import express from 'express';
import { createTweet, deleteTweet, getTweetById, getTweets, updateTweet } from '../../controller/tweetController.js';
import { getTweetByIdManualValidator } from '../../validator/tweetManualValidator.js';
import cloudinaryUploader from '../../middlewares/multerUploader.js';
import { validate } from '../../validator/zodValidator.js';
import { tweetZodSchema } from '../../validator/schema/tweetZodSchema.js';

const router = express.Router();

router.get('/', getTweets);

router.post(
  '/',
  cloudinaryUploader('tweets').single('tweetImage'),
  validate(tweetZodSchema),
  createTweet
);

router.delete('/:id', getTweetByIdManualValidator, deleteTweet);

router.get('/:id', getTweetByIdManualValidator, getTweetById);

router.put('/:id',getTweetByIdManualValidator, updateTweet )

export default router;
