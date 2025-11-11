import mongoose from "mongoose";

const pollOptionSchema = new mongoose.Schema(
   {
    id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    poll_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll", // 🔗 Links to Poll
      required: true,
    },
    option_text: {
      type: String,
      required: true,
      trim: true,
    },
    vote_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)


export default mongoose.model("PollOption", pollOptionSchema);