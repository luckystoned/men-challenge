import express from 'express';
import commentMiddlewares from '../middlewares/comment';
import commonValidations from '../middlewares/common/validations';
import commentValidations from '../middlewares/comment/validations';
import { isAuthorized } from '../middlewares/common/isAuthorized';

const {
  validateAuthorExists,
  validateCommentExists,
  validatePostExists,
  validateText,
} = commentValidations;

const { addComment } = commentMiddlewares;

const { validateBody } = commonValidations;

const commentRouter = express.Router();

const createCommentValidations = [
  validateAuthorExists,
  validateCommentExists,
  validatePostExists,
  validateText,
];

const createCommentMiddleware = validateBody(createCommentValidations);

commentRouter.post('/add', isAuthorized, createCommentMiddleware, addComment);

export default commentRouter;
