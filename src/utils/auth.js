import { verifyToken } from "../utils/jwt.js"; // Importing the verifyToken function to validate JWT tokens
import cookie from "cookie"; // Use a library for robust cookie parsing

export function authenticateUser(handler, allowedRoles) {
  return async (req, res) => {
    try {
      // Securely parse cookies using a library
      const cookieHeader = req.headers.get("cookie");
      if (!cookieHeader) {
        return new Response(
          JSON.stringify({ message: "Unauthorized access: Cookies are missing" }),
          { status: 401 }
        );
      }

      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token; // Get the token from cookies

      if (!token) {
        return new Response(
          JSON.stringify({ message: "Unauthorized access: Token is missing" }),
          { status: 401 }
        );
      }

      // Verify the token and decode user information
      const decoded = verifyToken(token); // Ensure `verifyToken` explicitly validates the signature and algorithm
      if (!decoded) {
        return new Response(
          JSON.stringify({ message: "Invalid or expired token" }),
          { status: 403 }
        );
      }

      req.user = decoded;

      // Check role-based access control if `allowedRoles` is defined
      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return new Response(
          JSON.stringify({ message: "Access forbidden: Role not permitted" }),
          { status: 403 }
        );
      }

      // Proceed to the actual handler
      return handler(req, res);
    } catch (error) {
      console.error("Authentication error occurred."); 
      return new Response(
        JSON.stringify({ message: "Authentication failed" }),
        { status: 403 }
      );
    }
  };
}