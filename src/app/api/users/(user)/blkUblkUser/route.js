import dbConnect from "../../../../../dbconnect/dbconnect.js";
import User from "../../../../../models/user.model.js";
import { authenticateUser } from "@/utils/auth.js";
import { NextResponse } from "next/server";

async function toggleBlockStatus(req) {
  if (req.method !== "PATCH") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  await dbConnect();

  try {
    const { userId } = await req.json();

    // Validate input
    if (!userId) {
      return NextResponse.json({ message: "Missing userId" }, { status: 400 });
    }

    // Find the user to update
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const requesterRole = req.user.role;

    // Access control based on roles
    if (
      requesterRole === "001" || // Super Admin can toggle Admin and CRC
      (requesterRole === "002" && userToUpdate.role === "003") // Admin can toggle CRC only
    ) {
      // Prevent toggling another Super Admin
      if (userToUpdate.role === "001") {
        return NextResponse.json(
          { message: "Cannot toggle block status of another Super Admin." },
          { status: 403 }
        );
      }

      // Toggle the user's block status
      userToUpdate.isBlocked = !userToUpdate.isBlocked;
      userToUpdate.userStatus = userToUpdate.isBlocked ? "block" : "unblock";
      userToUpdate.access = !userToUpdate.isBlocked;

      // Save the updated user
      await userToUpdate.save();

      return NextResponse.json(
        { message: `User successfully ${userToUpdate.isBlocked ? "blocked" : "unblocked"}.` },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Unauthorized to toggle block status." },
        { status: 403 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error toggling block status.", error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  return authenticateUser(toggleBlockStatus, ["001", "002"])(req);
}
