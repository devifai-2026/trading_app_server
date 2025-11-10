import mongoose from "mongoose";
import { type } from "os";

const subscriptionPlanSchema = new mongoose.Schema(
    {
        id:{
         type: mongoose.Schema.Types.ObjectId,
         auto:true   
        },
        name:{
            type:String,
            required:true,
            trim:true
        },
        price:{
            type:Number,
            required:true
        },
        type:{
            type:String,
            enum:["monthly", "yearly"],
            required:true
        },
        details: [
            {
                header:{type:String , required:true},
                description:{type:String, required:true}
            
        },
        ],
        tagline:{
            type:String,
            trim:true
        },
        isRecommended:{
            type:Boolean,
            default:false
        },

    },
     {
    timestamps: true, // ✅ adds createdAt & updatedAt
  }
)

export default mongoose.model("SubscriptionPlan", subscriptionPlanSchema);