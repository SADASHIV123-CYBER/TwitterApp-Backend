import AppError from "./appError.js";

class unauthorisedError extends AppError {
    constructor() {
        super(`User is not authorised properly`, 401)
    }
}

export default unauthorisedError