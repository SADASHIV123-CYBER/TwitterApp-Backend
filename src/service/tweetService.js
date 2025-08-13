import { 
    createTweet as createTweetRepository,
    getTweets as getTweetsRepository,
    getTweetById as getTweetByIdRepository,
    deleteTweet as deleteTweetRepository,
    updateTweet as updateTweetRepository,
    // addComment as addCommentRepository,
    // deleteComment as deleteCommentRepository
} from '../repository/tweetRepository.js';

import InternalServerError from '../utils/errors/internalServerError.js';
import NotFoundError from '../utils/errors/notFoundError.js';
import handleCommonErrors from '../utils/errors/handleCommonErrors.js';
import { Filter } from 'bad-words';
import logger from '../utils/helpers/logger.js';
import BadRequestError from '../utils/errors/badRequestError.js';

import * as tweetRepository from '../repository/tweetRepository.js'
import UnauthorisedError from '../utils/errors/unauthorisedError.js';

export async function createTweet({ body, author }) {
  try {
    const filter = new Filter();

    if(filter.isProfane(body)) {
      logger.warn(`Profanity detected in input: ${body}`);
      logger.info(`Cleaned version ${filter.clean(body)}`);
      throw new BadRequestError('Tweet contains blocked words');
    }

    const tweet = await createTweetRepository({ body, author });
    return tweet;
    
  } catch (error) {
    if(error instanceof BadRequestError) {
      throw error;
    }
    logger.error(error);
    handleCommonErrors(error);
  }
}

export async function getTweets() {
    try {
        const tweets = await getTweetsRepository();
        return tweets;
    } catch (error) {
        console.error(error);
        throw new InternalServerError();
    }
}

export async function getTweetById(id) {
    try {
        const tweet = await getTweetByIdRepository(id);

        if (!tweet) {
            throw new NotFoundError('Tweet');
        }

        return tweet;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }

        logger.error(error)

        handleCommonErrors(error);
    }
}

export async function deleteTweet(id) {
    try {
        const response = await deleteTweetRepository(id);

        if (!response) {
            throw new NotFoundError('Tweet');
        }

        return response;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }

        logger.error(error)

        handleCommonErrors(error);
    }
}

export async function updateTweet(id, body) {
    try {
        const response = await updateTweetRepository(id, body);

        if (!response) {
            throw new NotFoundError('Tweet');
        }

        return response;
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error;
        }
        
        logger.error(error)

        handleCommonErrors(error);
    }
}

export async function likeTweetService(tweetId, userId) {
    try {
        return await tweetRepository.likeTweet(tweetId, userId);

    } catch (error) {
        if(error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error
        }

        logger.error(error);

        handleCommonErrors(error)

    }
};

export async function unlikeTweetService(tweetId, userId) {
    try {
        return await tweetRepository.unlikeTweet(tweetId, userId);
    } catch (error) {
        if(error instanceof NotFoundError || error instanceof BadRequestError) {
            throw error
        }

        logger.error(error)

        handleCommonErrors(error)
    }
}

export async function addCommentService(tweetId, userId, text) {
    try {
        return await tweetRepository.addComment(tweetId, userId, text);
    } catch (error) {
        if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
            throw error;
        }

        logger.error(error);

        handleCommonErrors(error);

        throw error
    }
}

export async function deleteCommentService(tweetId, commentId, userId) {
    try {
        return await tweetRepository.deleteComment(tweetId, commentId, userId);
    } catch (error) {
        if(error instanceof NotFoundError || error instanceof BadRequestError || error instanceof UnauthorisedError) {
            throw error
        }

        logger.error(error)

        handleCommonErrors(error);
        
        throw error
    }
}



