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
  secure: isProd,              // ✅ true in production
  sameSite: isProd ? 'None' : 'Lax', // ✅ None for cross-origin
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
};



    if (process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN !== 'localhost') {
      cookieOptions.domain = process.env.COOKIE_DOMAIN;
    }

    logger.info('Setting auth cookie with options:', cookieOptions);

    // ✅ Set the auth cookie
    res.cookie('authToken', token, cookieOptions);

    return successResponce(res, null, StatusCodes.OK, `User logged in successfully: ${loginPayload.email}`);
  } catch (error) {
    logger.error(error);
    return errorResponce(res, error);
  }
}
