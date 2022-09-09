import express from 'express';

import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import postRouter from './routes/postRouter';
import commentRouter from './routes/commentRouter';
import translationRouter from './routes/translationRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);
router.use('/translations', translationRouter);

export default router;
