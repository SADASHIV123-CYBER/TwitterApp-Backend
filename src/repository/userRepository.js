import User from "../schema/userSchema";
import handleCommonErrors from "../utils/errors/handleCommonErrors";
import NotFoundError from "../utils/errors/notFoundError";
import logger from "../utils/helpers/logger";

export async function createUser(userDetails) {
    try {
        const user = await User.create(userDetails);
        return user
    } catch (error) {
        logger.info(error)
        handleCommonErrors(error)
        throw error
    }
}

export async function findUser(parameters) {
    try {
        const user = await User.findOne({ ...parameters });
        if(!user) {
            throw new NotFoundError('User not found')
        }
        return user
    } catch (error) {
        if(error instanceof NotFoundError) {
            throw error
        }
        handleCommonErrors(error);

        throw error
    }
}

