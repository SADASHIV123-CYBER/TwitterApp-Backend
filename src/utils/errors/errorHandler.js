import NotFoundError from "./notFoundError.js";
import BadRequestError from "./badRequestError.js";
import UnauthorisedError from "./unauthorisedError.js";
import handleCommonErrors from "./handleCommonErrors.js";
import logger from "../helpers/logger.js";

export function withErrorHandling(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorisedError
      ) {
        throw error;
      }
      
      logger.error(error);
      handleCommonErrors(error);
    }
  };
}