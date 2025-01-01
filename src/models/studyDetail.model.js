import mongoose from "mongoose";

// Define the schema for the new study
const newStudySchema = new mongoose.Schema(
  {
    protocolNo: {
      type: String,
      required: true,
      default: null,
    },
    protocolTitle: {
      type: String,
      required: true,
      default: null,
    },
    companyLogo: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }, // Adds createdAt and updatedAt fields
);

const NewStudie =
  mongoose.models.NewStudie || mongoose.model("NewStudie", newStudySchema);

export default NewStudie;
