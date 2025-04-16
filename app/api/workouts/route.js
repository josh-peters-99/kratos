import { connectDB } from "@/lib/db";
import Workout from "@/models/workout";
import UserMetrics from "@/models/userMetrics";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { startOfWeek, format } from "date-fns";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const workouts = await Workout.find({ userId: session.user.id });
    return NextResponse.json(workouts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    
    const data = await req.json();

    const { title, date, time, notes, exercises } = data;
    if (!title) {
      return NextResponse.json({ error: "Missing field: title" }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ error: "Missing field: date" }, { status: 400 });
    }
    if (!Array.isArray(exercises)) {
      return NextResponse.json({ error: "Field 'exercises' must be an array" }, { status: 400 });
    }    

    const transformedExercises = exercises.map((exercise) => {
      const { name, exerciseType, sets } = exercise;

      const transformedSets = sets.map((set) => ({
        reps: parseInt(set.reps) || undefined,
        weight: parseFloat(set.weight) || undefined,
        distance: parseFloat(set.distance) || undefined,
        hours: parseInt(set.hours) || undefined,
        minutes: parseInt(set.minutes) || undefined,
        seconds: parseInt(set.seconds) || undefined,
        units: ["miles", "kilometers", "meters"].includes(set.units) ? set.units : undefined,
      }));

      return {
        name,
        exerciseType,
        sets: transformedSets,
      };
    });

    const newWorkout = new Workout({
      userId: session.user.id,
      title,
      date: new Date(date),
      time,
      notes,
      exercises: transformedExercises,
    });

    await newWorkout.save();

    // Update user metrics
    const workoutDate = new Date(date);
    const year = workoutDate.getFullYear().toString();
    const month = `${year}-${(workoutDate.getMonth() + 1).toString().padStart(2, "0")}`;
    const week = format(startOfWeek(workoutDate, { weekStartsOn: 1 }), "yyyy-'W'II");

    const userMetrics = await UserMetrics.findOne({ userId: session.user.id });

    if (userMetrics) {
      userMetrics.totalWorkouts += 1;
      userMetrics.yearlyWorkouts.set(year, (userMetrics.yearlyWorkouts.get(year) || 0) + 1);
      userMetrics.monthlyWorkouts.set(month, (userMetrics.monthlyWorkouts.get(month) || 0) + 1);
      userMetrics.weeklyWorkouts.set(week, (userMetrics.weeklyWorkouts.get(week) || 0) + 1);

      for (const exercise of transformedExercises) {
        const { name, sets } = exercise;

        // Extract best values from the new workout
        let bestWeight = 0;
        let bestReps = 0;
        let bestTime = 0;
        let bestDistance = 0;

        for (const set of sets) {
          if (set.weight && set.weight > bestWeight) bestWeight = set.weight;
          if (set.reps && set.reps > bestReps) bestReps = set.reps;

          const timeInSeconds = 
            (set.hours || 0) * 3600 +
            (set.minutes || 0) * 60 +
            (set.seconds || 0);
          if (timeInSeconds > bestTime) bestTime = timeInSeconds;
          
          if (set.distance && set.distance > bestDistance)
              bestDistance = set.distance;
        }

        // Find existing personal best for this exercise
        const pb = userMetrics.personalBests.find(
          (pb) => pb.exerciseName.toLowerCase() === name.toLowerCase()
        );

        if (pb) {
          pb.bestWeight = Math.max(pb.bestWeight, bestWeight);
          pb.bestReps = Math.max(pb.bestReps, bestReps);
          pb.bestTime = Math.max(pb.bestTime, bestTime);
          pb.bestDistance = Math.max(pb.bestDistance, bestDistance);
        } else {
          // If no PB exists yet for this exercise, create a new entry
          userMetrics.personalBests.push({
            exerciseName: name,
            bestWeight,
            bestReps,
            bestTime,
            bestDistance,
          });
        }
      }

      await userMetrics.save();
    } else {
      await UserMetrics.create({
        userId: session.user.id,
        totalWorkouts: 1,
        yearlyWorkouts: { [year]: 1 },
        monthlyWorkouts: { [month]: 1 },
        weeklyWorkouts: { [week]: 1 },
      });
    }

    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });
  }
}