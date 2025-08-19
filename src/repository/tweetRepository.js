// import { QuoteTweet, Retweet, Tweet } from "../schema/tweetSchema.js";

// import BadRequestError from "../utils/errors/badRequestError.js";
// import handleCommonErrors from "../utils/errors/handleCommonErrors.js";
// // import InternalServerError from "../utils/errors/internalServerError.js";
// import NotFoundError from "../utils/errors/notFoundError.js";
// import UnauthorisedError from "../utils/errors/unauthorisedError.js";
// import logger from '../utils/helpers/logger.js'
// import { withErrorHandling } from "../utils/errors/errorHandler.js";

// export async function createTweet({ body, author }) {
//     try {
//         const tweet = await Tweet.create({ 
//             body,
//             author    // now defined because it comes from the argument
//         });
//         return tweet;
//     } catch (error) {
//         handleCommonErrors(error);
//         throw error;
//     }
// }

// export async function getTweets() {
//     try {
//         const tweet = await Tweet.find();

//         if(tweet.length === 0) {
//             throw new NotFoundError('Tweet')
//         }
//         return tweet
//     } catch (error) {
//         if(error instanceof NotFoundError) {
//             throw error
//         }

//         handleCommonErrors(error);
//         throw error

//         // console.log(error);
//         // throw new InternalServerError()
//     }
// }

// export async function getTweetById(tweetId) {
//     try {
//         const tweet = await Tweet.findById(tweetId);

//         if (!tweet) {
//             throw new NotFoundError("Tweet not found");
//         }

//         return tweet;
//     } catch (error) {
//         // if (error.name === "CastError") {
//         //     throw new BadRequestError(`Invalid tweet ID: ${tweetId}`);
//         // }

//         // console.error("Unexpected error:", error);
//         // throw new InternalServerError("Failed to get tweet");

//         handleCommonErrors(error);
//         throw error
//     }
// }

// export async function deleteTweet(tweetId) {
//     try {
//         const tweet = await Tweet.findByIdAndDelete(tweetId);

//         if(!tweet) {
//             throw new NotFoundError('Tweet')
//         }
//         return tweet
//     } catch (error) {
//         // if(error.name === "CastError") {
//         //     throw new BadRequestError(`Invalid tweet ID ${tweetId}`)
//         // }

//         // console.log(error);
//         // throw new InternalServerError()

//         handleCommonErrors(error);
//         throw error
//     }
// }

// export async function updateTweet(tweetId, body) {
//     try {
//         logger.info("Updating tweetId:", tweetId, "with body:", body);
//         const tweet = await Tweet.findByIdAndUpdate(tweetId, {body: body}, {new: true, runValidators: true},);
//         logger.info("Updated tweetId:", tweetId, "with body:", body);
//         if(!tweet) {
//             throw new NotFoundError('Tweet');
//         }
//         return tweet
//     } catch (error) {

//         handleCommonErrors(error)
//         throw error
//     }
// }

// export async function likeTweet(tweetId, userId) {
//     try {
//         const tweet = await Tweet.findById(tweetId);

//         if(!tweet) {
//             throw new NotFoundError("Tweet")
//         };

//         if(tweet.likes.includes(userId)) {
//             throw new BadRequestError("You have already liked this tweet")
//         }

//         // tweet.likes.push(userId);
//         // await tweet.save();

//         const updateTweet = await Tweet.findByIdAndUpdate(tweetId, 
//             {$addToSet: {likes: userId}},
//             {new: true}
//         )

//         await updateTweet.populate("likes", "displayName");
//         return updateTweet
//     } catch (error) {
//         if(error instanceof NotFoundError) {
//             throw error
//         }
        
//         logger.error(error)
        
//         // throw new InternalServerError()

//         handleCommonErrors(error)
//     }
// }

// export async function unlikeTweet(tweetId, userId) {
//     try {
//         const tweet = await Tweet.findById(tweetId);

//         if(!tweet) {
//             throw new NotFoundError("Tweet")
//         }

//         if(!tweet.likes.includes(userId)) {
//             throw new BadRequestError("You have not liked this tweet")
//         }

//         // tweet.likes = tweet.likes.filter(
//         //     id => id.toString() !== userId.toString()
//         // )

//         // await tweet.save();


//         const updateTweet = await Tweet.findByIdAndUpdate(tweetId, 
//             {$pull: {likes: userId}},
//             {new: true}
//         )

//         return updateTweet
//     } catch (error) {

//         if(error instanceof NotFoundError ) {
//             throw error
//         }

//         logger.error(error)

//         // throw new InternalServerError()

//         handleCommonErrors(error)
        
//     }
// }

// export async function addComment(tweetId, userId, text) {
//     try {
//         const newComment = {
//             user: userId,
//             text: text.trim(),
//             createdAt: new Date()
//         };

//         const updatedTweet = await Tweet.findByIdAndUpdate(
//             tweetId,
//             { $push: { comments: newComment } },
//             { new: true, runValidators: true }
//         ).populate("comments.user", "displayName");

//         if (!updatedTweet) {
//             throw new NotFoundError("Tweet");
//         }

//         return updatedTweet;
//     } catch (error) {
//         if (error instanceof NotFoundError || error instanceof BadRequestError) {
//             throw error;
//         }
//         logger.error(error);
//         handleCommonErrors(error);
//         throw error;
//     }
// }

// // export async function deleteComment(tweetId, commentId, userId) {
// //     try {
// //         const tweet = await Tweet.findById(tweetId)

// //         if(!tweet) {
// //             throw new NotFoundError('Tweet')
// //         }

// //         const comment = tweet.comments.id(commentId);

// //         if(!comment) {
// //             throw new NotFoundError('Comment')
// //         }

// //         if(comment.user.toString() !== userId && tweet.author.toString() !== userId) {
// //             throw new UnauthorisedError();
// //         }

// //         await Tweet.findByIdAndUpdate(
// //             tweetId,
// //             {$pull: {comments: {_id: commentId}}},
// //             {new: true, runValidators: true}
// //         );

// //         return {message: "comment deleted successfully"}
// //     } catch (error) {
// //         if(error instanceof NotFoundError || error instanceof UnauthorisedError) {
// //             throw error
// //         };

// //         logger.error(error);

// //         handleCommonErrors(error);

// //         throw error
// //     }
// // }

// export async function updateComment(tweetId, commentId, body) {
//     try {
//         const tweet = await Tweet.findById(tweetId);

//         if(!tweet) {
//             throw new NotFoundError('Tweet')
//         };

//         const comment = tweet.comments.id(commentId);

//         if(!comment) {
//             throw new NotFoundError('Comment')
//         };

//         comment.text = body.text

//         await tweet.save()

//     } catch (error) {
//         if(error instanceof NotFoundError || 
//            error instanceof UnauthorisedError) 
//         {
//             throw error
//         };


//         logger.error(error);
//         handleCommonErrors(error);
//         throw error
//     }
// };


// import mongoose from "mongoose";

// export async function replyToComment(tweetId, commentId, userId, body) {
//   try {
//     const updatedTweet = await Tweet.findOneAndUpdate(
//       {
//         _id: new mongoose.Types.ObjectId(tweetId),
//         "comments._id": new mongoose.Types.ObjectId(commentId),
//       },
//       {
//         $push: {
//           "comments.$.replies": {
//             user: new mongoose.Types.ObjectId(userId),
//             text: body.trim(),
//           },
//         },
//       },
//       { new: true }
//     );

//     if (!updatedTweet) {
//       throw new NotFoundError("Tweet or Comment not found");
//     }

//     return updatedTweet;
//   } catch (error) {
//     if (error instanceof NotFoundError || error instanceof UnauthorisedError) {
//       throw error;
//     }
//     logger.error(error);
//     handleCommonErrors(error);
//     throw error;
//   }
// }


// export async function toggleCommentLike(tweetId, commentId, userId) {
//     try {
//         const tweet = await Tweet.findOne({ _id: tweetId, "comments._id": commentId });
//         if (!tweet) throw new NotFoundError("Tweet or Comment not found");

//         const comment = tweet.comments.id(commentId);
//         if (!comment) throw new NotFoundError("Comment");

//         const alreadyLiked = comment.likes.some(id => id.toString() === userId.toString());

//         const updateOperation = alreadyLiked
//             ? { $pull: { "comments.$.likes": userId } }
//             : { $addToSet: { "comments.$.likes": userId } };

//         const updatedTweet = await Tweet.findOneAndUpdate(
//             { _id: tweetId, "comments._id": commentId },
//             updateOperation,
//             { new: true }
//         ).populate("comments.user", "displayName")
//          .populate("comments.likes", "displayName");

//         return {updatedTweet, liked: !alreadyLiked};
//     } catch (error) {
//         if (error instanceof NotFoundError || error instanceof UnauthorisedError) {
//             throw error;
//         }

//         logger.error(error);
//         handleCommonErrors(error);
//         throw error;
//     }
// }


// export async function softDeleteComment(tweetId, commentId, userId) {
//     try {
//         const tweet = await Tweet.findOne({ _id: tweetId, "comments._id": commentId });
//         if (!tweet) throw new NotFoundError("Tweet or Comment");

//         const comment = tweet.comments.id(commentId);
//         if (comment.user.toString() !== userId && tweet.author.toString() !== userId) {
//             throw new UnauthorisedError();
//         }

//         const updatedTweet = await Tweet.findOneAndUpdate(
//             { _id: tweetId, "comments._id": commentId },
//             {
//                 $set: {
//                     "comments.$.isDeleted": true,
//                     "comments.$.status": "hidden",
//                     "comments.$.deletedAt": new Date()
//                 }
//             },
//             { new: true }
//         ).populate("comments.user", "displayName");

//         return updatedTweet;
//     } catch (error) {
//         if (error instanceof NotFoundError || error instanceof UnauthorisedError || error instanceof BadRequestError) {
//             throw error;
//         }
//         logger.error(error);
//         handleCommonErrors(error);
//         throw error;
//     }
// }

// export async function retweet(tweetId, userId) {
//     try {
//         const tweet = await Tweet.findById(tweetId);

//         if(!tweet) {
//             throw new NotFoundError("Tweet")
//         };

//         const existingRetweet = await Retweet.findOne({user: userId, originalTweet: tweetId});

//         if(existingRetweet) {
//             throw new BadRequestError("Tweet is already retweeted")
//         };

//         const newRetweet = await Retweet.create({
//             user: userId,
//             originalTweet: tweetId
//         });

//         // tweet.retweetCount += 1;
//         // tweet.retweets.push(newRetweet._id);
//         const populatedRetweet = await Retweet.findById(newRetweet._id)
//         .populate("user", "displayName");

//         await Tweet.findByIdAndUpdate(tweetId,{
//             $inc: {retweetCount: 1},
//             $addToSet: {retweets: newRetweet._id},
//         }, {new: true})

//         // await tweet.save();

//         // return newRetweet;
//         return populatedRetweet
//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error
//         }

//         logger.error(error);
//         handleCommonErrors(error);
//         throw error
//         }
// }

// export async function quoteTweet(tweetId, userId, text) {
//     try {
//         const tweet = await Tweet.findById(tweetId);
//         if(!tweet) {
//             throw new NotFoundError("Tweet")
//         }

//         const newQuote = await QuoteTweet.create({
//             originalTweet: tweetId,
//             user: userId,
//             text: text
//         })

//         await Tweet.findByIdAndUpdate(tweetId,{
//             $inc: {quoteCount: 1},
//             $addToSet: {quoteTweets: newQuote._id}
//         }, {new: true});

//         // await tweet.save();

//         return newQuote;
//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error
//         };

//         logger.error(error);
//         handleCommonErrors(error);
//         throw error
//     }
// }


import { QuoteTweet, Retweet, Tweet } from "../schema/tweetSchema.js";
import mongoose from "mongoose";
import { withErrorHandling } from "../utils/errors/errorHandler.js";
import logger from '../utils/helpers/logger.js';
import NotFoundError from "../utils/errors/notFoundError.js";
import UnauthorisedError from "../utils/errors/unauthorisedError.js";
import { tr } from "zod/locales";

export const createTweet = withErrorHandling(async ({ body, author }) => {
  return await Tweet.create({ body, author });
});

export const getTweets = withErrorHandling(async () => {
  const tweets = await Tweet.find();

  if (tweets.length === 0){ 
    throw new NotFoundError('Tweet');
  }

  return tweets;
});

export const getTweetById = withErrorHandling(async (tweetId) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new NotFoundError("Tweet not found");
  }
  return tweet;
});

export const deleteTweet = withErrorHandling(async (tweetId) => {
  const tweet = await Tweet.findByIdAndDelete(tweetId);
    if (!tweet) {
        throw new NotFoundError('Tweet');

    }
  return tweet;
});

export const updateTweet = withErrorHandling(async (tweetId, body) => {
  logger.info("Updating tweet:", { tweetId, body });
  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { body },
    { new: true, runValidators: true }
  );
  if (!tweet) throw new NotFoundError('Tweet');
  return tweet;
});

export const likeTweet = withErrorHandling(async (tweetId, userId) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new NotFoundError("Tweet");

  }
  if (tweet.likes.includes(userId)) {
    throw new BadRequestError("Already liked");
}

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $addToSet: { likes: userId }},
    { new: true }
  ).populate("likes", "displayName");
  
  return updatedTweet;
});

export const unlikeTweet = withErrorHandling(async (tweetId, userId) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");


  if (!tweet.likes.includes(userId)) {
    throw new BadRequestError("Not liked");
}

  return await Tweet.findByIdAndUpdate(
    tweetId,
    { $pull: { likes: userId }},
    { new: true }
  );
});

export const addComment = withErrorHandling(async (tweetId, userId, text) => {
  const newComment = {
    user: userId,
    text: text.trim(),
    createdAt: new Date()
  };

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { $push: { comments: newComment }},
    { new: true, runValidators: true }
  ).populate("comments.user", "displayName");

  if (!updatedTweet) {
    throw new NotFoundError("Tweet");


}
  return updatedTweet;
});

export const updateComment = withErrorHandling(async (tweetId, commentId, body) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new NotFoundError('Tweet');
}

  const comment = tweet.comments.id(commentId);
  if (!comment) throw new NotFoundError('Comment');

  comment.text = body.text;
  await tweet.save();
  return tweet;
});

export const replyToComment = withErrorHandling(async (tweetId, commentId, userId, body) => {
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

  if (!updatedTweet) throw new NotFoundError("Tweet or Comment not found");
  return updatedTweet;
});

export const toggleCommentLike = withErrorHandling(async (tweetId, commentId, userId) => {
  const tweet = await Tweet.findOne({ _id: tweetId, "comments._id": commentId });

  if (!tweet) {
    throw new NotFoundError("Tweet or Comment not found");
}

  const comment = tweet.comments.id(commentId);
  if (!comment) {

    throw new NotFoundError("Comment");

}

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

  return { updatedTweet, liked: !alreadyLiked };
});

export const softDeleteComment = withErrorHandling(async (tweetId, commentId, userId) => {
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
});

export const retweet = withErrorHandling(async (tweetId, userId) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new NotFoundError("Tweet");

  const existingRetweet = await Retweet.findOne({ user: userId, originalTweet: tweetId });
  if (existingRetweet) {

    await Retweet.findByIdAndDelete(existingRetweet._id)
    await Tweet.findByIdAndUpdate(
        tweetId,
        {$inc: {retweetCount: -1}, $pull: {retweets: existingRetweet._id}},
        {new: true}
    );

    return {action: 'undone', retweetId: existingRetweet._id}

  } else {

    const newRetweet = await Retweet.create({user: userId, originalTweet: tweetId})

  await Tweet.findByIdAndUpdate(
    tweetId,
    { $inc: { retweetCount: 1 }, $addToSet: { retweets: newRetweet._id }},
    { new: true }
  );

    const populatedRetweet = await Retweet.findById(newRetweet._id)
    .populate("user", "displayName");

    return {action: "done", retweet: populatedRetweet}
    }
});


export const quoteTweet = withErrorHandling(async (tweetId, userId, text) => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new NotFoundError("Tweet");
}

  const newQuote = await QuoteTweet.create({
    originalTweet: tweetId,
    user: userId,
    text
  });

  await Tweet.findByIdAndUpdate(
    tweetId,
    { $inc: { quoteCount: 1 }, $addToSet: { quoteTweets: newQuote._id }},
    { new: true }
  );

  const populatedquote = await QuoteTweet.findById(newQuote._id)
  .populate("user", "displayName")
  .populate("originalTweet", "author")
  // .populate("isQuoteTweet", "quoteCount")

  return populatedquote

});

export const deleteQuoteTweet = withErrorHandling(async (quoteId, userId) => {
  const quote = await QuoteTweet.findById(quoteId);

  if(!quote) {
    throw new NotFoundError('Quoted tweet')
  };

  if(quote.user.toString() !== userId) {
    throw new UnauthorisedError();
  };

  await QuoteTweet.findByIdAndDelete(quoteId);

  const updatedTweet = await Tweet.findByIdAndUpdate(quote.originalTweet,
    {
      $inc: {quoteCount: -1},
      $pull: {quoteTweets: quoteId}
    },
    {new: true}
  );

  // const populate = await Tweet.findById(updatedTweet._id)
  // .populate("user", "displayName")
  // .populate({
  //   path: "quoteTweets",
  //   populate: {path: "user", select: "displayName"}
  // })

  // // return {message: "Quoted tweet deleted successfully", updatedTweet};
  // return populate

    const populatedTweet = await Tweet.findById(updatedTweet._id)
    .populate("author", "displayName")
    .populate({
      path: "quoteTweets",
      populate: { path: "user", select: "displayName" },
    });

  return populatedTweet;

});