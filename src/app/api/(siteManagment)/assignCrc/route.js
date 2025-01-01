import dbConnect from "@/dbconnect/dbconnect.js"; // Database connection module
import SiteManagement from "@/models/siteManagment.model.js"; // Site management model
import User from "@/models/user.model.js"; // User model
import { authenticateUser } from "@/utils/auth.js";
import { NextResponse } from "next/server";

// Assign CRC handler
async function assignCrc(req) {
  if (req.method !== "PATCH") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  await dbConnect();

  try {
    // Parse JSON request body
    const { siteEmailId, crcEmail } = await req.json();

    // Validate required inputs
    if (!siteEmailId || !crcEmail) {
      return NextResponse.json({ message: "Missing siteEmailId or crcEmail" }, { status: 400 });
    }

    // Get the authenticated user from the request
    const user = req.user;

    // Check if the user has the required role
    if (user.role !== "001" && user.role !== "002") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Find the site by email
    const site = await SiteManagement.findOne({ siteEmailId });
    if (!site) {
      return NextResponse.json({ message: "Site not found" }, { status: 404 });
    }

    // Find the CRC user by email and validate their role
    const crc = await User.findOne({ email: crcEmail, role: "003" });
    if (!crc) {
      return NextResponse.json({ message: "Invalid CRC user" }, { status: 400 });
    }

    // Check if the CRC is already assigned to another site
    const existingSite = await SiteManagement.findOne({ crcAllotted: crc.email });
    if (existingSite && existingSite._id.toString() !== site._id.toString()) {
      return NextResponse.json(
        { message: "CRC is already assigned to another site" },
        { status: 400 }
      );
    }

    // Assign the CRC to the site and save
    site.crcAllotted = crc.email;
    await site.save();

    return NextResponse.json(
      { message: "CRC assigned successfully", site },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error assigning CRC:", error);
    return NextResponse.json(
      { message: "Error assigning CRC", error: error.message },
      { status: 500 }
    );
  }
}

// Export the asynchronous handler function with authentication middleware
export async function PATCH(req) {
  return authenticateUser(assignCrc)(req); // Ensure the user is authenticated
}
