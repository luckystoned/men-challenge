import { check } from 'express-validator';
import errorCodes from '../../../constants/errorCodes';

const { INVALID_ID } = errorCodes;

const validateId = check('id', INVALID_ID).isString();

export default validateId;
