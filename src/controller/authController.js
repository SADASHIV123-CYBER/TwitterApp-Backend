import { StatusCodes } from "http-status-codes";
import { loginUser } from "../service/authService.js";
import { errorResponce, successResponce } from "../utils/helpers/responses.js";
import logger from "../utils/helpers/logger.js";
import serverConfig from "../config/serverConfig.js";

export async function login(req, res) {
    try {
        const loginPayload = req.body;

        // 1️⃣ Get token from service
        const token = await loginUser(loginPayload); // make sure loginUser returns a JWT token

        // 2️⃣ Set cookie
        res.cookie("authToken", token, {
            httpOnly: true,
            secure: serverConfig.NODE_ENV === "production", // true in prod
            sameSite: serverConfig.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // 3️⃣ Send success response
        return successResponce(res, null, StatusCodes.OK, "Logged in successfully");
    } catch (error) {
        logger.error(error);
        return errorResponce(res, error);
    }
}
