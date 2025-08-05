import AppError from "./appError";

class BadRequestError extends AppError {
    constructor(invalidParams) {
        let message = "";

        invalidParams.forEach(params => {
            message += `${params}\n`
        });

        super(`Request of the following has the invalid parameters ${invalidParams}`, 400)
    }
}

export default BadRequestError