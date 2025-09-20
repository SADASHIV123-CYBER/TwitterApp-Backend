import { Follow, User } from "../schema/userSchema.js";
import BadRequestError from "../utils/errors/badRequestError.js";
import { withErrorHandling } from "../utils/errors/errorHandlerUser.js";
import NotFoundError from "../utils/errors/notFoundError.js";

export const createUser = withErrorHandling(async (userDetails) => {
  const user = await User.create(userDetails);
  if (!user) throw new BadRequestError();
  return user;
});

export const findUser = withErrorHandling(async ({ ...parameters }) => {
  const user = await User.findOne({ ...parameters }).lean();
  return user || null;
});

export const toggleFollow = withErrorHandling(async (currentUserId, targetUserId) => {
  if (currentUserId.toString() === targetUserId.toString()) {
    throw new BadRequestError("You can not follow your self");
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
});
