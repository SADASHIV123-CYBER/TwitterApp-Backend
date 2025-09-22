// src/controllers/authController.js
import { StatusCodes } from "http-status-codes";
import { loginUser } from "../service/authService.js";
import { errorResponce, successResponce } from "../utils/helpers/responses.js";
import logger from "../utils/helpers/logger.js";

export async function login(req, res) {
  try {
    const loginPayload = req.body;
    const token = await loginUser(loginPayload);

    const isProd = process.env.NODE_ENV === 'production';

    // For local dev: httpOnly true, secure false, sameSite 'Lax'
    // For production: httpOnly true, secure true, sameSite 'None' (required for cross-site)
    const cookieOptions = {
      httpOnly: true,
      secure: isProd, // true only in production
      sameSite: isProd ? 'None' : 'Lax', // None + secure required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/',
    };

    // ONLY set domain if explicitly provided and not 'localhost'
    if (process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN !== 'localhost') {
      cookieOptions.domain = process.env.COOKIE_DOMAIN; // e.g. ".example.com"
    }

    // Debug: log cookie options in server logs (remove later)
    logger.info('Setting auth cookie with options:', cookieOptions);

    res.cookie('authToken', token, cookieOptions);

    return successResponce(res, null, StatusCodes.OK, "User logged in successfully");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
}
