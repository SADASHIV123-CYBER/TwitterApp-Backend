import { StatusCodes } from "http-status-codes";
import registerUser from "../service/userService.js";
import { errorResponce, successResponce } from "../utils/helpers/responses.js";
import logger from "../utils/helpers/logger.js";

async function createUser(req, res) {
    try {
        const user = await registerUser(req.body);

        return successResponce(res, user, StatusCodes.CREATED, "User created successfully")
    } catch (error) {
        logger.error("Unable to create user, something went wrong", error);
        return errorResponce(res, error)
    }
}

export default createUser;