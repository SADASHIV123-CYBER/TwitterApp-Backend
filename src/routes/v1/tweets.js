import express from 'express';
import { createTweet, deleteTweet, getTweetById, getTweets, updateTweet } from '../../controller/tweetController.js';
import { getTweetByIdManualValidator } from '../../validator/tweetManualValidator.js';
import cloudinaryUploader from '../../middlewares/multerUploader.js';
import { validate } from '../../validator/zodValidator.js';
import { tweetZodSchema } from '../../validator/schema/tweetZodSchema.js';
import { isLoggedIn } from '../../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/', getTweets);

router.post(
  '/',
  isLoggedIn,
  cloudinaryUploader('tweets').single('tweetImage'),
  validate(tweetZodSchema),
  createTweet
);

router.delete('/:id', isLoggedIn, getTweetByIdManualValidator, deleteTweet);

router.get('/:id', isLoggedIn, getTweetByIdManualValidator, getTweetById);

router.put('/:id', isLoggedIn, getTweetByIdManualValidator, updateTweet )

export default router;
