// Importing necessary modules for database connection, user model, password comparison, and token generation
import dbConnect from "../../../../dbconnect/dbconnect.js"; // Database connection module
import User from "../../../../models/user.model.js"; // User model for MongoDB
import bcrypt from "bcrypt"; // Library for hashing and comparing passwords
import { generateToken } from "../../../../utils/jwt.js"; // Function to generate JWT tokens
import { NextResponse } from 'next/server'; // Import NextResponse for response handling

// Exporting the asynchronous handler function for user login
export async function POST(req) {
  // Establishing a connection to the database
  await dbConnect();

  // Destructuring the request body to get email and password
  const { email, password } = await req.json();

  try {
    // Finding the user in the database by email
    const user = await User.findOne({ email });
    
    // If user is not found, return a 404 response
    if (!user) {
      return NextResponse.json({ message: "User  not found" }, { status: 404 });
    }

    // Check if the user is blocked
    if (user.isBlocked) {
      return NextResponse.json({ message: "Your account is blocked. Please contact support." }, { status: 403 });
    }

    // Comparing the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    
    // If the password does not match, return a 400 response
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 400 });
    }

    // Check if it's the user's first login
    if (!user.loginAt) {
      user.loginAt = new Date(); // Store the current date and time
      await user.save(); // Save the updated user document
    }

    // Generate the JWT token
    const token = generateToken({ id: user._id, role: user.role, email: user.email });

    // Set the token in a cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        email,
        role: user.role,
        fullName: `${user.firstName} ${user.lastName}`,
        loginAt: user.loginAt,
        userId: user._id,
      },
    });

    // Set the cookie with the token
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 3600,
      secure: process.env.NODE_ENV === 'production', // Set secure flag in production
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    // Handling any errors that occur during the login process
    console.error("Login error:", error); // Log the error for debugging
    return NextResponse.json({ message: "Error logging in", error: error.message }, { status: 500 });
  }
}