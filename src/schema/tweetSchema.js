import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
  body: {
    type: String,
    trim: true,
    required: true,
    maxLength: [280, "Max limit is 280 characters."]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "USER",
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER"
    }
  ]
}, {
  timestamps: true
});

export const Tweet = mongoose.model("Tweet", TweetSchema);
