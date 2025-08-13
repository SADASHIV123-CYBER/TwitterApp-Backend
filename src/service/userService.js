import { createUser, findUser } from "../repository/userRepository.js";
import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/helpers/logger.js";
import handleCommonErrors from "../utils/errors/handleCommonErrors.js";
import BadRequestError from "../utils/errors/badRequestError.js";
 
async function registerUser(userDetails) {
    let profilePicture = null;

    try {
        const existingUser = await findUser({
            email: userDetails.email,
            userName: userDetails.userName,
            mobileNumber: userDetails.mobileNumber
        });

        if (existingUser) {
            throw new BadRequestError("User is already registered with given email or username");
        }

        if (userDetails.imagePath) {
            const cloudinaryResponse = await cloudinary.uploader.upload(userDetails.imagePath);
            profilePicture = cloudinaryResponse.secure_url;
        }

        console.log('Profile picture: --->', profilePicture);
        
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
