import express from 'express';
import { addCommentController, createTweet, /*deleteCommentController,*/ deleteTweet, getTweetById, getTweets, likeTweetController, replyToCommentController, softDeleteCommentController, toggleCommentLikeController, unlikeTweetController, updateCommentController, updateTweet } from '../../controller/tweetController.js';
import { getTweetByIdManualValidator } from '../../validator/tweetManualValidator.js';
import cloudinaryUploader from '../../middlewares/multerUploader.js';
import { validate } from '../../validator/zodValidator.js';
import { tweetZodSchema } from '../../validator/schema/tweetZodSchema.js';
import { isAdmin, isLoggedIn } from '../../middlewares/authMiddlewares.js';
import { commentZodSchema } from '../../validator/schema/commentZodSchema.js';
import { replyZodSchema } from '../../validator/schema/replyZodSchema.js';

const router = express.Router();

router.get('/', isLoggedIn, getTweets);

router.post(
  '/',
  isLoggedIn,
  cloudinaryUploader('tweets').single('tweetImage'),
  validate(tweetZodSchema),
  createTweet
);

router.delete('/:id', isLoggedIn, getTweetByIdManualValidator, deleteTweet);

router.get('/:id', isLoggedIn, getTweetByIdManualValidator, getTweetById);

router.put('/:id', isLoggedIn, getTweetByIdManualValidator, validate(tweetZodSchema), updateTweet );

router.post('/:id/like', isLoggedIn, getTweetByIdManualValidator, likeTweetController)

router.post('/:id/unlike', isLoggedIn, getTweetByIdManualValidator, unlikeTweetController)

router.post('/:id/comment', isLoggedIn, getTweetByIdManualValidator,validate(commentZodSchema), addCommentController);

// router.delete('/:tweetId/comment/:commentId', 
//   isLoggedIn, 
//   getTweetByIdManualValidator, 
//   deleteCommentController
// );

router.put('/:tweetId/comment/:commentId', isLoggedIn, getTweetByIdManualValidator, updateCommentController)


// router.post('/:tweetId/comments/:commentId/replies', isLoggedIn, validate(tweetZodSchema), getTweetByIdManualValidator, replyToCommentController)
router.post(
  '/:tweetId/comments/:commentId/replies',
  isLoggedIn,
  getTweetByIdManualValidator,
  validate(replyZodSchema),
  replyToCommentController
);

router.post(
  '/:tweetId/comments/:commentId/like',
  isLoggedIn,
  getTweetByIdManualValidator,
  toggleCommentLikeController
);

router.delete(
  '/:tweetId/comment/:commentId/soft',
  isLoggedIn,
  getTweetByIdManualValidator,
  softDeleteCommentController
);




export default router;
