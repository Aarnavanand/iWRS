import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // enum: ["Super Admin", "Admin", "CRC"],
      enum: ["001", "002", "003"],
      required: true,
    },
    loginAt: {
      type: Date,
    },
    isBlocked: {
      type: Boolean,
      default: false, // false means not blocked, true means blocked
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
