import AppError from "./appError.js";

class BadRequestError extends AppError {
  constructor(invalidParams) {
    let message = "";

    if (Array.isArray(invalidParams)) {
      invalidParams.forEach(param => {
        message += `${param}\n`;
      });
    } else if (invalidParams && typeof invalidParams === "object" && invalidParams.errors) {
      // Probably a ZodError
      invalidParams.errors.forEach(err => {
        const path = err.path?.join(".") || "unknown";
        message += `Field "${path}": ${err.message}\n`;
      });
    } else {
      message = String(invalidParams || "Unknown invalid parameters");
    }

    super(`Request has invalid parameters:\n${message}`, 400);
  }
}

export default BadRequestError;
