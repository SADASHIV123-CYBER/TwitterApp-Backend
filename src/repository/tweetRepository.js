import { Tweet } from "../schema/tweetSchema.js";

import BadRequestError from "../utils/errors/badRequestError.js";
import handleCommonErrors from "../utils/errors/handleCommonErrors.js";
// import InternalServerError from "../utils/errors/internalServerError.js";
import NotFoundError from "../utils/errors/notFoundError.js";
import UnauthorisedError from "../utils/errors/unauthorisedError.js";
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
        logger.info("Updating tweetId:", tweetId, "with body:", body);
        const tweet = await Tweet.findByIdAndUpdate(tweetId, {body: body}, {new: true, runValidators: true},);
        logger.info("Updated tweetId:", tweetId, "with body:", body);
        if(!tweet) {
            throw new NotFoundError('Tweet');
        }
        return tweet
    } catch (error) {

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

        // tweet.likes.push(userId);
        // await tweet.save();

        const updateTweet = await Tweet.findByIdAndUpdate(tweetId, 
            {$addToSet: {likes: userId}},
            {new: true}
        )

        await updateTweet.populate("likes", "displayName");
        return updateTweet
    } catch (error) {
        if(error instanceof NotFoundError) {
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

        // tweet.likes = tweet.likes.filter(
        //     id => id.toString() !== userId.toString()
        // )

        // await tweet.save();


        const updateTweet = await Tweet.findByIdAndUpdate(tweetId, 
            {$pull: {likes: userId}},
            {new: true}
        )

        return updateTweet
    } catch (error) {

        if(error instanceof NotFoundError ) {
            throw error
        }

        logger.error(error)

        // throw new InternalServerError()

        handleCommonErrors(error)
        
    }
}

export async function addComment(tweetId, userId, text) {
    try {
        if (!text?.trim()) {
            throw new BadRequestError("Comment text is required");
        }

        const newComment = {
            user: userId,
            text: text.trim(),
            createdAt: new Date()
        };

        const updatedTweet = await Tweet.findByIdAndUpdate(
            tweetId,
            { $push: { comments: newComment } },
            { new: true, runValidators: true }
        ).populate("comments.user", "displayName");

        if (!updatedTweet) {
            throw new NotFoundError("Tweet");
        }

        return updatedTweet;
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error;
        }
        logger.error(error);
        handleCommonErrors(error);
        throw error;
    }
}

// export async function deleteComment(tweetId, commentId, userId) {
//     try {
//         const tweet = await Tweet.findById(tweetId)

//         if(!tweet) {
//             throw new NotFoundError('Tweet')
//         }

//         const comment = tweet.comments.id(commentId);

//         if(!comment) {
//             throw new NotFoundError('Comment')
//         }

//         if(comment.user.toString() !== userId && tweet.author.toString() !== userId) {
//             throw new UnauthorisedError();
//         }

//         await Tweet.findByIdAndUpdate(
//             tweetId,
//             {$pull: {comments: {_id: commentId}}},
//             {new: true, runValidators: true}
//         );

//         return {message: "comment deleted successfully"}
//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof UnauthorisedError) {
//             throw error
//         };

//         logger.error(error);

//         handleCommonErrors(error);

//         throw error
//     }
// }

export async function updateComment(tweetId, commentId, body) {
    try {
        const tweet = await Tweet.findById(tweetId);

        if(!tweet) {
            throw new NotFoundError('Tweet')
        };

        const comment = tweet.comments.id(commentId);

        if(!comment) {
            throw new NotFoundError('Comment')
        };

        comment.text = body.text

        await tweet.save()

    } catch (error) {
        if(error instanceof NotFoundError || 
           error instanceof UnauthorisedError) 
        {
            throw error
        };


        logger.error(error);
        handleCommonErrors(error);
        throw error
    }
};

// export async function replyToComment(tweetId, commentId, userId, body) {

//     try {
//         const updatedTweet = await Tweet.findOneAndUpdate(
//             { _id: tweetId, "comments._id": new mongoose.Types.ObjectId(commentId) },
//             { $push: { "comments.$.replies": { user: userId, text: body.trim() } } },
//             { new: true }
//         );

//         if(!updatedTweet) {
//             throw new NotFoundError("Tweet or Comment not found");
//         }

//         return updatedTweet;
//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof UnauthorisedError) {
//             throw error;
//         }
//         logger.error(error);
//         handleCommonErrors(error);
//         throw error;
//     }
// }

import mongoose from "mongoose";

export async function replyToComment(tweetId, commentId, userId, body) {
  try {
    const updatedTweet = await Tweet.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(tweetId),
        "comments._id": new mongoose.Types.ObjectId(commentId),
      },
      {
        $push: {
          "comments.$.replies": {
            user: new mongoose.Types.ObjectId(userId),
            text: body.trim(),
          },
        },
      },
      { new: true }
    );

    if (!updatedTweet) {
      throw new NotFoundError("Tweet or Comment not found");
    }

    return updatedTweet;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof UnauthorisedError) {
      throw error;
    }
    logger.error(error);
    handleCommonErrors(error);
    throw error;
  }
}


export async function toggleCommentLike(tweetId, commentId, userId) {
    try {
        const tweet = await Tweet.findOne({ _id: tweetId, "comments._id": commentId });
        if (!tweet) throw new NotFoundError("Tweet or Comment not found");

        const comment = tweet.comments.id(commentId);
        if (!comment) throw new NotFoundError("Comment");

        const alreadyLiked = comment.likes.some(id => id.toString() === userId.toString());

        const updateOperation = alreadyLiked
            ? { $pull: { "comments.$.likes": userId } }
            : { $addToSet: { "comments.$.likes": userId } };

        const updatedTweet = await Tweet.findOneAndUpdate(
            { _id: tweetId, "comments._id": commentId },
            updateOperation,
            { new: true }
        ).populate("comments.user", "displayName")
         .populate("comments.likes", "displayName");

        return {updatedTweet, liked: !alreadyLiked};
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof UnauthorisedError) {
            throw error;
        }

        logger.error(error);
        handleCommonErrors(error);
        throw error;
    }
}


export async function softDeleteComment(tweetId, commentId, userId) {
    try {
        const tweet = await Tweet.findOne({ _id: tweetId, "comments._id": commentId });
        if (!tweet) throw new NotFoundError("Tweet or Comment");

        const comment = tweet.comments.id(commentId);
        if (comment.user.toString() !== userId && tweet.author.toString() !== userId) {
            throw new UnauthorisedError();
        }

        const updatedTweet = await Tweet.findOneAndUpdate(
            { _id: tweetId, "comments._id": commentId },
            {
                $set: {
                    "comments.$.isDeleted": true,
                    "comments.$.status": "hidden",
                    "comments.$.deletedAt": new Date()
                }
            },
            { new: true }
        ).populate("comments.user", "displayName");

        return updatedTweet;
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof UnauthorisedError || error instanceof BadRequestError) {
            throw error;
        }
        logger.error(error);
        handleCommonErrors(error);
        throw error;
    }
}
