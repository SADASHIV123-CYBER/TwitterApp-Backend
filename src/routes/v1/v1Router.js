import express from 'express'
import tweetRouter from './tweets.js'
import commentRouter from './comment.js'
import userRouter from './user.js'
import authRouter from './auth.js'


const router = express.Router();

router.use('/tweets', tweetRouter);
router.use('/comments', commentRouter);
router.use('/user', userRouter)
router.use('/auth', authRouter)

export default router
