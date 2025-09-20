import { StatusCodes } from "http-status-codes";
import { successResponce, errorResponce } from "../utils/helpers/responses.js";
import logger from "../utils/helpers/logger.js";
import { registerUser, toggleFollowService, getUserProfileService, getFollowersService, getFollowingService } from "../service/userService.js";

export async function createUser(req, res) {
  try {
    const userData = { ...req.body, imagePath: req.file?.path };
    const user = await registerUser(userData);
    return successResponce(res, user, StatusCodes.CREATED, "User created successfully");
  } catch (error) {
    logger.error("Unable to create user", error);
    return errorResponce(res, error);
  }
}

export const toggleFollowController = async (req, res) => {
  try {
    const currentUserId = req.user && req.user._id ? req.user._id : req.user;
    const targetUserId = req.params.targetUser;
    const result = await toggleFollowService(currentUserId, targetUserId);
    return successResponce(res, result, StatusCodes.OK, result.action === "followed" ? "followed" : "unfollowed");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user && req.user._id ? req.user._id : null;
    const profile = await getUserProfileService(userId, currentUserId);
    return successResponce(res, profile, StatusCodes.OK, "User profile fetched successfully");
  } catch (error) {
    logger.error("Unable to fetch user profile", error);
    return errorResponce(res, error);
  }
};

export const getFollowersController = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user && req.user._id ? req.user._id : null;
    const result = await getFollowersService(userId, currentUserId);
    return successResponce(res, result, StatusCodes.OK, "Followers fetched successfully");
  } catch (error) {
    logger.error("Unable to fetch followers", error);
    return errorResponce(res, error);
  }
};

export const getFollowingController = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user && req.user._id ? req.user._id : null;
    const result = await getFollowingService(userId, currentUserId);
    return successResponce(res, result, StatusCodes.OK, "Following fetched successfully");
  } catch (error) {
    logger.error("Unable to fetch following", error);
    return errorResponce(res, error);
  }
};
