import mongoose from "mongoose";

const subjectRandomizationSchema = new mongoose.Schema(
  {
    subjectID: {
      type: String,
      required: true,
      unique: true, // Ensures subject IDs are unique
      trim: true,
    },
    siteID: {
      type: String,
      required: true,
      trim: true, 
    },
    randomizationCode: {
      type: String,
      default: null, 
    },
    randomizationGroup: {
      type: String,
      enum: ["IP", "NS"], // Example groups
      default: null,
    },
    randomizationDate: {
      type: Date,
      default: null, // Populated when randomization occurs
    },
    assignedBy: {
      type: String,
      default: null, // Stores user ID of the admin assigning the code
    },
    remarks: {
      type: String,
      default: null, // Optional remarks about randomization
    },
    auditTrail: [
      {
        action: {
          type: String,
          required: true, // Example: "Created", "Randomized", "Blocked"
        },
        performedBy: {
          type: String,
          required: true, // User ID of the person performing the action
        },
        timestamp: {
          type: Date,
          default: Date.now, // When the action was performed
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const SubjectRandomization =
  mongoose.models.SubjectRandomization ||
  mongoose.model("SubjectRandomization", subjectRandomizationSchema);

export default SubjectRandomization;
