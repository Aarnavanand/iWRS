import connectDB from "@/dbconnect/dbconnect.js";
import Kit from "@/models/kitVaills.model.js";
import { authenticateUser } from "@/utils/auth.js";
import SiteManagement from "@/models/siteManagment.model.js";
import User from "@/models/user.model.js";

async function rejectKit(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405 });
    }

    const { kitCode, kitRejectRemarks } = await req.json();

    if (!kitCode || !kitRejectRemarks) {
        return new Response(JSON.stringify({ message: 'Kit ID and reject remarks are required' }), { status: 400 });
    }

    const user = req.user; // `req.user` is populated by `authenticateUser`
    if (!user) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    try {
        await connectDB();

        const kit = await Kit.findOne({kitCode});
        if (!kit) {
            return new Response(JSON.stringify({ message: 'Kit not found' }), { status: 404 });
        }

        // Check if the user is a CRC and is assigned to the same site as the kit
        const dbUser = await User.findOne({ email: user.email });
        if (!dbUser || dbUser.role !== "003") {
            return new Response(JSON.stringify({ message: "Forbidden: You do not have the required permissions." }), { status: 403 });
        }

        // Find the site assigned to the CRC
        const site = await SiteManagement.findOne({ crcAllotted: dbUser.email });
        if (!site) {
            return new Response(JSON.stringify({ message: "CRC is not assigned to any site." }), { status: 403 });
        }

        // Check if the kit is already discarded
        if (kit.kitStatus === 3) { // Assuming 3 is the status for rejected kits
            return new Response(JSON.stringify({ message: 'Kit is already discarded and cannot be allotted' }), { status: 400 });
        }

        if (kit.kitApproved===1) {
            return new Response(JSON.stringify({ message: 'Kit is already approved and cannot be rejected' }), { status: 400 });
        }
        // Update the kit's rejection details
        kit.kitApproved = 2;
        kit.kitStatus = 3; // Assuming 3 is the status for rejected kits
        kit.kitDiscardBy = user.email;
        kit.kitDiscardAt = new Date();
        kit.kitRejectRemarks = kitRejectRemarks;
        await kit.save();

        return new Response(JSON.stringify({ message: 'Kit rejected successfully' }), { status: 200 });
    } catch (error) {
        console.error("Error rejecting kit:", error);

        return new Response(JSON.stringify({ message: 'Internal server error. Please try again later.' }), { status: 500 });
    }
}

export async function POST(req) {
    return authenticateUser(rejectKit)(req);
}