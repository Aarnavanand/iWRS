import KitVaills from "@/models/kitVaills.model.js"; // Import the KitVaills model
import { authenticateUser } from "@/utils/auth.js";
import connectDB from "@/dbconnect/dbconnect";

const dispatchKit = async (req) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ message: "Method not allowed" }), { status: 405 });
    }

    await connectDB(); // Ensure database connection

    try {
        const loggedInUser = req.user; // `req.user` is populated by `authenticateUser`
        const { role } = loggedInUser;

        // Role-based access control
        if (!["001", "002"].includes(role)) {
            return new Response(JSON.stringify({ message: "Forbidden: Only admins and superadmins can dispatch kits." }), { status: 403 });
        }

        // Extract kit data from request body
        const { kitCode } = await req.json(); // Ensure this is awaited

        // Validate required fields
        if (!kitCode) {
            return new Response(JSON.stringify({ message: "Missing required fields." }), { status: 400 });
        }

        // Find the kit by kitCode
        const kit = await KitVaills.findOne({ kitCode });
        if (!kit) {
            return new Response(JSON.stringify({ message: "Kit not found." }), { status: 404 });
        }

        // Check if the kit is already dispatched
        if (kit.kitStatus === 1) {
            return new Response(JSON.stringify({ message: "Kit is already dispatched." }), { status: 400 });
        }

        // Update the kit status to dispatched (1)
        kit.kitStatus = 1; // Set status to 1 for dispatched
        kit.kitDispatchBy = loggedInUser.email; // Record who dispatched the kit
        kit.kitDispatchAt = new Date(); // Record the dispatch time
        await kit.save(); // Save the updated kit

        // Respond with success
        return new Response(JSON.stringify({ message: "Kit dispatched successfully!", data: kit }), { status: 200 });
    } catch (error) {
        console.error("Error dispatching kit:", error);
        return new Response(JSON.stringify({ message: "Internal server error." }), { status: 500 });
    }
};

// Export the POST method
export async function POST(req) {
    return new authenticateUser(dispatchKit)(req); // Ensure the user is authenticated
}
