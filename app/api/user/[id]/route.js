import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import User from "@/models/user";

export async function PUT(req, { params }) {
  const { id } = await params; // Get user ID from the URL params

  // Get session to ensure the user is authenticated
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  if (session.user.id !== id) {
    return NextResponse.json({ message: "You can only update your own profile" }, { status: 403 });
  }

  // Parse the request body
  const { bio } = await req.json();
  if (!bio) {
    return NextResponse.json({ message: "Bio is required" }, { status: 400 });
  }

  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // update the user's bio
    user.bio = bio;
    await user.save();

    // Return the success response
    return NextResponse.json({ message: "Bio updated successfully", user });
  } catch (error) {
    console.error("Error updating user bio:", error);
    return NextResponse.json({ message: "Error updating bio", error }, { status: 500 });
  }
}