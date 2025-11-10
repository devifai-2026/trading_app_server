import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    lastLoginTime: {
      type: Date,
      default: null,
    },
     notificationPreferenceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NotificationPreference", // optional relation if you have separate table
      default: null,
    },

    currentTheme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },

     isEmailVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    marketExperience: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      default: "beginner",
    },
    photo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
export default mongoose.model("User", userSchema);
