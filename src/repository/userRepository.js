// import User from "../schema/userSchema.js";
// import handleCommonErrors from "../utils/errors/handleCommonErrors.js";
// import NotFoundError from "../utils/errors/notFoundError.js";
// import logger from "../utils/helpers/logger.js";

// export async function createUser(userDetails) {
//     try {
//         const user = await User.create(userDetails);
//         return user
//     } catch (error) {
//         logger.info(error)
//         handleCommonErrors(error)
//         throw error
//     }
// }

// export async function findUser(parameters) {
//     try {
//         const user = await User.findOne({ ...parameters });
//         if(!user) {
//             throw new NotFoundError('User not found')
//         }
//         return user
//     } catch (error) {
//         if(error instanceof NotFoundError) {
//             throw error
//         }
//         handleCommonErrors(error);

//         throw error
//     }
// }

import User from "../schema/userSchema.js";
import handleCommonErrors from "../utils/errors/handleCommonErrors.js";
import logger from "../utils/helpers/logger.js";

/**
 * Creates a new user in the database.
 * @param {Object} userDetails - The details of the user to create.
 * @returns {Promise<Object>} The created user object.
 */
export async function createUser(userDetails) {
    try {
        const user = await User.create(userDetails);
        return user;
    } catch (error) {
        logger.error(error);
        handleCommonErrors(error);
        throw error;
    }
}

/**
 * Finds a user by the given parameters.
 * @param {Object} parameters - The query parameters (e.g., { email: "abc@example.com" }).
 * @returns {Promise<Object|null>} The found user object or null if not found.
 */
export async function findUser(parameters) {
    try {
        const user = await User.findOne({ ...parameters });
        // ✅ Return null instead of throwing so signup can proceed
        return user || null;
    } catch (error) {
        logger.error(error);
        handleCommonErrors(error);
        throw error;
    }
}
