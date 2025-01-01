import dbConnect from "@/dbconnect/dbconnect.js"; // Database connection module
import SiteManagement from "@/models/siteManagment.model.js"; // Site management model for MongoDB
import { authenticateUser  } from "@/utils/auth.js";
import { NextResponse } from 'next/server'; // Import NextResponse for better response handling

async function toggleSiteBlock(req) {
  if (req.method !== "PATCH") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  await dbConnect();

  const { siteId } = await req.json(); // Expecting siteId in the request body

  try {
    // Check if the site exists
    const site = await SiteManagement.findById(siteId); // Use siteId to find the site
    if (!site) {
      return NextResponse.json({ message: "Site not found" }, { status: 404 });
    }

    // Check user role
    const { role } = req.user; // Assuming user info is attached to req.user
    if (role !== "001" && role !== "002") { // Only Super Admin (001) and Admin (002) can block/unblock
      return NextResponse.json({ message: "Unauthorized: Only Super Admin and Admin can block/unblock sites." }, { status: 403 });
    }

    // Toggle the block status
    site.isBlocked = !site.isBlocked; // Assuming isBlocked is a field in the SiteManagement model
    if (site.isBlocked) {
      site.isUpdated = false; // Disable updates when the site is blocked
    }
    await site.save(); // Save the updated site

    const message = site.isBlocked
      ? "Site has been blocked successfully. CRCs cannot create or randomize subjects while the site is blocked."
      : "Site has been unblocked successfully. CRCs can now create or randomize subjects.";
    
    return NextResponse.json({ message, site }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error toggling site block status", error: error.message }, { status: 500 });
  }
}

// Exporting the asynchronous handler function for toggling site block status with middleware
export async function PATCH(req) {
  return authenticateUser (toggleSiteBlock)(req); // Ensure the user is authenticated
}