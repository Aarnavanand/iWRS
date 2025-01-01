import dbConnect from "@/dbconnect/dbconnect.js";
import ManageCode from "@/models/codeManagment.model.js";
import SiteManagement from "@/models/siteManagment.model.js";
import { authenticateUser  } from "@/utils/auth.js";
import { NextResponse } from 'next/server'; // Import NextResponse for better response handling

async function createManageCode(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
  
  await dbConnect();

  try {
    const { role } = req.user; // Middleware adds user info to `req.user`

    // Only allow Super Admin (001) and Admin (002)
    if (!["001", "002"].includes(role)) {
      return NextResponse.json(
        { message: "Unauthorized: Only super admin or admin can create a code" },
        { status: 403 }
      );
    }

    // Destructure code details from the request body
    const codes = await req.json(); // Expecting an array of code details

    const createdCodes = []; // To store successfully created codes
    const errors = []; // To store any errors encountered

    // Fetch all site IDs in advance to minimize database calls
    const siteIDs = codes.map(code => code.codeSiteId);
    const sites = await SiteManagement.find({ siteID: { $in: siteIDs } }).lean();

    const siteMap = new Map(sites.map(site => [site.siteID, site])); // Create a map for quick lookup

    for (const { codeNo, codeSiteId, codeType, remarks } of codes) {
      const site = siteMap.get(codeSiteId);

      // Validate `codeSiteId` against the SiteManagement collection
      if (!site) {
        errors.push({ codeNo, message: "Invalid codeSiteId: Site does not exist" });
        continue; // Skip to the next code
      }

      // Check if the site is blocked
      if (site.isBlocked) {
        errors.push({ codeNo, message: "Code generation is not allowed: The site is blocked" });
        continue; // Skip to the next code
      }

      // Ensure the `index` is unique per `codeSiteId`
      const currentIndex = await ManageCode.countDocuments({ codeSiteId }) + 1;

      // Create a new ManageCode entry
      const newCode = new ManageCode({
        codeNo,
        codeSiteId,
        codeType,
        remarks: remarks || null, // Default to `null` if not provided
        index: currentIndex,
        codeGenerationDT: new Date(),
        codeRandomizationDT: null,
        Status: "Unused", 
        codeuserID: role,
      });

      // Save to database
      await newCode.save();
      createdCodes.push(newCode); // Add to the list of created codes
    }

    // Prepare response
    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Some codes were not created", createdCodes, errors },
        { status: 207 } // Multi-Status response
      );
    }

    return NextResponse.json(
      { message: "ManageCodes created successfully", data: createdCodes },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating ManageCode:", error);
    return NextResponse.json(
      { message: "Error creating ManageCode", error: error.message },
      { status: 500 }
    );
  }
}

// Exported POST handler with role-based authentication
export async function POST(req) {
  return authenticateUser (createManageCode, ["001", "002"])(req);
}