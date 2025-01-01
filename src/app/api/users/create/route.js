import dbConnect from "../../../../dbconnect/dbconnect.js"; // Database connection module
import User from "../../../../models/user.model.js"; // User model for MongoDB
import { authenticateUser } from "@/utils/auth.js";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing
import { NextResponse } from "next/server"; // Next.js response utilities

// User creation handler
async function createUser(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  await dbConnect(); // Establishing a connection to the database

  const { firstName, lastName, email, password, role } = await req.json(); // Parsing the request body

  try {
    const authenticatedUser = req.user; // Get the authenticated user from the request

    // Verify permissions based on user roles
    const isAdminCreatingValidRole = authenticatedUser.role === "001" && ["002", "003"].includes(role);
    const isCRCAllowedToCreateCRC = authenticatedUser.role === "002" && role === "003";

    if (!isAdminCreatingValidRole && !isCRCAllowedToCreateCRC) {
      return NextResponse.json({ message: "Unauthorized: You do not have permission to create this user" }, { status: 403 });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      loginAt: null,
    });
    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating user", error: error.message }, { status: 500 });
  }
}

// Exporting the asynchronous handler function for user creation with middleware
export async function POST(req) {
  return authenticateUser(createUser)(req);
}