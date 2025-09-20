import express from "express";
import {
  addCommentController,
  createTweet,
  deleteQuoteController,
  deleteTweet,
  getTweetById,
  getTweets,
  likeTweetController,
  quoteController,
  replyToCommentController,
  retweetController,
  softDeleteCommentController,
  toggleCommentLikeController,
  unlikeTweetController,
  updateCommentController,
  updateTweet,
  getUserTweets,
  getUserRetweets,
  getUserQuotes,
} from "../../controller/tweetController.js";
import { getTweetByIdManualValidator } from "../../validator/tweetManualValidator.js";
import cloudinaryUploader from "../../middlewares/multerUploader.js";
import { validate } from "../../validator/zodValidator.js";
import { tweetZodSchema } from "../../validator/schema/tweetZodSchema.js";
import { isLoggedIn } from "../../middlewares/authMiddlewares.js";
import { commentZodSchema } from "../../validator/schema/commentZodSchema.js";
import { replyZodSchema } from "../../validator/schema/replyZodSchema.js";
import { getQuoteByIdManualValidator } from "../../validator/quoteTweetManualValidator.js";

const router = express.Router();

router.get("/", isLoggedIn, getTweets);
router.post("/", isLoggedIn, cloudinaryUploader("tweets").single("tweetImage"), validate(tweetZodSchema), createTweet);

router.get("/user/:userId", isLoggedIn, getUserTweets);
router.get("/user/:userId/retweets", isLoggedIn, getUserRetweets);
router.get("/user/:userId/quotes", isLoggedIn, getUserQuotes);

router.post("/:tweetId/comments", isLoggedIn, getTweetByIdManualValidator, validate(commentZodSchema), addCommentController);
router.post("/:id/comment", isLoggedIn, getTweetByIdManualValidator, validate(commentZodSchema), addCommentController);

router.put("/:tweetId/comments/:commentId", isLoggedIn, getTweetByIdManualValidator, updateCommentController);
router.put("/:tweetId/comment/:commentId", isLoggedIn, getTweetByIdManualValidator, updateCommentController);

router.post("/:tweetId/comments/:commentId/replies", isLoggedIn, getTweetByIdManualValidator, validate(replyZodSchema), replyToCommentController);

router.post("/:tweetId/comments/:commentId/like", isLoggedIn, getTweetByIdManualValidator, toggleCommentLikeController);
router.post("/:tweetId/comment/:commentId/like", isLoggedIn, getTweetByIdManualValidator, toggleCommentLikeController);

router.delete("/:tweetId/comments/:commentId/soft", isLoggedIn, getTweetByIdManualValidator, softDeleteCommentController);
router.delete("/:tweetId/comment/:commentId/soft", isLoggedIn, getTweetByIdManualValidator, softDeleteCommentController);

router.post("/:tweetId/retweet", isLoggedIn, getTweetByIdManualValidator, retweetController);
router.post("/:tweetId/quote", isLoggedIn, getTweetByIdManualValidator, cloudinaryUploader("quote").single("quoteImage"), quoteController);
router.delete("/:quoteId/quote", isLoggedIn, getQuoteByIdManualValidator, deleteQuoteController);
router.delete("/quote/:quoteId", isLoggedIn, getQuoteByIdManualValidator, deleteQuoteController);

router.get("/:id", isLoggedIn, getTweetById);
router.put("/:id", isLoggedIn, getTweetByIdManualValidator, validate(tweetZodSchema), updateTweet);
router.delete("/:id", isLoggedIn, getTweetByIdManualValidator, deleteTweet);

router.post("/:id/like", isLoggedIn, getTweetByIdManualValidator, likeTweetController);
router.post("/:id/unlike", isLoggedIn, getTweetByIdManualValidator, unlikeTweetController);

export default router;
