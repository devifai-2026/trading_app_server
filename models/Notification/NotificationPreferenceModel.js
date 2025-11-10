import mongoose from "mongoose";

const notificationPreferenceSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // improves query performance
    },
    FNO: {
      type: Boolean,
      default: false,
    },
    equity: {
      type: Boolean,
      default: false,
    },
    swing: {
      type: Boolean,
      default: false,
    },
    longTerm: {
      type: Boolean,
      default: false,
    },
    commodities: {
      type: Boolean,
      default: false,
    },
    earningsReport: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "NotificationPreference",
  notificationPreferenceSchema
);
