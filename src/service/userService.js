import { v2 as cloudinary } from "cloudinary";
import { User, Follow } from "../schema/userSchema.js";
import {
  createUser as repoCreateUser,
  findUser as repoFindUser,
  toggleFollow as repoToggleFollow,
  getFollowersList,
  getFollowingList,
} from "../repository/userRepository.js";

export const registerUser = async (userDetails) => {
  let profilePicture = null;
  const existingUser = await User.findOne({
    $or: [
      { email: userDetails.email },
      { userName: userDetails.userName },
      { mobileNumber: userDetails.mobileNumber },
    ],
  });
  if (existingUser) {
    const err = new Error("User is already registered with given email, username, or mobile number");
    err.status = 400;
    throw err;
  }
  if (userDetails.imagePath) {
    const cloudinaryResponse = await cloudinary.uploader.upload(userDetails.imagePath);
    profilePicture = cloudinaryResponse.secure_url;
  }
  const newUser = await repoCreateUser({
    fullName: userDetails.fullName,
    userName: userDetails.userName,
    email: userDetails.email,
    password: userDetails.password,
    profilePicture,
    role: userDetails.role,
    isVerified: userDetails.isVerified ?? false,
    displayName: userDetails.displayName,
    mobileNumber: userDetails.mobileNumber,
  });
  return newUser;
};

export const toggleFollowService = async (currentUserId, targetUserId) => {
  const result = await repoToggleFollow(currentUserId, targetUserId);
  return result;
};

export const getFollowersService = async (userId, currentUserId = null) => {
  let users = await getFollowersList(userId);
  const count = users.length;
  if (currentUserId && users.length) {
    const ids = users.map((u) => u._id);
    const followedDocs = await Follow.find({
      follower: currentUserId,
      following: { $in: ids },
    }).select("following").lean();
    const followedSet = new Set(followedDocs.map((d) => String(d.following)));
    users = users.map((u) => ({ ...u, isFollowed: followedSet.has(String(u._id)) }));
  } else {
    users = users.map((u) => ({ ...u, isFollowed: false }));
  }
  return { count, users };
};

export const getFollowingService = async (userId, currentUserId = null) => {
  let users = await getFollowingList(userId);
  const count = users.length;
  if (currentUserId && users.length) {
    const ids = users.map((u) => u._id);
    const followedDocs = await Follow.find({
      follower: currentUserId,
      following: { $in: ids },
    }).select("following").lean();
    const followedSet = new Set(followedDocs.map((d) => String(d.following)));
    users = users.map((u) => ({ ...u, isFollowed: followedSet.has(String(u._id)) }));
  } else {
    users = users.map((u) => ({ ...u, isFollowed: false }));
  }
  return { count, users };
};

export const getUserProfileService = async (userId, currentUserId = null) => {
  const user = await User.findById(userId).select("-password").lean();
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  const followerCount = await Follow.countDocuments({ following: userId });
  const followingCount = await Follow.countDocuments({ follower: userId });
  let isFollowed = false;
  if (currentUserId) {
    const f = await Follow.findOne({ follower: currentUserId, following: userId }).lean();
    isFollowed = Boolean(f);
  }
  return { ...user, followerCount, followingCount, isFollowed };
};
