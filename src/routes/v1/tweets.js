import express from 'express';
import { addCommentController, createTweet, deleteCommentController, deleteTweet, getTweetById, getTweets, likeTweetController, unlikeTweetController, updateTweet } from '../../controller/tweetController.js';
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

router.put('/:id', isLoggedIn, getTweetByIdManualValidator, updateTweet );

router.post('/:id/like', isLoggedIn, getTweetByIdManualValidator, likeTweetController)
router.post('/:id/unlike', isLoggedIn, getTweetByIdManualValidator, unlikeTweetController)
router.post('/:id/comment', isLoggedIn, getTweetByIdManualValidator, addCommentController);
// router.delete('/:id/comment', isLoggedIn, getTweetByIdManualValidator, deleteCommentController)
// router.delete('/:id/comment/:commentId',
//   isLoggedIn,
//   getTweetByIdManualValidator,
//   deleteCommentController
// );

router.delete('/:tweetId/comment/:commentId', 
  isLoggedIn, 
  getTweetByIdManualValidator, 
  deleteCommentController
);



export default router;
