import mongoose from "mongoose";
import { type } from "os";

const notificationSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, auto: true },

    photo: {
      type: String,
      trim: true,
    },
    hyperlink: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);


export const Notification = mongoose.model("Notification", notificationSchema);
