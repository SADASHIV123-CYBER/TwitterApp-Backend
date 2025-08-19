import logger from '../helpers/logger.js';
import BadRequestError from './badRequestError.js';
import InternalServerError from './internalServerError.js';

function extractValidationMessages(error) {
  return Object.values(error.errors)
    .map((err) => err.message)
    .join(', ');
}

export function isMongooseError(error) {
  return error.name === 'CastError' || 
         error.name === 'ValidationError' ||
         error.name === 'MongoServerError';
}

export default function handleCommonErrors(error) {
  if (error.name === 'CastError') {
    throw new BadRequestError('Invalid resource identifier format');
  }

  if (error.name === 'ValidationError') {
    throw new BadRequestError(`Validation failed: ${extractValidationMessages(error)}`);
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    throw new BadRequestError('Duplicate key error');
  }

  // Log unexpected errors
  logger.error('Unhandled error:', {
    message: error.message,
    stack: error.stack,
    type: error.name
  });

  // Sanitize error before exposing to client
  throw new InternalServerError('An unexpected error occurred');
}