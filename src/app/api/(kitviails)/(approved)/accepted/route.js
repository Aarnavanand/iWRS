import connectDB from "@/dbconnect/dbconnect.js";
import Kit from "@/models/kitVaills.model.js";
import User from "@/models/user.model.js";
import SiteManagement from "@/models/siteManagment.model.js";
import { authenticateUser } from "@/utils/auth.js";

async function acceptKit(req) {
    // Ensure only POST requests are allowed
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ message: "Method not allowed" }), { status: 405 });
    }

    try {
        // Extract user from the middleware
        const user = req.user;
        if (!user) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        // Parse the request body
        const { kitCode } = await req.json();
        if (!kitCode) {
            return new Response(JSON.stringify({ message: "Kit code is required" }), { status: 400 });
        }

        // Connect to the database
        await connectDB();

        // Fetch the user from the database
        const dbUser = await User.findOne({ email: user.email });
        if (!dbUser || dbUser.role !== "003") {
            return new Response(JSON.stringify({ message: "Forbidden: You do not have the required permissions." }), { status: 403 });
        }

        // Find the site assigned to the CRC
        const site = await SiteManagement.findOne({ crcAllotted: dbUser.email });
        if (!site) {
            return new Response(JSON.stringify({ message: "CRC is not assigned to any site." }), { status: 403 });
        }

        // Find the specified kit using kitCode
        const kit = await Kit.findOne({ kitCode });
        if (!kit) {
            return new Response(JSON.stringify({ message: "Kit not found." }), { status: 404 });
        }

        // Validate if the kit belongs to the CRC's site
        if (kit.siteId !== site.siteID) {
            return new Response(JSON.stringify({ message: "Kit is not assigned to your site." }), { status: 403 });
        }

        // Check if the kit is in the correct status for acceptance
        if (kit.kitStatus !== 1) {
            return new Response(JSON.stringify({ message: "Kit is not dispatched or already accepted." }), { status: 400 });
        }

        // Update the kit's status and approval details
        kit.kitApproved = 1;
        kit.kitStatus = 2;
        kit.kitApprovedBy = dbUser.email;
        kit.kitApprovedAt = new Date();
        await kit.save();

        return new Response(JSON.stringify({ message: "Kit accepted successfully." }), { status: 200 });
    } catch (error) {
        console.error("Error accepting kit:", error);

        return new Response(JSON.stringify({ message: "Internal server error. Please try again later." }), { status: 500 });
    }
}

export async function POST(req) {
    return authenticateUser(acceptKit)(req);
}
