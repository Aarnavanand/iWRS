import dbConnect from "../../../dbconnect/dbconnect.js";
import NewStudie from "@/models/studyDetail.model.js";
import { NextResponse } from "next/server";

async function getAllStudies() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all studies
    const studies = await NewStudie.find();

    if (!studies || studies.length === 0) {
      return NextResponse.json({ message: "No studies found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Studies retrieved successfully", studies },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving studies:", error);
    return NextResponse.json(
      { message: "Error retrieving studies", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  if (req.method !== "GET") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }
  return await getAllStudies();
}
