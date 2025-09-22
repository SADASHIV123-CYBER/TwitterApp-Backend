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

    const cookieOptions = {
      httpOnly: true,
      secure: isProd, // secure must be true for SameSite=None in browsers
      sameSite: isProd ? 'None' : 'Lax', // None for cross-site in production
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    };

    // Optional: if you need cookie to be valid for a specific domain (e.g. .yourdomain.com)
    if (process.env.COOKIE_DOMAIN) {
      cookieOptions.domain = process.env.COOKIE_DOMAIN; // e.g. ".example.com"
    }

    res.cookie('authToken', token, cookieOptions);

    return successResponce(res, null, StatusCodes.OK, "User logged in successfully");
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
}
