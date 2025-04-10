import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // Your database connection utility
import WorkoutTemplate from "@/models/workoutTemplate"; // Ensure the model path is correct
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Path to your NextAuth config

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Not authorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    await connectDB();
    const templates = await WorkoutTemplate.find({
      userId: session.user.id,
      title: { $regex: new RegExp(query, "i") }
    }).select("title"); // Just return the title of the templates

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error in /search-templates:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
