// import { createUser, findUser } from "../repository/userRepository.js";
// import { v2 as cloudinary } from "cloudinary";
// import logger from "../utils/helpers/logger.js";
// import handleCommonErrors from "../utils/errors/handleCommonErrors.js";

// /**
//  * Registers a new user
//  * @param {Object} userDetails - User data from request
//  * @param {string} [userDetails.imagePath] - Path to profile picture (optional)
//  */
// async function registerUser(userDetails) {
//     let profilePicture = null;

//     try {
//         // --- 1. Check if user already exists ---
//         let existingUser = null;
//         try {
//             existingUser = await findUser({
//                 email: userDetails.email,
//                 userName: userDetails.userName
//             });
//         } catch (err) {
//             // If it's a NotFoundError, we ignore and proceed
//             if (err.name !== "NotFoundError") throw err;
//         }

//         if (existingUser) {
//             throw new Error("User is already registered with given email or username");
//         }

//         // --- 2. Upload image to Cloudinary if provided ---
//         if (userDetails.imagePath) {
//             const cloudinaryResponse = await cloudinary.uploader.upload(userDetails.imagePath);
//             profilePicture = cloudinaryResponse.secure_url;
//         }

//         // --- 3. Create the new user ---
//         const {
//             fullName,
//             userName,
//             email,
//             password,
//             role,
//             isVerified,
//             displayName
//         } = userDetails;

//         const newUser = await createUser({
//             fullName,
//             userName,
//             email,
//             password,
//             profilePicture,
//             role,
//             isVerified: isVerified ?? false,
//             displayName
//         });

//         return newUser;

//     } catch (error) {
//         logger.error(error);
//         handleCommonErrors(error);
//         throw error;
//     }
// }

// export default registerUser;


import { createUser, findUser } from "../repository/userRepository.js";
import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/helpers/logger.js";
import handleCommonErrors from "../utils/errors/handleCommonErrors.js";
import BadRequestError from "../utils/errors/badRequestError.js";

/**
 * Registers a new user
 * @param {Object} userDetails - User data from request
 * @param {string} [userDetails.imagePath] - Path to profile picture (optional)
 */
async function registerUser(userDetails) {
    let profilePicture = null;

    try {
        // --- 1. Check if user already exists ---
        const existingUser = await findUser({
            email: userDetails.email,
            userName: userDetails.userName,
            mobileNumber: userDetails.mobileNumber
        });

        if (existingUser) {
            throw new BadRequestError("User is already registered with given email or username");
        }

        // --- 2. Upload image to Cloudinary if provided ---
        if (userDetails.imagePath) {
            const cloudinaryResponse = await cloudinary.uploader.upload(userDetails.imagePath);
            profilePicture = cloudinaryResponse.secure_url;
        }

        console.log('Profile picture: --->', profilePicture);
        
        // --- 3. Create the new user ---
        const {
            fullName,
            userName,
            email,
            password,
            role,
            isVerified,
            displayName,
            mobileNumber
        } = userDetails;

        const newUser = await createUser({
            fullName,
            userName,
            email,
            password,
            profilePicture,
            role,
            isVerified: isVerified ?? false,
            displayName,
            mobileNumber
        });



        
        return newUser;

    } catch (error) {
        logger.error(error);
        handleCommonErrors(error);
        throw error;
    }
}

export default registerUser;
