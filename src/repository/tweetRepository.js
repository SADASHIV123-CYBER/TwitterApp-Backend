import { Tweet } from "../schema/tweetSchema.js";

import BadRequestError from "../utils/errors/badRequestError.js";
import handleCommonErrors from "../utils/errors/handleCommonErrors.js";
import InternalServerError from "../utils/errors/internalServerError.js";
import NotFoundError from "../utils/errors/notFoundError.js";
import logger from '../utils/helpers/logger.js'

export async function createTweet({ body, author }) {
    try {
        const tweet = await Tweet.create({ 
            body,
            author    // now defined because it comes from the argument
        });
        return tweet;
    } catch (error) {
        handleCommonErrors(error);
        throw error;
    }
}

export async function getTweets() {
    try {
        const tweet = await Tweet.find();

        if(tweet.length === 0) {
            throw new NotFoundError('Tweet')
        }
        return tweet
    } catch (error) {
        if(error instanceof NotFoundError) {
            throw error
        }

        handleCommonErrors(error);
        throw error

        // console.log(error);
        // throw new InternalServerError()
    }
}

export async function getTweetById(tweetId) {
    try {
        const tweet = await Tweet.findById(tweetId);

        if (!tweet) {
            throw new NotFoundError("Tweet not found");
        }

        return tweet;
    } catch (error) {
        // if (error.name === "CastError") {
        //     throw new BadRequestError(`Invalid tweet ID: ${tweetId}`);
        // }

        // console.error("Unexpected error:", error);
        // throw new InternalServerError("Failed to get tweet");

        handleCommonErrors(error);
        throw error
    }
}

export async function deleteTweet(tweetId) {
    try {
        const tweet = await Tweet.findByIdAndDelete(tweetId);

        if(!tweet) {
            throw new NotFoundError('Tweet')
        }
        return tweet
    } catch (error) {
        // if(error.name === "CastError") {
        //     throw new BadRequestError(`Invalid tweet ID ${tweetId}`)
        // }

        // console.log(error);
        // throw new InternalServerError()

        handleCommonErrors(error);
        throw error
    }
}

export async function updateTweet(tweetId, body) {
    try {
        const tweet = await Tweet.findByIdAndUpdate(tweetId, {body}, {new: true, runValidators: true},);

        if(!tweet) {
            throw new NotFoundError('Tweet');
        }
        return tweet
    } catch (error) {
        // if(error.name === 'CastError') {
        //     throw new BadRequestError(`Invalid tweet ID ${tweetId}`);
        // }

        // if(error.name === 'ValidationError') {
        //     const errorMessageList = Object.keys(error.errors).map(property => {
        //         return error.errors[property].message;
        //     })

        //     throw new BadRequestError(errorMessageList)
        // }

        // console.log(error);
        // throw new InternalServerError()

        handleCommonErrors(error)
        throw error
    }
}

export async function likeTweet(tweetId, userId) {
    try {
        const tweet = await Tweet.findById(tweetId);

        if(!tweet) {
            throw new NotFoundError("Tweet")
        };

        if(tweet.likes.includes(userId)) {
            throw new BadRequestError("You have already liked this tweet")
        }

        tweet.likes.push(userId);
        await tweet.save();

        await tweet.populate("likes", "userName");
        return tweet
    } catch (error) {
        if(error instanceof NotFoundError ||error instanceof BadRequestError) {
            throw error
        }
        
        logger.error(error)
        
        // throw new InternalServerError()

        handleCommonErrors(error)
    }
}

export async function unlikeTweet(tweetId, userId) {
    try {
        const tweet = await Tweet.findById(tweetId);

        if(!tweet) {
            throw new NotFoundError("Tweet")
        }

        if(!tweet.likes.includes(userId)) {
            throw new BadRequestError("You have not liked this tweet")
        }

        tweet.likes = tweet.likes.filter(
            id => id.toString() !== userId.toString()
        )

        await tweet.save();
        return tweet
    } catch (error) {

        if(error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error
        }

        logger.error(error)

        // throw new InternalServerError()

        handleCommonErrors(error)
        
    }
}
