import { check } from 'express-validator';
import userService from '../../../services/userService';
import errorCodes from '../../../constants/errorCodes';

const { USER_NOT_EXISTS } = errorCodes;

const validateAuthorExists = check('comment.author')
  .isMongoId()
  .custom(async (authorId) => {
    const user = await userService.findById(authorId);
    if (!user) {
      return Promise.reject(new Error(USER_NOT_EXISTS));
    }
    return Promise.resolve();
  });

export default validateAuthorExists;
