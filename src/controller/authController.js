import { StatusCodes } from "http-status-codes";
import { loginUser } from "../service/authService.js";
import { errorResponce, successResponce } from "../utils/helpers/responses.js";
import logger from "../utils/helpers/logger.js";
import serverConfig from "../config/serverConfig.js";

export async function login(req, res) {
  try {
    const loginPayload = req.body;
    const token = await loginUser(loginPayload);

    // Cookie settings
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only true in prod
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return successResponce(res, null, StatusCodes.OK, "User logged in successfully");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
}
