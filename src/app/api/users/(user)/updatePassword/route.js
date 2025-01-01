import dbConnect from "../../../../../dbconnect/dbconnect.js";
import User from "../../../../../models/user.model.js";
import bcrypt from "bcrypt";
import { authenticateUser } from "@/utils/auth.js";
import { NextResponse } from "next/server";

// Handler function for updating password
async function updatePassword(req) {
  if (req.method !== "PUT") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  // Establish database connection
  await dbConnect();

  try {
    // Extracting data from the request body
    const { userId, newPassword, password } = await req.json(); // Include password for Admin and CRC

    // Check for missing required fields
    if (!userId || !newPassword || (["002", "003"].includes(req.user.role) && !password)) {
      return NextResponse.json(
        { message: "Missing userId, newPassword, or password" },
        { status: 400 }
      );
    }

    // Get the role and ID of the requester (from authentication middleware)
    const { role: requesterRole, id: requesterId } = req.user;

    // Find the user to update by their ID
    const userToUpdate = await User.findById(userId);

    // Check if the user exists
    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Authorization logic
    if (requesterRole === "001") {
      // Super Admin can update anyone's password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      userToUpdate.password = hashedPassword;
      await userToUpdate.save();

      return NextResponse.json(
        { message: "Password updated successfully" },
        { status: 200 }
      );
    } else if (
      (requesterRole === "002" || requesterRole === "003") &&
      requesterId === userToUpdate.id
    ) {
      // Admin and CRC can update their own password
      const isMatch = await bcrypt.compare(password, userToUpdate.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: "Previous password is incorrect" },
          { status: 403 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      userToUpdate.password = hashedPassword;
      await userToUpdate.save();

      return NextResponse.json(
        { message: "Password updated successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Unauthorized to update this password" },
        { status: 403 }
      );
    }
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      { message: "Error updating password", error: error.message },
      { status: 500 }
    );
  }
}

// Export the handler with authentication middleware
export async function PUT(req) {
  return authenticateUser(updatePassword, ["001", "002", "003"])(req); // Super Admin, Admin, and CRC
}
