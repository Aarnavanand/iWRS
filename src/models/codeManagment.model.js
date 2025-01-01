import mongoose from "mongoose";

// Define the schema for ManageCode
const manageCodeSchema = new mongoose.Schema(
  {
    codeNo: {
      type: Number,
      required: true,
    },
    codeSiteId: {
      type: String,
      required: true,
      index: true, // Adding index for faster site-based queries
    },
    codeType: {
      type: String,
      required: true,
      enum: ["NS", "IP"], // Restrict codeType to only "NS" or "IP"
    },
    remarks: {
      type: String,
      default: null,
    },
    index: {
      type: Number,
      index: true,
      required: true, // Ensures proper tracking or ordering
    },
    codeGenerationDT: {
      type: Date,
      required: true,
      default: Date.now, // Automatically assigns the current timestamp
    },
    codeRandomizationDT: {
      type: Date,
      default: null, // Tracks when the code was assigned to a subject
    },
    Status: {
      type: String,
      enum: ["used", "Unused"], // Only allows valid status values
      default: "Unused",
    },
    codeuserID: {
      type: String,
      enum: ["001", "002"], // Role of the user creating the code
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const ManageCode = mongoose.models.ManageCode || mongoose.model("ManageCode", manageCodeSchema);

export default ManageCode;
