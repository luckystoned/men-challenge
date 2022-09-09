import { param } from 'express-validator';

const validateParamId = (id) => [param(id).isMongoId()];

export default validateParamId;
