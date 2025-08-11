import { StatusCodes } from "http-status-codes";
import { errorResponce } from "../utils/helpers/responses.js";
import jwt from "jsonwebtoken";
import serverConfig from '../config/serverConfig.js'
import UnauthorisedError from "../utils/errors/unauthorisedError.js";
import logger from "../utils/helpers/logger.js";
import InternalServerError from "../utils/errors/internalServerError.js";

export async function isLoggedIn(req, res, next) {
    const token = req.cookies["authToken"];

    if(!token) {
        return errorResponce(res, /*{status: StatusCodes.UNAUTHORIZED, message: "No Auth Token provided"}*/ new UnauthorisedError())
    }

    try {
        const decode = jwt.verify(token, serverConfig.JWT_SECRET);

        // if(!decode) {
        //     throw new UnauthorisedError()
        // }

        req.user = {
            email: decode.email,
            id: decode.id,
            role: decode.role
        }

        next()
    } catch (error) {
        logger.error(error);
        return errorResponce(res, new InternalServerError())
    }
}

export async function isAdmin(req, res, next) {
    try {
        const loggedInUser = req.user;

        if(!loggedInUser) {
            return errorResponce(res, new UnauthorisedError())
        }

        if(loggedInUser.role === "ADMIN") {
            return next();
        }

        return errorResponce(res,  new UnauthorisedError()
            // {
            //     status: StatusCodes.UNAUTHORIZED, message: "You are not authorized for this action"
            // }
        );
    } catch (error) {
        logger.error(error);

        return errorResponce(res, new InternalServerError())
    }
}