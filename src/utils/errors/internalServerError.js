import AppError from "./appError";

class InternalServerError  extends AppError {
    constructor() {
        super(`It's not you it's our server, whenre something went wrong`, 500);
    }
}

export default InternalServerError