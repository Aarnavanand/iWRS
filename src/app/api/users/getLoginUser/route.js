// Import necessary modules
import dbConnect from "../../../../dbconnect/dbconnect.js"; // Database connection module
import User from "../../../../models/user.model.js"; // User model for MongoDB
import { verifyToken } from "../../../../utils/jwt.js"; // Function to verify JWT tokens
import { NextResponse } from "next/server"; // Import NextResponse for response handling

// Exporting the asynchronous handler function for getting the logged-in user's details
export async function GET(req) {
  // Establish a connection to the database
  await dbConnect();

  try {
    // Retrieve the token from the cookies
    const token = req.cookies.get("token")?.value;

    // If no token is found, return a 401 Unauthorized response
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Verify the token to extract user information
    const decoded = verifyToken(token);

    // If the token is invalid or expired, return a 401 Unauthorized response
    if (!decoded) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    // Find the user in the database using the ID from the token
    const user = await User.findById(decoded.id).select("-password"); // Exclude the password field

    // If the user is not found, return a 404 Not Found response
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Respond with the user's details
    return NextResponse.json({
      message: "User details retrieved successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        fullName: `${user.firstName} ${user.lastName}`,
        createdAt: user.createdAt,
        loginAt: user.loginAt,
      },
    });
  } catch (error) {
    // Handle any errors that occur
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { message: "Error fetching user details", error: error.message },
      { status: 500 }
    );
  }
}
