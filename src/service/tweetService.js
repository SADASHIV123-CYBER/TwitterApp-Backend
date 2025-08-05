import { 
    createTweet as createTweetRepository,
    getTweets as getTweetsRepository,
    getTweetById as getTweetByIdRepository,
    deleteTweet as deleteTweetRepository,
    updateTweet as updateTweetRepository
} from '../repository/tweetRepository.js';

import InternalServerError from '../utils/internalServerError.js';
import NotFoundError from '../utils/notFoundError.js';
import handleCommonErrors from '../utils/handleCommonErrors.js';

export async function createTweet({ body }) {
    try {
        const tweet = await createTweetRepository({ body });
        return tweet;
    } catch (error) {
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

        handleCommonErrors(error);
    }
}
