import NotFoundError from "./notFoundError.js";
import handleCommonErrors from "./handleCommonErrors.js";
import logger from "../helpers/logger.js";

export function withErrorHandling(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (
        error instanceof NotFoundError
      ) {
        throw error;
      }
      
      logger.error(error);
      handleCommonErrors(error);
    }
  };
}