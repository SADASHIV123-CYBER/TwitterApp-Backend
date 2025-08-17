import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
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
})

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
  },

  replies: [replySchema],

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId
    }
  ],

  editHistory: [
    {
      text: String,
      editedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  isDeleted: {
    type: Boolean,
    default: false
  }, 

  status: {
    type: String,
    enum: ["visible", "hidden", "flagged"],
    default: "visible"
  },
  deletedAt: {
    type: Date
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
