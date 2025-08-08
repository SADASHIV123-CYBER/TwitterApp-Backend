import { createUser, findUser } from "../repository/userRepository";
import { v2 as cloudinary } from "cloudinary";
import logger from "../utils/helpers/logger";
import handleCommonErrors from "../utils/errors/handleCommonErrors";
async function registerUser(userDetails) {
    let profilePicture = null;
    try {
        const user = await findUser({
            email: userDetails.email,
            userName: userDetails.userName
        })

        if(user) {
            throw new Error("User is already registered with give email id and userName")
        }

        if(userDetails.imagePath) {
            const cloudinaryResponse = await cloudinary.uploader.upload(userDetails.imagePath);
            profilePicture = cloudinaryResponse.secure_url
        }

        const {
            fullName, 
            userName, 
            email, 
            password, /*profilePicture,*/ 
            role, 
            isVerified, 
            displayName
        } = userDetails

        const newUser = await createUser({
            fullName,
            userName, 
            email,
            password, 
            profilePicture, 
            role,
            isVerified,
            displayName,
        });

        return newUser;
    } catch (error) {
        logger.info(error);
        handleCommonErrors(error);
        throw error
    }
}