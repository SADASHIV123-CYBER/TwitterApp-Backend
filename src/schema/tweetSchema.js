import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  text: {
    type: String,
    trim: true,
    required: true,
    maxLength: [280, "Max comment length is 280 characters."]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TweetSchema = new mongoose.Schema({
  body: {
    type: String,
    trim: true,
    required: true,
    maxLength: [280, "Max limit is 280 characters."]
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  comments: [CommentSchema] 
}, {
  timestamps: true
});

export const Tweet = mongoose.model("Tweet", TweetSchema);
