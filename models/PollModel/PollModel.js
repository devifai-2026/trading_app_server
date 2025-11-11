import mongoose from "mongoose";
import { type } from "os";

const pollSchema = new mongoose.Schema(
    {
        id:{ type: mongoose.Schema.Types.ObjectId, auto:true },

        question:{
            type:String,
            required:true,
            trim:true
        },
        isActive:{
            type:Boolean,
            default:true
        },
        expires_at:{
            type:Date,
            required:true
        },
       
    },
    { timestamps: true }

);

export default mongoose.model("Poll", pollSchema);