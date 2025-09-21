import { StatusCodes } from "http-status-codes";
import * as tweetService from "../service/tweetService.js";
import NotFoundError from "../utils/errors/notFoundError.js";
import { errorResponce, successResponce } from "../utils/helpers/responses.js";
import logger from "../utils/helpers/logger.js";
import { withErrorHandling } from "../utils/errors/errorHandler.js";

export const createTweet = async (req, res) => {
  try {
    const imageUrl = req.file ? req.file.path : null;
    const tweet = await tweetService.createTweet({
      body: req.body.tweet,
      author: req.user._id,
      image: imageUrl
    });
    return successResponce(res, tweet, StatusCodes.CREATED, "Tweet created successfully");
  } catch (err) {
    logger.error("Tweet create error", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message || "Internal Server Error" });
  }
};

export const getTweets = async (req, res) => {
  try {
    const tweets = await tweetService.getTweets(req.user?.id);
    return successResponce(res, tweets, StatusCodes.OK, "Tweets fetched successfully");
  } catch (error) {
    logger.error("Unable to get tweets, something went wrong", error);
    return errorResponce(res, error);
  }
};

export const getTweetById = async (req, res) => {
  try {
    const tweet = await tweetService.getTweetById(req.params.id, req.user?.id);
    if (!tweet) throw new NotFoundError("Tweet not found");
    return successResponce(res, tweet, StatusCodes.OK, "Tweet fetched successfully");
  } catch (error) {
    logger.error("Unable to fetch tweet, something went wrong", error);
    return errorResponce(res, error);
  }
};

export const deleteTweet = async (req, res) => {
  try {
    const deletedTweet = await tweetService.deleteTweet(req.params.id);
    if (!deletedTweet) throw new NotFoundError("Tweet not found");
    return successResponce(res, deletedTweet, StatusCodes.OK, "Tweet deleted successfully");
  } catch (error) {
    logger.error("Unable to delete tweet, something went wrong", error);
    return errorResponce(res, error);
  }
};

export const updateTweet = async (req, res) => {
  try {
    const tweetId = req.params.id;
    const body = req.body.tweet;
    const updatedTweet = await tweetService.updateTweet(tweetId, body);
    if (!updatedTweet) throw new NotFoundError("Tweet not found");
    return successResponce(res, updatedTweet, StatusCodes.OK, "Tweet updated successfully");
  } catch (error) {
    logger.error("Unable to update tweet, something went wrong", error);
    return errorResponce(res, error);
  }
};

export const likeTweetController = async (req, res) => {
  try {
    const tweetId = req.params.id;
    const userId = req.user.id;
    const liked = await tweetService.likeTweet(tweetId, userId);
    return successResponce(res, liked, StatusCodes.OK, `Liked tweet ${tweetId}`);
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const unlikeTweetController = async (req, res) => {
  try {
    const tweetId = req.params.id;
    const userId = req.user.id;
    const unliked = await tweetService.unlikeTweet(tweetId, userId);
    return successResponce(res, unliked, StatusCodes.OK, `Unliked tweet ${tweetId}`);
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const addCommentController = async (req, res) => {
  try {
    const tweetId = req.params.tweetId || req.params.id;
    const userId = req.user.id;
    const { text } = req.body;
    const addedCommentTweet = await tweetService.addComment(tweetId, userId, text);
    return successResponce(res, addedCommentTweet, StatusCodes.OK, `Successfully posted comment on tweet ${tweetId}`);
  } catch (error) {
    logger.error("addCommentController error", error);
    if (error instanceof NotFoundError) {
      return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: error.message });
    }
    if (error.message && (error.message.includes("empty") || error.message.includes("Invalid"))) {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.message });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

export const updateCommentController = async (req, res) => {
  try {
    const { tweetId, commentId } = req.params;
    const body = { text: req.body.text };
    const updatedComment = await tweetService.updateComment(tweetId, commentId, body);
    return successResponce(res, updatedComment, StatusCodes.OK, `Successfully updated comment from tweet ${tweetId}`);
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const replyToCommentController = async (req, res) => {
  try {
    const { tweetId, commentId } = req.params;
    const userId = req.user.id;
    const { text } = req.body;
    const commentReply = await tweetService.replyToComment(tweetId, commentId, userId, text);
    return successResponce(res, commentReply, StatusCodes.OK, `Replied to comment ${commentId}`);
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const toggleCommentLikeController = async (req, res) => {
  try {
    const { tweetId, commentId } = req.params;
    const userId = req.user.id;
    const commentLike = await tweetService.toggleCommentLike(tweetId, commentId, userId);
    return successResponce(res, commentLike, StatusCodes.OK, commentLike?.liked ?? false ? "Liked" : "Unliked");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const softDeleteCommentController = async (req, res) => {
  try {
    const { tweetId, commentId } = req.params;
    const userId = req.user.id;
    const softDeleted = await tweetService.softDeleteComment(tweetId, commentId, userId);
    return successResponce(res, softDeleted, StatusCodes.OK, "Comment deleted");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const retweetController = async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const userId = req.user.id;
    const retweet = await tweetService.retweet(tweetId, userId);
    return successResponce(res, retweet, StatusCodes.OK, retweet.action === "done" ? "Retweet done!" : "Retweet undone");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const quoteController = async (req, res) => {
  try {
    const tweetId = req.params.tweetId;
    const userId = req.user.id;
    const { text } = req.body;
    const quote = await tweetService.quote(tweetId, userId, text);
    return successResponce(res, quote, StatusCodes.OK, "Tweet quoted");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const deleteQuoteController = async (req, res) => {
  try {
    const quoteId = req.params.quoteId;
    const userId = req.user.id;
    const deleted = await tweetService.deleteQuote(quoteId, userId);
    return successResponce(res, deleted, StatusCodes.OK, "Quote tweet deleted successfully");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const getUserTweets = withErrorHandling(async (req, res) => {
  const tweets = await tweetService.getUserTweets(req.params.userId, req.user?.id);
  res.status(StatusCodes.OK).json({ success: true, data: tweets });
});

export const getUserRetweets = withErrorHandling(async (req, res) => {
  const retweets = await tweetService.getUserRetweets(req.params.userId, req.user?.id);
  res.status(StatusCodes.OK).json({ success: true, data: retweets });
});

export const getUserQuotes = withErrorHandling(async (req, res) => {
  const quotes = await tweetService.getUserQuotes(req.params.userId, req.user?.id);
  res.status(StatusCodes.OK).json({ success: true, data: quotes });
});
