import mongoose from "mongoose";

const pollVoteSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    poll_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll",
      required: true,
    },
    option_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PollOption",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
  },
  { timestamps: true }
);


export default mongoose.model("PollVote", pollVoteSchema);
