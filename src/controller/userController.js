import { StatusCodes } from "http-status-codes";
import { errorResponce, successResponce } from "../utils/helpers/responses.js";
import logger from "../utils/helpers/logger.js";
import { registerUser, toggleFollowService } from "../service/userService.js";

export async function createUser(req, res) {
    try {
        const userData = {
            ...req.body,
            imagePath: req.file?.path 
        }
        const user = await registerUser(userData);

        return successResponce(res, user, StatusCodes.CREATED, "User created successfully")
    } catch (error) {
        logger.error("Unable to create user, something went wrong", error);
        return errorResponce(res, error)
    }
}


export const toggleFollowController = async(req, res) => {
  try {
    

  const userId = req.user;
  const targetUserId = req.params.targetUser;

  const result = await toggleFollowService(userId, targetUserId);

  return successResponce(res, result, StatusCodes.OK, result.action === "followed" ? "floowed" : "unfollowed")
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error)  
  }
}


