// import { 
//     createTweet as createTweetRepository,
//     getTweets as getTweetsRepository,
//     getTweetById as getTweetByIdRepository,
//     deleteTweet as deleteTweetRepository,
//     updateTweet as updateTweetRepository,
//     // addComment as addCommentRepository,
//     // deleteComment as deleteCommentRepository
// } from '../repository/tweetRepository.js';

// import InternalServerError from '../utils/errors/internalServerError.js';
// import NotFoundError from '../utils/errors/notFoundError.js';
// import handleCommonErrors from '../utils/errors/handleCommonErrors.js';
// import { Filter } from 'bad-words';
// import logger from '../utils/helpers/logger.js';
// import BadRequestError from '../utils/errors/badRequestError.js';

// import * as tweetRepository from '../repository/tweetRepository.js'
// import UnauthorisedError from '../utils/errors/unauthorisedError.js';
// import { withErrorHandling } from '../utils/errors/errorHandler.js';

// export async function createTweet({ body, author }) {
//   try {
//     const filter = new Filter();

//     if(filter.isProfane(body)) {
//       logger.warn(`Profanity detected in input: ${body}`);
//       logger.info(`Cleaned version ${filter.clean(body)}`);
//       throw new BadRequestError('Tweet contains blocked words');
//     }

//     const tweet = await createTweetRepository({ body, author });
//     return tweet;
    
//   } catch (error) {
//     if(error instanceof BadRequestError || error instanceof InternalServerError || error instanceof UnauthorisedError) {
//       throw error;
//     }
//     logger.error(error);
//     handleCommonErrors(error);
//   }
// }

// export async function getTweets() {
//     try {
//         const tweets = await getTweetsRepository();
//         return tweets;
//     } catch (error) {
//         console.error(error);
//         throw new InternalServerError();
//     }
// }

// export async function getTweetById(id) {
//     try {
//         const tweet = await getTweetByIdRepository(id);

//         if (!tweet) {
//             throw new NotFoundError('Tweet');
//         }

//         return tweet;
//     } catch (error) {
//         if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error;
//         }

//         logger.error(error)

//         handleCommonErrors(error);
//     }
// }

// export async function deleteTweet(id) {
//     try {
//         const response = await deleteTweetRepository(id);

//         if (!response) {
//             throw new NotFoundError('Tweet');
//         }

//         return response;
//     } catch (error) {
//         if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error;
//         }

//         logger.error(error)

//         handleCommonErrors(error);
//     }
// }

// export async function updateTweet(id, body) {
//     try {

//         const response = await updateTweetRepository(id, body);
//         logger.info(body)

//         if (!response) {
//             throw new NotFoundError('Tweet');
//         }

//         return response;
//     } catch (error) {
//         if (error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error;
//         }
        
//         logger.error(error)

//         handleCommonErrors(error);
//         throw error
//     }
// }

// export async function likeTweetService(tweetId, userId) {
//     try {
//         return await tweetRepository.likeTweet(tweetId, userId);

//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error
//         }

//         logger.error(error);

//         handleCommonErrors(error)

//     }
// };

// export async function unlikeTweetService(tweetId, userId) {
//     try {
//         return await tweetRepository.unlikeTweet(tweetId, userId);
//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error
//         }

//         logger.error(error)

//         handleCommonErrors(error)
//     }
// }

// export async function addCommentService(tweetId, userId, text) {
//     try {
//         return await tweetRepository.addComment(tweetId, userId, text);
//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error;
//         }

//         logger.error(error);

//         handleCommonErrors(error);

//         throw error
//     }
// }

// export async function deleteCommentService(tweetId, commentId, userId) {
//     try {
//         return await tweetRepository.deleteComment(tweetId, commentId, userId);
//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error
//         }

//         logger.error(error)

//         handleCommonErrors(error);
        
//         throw error
//     }
// }

// export async function updateCommentService(tweetId, commentId, body) {
//     try {
//         return await tweetRepository.updateComment(tweetId, commentId, body);
//     } catch (error) {

//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error
//         }
        
//         logger.error(error);

//         handleCommonErrors(error);

//         throw error
//     };
// }

// export async function replyToCommentService(tweetId, commentId, userId, body) {
//     try {
//         return await tweetRepository.replyToComment(tweetId, commentId, userId, body)
//     } catch (error) {

//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error
//         }
        
//         logger.error(error);

//         handleCommonErrors(error);

//         throw error
//     }
// }
// export async function toggleCommentLikeService(tweetId, commentId, userId) {
//     try {
//         const { updatedTweet, liked } = await tweetRepository.toggleCommentLike(tweetId, commentId, userId);
//         return { updatedTweet, liked };
//     } catch (error) {
//         if (
//             error instanceof NotFoundError ||
//             error instanceof BadRequestError ||
//             error instanceof UnauthorisedError
//         ) {
//             throw error;
//         }

//         logger.error(error);
//         handleCommonErrors(error);
//         throw error;
//     }
// }


// export async function softDeleteCommentService(tweetId, commentId, userId) {
//     try {
//         return await tweetRepository.softDeleteComment(tweetId, commentId, userId);
//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error
//         }
        
//         logger.error(error);

//         handleCommonErrors(error);

//         throw error     
//     }
// }

// export async function retweetService(tweetId, userId) {
//     try {
//         const tweet = await tweetRepository.retweet(tweetId, userId);
//         return tweet
//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error;
//         }

//         log.error(error);

//         handleCommonErrors(error);

//         throw error
//     }
// }

// export async function quoteService(tweetId, userId, text) {
//     try {
//         const tweet = await tweetRepository.quoteTweet(tweetId, userId, text);
//         return tweet
//     } catch (error) {
//         if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
//             throw error;
//         }

//         log.error(error);

//         handleCommonErrors(error);

//         throw error
//     }
// }





// import { Filter } from 'bad-words';
import * as tweetRepository from '../repository/tweetRepository.js';
import { withErrorHandling } from '../utils/errors/errorHandler.js';


import logger from '../utils/helpers/logger.js';

export const createTweet = withErrorHandling(async ({ body, author }) => {
//   const filter = new Filter();
//   if(filter.isProfane(body)) {
//     logger.warn(`Profanity detected in input: ${body}`);
//     logger.info(`Cleaned version ${filter.clean(body)}`);
//     throw new BadRequestError('Tweet contains blocked words');
//   }
  return await tweetRepository.createTweet({ body, author });
});

export const getTweets = withErrorHandling(async () => {
  return await tweetRepository.getTweets();
});

export const getTweetById = withErrorHandling(async (id) => {
  const tweet = await tweetRepository.getTweetById(id);
  if (!tweet) throw new NotFoundError('Tweet');
  return tweet;
});

export const deleteTweet = withErrorHandling(async (id) => {
  const response = await tweetRepository.deleteTweet(id);
  if (!response) throw new NotFoundError('Tweet');
  return response;
});

export const updateTweet = withErrorHandling(async (id, body) => {
  logger.info(body);
  const response = await tweetRepository.updateTweet(id, body);
  if (!response) throw new NotFoundError('Tweet');
  return response;
});

export const likeTweetService = withErrorHandling(async (tweetId, userId) => {
  return await tweetRepository.likeTweet(tweetId, userId);
});

export const unlikeTweetService = withErrorHandling(async (tweetId, userId) => {
  return await tweetRepository.unlikeTweet(tweetId, userId);
});

export const addCommentService = withErrorHandling(async (tweetId, userId, text) => {
  return await tweetRepository.addComment(tweetId, userId, text);
});

export const deleteCommentService = withErrorHandling(async (tweetId, commentId, userId) => {
  return await tweetRepository.deleteComment(tweetId, commentId, userId);
});

export const updateCommentService = withErrorHandling(async (tweetId, commentId, body) => {
  return await tweetRepository.updateComment(tweetId, commentId, body);
});

export const replyToCommentService = withErrorHandling(async (tweetId, commentId, userId, body) => {

  return await tweetRepository.replyToComment(tweetId, commentId, userId, body);
});

export const toggleCommentLikeService = withErrorHandling(async (tweetId, commentId, userId) => {

  const { updatedTweet, liked } = await tweetRepository.toggleCommentLike(tweetId, commentId, userId);

  return { updatedTweet, liked };
});

export const softDeleteCommentService = withErrorHandling(async (tweetId, commentId, userId) => {
  return await tweetRepository.softDeleteComment(tweetId, commentId, userId);
});

export const retweetService = withErrorHandling(async (tweetId, userId) => {
  return await tweetRepository.retweet(tweetId, userId);
});

export const quoteService = withErrorHandling(async (tweetId, userId, text) => {

  return await tweetRepository.quoteTweet(tweetId, userId, text);
});

export const deleteQuoteService = withErrorHandling(async (quoteId, userId) => {
  return await tweetRepository.deleteQuoteTweet(quoteId, userId);
})