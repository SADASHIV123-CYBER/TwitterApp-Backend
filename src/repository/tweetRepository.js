import { QuoteTweet, Retweet, Tweet } from "../schema/tweetSchema.js";
import mongoose from "mongoose";
import { withErrorHandling } from "../utils/errors/errorHandler.js";
import NotFoundError from "../utils/errors/notFoundError.js";

const AUTHOR_SELECT = "userName displayName profilePicture";

export const createTweet = async ({ body, author, image }) => {
  const tweet = await Tweet.create({ body, author, image });
  return await Tweet.findById(tweet._id).populate("author", AUTHOR_SELECT);
};

export const getTweets = async () => {
  const tweets = await Tweet.find().sort({ createdAt: -1 }).populate("author", AUTHOR_SELECT);
  if (!tweets || tweets.length === 0) throw new NotFoundError("Tweet");
  return tweets;
};

export const getTweetById = async (tweetId) => {
  if (!mongoose.Types.ObjectId.isValid(tweetId)) throw new NotFoundError("Tweet");
  const tweet = await Tweet.findById(tweetId)
    .populate("author", AUTHOR_SELECT)
    .populate({ path: "comments", populate: { path: "user", select: "displayName profilePicture" } });
  if (!tweet) throw new NotFoundError("Tweet");
  return tweet;
};

export const deleteTweet = withErrorHandling(async (tweetId) => {
  const tweet = await Tweet.findByIdAndDelete(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  return tweet;
});

export const updateTweet = withErrorHandling(async (tweetId, body) => {
  const tweet = await Tweet.findByIdAndUpdate(tweetId, { body }, { new: true, runValidators: true });
  if (!tweet) throw new NotFoundError("Tweet");
  return tweet;
});

export const likeTweet = async (tweetId, userId) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  if (tweet.likes.some((id) => String(id) === String(userId))) {
    throw new Error("Already liked");
  }
  const updated = await Tweet.findByIdAndUpdate(
    tweetId,
    { $addToSet: { likes: userId }, $inc: { likeCount: 1 } },
    { new: true }
  ).populate("author", AUTHOR_SELECT);
  if (typeof updated.likeCount !== "number") updated.likeCount = (updated.likes || []).length;
  return updated;
};

export const unlikeTweet = async (tweetId, userId) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  if (!tweet.likes.some((id) => String(id) === String(userId))) {
    throw new Error("Not liked");
  }
  const updated = await Tweet.findByIdAndUpdate(
    tweetId,
    { $pull: { likes: userId }, $inc: { likeCount: -1 } },
    { new: true }
  ).populate("author", AUTHOR_SELECT);
  if (updated.likeCount < 0) updated.likeCount = 0;
  return updated;
};

export const addComment = withErrorHandling(async (tweetId, userId, text) => {
  const newComment = { user: userId, text: text.trim(), createdAt: new Date() };
  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $push: { comments: newComment } },
    { new: true, runValidators: true }
  ).populate("comments.user", "displayName profilePicture");
  if (!updatedTweet) throw new NotFoundError("Tweet");
  return updatedTweet;
});

export const updateComment = withErrorHandling(async (tweetId, commentId, body) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  const comment = tweet.comments.id(commentId);
  if (!comment) throw new NotFoundError("Comment");
  comment.text = body.text;
  comment.editHistory.push({ text: body.text });
  await tweet.save();
  return tweet;
});

export const replyToComment = withErrorHandling(async (tweetId, commentId, userId, body) => {
  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(tweetId), "comments._id": new mongoose.Types.ObjectId(commentId) },
    { $push: { "comments.$.replies": { user: new mongoose.Types.ObjectId(userId), text: body.trim() } } },
    { new: true }
  ).populate("comments.user", "displayName profilePicture");
  if (!updatedTweet) throw new NotFoundError("Tweet or Comment not found");
  return updatedTweet;
});

export const toggleCommentLike = withErrorHandling(async (tweetId, commentId, userId) => {
  const tweet = await Tweet.findOne({ _id: tweetId, "comments._id": commentId });
  if (!tweet) throw new NotFoundError("Tweet or Comment not found");
  const comment = tweet.comments.id(commentId);
  if (!comment) throw new NotFoundError("Comment");
  const alreadyLiked = comment.likes.some((id) => id.toString() === userId.toString());
  const updateOperation = alreadyLiked ? { $pull: { "comments.$.likes": userId } } : { $addToSet: { "comments.$.likes": userId } };
  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, "comments._id": commentId },
    updateOperation,
    { new: true }
  )
    .populate("comments.user", "displayName profilePicture")
    .populate("comments.likes", "displayName");
  return { updatedTweet, liked: !alreadyLiked };
});

export const softDeleteComment = withErrorHandling(async (tweetId, commentId, userId) => {
  const tweet = await Tweet.findOne({ _id: tweetId, "comments._id": commentId });
  if (!tweet) throw new NotFoundError("Tweet or Comment");
  const comment = tweet.comments.id(commentId);
  if (comment.user.toString() !== userId && tweet.author.toString() !== userId) {
    throw new Error("Unauthorised");
  }
  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, "comments._id": commentId },
    { $set: { "comments.$.isDeleted": true, "comments.$.status": "hidden", "comments.$.deletedAt": new Date() } },
    { new: true }
  ).populate("comments.user", "displayName profilePicture");
  return updatedTweet;
});

export const createRetweet = withErrorHandling(async (tweetId, userId, visibility = "public") => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  const existing = await Retweet.findOne({ user: userId, originalTweet: tweetId });
  if (existing) return existing;
  const retweet = await Retweet.create({ user: userId, originalTweet: tweetId, visibility });
  await Tweet.findByIdAndUpdate(tweetId, { $inc: { retweetCount: 1 }, $addToSet: { retweets: retweet._id } });
  return retweet.populate("user", AUTHOR_SELECT);
});

export const undoRetweet = withErrorHandling(async (tweetId, userId) => {
  const retweet = await Retweet.findOneAndDelete({ user: userId, originalTweet: tweetId });
  if (!retweet) throw new NotFoundError("Retweet");
  await Tweet.findByIdAndUpdate(tweetId, { $inc: { retweetCount: -1 }, $pull: { retweets: retweet._id } });
  return { success: true, removedId: retweet._id };
});

export const findRetweet = withErrorHandling(async (tweetId, userId) => {
  return await Retweet.findOne({ user: userId, originalTweet: tweetId });
});

export const createQuoteTweet = withErrorHandling(async (tweetId, userId, text) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  const quote = await QuoteTweet.create({ user: userId, originalTweet: tweetId, text });
  await Tweet.findByIdAndUpdate(tweetId, { $inc: { quoteCount: 1 }, $addToSet: { quoteTweets: quote._id } });
  return quote.populate("user", AUTHOR_SELECT);
});

export const deleteQuoteTweet = withErrorHandling(async (quoteId, userId) => {
  const quote = await QuoteTweet.findById(quoteId);
  if (!quote) throw new NotFoundError("Quote");
  if (String(quote.user) !== String(userId)) throw new Error("Unauthorised");
  await QuoteTweet.findByIdAndDelete(quoteId);
  await Tweet.findByIdAndUpdate(quote.originalTweet, { $inc: { quoteCount: -1 }, $pull: { quoteTweets: quoteId } });
  return { success: true, removedId: quoteId };
});

export const getUserTweets = async (userId) => {
  return await Tweet.find({ author: userId }).sort({ createdAt: -1 }).populate("author", AUTHOR_SELECT);
};

export const getUserRetweets = async (userId) => {
  return await Retweet.find({ user: userId }).sort({ createdAt: -1 }).populate("originalTweet").populate("user", AUTHOR_SELECT);
};

export const getUserQuotes = async (userId) => {
  return await QuoteTweet.find({ user: userId }).sort({ createdAt: -1 }).populate("originalTweet").populate("user", AUTHOR_SELECT);
};
