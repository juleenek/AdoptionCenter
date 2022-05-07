import User from './models/User';
const Joi = require('@hapi/joi');

// Register Validation
// ToDo: dodać do kazdego error details (czego dotyczy błąd)
export const registerValidation = (data: User) => {
  const schema = Joi.object().keys({
    login: Joi.string().min(6).required(),
    name: Joi.string().min(6).required(),
    surname: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
