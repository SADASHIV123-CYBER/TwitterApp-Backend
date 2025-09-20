import { StatusCodes } from "http-status-codes";
import * as tweetService from "../service/tweetService.js";
import { errorResponce, successResponce } from "../utils/helpers/responses.js";
import NotFoundError from "../utils/errors/notFoundError.js";
import logger from "../utils/helpers/logger.js";

export const createTweet = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : null;
    const tweet = await tweetService.createTweet({ body: req.body.tweet, author: req.user._id, image: imageUrl });
    return successResponce(res, tweet, StatusCodes.CREATED, "Tweet created successfully");
  } catch (err) {
    logger.error(err);
    return errorResponce(res, err);
  }
};

export const getTweets = async (req, res) => {
  try {
    const tweets = await tweetService.getTweets();
    return successResponce(res, tweets, StatusCodes.OK, "Tweets fetched successfully");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const getTweetById = async (req, res) => {
  try {
    const tweet = await tweetService.getTweetById(req.params.id);
    if (!tweet) throw new NotFoundError("Tweet not found");
    return successResponce(res, tweet, StatusCodes.OK, "Tweet fetched successfully");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const deleteTweet = async (req, res) => {
  try {
    const deletedTweet = await tweetService.deleteTweet(req.params.id);
    if (!deletedTweet) throw new NotFoundError("Tweet not found");
    return successResponce(res, deletedTweet, StatusCodes.OK, "Tweet deleted successfully");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const updateTweet = async (req, res) => {
  try {
    const updatedTweet = await tweetService.updateTweet(req.params.id, req.body.tweet);
    return successResponce(res, updatedTweet, StatusCodes.OK, "Tweet updated successfully");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const likeTweetController = async (req, res) => {
  try {
    const likeTweet = await tweetService.likeTweet(req.params.id, req.user.id);
    return successResponce(res, likeTweet, StatusCodes.OK, "Liked tweet");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const unlikeTweetController = async (req, res) => {
  try {
    const unlikeTweet = await tweetService.unlikeTweet(req.params.id, req.user.id);
    return successResponce(res, unlikeTweet, StatusCodes.OK, "Unliked tweet");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const addCommentController = async (req, res) => {
  try {
    const tweetId = req.params.tweetId ?? req.params.id;
    const addComment = await tweetService.addComment(tweetId, req.user.id, req.body.text);
    return successResponce(res, addComment, StatusCodes.OK, "Comment added");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const updateCommentController = async (req, res) => {
  try {
    const tweetId = req.params.tweetId ?? req.params.id;
    const commentId = req.params.commentId;
    const updateComment = await tweetService.updateComment(tweetId, commentId, { text: req.body.text });
    return successResponce(res, updateComment, StatusCodes.OK, "Comment updated");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const replyToCommentController = async (req, res) => {
  try {
    const tweetId = req.params.tweetId ?? req.params.id;
    const commentId = req.params.commentId;
    const commentReply = await tweetService.replyToComment(tweetId, commentId, req.user.id, req.body.text);
    return successResponce(res, commentReply, StatusCodes.OK, "Replied to comment");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const toggleCommentLikeController = async (req, res) => {
  try {
    const tweetId = req.params.tweetId ?? req.params.id;
    const commentId = req.params.commentId;
    const commentLike = await tweetService.toggleCommentLike(tweetId, commentId, req.user.id);
    return successResponce(res, commentLike, StatusCodes.OK, commentLike.liked ? "Liked" : "Unliked");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const softDeleteCommentController = async (req, res) => {
  try {
    const tweetId = req.params.tweetId ?? req.params.id;
    const commentId = req.params.commentId;
    const softDelete = await tweetService.softDeleteComment(tweetId, commentId, req.user.id);
    return successResponce(res, softDelete, StatusCodes.OK, "Comment deleted");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const retweetController = async (req, res) => {
  try {
    const tweetId = req.params.tweetId ?? req.params.id;
    const result = await tweetService.retweet(tweetId, req.user.id);
    return successResponce(res, result, StatusCodes.OK, result.action === "done" ? "Retweet done!" : "Retweet undone");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const quoteController = async (req, res) => {
  try {
    const tweetId = req.params.tweetId ?? req.params.id;
    const quote = await tweetService.quote(tweetId, req.user.id, req.body.text);
    return successResponce(res, quote, StatusCodes.OK, "Tweet quoted");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const deleteQuoteController = async (req, res) => {
  try {
    const quoteId = req.params.quoteId ?? req.params.id;
    const result = await tweetService.deleteQuote(quoteId, req.user.id);
    return successResponce(res, result, StatusCodes.OK, "Quote tweet deleted successfully");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const getUserTweets = async (req, res) => {
  try {
    const tweets = await tweetService.getUserTweets(req.params.userId);
    return successResponce(res, tweets, StatusCodes.OK, "User tweets");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const getUserRetweets = async (req, res) => {
  try {
    const retweets = await tweetService.getUserRetweets(req.params.userId);
    return successResponce(res, retweets, StatusCodes.OK, "User retweets");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const getUserQuotes = async (req, res) => {
  try {
    const quotes = await tweetService.getUserQuotes(req.params.userId);
    return successResponce(res, quotes, StatusCodes.OK, "User quotes");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};
