import { connectDB } from "@/lib/db";
import UserMetrics from "@/models/userMetrics";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const userMetrics = await UserMetrics.findOne({ userId: session.user.id });

    if (!userMetrics) {
      return NextResponse.json(
        { error: "User metrics not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userMetrics, { status: 200 });
  } catch (error) {
    console.error("Error fetching user metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch user metrics" },
      { status: 500 }
    );
  }
}
