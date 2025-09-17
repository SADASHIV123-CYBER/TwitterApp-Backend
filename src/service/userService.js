// import { createUser, findUser, toggleFollow } from "../repository/userRepository.js";
// import { v2 as cloudinary } from "cloudinary";
// import BadRequestError from "../utils/errors/badRequestError.js";
// import { withErrorHandling } from "../utils/errors/errorHandlerUser.js";

// export const registerUser = withErrorHandling(async (userDetails) => {
//     let profilePicture = null;

//     const existingUser = await findUser({
//         email: userDetails.email,
//         userName: userDetails.userName,
//         mobileNumber: userDetails.mobileNumber
//     });

//     if (existingUser) {
//         throw new BadRequestError("User is already registered with given email, username, or mobile number");
//     }

//     if (userDetails.imagePath) {
//         const cloudinaryResponse = await cloudinary.uploader.upload(userDetails.imagePath);
//         profilePicture = cloudinaryResponse.secure_url;
//     }

//     const {
//         fullName,
//         userName,
//         email,
//         password,
//         role,
//         isVerified,
//         displayName,
//         mobileNumber
//     } = userDetails;

//     const newUser = await createUser({
//         fullName,
//         userName,
//         email,
//         password,
//         profilePicture,
//         role,
//         isVerified: isVerified ?? false,
//         displayName,
//         mobileNumber
//     });

//     return newUser;
// });

// export const toggleFollowService = withErrorHandling(async (currentUserId, targetUserId) => {
//     return await toggleFollow(currentUserId, targetUserId);
// })

import { Follow, User } from "../schema/userSchema.js";
import BadRequestError from "../utils/errors/badRequestError.js";
import { withErrorHandling } from "../utils/errors/errorHandlerUser.js";
import NotFoundError from "../utils/errors/notFoundError.js";

export const createUser = withErrorHandling(async (userDetails) => {
  const user = await User.create(userDetails);
  if (!user) {
    throw new BadRequestError();
  }
  return user;
});

export const findUser = withErrorHandling(async ({ ...parameters }) => {
  const user = await User.findOne({ ...parameters }).lean();
  return user || null;
});

export const toggleFollow = withErrorHandling(async (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new BadRequestError("You cannot follow yourself");
  }

  const existingFollow = await Follow.findOne({
    follower: currentUserId,
    following: targetUserId,
  });

  let action;

  if (existingFollow) {
    await existingFollow.deleteOne();
    action = "unfollowed";
  } else {
    await Follow.create({
      follower: currentUserId,
      following: targetUserId,
    });
    action = "followed";
  }

  const followerCount = await Follow.countDocuments({ following: targetUserId });
  const followingCount = await Follow.countDocuments({ follower: targetUserId });

  return { action, followerCount, followingCount };
});

// ✅ New service
export const getUserProfileService = withErrorHandling(async (userId) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) throw new NotFoundError("User not found");
  return user;
});
