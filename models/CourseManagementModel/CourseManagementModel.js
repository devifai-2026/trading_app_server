import mongoose from "mongoose";

const courseManagementSchema = new mongoose.Schema(
    {
        photo:{
            type:String,
            default:""
        },
        slug:{
            type: String,
            required: true,
            unique: true,
             lowercase: true,
           trim: true,
        },

    },
    { timestamps: true }
);


export default mongoose.model("CourseManagement", courseManagementSchema);