import AppError from "./appError.js";

class UnauthorisedError extends AppError {
    constructor(message = "User is not authorised properly") {
        super(message, 401);
    }
}

export default UnauthorisedError;
