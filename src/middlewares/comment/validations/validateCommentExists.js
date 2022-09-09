import { check } from 'express-validator';

const validateCommentExists = check('comment').exists();

export default validateCommentExists;
