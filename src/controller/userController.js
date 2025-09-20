import { StatusCodes } from "http-status-codes";
import { errorResponce, successResponce } from "../utils/helpers/responses.js";
import logger from "../utils/helpers/logger.js";
import { registerUser, toggleFollowService, getUserProfileService } from "../service/userService.js";

export async function createUser(req, res) {
  try {
    const userData = {
      ...req.body,
      imagePath: req.file?.path,
    };
    const user = await registerUser(userData);
    return successResponce(res, user, StatusCodes.CREATED, "User created successfully");
  } catch (error) {
    logger.error("Unable to create user, something went wrong", error);
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
