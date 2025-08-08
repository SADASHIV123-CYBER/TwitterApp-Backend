import { StatusCodes } from "http-status-codes";


export const successResponce = (res, data, statusCode = StatusCodes.OK, message = "Success") => {
    return res.status(statusCode).json({
        success: true,
        data,
        message
    });
};


export const errorResponce = (res, error) => {
    console.log("Error:", error);

    if (error.status) {
        return res.status(error.status).json({
            success: false,
            message: error.message,
            error: error.error || null
        });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error"
    });
};
