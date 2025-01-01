import dbConnect from "@/dbconnect/dbconnect";
import SiteManagement from "@/models/siteManagment.model";
import { authenticateUser } from "@/utils/auth.js";
import { NextResponse } from "next/server";

async function createSiteManagement(req) {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  await dbConnect();

  try {
    const { role } = req.user; // `authenticateUser` middleware attaches user info to `req.user`

    // Allow only Super Admin (001) and Admin (002)
    if (!["001", "002"].includes(role)) {
      return NextResponse.json(
        { message: "Unauthorized: You do not have permission to create a site" },
        { status: 403 }
      );
    }

    // Extract site details from the request body
    const {
      siteName,
      siteTitle,
      siteAddress,
      siteCountry,
      siteState,
      siteCity,
      sitePIN,
      siteContactNo,
      siteEmailId,
      enrolmentAtSite,
      remarks,
    } = await req.json();

    // Generate a unique siteID based on the number of existing entries
    const siteCount = await SiteManagement.countDocuments();
    const siteID = (siteCount + 1).toString().padStart(2, "0"); // Format siteID as 01, 02, etc.

    // Create a new site entry
    const newSite = await SiteManagement.create({
      siteID,
      siteName,
      siteTitle,
      siteAddress,
      siteCountry,
      siteState,
      siteCity,
      sitePIN,
      siteContactNo,
      siteEmailId,
      enrolmentAtSite,
      remarks,
    });

    return NextResponse.json(
      { message: "Site Management created successfully", data: newSite },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating site management:", error);
    return NextResponse.json(
      { message: "Error creating site management", error: error.message },
      { status: 500 }
    );
  }
}

// Export the Next.js API route with authentication middleware
export async function POST(req) {
  return authenticateUser(createSiteManagement, ["001", "002"])(req);
}
