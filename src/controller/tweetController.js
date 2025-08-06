import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import {
  createTweet as createTweetService,
  getTweets as getTweetsService,
  getTweetById as getTweetByIdService,
  deleteTweet as deleteTweetService,
  updateTweet as updateTweetService
} from "../service/tweetService.js";

import { errorResponce, successResponce } from "../utils/helpers/responses.js";
import BadRequestError from "../utils/errors/badRequestError.js";
import NotFoundError from "../utils/errors/notFoundError.js";
import logger from "../utils/helpers/logger.js";

// CREATE TWEET
export const createTweet = async (req, res) => {
  try {
    const tweet = await createTweetService({ body: req.body.tweet });

    return successResponce(res, tweet, StatusCodes.CREATED, "Tweet created successfully");
  } catch (error) {
    logger.error("Tweet creation failed, something went wrong", error);
    return errorResponce(res, error);
  }
};

// GET ALL TWEETS
export const getTweets = async (req, res) => {
  try {
    const tweets = await getTweetsService();

    return successResponce(res, tweets, StatusCodes.OK, "Tweets fetched successfully");
  } catch (error) {
    logger.error("Unable to get tweets, something went wrong", error);
    return errorResponce(res, error);
  }
};

// GET TWEET BY ID
export const getTweetById = async (req, res) => {
  try {
    const tweet = await getTweetByIdService(req.params.id);

    if (!tweet) {
      throw new NotFoundError("Tweet not found");
    }

    return successResponce(res, tweet, StatusCodes.OK, "Tweet fetched successfully");
  } catch (error) {
    logger.error("Unable to fetch tweet, something went wrong", error);
    return errorResponce(res, error);
  }
};

// DELETE TWEET
export const deleteTweet = async (req, res) => {
  try {
    const deletedTweet = await deleteTweetService(req.params.id);

    if (!deletedTweet) {
      throw new NotFoundError("Tweet not found");
    }

    return successResponce(res, deletedTweet, StatusCodes.OK, "Tweet deleted successfully");
  } catch (error) {
    logger.error("Unable to delete tweet, something went wrong", error);
    return errorResponce(res, error);
  }
};

// UPDATE TWEET
export const updateTweet = async (req, res) => {
  try {
    const updatedTweet = await updateTweetService(req.params.id, req.body.tweet);

    if (!updatedTweet) {
      throw new NotFoundError("Tweet not found");
    }

    return successResponce(res, updatedTweet, StatusCodes.OK, "Tweet updated successfully");
  } catch (error) {
    logger.error("Unable to update tweet, something went wrong", error);
    return errorResponce(res, error);
  }
};
