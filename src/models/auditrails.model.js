import mongoose from "mongoose";

const auditTrailSchema = new mongoose.Schema(
  {
    action: { type: String, required: true }, // Action (e.g., CREATE, UPDATE, DELETE)
    collectionName: { type: String, required: true }, // Collection name
    documentId: { type: String, required: true }, // Document ID
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User ID
    email: { type: String, required: true }, // Email of the logged-in user
    changes: { type: Object, default: null }, // Changes made (if applicable)
    description: { type: String, default: "" }, // Action description
  },
  { timestamps: true }
);

const AuditTrail =
  mongoose.models.AuditTrail || mongoose.model("AuditTrail", auditTrailSchema);

export default AuditTrail;
