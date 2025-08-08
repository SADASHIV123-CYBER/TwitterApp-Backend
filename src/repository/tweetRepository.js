import { Tweet } from "../schema/tweetSchema.js";

import BadRequestError from "../utils/errors/badRequestError.js";
import handleCommonErrors from "../utils/errors/handleCommonErrors.js";
import InternalServerError from "../utils/errors/internalServerError.js";
import NotFoundError from "../utils/errors/notFoundError.js";

export async function createTweet({body}) {
    try {
        const tweet = await Tweet.create({ body });
        return tweet
    } catch (error) {
        // if(error.name === 'ValidationError') {
        //     const errorMessageList = Object.keys(error.errors).map(property => {
        //         return error.errors[property].message
        //     });

        //     throw new BadRequestError(errorMessageList)
        // }

        handleCommonErrors(error);

        throw error

        // console.log(error);
        // throw new InternalServerError();
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

