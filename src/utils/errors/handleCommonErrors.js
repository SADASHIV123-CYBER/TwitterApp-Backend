import CastError from './castError.js';
import BadRequestError from './badRequestError.js';
import InternalServerError from './internalServerError.js';

function extractValidationMessages(error) {
    return Object.values(error.errors).map((err) => err.message).join(', ');
}

export default function handleCommonErrors(error) {
    if (error.name === 'CastError') {
        throw new CastError('Invalid ID format');
    }

    if (error.name === 'ValidationError') {
        throw new BadRequestError(extractValidationMessages(error));
    }

    console.error(error);
    throw new InternalServerError();
}
