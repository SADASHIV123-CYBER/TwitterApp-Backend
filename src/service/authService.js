import { findUser } from "../repository/userRepository.js";
import BadRequestError from "../utils/errors/badRequestError.js";
import NotFoundError from "../utils/errors/notFoundError.js";
import InternalServerError from "../utils/errors/internalServerError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import serverConfig from "../config/serverConfig.js";
import logger from "../utils/helpers/logger.js";

export async function loginUser(authDetails) {
    try {
        const { email, password: plainPassword } = authDetails || {};

        if (!email || !plainPassword) {
            throw new BadRequestError("Email and password are required");
        }

        if (!serverConfig.JWT_SECRET) {
            logger.error("JWT secret is missing from configuration");
            throw new InternalServerError("Authentication configuration error");
        }


        const user = await findUser({ email });

        if (!user) {
            throw new BadRequestError("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(plainPassword, user.password);
        if (!isPasswordValid) {
            throw new BadRequestError("Invalid email or password");
        }

        const userRole = user.role || "USER";

        const token = jwt.sign(
            { email: user.email, id: user.id, role: userRole },
            serverConfig.JWT_SECRET,
            { expiresIn: serverConfig.JWT_EXPIRY }
        );

        logger.info(`User logged in successfully: ${email}`);

        return token;

    } catch (error) {
        logger.error("Login process failed", { email: authDetails?.email, error: error.message });

        if (error.statusCode) throw error;
        throw new InternalServerError("Unable to process login request");
    }
}
