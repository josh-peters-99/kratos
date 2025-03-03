import { connectDB } from "@/lib/mongodb";
import Set from "@/models/Set";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const updatedSet = await Set.findByIdAndUpdate(id, await req.json(), { new: true });
    return NextResponse.json(updatedSet, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    await Set.findByIdAndDelete(id);
    return NextResponse.json({ message: "Set deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}