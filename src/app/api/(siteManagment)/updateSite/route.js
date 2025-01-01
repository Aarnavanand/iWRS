import dbConnect from "@/dbconnect/dbconnect.js";
import SiteManagement from "@/models/siteManagment.model.js";
import User from "@/models/user.model.js"; // Import the User model to validate CRC
import { authenticateUser } from "@/utils/auth.js";
import { NextResponse } from 'next/server'; // Import NextResponse for better response handling

// Handler to update site details
async function updateSite(req) {
  // 1. Check the HTTP method
  if (req.method !== "PATCH") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  // 2. Connect to the database
  await dbConnect();

  try {
    // 3. Parse the request body
    const { siteId, updateData } = await req.json();

    // Validate input
    if (!siteId || !updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
    }

    console.log("Received Payload:", { siteId, updateData }); // Debugging payload

    // 4. Find the site document by ID
    const site = await SiteManagement.findById(siteId);

    if (!site) {
      return NextResponse.json({ message: "Site not found" }, { status: 404 });
    }

    // 5. Check user role for authorization
    const { role } = req.user; // Assuming req.user is set via middleware
    if (!["001", "002"].includes(role)) { // Super Admin (001) or Admin (002)
      return NextResponse.json(
        { message: "Unauthorized: Only Super Admin and Admin can update sites." },
        { status: 403 }
      );
    }

    // 6. Check if CRC is present and if it's already assigned to another site
    if (updateData.crcAllotted) {
      const existingSite = await SiteManagement.findOne({ crcAllotted: updateData.crcAllotted });
      if (existingSite && existingSite._id.toString() !== siteId) {
      return NextResponse.json(
        { message: "CRC is already assigned to another site." },
        { status: 409 }
      );
      }

      // Validate if the CRC is a valid user by email
      const crcUser = await User.findOne({ email: updateData.crcAllotted });
      if (!crcUser || crcUser.role !== "003") { // Assuming CRC role is "003"
      return NextResponse.json(
        { message: "Invalid CRC user." },
        { status: 400 }
      );
      }
    }

    // 7. Handle ObjectId conversion for nested fields like "crcAllotted"
    if (updateData.crcAllotted && updateData.crcAllotted.$oid) {
      updateData.crcAllotted = updateData.crcAllotted.$oid;
    }

    // 8. Update the site fields dynamically
    Object.assign(site, updateData); // Use Object.assign for cleaner code

    // Save the updated document
    const updatedSite = await site.save();

    // 9. Return success response
    return NextResponse.json(
      { message: "Site updated successfully", updatedSite },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating site:", error);
    return NextResponse.json(
      { message: "Error updating site", error: error.message },
      { status: 500 }
    );
  }
}

// Export the PATCH handler with middleware for authentication
export async function PATCH(req) {
  return authenticateUser(updateSite)(req);
}