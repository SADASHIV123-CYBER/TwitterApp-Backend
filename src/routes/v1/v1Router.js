import express from 'express'
import tweetRouter from './tweets.js'
import commentRouter from './comment.js'
import userRouter from './user.js'
import authRouter from './auth.js'
import verifyRouter from './verify.js'


const router = express.Router();

router.use('/tweets', tweetRouter);
router.use('/comments', commentRouter);
router.use('/user', userRouter)
router.use('/auth', authRouter)
router.use('/verify', verifyRouter)

export default router
