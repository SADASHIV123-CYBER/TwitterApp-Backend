import mongoose from "mongoose";

const TweetSchema = new mongoose.Schema({
  body: {
    type: String,
    trim: true,
    required: true,
    maxLength: [280, "You are crossing the character limit. Max is 280 characters."]
  }
});

export const Tweet = mongoose.model("Tweet", TweetSchema);
