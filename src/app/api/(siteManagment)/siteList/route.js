import dbConnect from "@/dbconnect/dbconnect.js"; // Database connection module
import SiteManagement from "@/models/siteManagment.model.js"; // Site management model
import { authenticateUser  } from "@/utils/auth.js";
import { NextResponse } from 'next/server'; // Import NextResponse for better response handling

async function getAllSites(req) {
  if (req.method !== "GET") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  await dbConnect();

  try {
    const { role } = req.user; // `authenticateUser ` middleware must attach user info to `req.user`

    // Allow only Super Admin (001) and Admin (002)
    if (!["001", "002"].includes(role)) {
      return NextResponse.json(
        { message: "Unauthorized: role to access sites" },
        { status: 403 }
      );
    }

    // Fetch all sites from the database and populate CRC details
    const sites = await SiteManagement.find({}).populate('crcAllotted', 'email firstName lastName'); // Get CRC email, first name, and last name along with site data
    
    return NextResponse.json(
      { message: "Sites retrieved successfully", data: sites },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving sites", error: error.message },
      { status: 500 }
    );
  }
}

// Exporting the GET handler for retrieving all sites with authentication middleware
export async function GET(req) {
  return authenticateUser (getAllSites)(req); // Ensure the user is authenticated
}