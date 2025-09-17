import { StatusCodes } from "http-status-codes";
import { loginUser } from "../service/authService.js";
import { errorResponce, successResponce } from "../utils/helpers/responses.js";
import logger from "../utils/helpers/logger.js";
// import NODE_ENV from '../config/serverConfig.js'
import serverConfig from "../config/serverConfig.js";

export async function login(req, res) {
    try {
        const loginPayload = req.body;

        const response = await loginUser(loginPayload);

        res.cookie("authToken", response, {
        httpOnly: true,
        secure: serverConfig.NODE_ENV === "production", // true on Render
        sameSite: "None", // allow cross-site cookies
        maxAge: 24 * 60 * 60 * 1000,
        });


        return successResponce(res, null, StatusCodes.OK, "logged in successfully");
    } catch (error) {
        logger.error(error);
        return errorResponce(res, error)
    }
}