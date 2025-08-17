// commentZodSchema.js
import { z } from "zod";
import checkProfanity from "../../utils/helpers/profanityChecker.js";

export const commentZodSchema = z.object({
  text: z.string()
    .min(1, "Comment cannot be empty")
    .max(280, "Comment too long")
    .refine((val) => {
      checkProfanity(val);
      return true;
    }, { message: "Comment contains blocked words" })
});
