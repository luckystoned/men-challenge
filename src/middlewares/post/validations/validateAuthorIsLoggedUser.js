import { check } from 'express-validator';
import errorCodes from '../../../constants/errorCodes';

const { INVALID_USER } = errorCodes;

const validateAuthorIsLoggedUser = check('author').custom(
  (authorId, { req }) => {
    if (req.user._id !== authorId) {
      throw new Error(INVALID_USER);
    }
    return true;
  },
);

export default validateAuthorIsLoggedUser;
