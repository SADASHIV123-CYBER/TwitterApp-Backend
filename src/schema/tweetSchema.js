import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    trim: true,
    required: true,
    maxLength: [280, "Max comment length is 280 characters."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    trim: true,
    required: true,
    maxLength: [280, "Max comment length is 280 characters."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [replySchema],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  editHistory: [
    {
      text: String,
      editedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["visible", "hidden", "flagged"],
    default: "visible",
  },
  deletedAt: {
    type: Date,
  },
});

const RetweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalTweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
      required: true,
      index: true,
    },
    visibility: {
      type: String,
      enum: ["public", "followers"],
      default: "public",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { autoIndex: true }
);

const QuoteTweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    originalTweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
      required: true,
      index: true,
    },
    text: {
      type: String,
      trim: true,
      required: true,
      maxLength: [280, "Max comment length is 280 characters."],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { autoIndex: true }
);

const TweetSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      trim: true,
      required: true,
      maxLength: [280, "Max limit is 280 characters."],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [CommentSchema],
    retweets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Retweet",
      },
    ],
    quoteTweets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuoteTweet",
      },
    ],
    isRetweet: {
      type: Boolean,
      default: false,
    },
    isQuoteTweet: {
      type: Boolean,
      default: false,
    },
    originalTweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tweet",
    },
    retweetCount: {
      type: Number,
      default: 0,
    },
    quoteCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

TweetSchema.index({ createdAt: -1 });
TweetSchema.index({ author: 1, createdAt: -1 });

export const Retweet = mongoose.model("Retweet", RetweetSchema);
export const QuoteTweet = mongoose.model("QuoteTweet", QuoteTweetSchema);
export const Tweet = mongoose.model("Tweet", TweetSchema);
