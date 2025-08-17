// tweetZodSchema.js
import { z } from "zod";
import checkProfanity from "../../utils/helpers/profanityChecker.js";

export const tweetZodSchema = z.object({
  tweet: z.string()
    .min(1, "Tweet body cannot be empty")
    .max(280, "Tweet body too long")
    .refine((val) => {
      try {
        checkProfanity(val); // if throws, we'll catch it
        return true; // valid if no bad words
      } catch {
        return false; // invalid if bad words found
      }
    }, { message: "Tweet contains blocked words" }),
  tweetImage: z.string().optional()
});
