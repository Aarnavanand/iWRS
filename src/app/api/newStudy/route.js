import dbConnect from "../../../dbconnect/dbconnect.js";
import NewStudie from "@/models/studyDetail.model.js";
import { authenticateUser } from "@/utils/auth.js";
import { NextResponse } from "next/server";

// Controller function to handle creating a new study
async function createNewStudy(req) {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  // Connect to the database
  await dbConnect();

  try {
    const { protocolNo, protocolTitle } = await req.json(); // Extract the request body
    const user = req.user; // Access the authenticated user

    // Verify that the user has admin privileges
    if (user.role !== "001") {
      return NextResponse.json(
        { message: "Unauthorized: Only admins can create a new study" },
        { status: 403 }
      );
    }

    // Check if a study already exists
    if (await NewStudie.exists()) {
      return NextResponse.json(
        { message: "A study already exists. Only one study can be created." },
        { status: 400 }
      );
    }

    // Create a new study document
    const newStudyEntry = await NewStudie.create({ protocolNo, protocolTitle });

    return NextResponse.json(
      { message: "New study created successfully", study: newStudyEntry },
      { status: 201 }
    );
  } catch (error) {
    // Handle errors and send error response
    return NextResponse.json(
      { message: "Error creating study", error: error.message },
      { status: 500 }
    );
  }
}

// Exporting the POST function with middleware
export async function POST(req) {
  return authenticateUser(createNewStudy)(req);
}
