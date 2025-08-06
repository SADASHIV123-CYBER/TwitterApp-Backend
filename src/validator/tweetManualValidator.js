import mongoose, { Mongoose } from "mongoose";
import BadRequestError from "../utils/errors/badRequestError.js"

export const createManualTweetValidater = (req, res, next) => {
    const tweetBody = req.body.tweet;

    if(!tweetBody || tweetBody.trim() === "") {
        throw new BadRequestError("Tweet is required")
    }

    if(tweetBody.length > 280) {
        throw new BadRequestError("weet must be 280 characters or less")
    }

    next()
}

export const getTweetByIdManualValidator = (req, res, next) => {
    const tweetId = req.params.id

    if(!tweetId || tweetId.trim() === "") {
        throw new BadRequestError("Tweet id is required")
    }

    if(!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new BadRequestError("Invalid tweet id")
    }


    next()
}