import mongoose from "mongoose";

const siteManagementSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      required: true,
      default: null,
    },
    siteID: {
      type: String,
      required: true,
      unique: true,
    },
    siteTitle: {
      type: String,
      required: true,
    },
    siteAddress: {
      type: String,
      required: true,
    },
    siteCountry: {
      type: String,
      required: true,
    },
    siteState: {
      type: String,
      required: true,
    },
    siteCity: {
      type: String,
      required: true,
    },
    sitePIN: {
      type: String,
      required: true,
    },
    siteContactNo: {
      type: String,
      required: true,
    },
    siteEmailId: {
      type: String,
      required: true,
      unique: true,
    },
    enrolmentAtSite: {
      type: String,
      required: true,
    },
    remarks: {
      type: String,
      required: true,
    },
    crcAllotted: {
      type: String,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

const SiteManagement =
  mongoose.models.SiteManagement ||
  mongoose.model("SiteManagement", siteManagementSchema);

export default SiteManagement;