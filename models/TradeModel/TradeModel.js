import mongoose from "mongoose";
import { type } from "os";

const tradeSchema = new mongoose.Schema(
    {
        targetUser:{
            type:String,
            enum:["subscribedUsers", "allUsers"],
            default:"allUsers"
        },
        tradeType:{
            type:String,
            required:true,
            trim:true
        },
        title:{
            type:String,
            required:true,
            trim:true
        },
        shortDescription:{
            type:String,
            trim:true
        },
        longDescription:{
            type:String,
            trim:true
        },
      remarks:{
        type:String,
            trim:true
      },
      category:{
        type:String,
        enum: ["FNO", "Cash", "Commodity"],
        required:true
      },
      subCategory:{
          type:String,
        enum: ["industry", "delivery", "long term"],
         default: "industry",
      },
      validityDate:{
        type: Date,
        required:true
      },
       status:{
        type:String,
         enum: ["open", "closed"],
      default: "open",
       },
       isDeleted:{
        type:Boolean,
        default:false
       }

    },
    { timestamps: true }
);


export default mongoose.model("Trade", tradeSchema);