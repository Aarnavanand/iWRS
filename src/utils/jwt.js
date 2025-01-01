import jwt from "jsonwebtoken"; // Importing the jsonwebtoken library for handling JWTs

// Generate JWT token
export const generateToken = (payload, expiresIn = "10m") => { // Function to generate a JWT token with a payload and optional expiration time of 10 minutes
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn }); // Signing the token with the payload and secret, setting the expiration time
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

// console.log("JWT Secret:", process.env.JWT_SECRET);