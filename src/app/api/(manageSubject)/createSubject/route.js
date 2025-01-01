import dbConnect from "@/dbconnect/dbconnect.js";
import Patient from "@/models/manageSubjects.model.js"; // Updated to match your model name
import SiteManagement from "@/models/siteManagment.model.js";
import { authenticateUser  } from "@/utils/auth.js";
import { NextResponse } from 'next/server'; // Import NextResponse for better response handling

const createSubject = async (req) => {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  await dbConnect();

  try {
    const { role, email } = req.user; // Extract user details from authentication

    if (role !== "003") { // Allow only CRCs to add subjects
      return NextResponse.json({ message: "Unauthorized: Only CRC can add subjects" }, { status: 403 });
    }

    // Fetch the site assigned to the logged-in CRC using their email
    const site = await SiteManagement.findOne({ crcAllotted: email });

    if (!site) {
      return NextResponse.json({ message: "No site assigned to this CRC" }, { status: 404 });
    }

    // Check if the site is blocked
    if (site.isBlocked) {
      return NextResponse.json({ message: "This site is currently blocked. You cannot create subjects at this time." }, { status: 403 });
    }

    const siteID = site.siteID; // Automatically derive siteID

    // Parse and validate request body
    const {
      subjectInitial,
      subjectGender,
      dob,
      subjectCurrentAge,
      subjectHeight,
      subjectWeight,
      subjectBMI,
      criteriaOk,
      remarks,
      assignKit,
      codeIndex,
    } = await req.json();

    if (!subjectInitial || !subjectGender || !dob) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const subjectCount = await Patient.countDocuments({ siteID: siteID });

    // Generate the subject number using siteID and the patient count at that site
    const paddedCount = String(subjectCount + 1).padStart(3, "0"); // e.g., 004 for the fourth patient
    const subjectNumber = `${siteID}-${paddedCount}`; // Correct subject number format

    // Create a new subject entry
    const newSubject = new Patient({
      siteID,
      subjectNumber,
      subjectInitial,
      subjectGender,
      dob,
      subjectCurrentAge,
      subjectHeight,
      subjectWeight,
      subjectBMI,
      criteriaOk,
      remarks,
      assignKit,
      codeIndex, // If provided
      createdBy: email, // Track which CRC created the subject
      createdAt: new Date(),
    });

    // Save the new subject to the database
    await newSubject.save();

    return NextResponse.json({
      message: "Subject created successfully",
      data: newSubject.toObject(), // Ensure the full subject object is returned with siteID
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating subject:", error.message); // Log the error
    return NextResponse.json({ message: "Error creating subject", error: error.message }, { status: 500 });
  }
};

// Apply middleware and call the createSubject function
export async function POST(req) {
  return authenticateUser (createSubject)(req);
}