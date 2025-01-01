
import dbConnect from "@/dbconnect/dbconnect.js";
import Patient from "@/models/manageSubjects.model";
import ManageCode from "@/models/codeManagment.model.js";
import { authenticateUser } from "@/utils/auth.js";

async function assignKitHandler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), { status: 405 });
  }

  await dbConnect();
  try {
    const { subjectNumber, siteID } = await req.json();
    if (!subjectNumber || !siteID) {
      return new Response(JSON.stringify({ success: false, message: "subjectNumber and siteID are required." }),
        { status: 400 }
      );
    }

    // Ensure subject is randomized
    const subject = await Patient.findOne({ subjectNumber, siteID });
    if (!subject || subject.randomizationStatus !== "Randomized") {
      return new Response(
        JSON.stringify({ success: false, message: "Subject not found or not randomized." }),
        { status: 400 }
      );
    }

    // Find a kit for the subject’s randomization group with vialsUsed < 3
    const kit = await ManageCode.findOneAndUpdate(
      {
        codeSiteId: siteID,
        codeType: subject.randomizationGroup, // "NS" or "IP"
        Status: "Unused",
        $expr: { $lt: ["$vialsUsed", 3] },
      },
      { $inc: { vialsUsed: 1 } },
      { new: true }
    );

    if (!kit) {
      return new Response(JSON.stringify({ success: false, message: "No available kit for this group." }),
        { status: 404 }
      );
    }

    // If kit now used up, update Status to "Used" if vialsUsed == 3
    if (kit.vialsUsed === 3) {
      kit.Status = "Used";
      await kit.save();
    }

    // Attach kit info to the subject
    subject.assignKit = kit.codeNo;
    await subject.save();

    return new Response(JSON.stringify({
      success: true,
      message: `Kit assigned successfully: ${kit.codeNo}`,
    }), { status: 200 });
  } catch (error) {
    console.error("Error assigning kit:", error.message);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  return authenticateUser(assignKitHandler)(req);
}