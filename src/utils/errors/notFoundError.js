import AppError from "./appError";

class NotFoundError extends AppError {
    constructor(resource) {
        super(`Not able to find ${resource}`)
    }
}

export default NotFoundError