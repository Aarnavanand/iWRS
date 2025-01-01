import { authenticateUser } from "../../../../middleware.js";

async function checkAuth(req) {
  return new Response(JSON.stringify({ message: "Authenticated" }), { status: 200 });
}

export async function GET(req) {
  return authenticateUser(checkAuth)(req);
}