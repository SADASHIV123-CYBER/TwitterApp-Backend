import AppError from "./appError.js";

class NotFoundError extends AppError {
    constructor(resource) {
        super(`Not able to find ${resource}`,400)
    }
}

export default NotFoundError