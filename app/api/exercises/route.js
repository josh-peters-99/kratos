import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectDB } from "@/lib/db"; // Your DB connection logic
import Exercise from "@/models/exercise";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    await connectDB();

    const exercises = await Exercise.find({
      $or: [
        { createdBy: null },
        { createdBy: session.user.id }
      ]
    });

    return NextResponse.json(exercises, { status: 200 });
  } catch (error) {
    console.error("Error in /api/exercises/route:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, exerciseType, musclesWorked = [] } = body;

    if (!name || !exerciseType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const newExercise = await Exercise.create({
      name,
      exerciseType,
      musclesWorked,
      createdBy: session.user.id,
    });

    return NextResponse.json(newExercise, { status: 201 });
  } catch (error) {
    console.error("Error in /api/exercises POST:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}