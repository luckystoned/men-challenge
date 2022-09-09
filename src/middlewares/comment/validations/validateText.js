import { check } from 'express-validator';
import { MAX_TEXT_LENGTH } from '../../../models/comment';
import errorCodes from '../../../constants/errorCodes';

const { MAX_LENGTH } = errorCodes;

const validateText = check('comment.text')
  .exists()
  .isLength({ max: MAX_TEXT_LENGTH })
  .withMessage(`${MAX_LENGTH} ${MAX_TEXT_LENGTH}`)
  .withMessage(`${MAX_LENGTH} ${MAX_TEXT_LENGTH} characters`);

export default validateText;
