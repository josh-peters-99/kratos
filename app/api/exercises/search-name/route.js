import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Adjust this path to your auth config
import { connectDB } from "@/lib/db"; // Your DB connection logic
import Exercise from "@/models/exercise";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    await connectDB();

    // Search exercises by name (case insensitive, user-specific)
    const exercises = await Exercise.find({
      name: { $regex: new RegExp(query, "i") }
    }).select("name exerciseType").limit(10);

    return NextResponse.json(exercises, { status: 200 });
  } catch (error) {
    console.error("Error in /api/exercises/search-names:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
