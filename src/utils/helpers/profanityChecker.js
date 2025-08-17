// import Filter from "bad-words";
// import { BadRequestError } from "./errors/index.js"; // adjust path as per your structure
// import logger from "./helpers/logger.js";
import { Filter } from "bad-words";
import BadRequestError from "../errors/badRequestError.js";
import logger from "./logger.js";

const filter = new Filter();

export default function checkProfanity(text) {
    if (filter.isProfane(text)) {
        logger.warn(`Profanity detected in input: ${text}`);
        logger.info(`Cleaned version: ${filter.clean(text)}`);
        throw new BadRequestError("Content contains blocked words");
    }
    return text;
}
