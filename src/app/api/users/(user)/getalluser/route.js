import dbConnect from "../../../../../dbconnect/dbconnect.js";
import User from "../../../../../models/user.model.js";
import { authenticateUser } from "@/utils/auth.js";
import { NextResponse } from "next/server";

// Function to retrieve users based on roles
async function getUsers(req) {
  if (req.method !== "GET") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  await dbConnect();

  try {
    const requesterRole = req.user.role;
    let users;

    if (requesterRole === "001") { // Super Admin
      users = await User.find().select("-password"); // Fetch all users for Super Admin
    } else if (requesterRole === "002") { // Admin
      users = await User.find({ role: "003" }).select("-password"); // Fetch CRC users only
    } else {
      return NextResponse.json({ message: "Unauthorized to view users" }, { status: 403 });
    }

    // Ensure sensitive data is not exposed
    const sanitizedUsers = users.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
    }));

    return NextResponse.json(sanitizedUsers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  return authenticateUser(getUsers, ["001", "002"])(req); // Super Admin and Admin
}
