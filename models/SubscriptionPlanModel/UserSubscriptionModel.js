import { subscribe } from "diagnostics_channel";
import mongoose from "mongoose";
import { type } from "os";

const userSubscriptionSchema = new mongoose.Schema(
    {
        id: { type: mongoose.Schema.Types.ObjectId, auto: true },

        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // 🔗 Links to User
            required: true,
        },
        planId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubscriptionPlan", // 🔗 Links to SubscriptionPlan
            required: true,
        },
        subscribedAt: {
            type: Date,
            default: Date.now,
        },
        endedAt:{
            type:Date
        },
        isExpired:{
            type: Boolean,
            default: false,
        },
        paymentReferenceId:{
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);


export const UserSubscription = mongoose.model("UserSubscription", userSubscriptionSchema);