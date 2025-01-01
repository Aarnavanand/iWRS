// Importing necessary modules for database connection
import { NextResponse } from 'next/server'; // Import NextResponse for response handling
import { authenticateUser  } from "@/utils/auth.js"; // Authentication middleware

// Logout handler
async function logout(req) {
  // Clear the token by setting an expired Set-Cookie header
  const response = NextResponse.json({ message: "Logout successful" });

  // Clears the token by setting an expired cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    secure: process.env.NODE_ENV === 'production', // Set secure flag in production
    sameSite: 'strict',
  });

  return response;
}

// Exporting the asynchronous handler function for logout with middleware
export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
  }

  return authenticateUser (logout)(req);
}