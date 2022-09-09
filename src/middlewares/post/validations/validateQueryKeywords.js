import { query } from 'express-validator';
import errorCodes from '../../../constants/errorCodes';

const { KEYWORDS_NOT_EXISTS, KEYWORDS_IS_EMPTY } = errorCodes;

const validateQueryKeywords = [
  query('keywords')
    .exists()
    .withMessage(`${KEYWORDS_NOT_EXISTS}`)
    .bail()
    .notEmpty()
    .withMessage(`${KEYWORDS_IS_EMPTY}`),
];

export default validateQueryKeywords;
