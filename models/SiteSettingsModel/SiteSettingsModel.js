import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema(
    {
        label:{
            type: String,
            required: true,
            trim:true,
        },
        slug:{
            type: String,
            required: true,
            unique: true,
            trim:true,
            lowercase: true,
        },

    },
    { timestamps: true }
);


export default mongoose.model("SiteSettings", siteSettingsSchema);