import AuditTrail from "../models/auditrails.model.js";

export const logAuditTrail = async ({
  collectionName,
  documentId,
  userId,
  email,
  action,
  description,
  oldData = null, // Add oldData for updates
  newData = null, // Add newData for updint/ates
}) => {
  try {
    let changes = null;

    // Calculate changes for UPDATE actions
    if (action === "UPDATE" && oldData && newData) {
      changes = {};
      for (const key in newData) {
        if (newData[key] !== oldData[key]) {
          changes[key] = { old: oldData[key], new: newData[key] };
        }
      }
    }

    // Log the audit trail
    await AuditTrail.create({
      collectionName, // e.g., "Users", "Orders"
      documentId, // ID of the document
      user: userId, // User ID of the logged-in user
      email, // Email of the logged-in user
      action, // CREATE, UPDATE, DELETE
      description, // Description of the operation
      changes, // Changes made to the document (if any)
    });
  } catch (error) {
    console.error("Error logging audit trail:", error.message);
  }
};
