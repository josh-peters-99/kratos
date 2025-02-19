import connectDB from "@/lib/db";
import Workout from "@/models/Workout";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    await connectDB();
    const { id } = params;
    const updatedWorkout = await Workout.findByIdAndUpdate(id, await req.json(), { new: true });
    return NextResponse.json(updatedWorkout, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
      await connectDB();
      const { id } = await req.json();
      const workout = await Workout.findById(id);

      if (!workout || workout.user.toString() !== session.user.id) {
          return NextResponse.json({ error: "Not authorized to delete this workout" }, { status: 403 });
      }

      await Workout.findByIdAndDelete(id);
      return NextResponse.json({ message: "Workout deleted" }, { status: 200 });
  } catch (error) {
      return NextResponse.json({ error: "Failed to delete workout" }, { status: 500 });
  }
}

