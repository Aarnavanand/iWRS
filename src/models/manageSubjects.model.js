import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  subjectNumber: {
    type: String,
    required: true,
    index: true, // Ensure index is applied
  },
  subjectInitial: {
    type: String,
    required: true,
  },
  subjectGender: {
    type: String,
    required: true,
    enum: ["Male", "Female"],
  },
  dob: {
    type: Date,
    required: true,
  },
  subjectCurrentAge: {
    type: Number,
    required: true,
  },
  subjectHeight: {
    type: Number,
    required: true,
  },
  subjectWeight: {
    type: Number,
    required: true,
  },
  subjectBMI: {
    type: Number,
    required: true,
  },
  criteriaOk: {
    type: Boolean,
    required: true,
    default: false,
  },
  remarks: {
    type: String,
    required: true,
  },
  assignKit: {
    type: String,
    default: null,
    required: true,
  },
  codeIndex: {
    type: Number,
    default: null,
  },
  siteID: {
    type: String,
    required: true,
    index: true, // Ensure index is applied
  },
  status:{
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema);

export default Patient;
