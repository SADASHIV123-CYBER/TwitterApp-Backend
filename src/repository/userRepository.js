import { Follow, User } from "../schema/userSchema.js";

export const createUser = async (userDetails) => {
  const user = await User.create(userDetails);
  return user;
};

export const findUser = async (params) => {
  const user = await User.findOne({ ...params }).lean();
  return user || null;
};

export const toggleFollow = async (currentUserId, targetUserId) => {
  if (String(currentUserId) === String(targetUserId)) {
    const err = new Error("You can not follow your self");
    err.status = 400;
    throw err;
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

  return { followerCount, followingCount, action };
};

export const getFollowersList = async (userId) => {
  const docs = await Follow.find({ following: userId })
    .populate("follower", "userName fullName profilePicture displayName")
    .lean();
  return docs.map((d) => d.follower);
};

export const getFollowingList = async (userId) => {
  const docs = await Follow.find({ follower: userId })
    .populate("following", "userName fullName profilePicture displayName")
    .lean();
  return docs.map((d) => d.following);
};
