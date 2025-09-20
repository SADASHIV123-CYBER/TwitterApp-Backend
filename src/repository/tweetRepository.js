import { QuoteTweet, Retweet, Tweet } from "../schema/tweetSchema.js";
import mongoose from "mongoose";
import NotFoundError from "../utils/errors/notFoundError.js";
import UnauthorisedError from "../utils/errors/unauthorisedError.js";
import BadRequestError from "../utils/errors/badRequestError.js";

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
    .populate({
      path: "comments",
      populate: { path: "user", select: "displayName profilePicture" },
    });
  if (!tweet) throw new NotFoundError("Tweet");
  return tweet;
};

export const deleteTweet = async (tweetId) => {
  const tweet = await Tweet.findByIdAndDelete(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  return tweet;
};

export const updateTweet = async (tweetId, body) => {
  const tweet = await Tweet.findByIdAndUpdate(tweetId, { body }, { new: true, runValidators: true });
  if (!tweet) throw new NotFoundError("Tweet");
  return tweet;
};

export const likeTweet = async (tweetId, userId) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  if (tweet.likes.some((id) => String(id) === String(userId))) throw new BadRequestError("Already liked");
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
  if (!tweet.likes.some((id) => String(id) === String(userId))) throw new BadRequestError("Not liked");
  const updated = await Tweet.findByIdAndUpdate(
    tweetId,
    { $pull: { likes: userId }, $inc: { likeCount: -1 } },
    { new: true }
  ).populate("author", AUTHOR_SELECT);
  if (updated.likeCount < 0) updated.likeCount = 0;
  return updated;
};

export const addComment = async (tweetId, userId, text) => {
  const newComment = { user: userId, text: text.trim(), createdAt: new Date() };
  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $push: { comments: newComment } },
    { new: true, runValidators: true }
  ).populate("comments.user", "displayName profilePicture");
  if (!updatedTweet) throw new NotFoundError("Tweet");
  return updatedTweet;
};

export const updateComment = async (tweetId, commentId, body) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  const comment = tweet.comments.id(commentId);
  if (!comment) throw new NotFoundError("Comment");
  comment.text = body.text;
  comment.editHistory = comment.editHistory || [];
  comment.editHistory.push({ text: body.text, editedAt: new Date() });
  await tweet.save();
  return tweet;
};

export const replyToComment = async (tweetId, commentId, userId, text) => {
  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(tweetId), "comments._id": new mongoose.Types.ObjectId(commentId) },
    { $push: { "comments.$.replies": { user: new mongoose.Types.ObjectId(userId), text: text.trim(), createdAt: new Date() } } },
    { new: true }
  ).populate("comments.user", "displayName profilePicture");
  if (!updatedTweet) throw new NotFoundError("Tweet or Comment not found");
  return updatedTweet;
};

export const toggleCommentLike = async (tweetId, commentId, userId) => {
  const tweet = await Tweet.findOne({ _id: tweetId, "comments._id": commentId });
  if (!tweet) throw new NotFoundError("Tweet or Comment not found");
  const comment = tweet.comments.id(commentId);
  if (!comment) throw new NotFoundError("Comment");
  const alreadyLiked = comment.likes.some((id) => String(id) === String(userId));
  const updateOperation = alreadyLiked ? { $pull: { "comments.$.likes": userId } } : { $addToSet: { "comments.$.likes": userId } };
  const updatedTweet = await Tweet.findOneAndUpdate({ _id: tweetId, "comments._id": commentId }, updateOperation, { new: true })
    .populate("comments.user", "displayName profilePicture")
    .populate("comments.likes", "displayName");
  return { updatedTweet, liked: !alreadyLiked };
};

export const softDeleteComment = async (tweetId, commentId, userId) => {
  const tweet = await Tweet.findOne({ _id: tweetId, "comments._id": commentId });
  if (!tweet) throw new NotFoundError("Tweet or Comment");
  const comment = tweet.comments.id(commentId);
  if (String(comment.user) !== String(userId) && String(tweet.author) !== String(userId)) throw new UnauthorisedError();
  const updatedTweet = await Tweet.findOneAndUpdate(
    { _id: tweetId, "comments._id": commentId },
    { $set: { "comments.$.isDeleted": true, "comments.$.status": "hidden", "comments.$.deletedAt": new Date() } },
    { new: true }
  ).populate("comments.user", "displayName profilePicture");
  return updatedTweet;
};

export const toggleRetweet = async (tweetId, userId) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  const existing = await Retweet.findOne({ user: userId, originalTweet: tweetId });
  if (existing) {
    await Retweet.findByIdAndDelete(existing._id);
    await Tweet.findByIdAndUpdate(tweetId, { $inc: { retweetCount: -1 }, $pull: { retweets: existing._id } });
    return { action: "undone", retweetId: existing._id };
  } else {
    const retweet = await Retweet.create({ user: userId, originalTweet: tweetId });
    await Tweet.findByIdAndUpdate(tweetId, { $inc: { retweetCount: 1 }, $addToSet: { retweets: retweet._id } });
    const populated = await Retweet.findById(retweet._id).populate("user", "displayName profilePicture");
    return { action: "done", retweet: populated };
  }
};

export const createQuoteTweet = async (tweetId, userId, text) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");
  const quote = await QuoteTweet.create({ user: userId, originalTweet: tweetId, text });
  await Tweet.findByIdAndUpdate(tweetId, { $inc: { quoteCount: 1 }, $addToSet: { quoteTweets: quote._id } });
  const populated = await QuoteTweet.findById(quote._id).populate("user", AUTHOR_SELECT).populate("originalTweet", "author body image");
  return populated;
};

export const deleteQuoteTweet = async (quoteId, userId) => {
  const quote = await QuoteTweet.findById(quoteId);
  if (!quote) throw new NotFoundError("Quoted tweet");
  if (String(quote.user) !== String(userId)) throw new UnauthorisedError();
  await QuoteTweet.findByIdAndDelete(quoteId);
  const updatedTweet = await Tweet.findByIdAndUpdate(quote.originalTweet, { $inc: { quoteCount: -1 }, $pull: { quoteTweets: quoteId } }, { new: true });
  const populatedTweet = await Tweet.findById(updatedTweet._id)
    .populate("author", "displayName")
    .populate({ path: "quoteTweets", populate: { path: "user", select: "displayName profilePicture" } });
  return populatedTweet;
};

export const getUserTweets = async (userId) => {
  return await Tweet.find({ author: userId }).sort({ createdAt: -1 }).populate("author", AUTHOR_SELECT);
};

export const getUserRetweets = async (userId) => {
  return await Retweet.find({ user: userId }).sort({ createdAt: -1 }).populate({ path: "originalTweet", populate: { path: "author", select: AUTHOR_SELECT } }).populate("user", AUTHOR_SELECT);
};

export const getUserQuotes = async (userId) => {
  return await QuoteTweet.find({ user: userId }).sort({ createdAt: -1 }).populate({ path: "originalTweet", populate: { path: "author", select: AUTHOR_SELECT } }).populate("user", AUTHOR_SELECT);
};
