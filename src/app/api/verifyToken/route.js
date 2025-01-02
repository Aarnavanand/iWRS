import { verifyToken } from "@/utils/jwt.js"; // Adjust the path as per your project structure

export default function POST(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed", valid: false });
  }

  // Validate Content-Type header
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ message: "Invalid content type. Expected application/json", valid: false });
  }

  // Validate request body
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing", valid: false });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required", valid: false });
  }

  try {
    const decoded = verifyToken(token); // Verify the token
    return res.status(200).json({
      message: "Token is valid",
      valid: true,
      user: {
        id: decoded.id,
        fullName: decoded.fullName,
        email: decoded.email,
      },
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message || "Invalid token",
      valid: false,
    });
  }
}
