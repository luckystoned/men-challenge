import express from 'express';
import postMiddlewares from '../middlewares/post';
import commonValidations from '../middlewares/common/validations';
import postValidations from '../middlewares/post/validations';
import { isAuthorized } from '../middlewares/common/isAuthorized';

const {
  validateTitle,
  validateBody: validatePostBody,
  validateAuthorExists,
  validateAuthorIsLoggedUser,
} = postValidations;

const { validateBody, validateParamId } = commonValidations;
const {
  createPost,
  findAllPosts,
  findPostById,
  findPostsByAuthor,
} = postMiddlewares;

const postRouter = express.Router();

const createPostValidations = [
  validateTitle,
  validatePostBody,
  validateAuthorExists,
  validateAuthorIsLoggedUser,
];

const paramIdMiddleware = validateBody(validateParamId('id'));
const createPostMiddleware = validateBody(createPostValidations);
postRouter.post('/', isAuthorized, createPostMiddleware, createPost);

postRouter.get('/', isAuthorized, findAllPosts);

postRouter.get('/:id', isAuthorized, paramIdMiddleware, findPostById);

postRouter.get(
  '/author/:id',
  isAuthorized,
  paramIdMiddleware,
  findPostsByAuthor,
);

export default postRouter;
