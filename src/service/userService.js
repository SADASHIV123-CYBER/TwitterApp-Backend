import { createUser, findUser, toggleFollow } from "../repository/userRepository.js";
import { v2 as cloudinary } from "cloudinary";
import BadRequestError from "../utils/errors/badRequestError.js";
import NotFoundError from "../utils/errors/notFoundError.js";  // ✅ Added
import { withErrorHandling } from "../utils/errors/errorHandlerUser.js";
import { User } from "../schema/userSchema.js";

export const registerUser = withErrorHandling(async (userDetails) => {
  let profilePicture = null;

  // ✅ Corrected uniqueness check
  const existingUser = await User.findOne({
    $or: [
      { email: userDetails.email },
      { userName: userDetails.userName },
      { mobileNumber: userDetails.mobileNumber }
    ]
  });

  if (existingUser) {
    throw new BadRequestError("User is already registered with given email, username, or mobile number");
  }

  if (userDetails.imagePath) {
    const cloudinaryResponse = await cloudinary.uploader.upload(userDetails.imagePath);
    profilePicture = cloudinaryResponse.secure_url;
  }

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
});

export const toggleFollowService = withErrorHandling(async (currentUserId, targetUserId) => {
  return await toggleFollow(currentUserId, targetUserId);
});

export const getUserProfileService = withErrorHandling(async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) throw new NotFoundError("User not found");  // ✅ Safe now
  return user;
});
