// utils/logger.js
import winston from 'winston';

const logger = winston.createLogger({
    level: 'info', // levels: error, warn, info, http, verbose, debug, silly
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'error.log', level: 'error' }), // Log errors to file
        new winston.transports.File({ filename: 'combined.log' }) // All logs
    ]
});

export default logger;
