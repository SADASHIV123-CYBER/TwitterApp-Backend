// replyZodSchema.js
import { z } from "zod";
import checkProfanity from "../../utils/helpers/profanityChecker.js";

export const replyZodSchema = z.object({
  text: z.string()
    .min(1, "Reply cannot be empty")
    .max(280, "Reply too long")
    .refine((val) => {
      checkProfanity(val);
      return true;
    }, { message: "Reply contains blocked words" })
});
