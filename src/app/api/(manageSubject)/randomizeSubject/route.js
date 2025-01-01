import SubjectRandomization from "@/models/SubjectRandomization.model.js";
import ManageCode from "@/models/codeManagment.model.js";
import Patient from "@/models/manageSubjects.model";
import { authenticateUser } from "@/utils/auth.js";

const getRandomizationCode = async (siteID, preferredType, fallbackType) => {
  try {
    let code = await ManageCode.findOneAndUpdate(
      { codeSiteId: siteID, Status: "Unused", codeType: preferredType },
      { Status: "Used" },
      { new: true, sort: { createdAt: 1 } }
    );

    // If the preferred type is unavailable, try the fallback type
    if (!code) {
      code = await ManageCode.findOneAndUpdate(
        { codeSiteId: siteID, Status: "Unused", codeType: fallbackType },
        { Status: "Used" },
        { new: true, sort: { createdAt: 1 } }
      );

      if (!code) {
        throw new Error(`No randomization codes available for site: ${siteID}`);
      }
    }

    return {
      codeNo: code.codeNo,
      codeType: code.codeType,
    };
  } catch (error) {
    console.error("Error fetching randomization code:", error.message);
    throw new Error("Failed to fetch randomization code. Please check availability.");
  }
};

/**
 * Fetch randomization group counts for a given site.
 */
const getRandomizationCounts = async (siteID) => {
  try {
    const groupCounts = await SubjectRandomization.aggregate([
      { $match: { siteID } },
      { $group: { _id: "$randomizationGroup", count: { $sum: 1 } } },
    ]);

    const nsCount = groupCounts.find((g) => g._id === "NS")?.count || 0;
    const ipCount = groupCounts.find((g) => g._id === "IP")?.count || 0;

    console.log(`NS Count: ${nsCount}, IP Count: ${ipCount}`);
    return { nsCount, ipCount };
  } catch (error) {
    console.error("Error in getRandomizationCounts:", error.message);
    throw error;
  }
};

/**
 * Determine the randomization group based on the 1:1 ratio logic.
 */
const determineRandomizationGroup = async (siteID) => {
  const randomizedSubjectsCount = await Patient.countDocuments({ siteID, status: 1 });

  // Fetch current group counts
  const { nsCount, ipCount } = await getRandomizationCounts(siteID);

  if (randomizedSubjectsCount === 0) return "NS"; // First patient gets "NS"
  if (randomizedSubjectsCount === 1) return "IP"; // Second patient gets "IP"

  if (randomizedSubjectsCount % 2 === 0) {
    // Even patient: Assign group to maintain balance
    return nsCount <= ipCount ? "NS" : "IP";
  } else {
    // Odd patient: Randomly assign but ensure balance
    return Math.random() < 0.5 ? "NS" : "IP";
  }
};

/**
 * Randomize a subject based on the group determination logic.
 */
const randomizeSubject = async (subjectNumber, siteID) => {
  try {
    const subject = await Patient.findOne({ subjectNumber, siteID });
    if (!subject) throw new Error(`Subject not found: subjectNumber=${subjectNumber}, siteID=${siteID}`);
    if (subject.randomizationStatus === "Randomized") throw new Error("Subject has already been randomized.");

    const preferredGroup = await determineRandomizationGroup(siteID);
    const fallbackGroup = preferredGroup === "NS" ? "IP" : "NS";

    const { codeNo: randomizationCode, codeType } = await getRandomizationCode(siteID, preferredGroup, fallbackGroup);

    const randomizedSubject = new SubjectRandomization({
      subjectID: subject.subjectNumber.toString(),
      siteID,
      randomizationCode,
      randomizationGroup: codeType,
      randomizationDate: new Date(),
      assignedBy: "System",
      auditTrail: [
        { action: "Randomized", performedBy: "System", timestamp: new Date() },
      ],
    });

    await randomizedSubject.save();

    Object.assign(subject, {
      randomizationStatus: "Randomized",
      randomizationGroup: codeType,
      randomizationCode,
      randomizationDate: new Date(),
      status: 1,
      auditTrail: [
        ...(subject.auditTrail || []),
        { action: "Randomized", performedBy: "System", timestamp: new Date() },
      ],
    });

    await subject.save();

    return {
      success: true,
      message: `Subject ${subjectNumber} for site ${siteID} has been randomized successfully.`,
    };
  } catch (error) {
    console.error("Error during subject randomization:", error.message);
    return { success: false, message: error.message || "An error occurred during randomization." };
  }
};

/**
 * Controller action to randomize a subject by subjectNumber and siteID.
 */
const randomizeBySubjectAndSite = async (req) => {
  try {
    const { subjectNumber, siteID } = await req.json();
    if (!subjectNumber || !siteID) {
      return new Response(
        JSON.stringify({ success: false, message: "Both subjectNumber and siteID are required." }),
        { status: 400 }
      );
    }

    const result = await randomizeSubject(subjectNumber.trim(), siteID.trim());
    return new Response(JSON.stringify(result), { status: result.success ? 200 : 500 });
  } catch (error) {
    console.error("Error in randomizeBySubjectAndSite controller:", error.message);
    return new Response(
      JSON.stringify({ success: false, message: "An error occurred while processing the request." }),
      { status: 500 }
    );
  }
};

// Export the POST method
export async function POST(req) {
  return new authenticateUser(randomizeBySubjectAndSite)(req);
}
