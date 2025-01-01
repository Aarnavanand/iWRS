import { authenticateUser } from "@/utils/auth.js";
import dbConnect from "@/dbconnect/dbconnect.js";
import KitVaills from "@/models/kitVaills.model.js";
import User from "@/models/user.model.js";

const createKit = async (req) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ message: "Method not allowed" }), { status: 405 });
    }

    await dbConnect(); // Ensure database connection

    try {
        // Get the logged-in user details from the request
        const loggedInUser = req.user; // `req.user` is populated by `authenticateUser`
        const { email, role } = loggedInUser;

        // Role-based access control
        if (!["001", "002"].includes(role)) {
            return new Response(JSON.stringify({ message: "Forbidden: Only admins and superadmins can create kits." }), { status: 403 });
        }

        // Extract kit data from request body
        const { kitCode, kitType, siteId, kitRejectRemarks } = await req.json(); // Ensure this is awaited

        // Validate required fields
        if (!kitCode || !kitType || !siteId) {
            return new Response(JSON.stringify({ message: "Missing required fields." }), { status: 400 });
        }

        // Ensure the user creating the kit exists in the database
        const creator = await User.findOne({ email });
        if (!creator) {
            return new Response(JSON.stringify({ message: "User not found. Cannot create the kit." }), { status: 404 });
        }

        // Create the new kit entry
        const newKit = await KitVaills.create({
            index: await KitVaills.countDocuments() + 1,
            kitCode,
            kitType,
            siteId,
            kitStatus: 0, // Default status
            kitCreatedBy: creator._id,
            kitApproved: 0, // Default approval status
            kitRejectRemarks: kitRejectRemarks || null,
        });

        // Respond with success
        return new Response(JSON.stringify({ message: "Kit created successfully!", data: newKit }), { status: 201 });
    } catch (error) {
        console.error("Error creating kit:", error);
        return new Response(JSON.stringify({ message: "Internal server error." }), { status: 500 });
    }
};

// Export the POST method
export async function POST(req) {
    return authenticateUser(createKit)(req); // Ensure the user is authenticated
}
