import { param } from 'express-validator';
import errorCodes from '../../../constants/errorCodes';

const { INVALID_ID } = errorCodes;

const validateParamId = (id) => [
  param(id).isMongoId().withMessage(`${INVALID_ID}`),
];

export default validateParamId;
