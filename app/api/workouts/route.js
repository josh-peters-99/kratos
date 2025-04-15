import { connectDB } from "@/lib/db";
import Workout from "@/models/workout";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

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
    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });
  }
}