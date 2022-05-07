import User from './models/User';
import Center from './models/Center';

const Joi = require('@hapi/joi');

// Register Validation
// ToDo: dodać do kazdego error details (czego dotyczy błąd)

export const registerValidation = (data: User) => {
  const schema = Joi.object().keys({
    login: Joi.string().min(6).required(),
    name: Joi.string().min(6).required(),
    surname: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

export const loginValidation = (data: User | Center) => {
  if (typeof data === typeof User) {
    const schema = Joi.object().keys({
      login: Joi.string().min(6).required(),
      password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
  }
  if (typeof data === typeof Center) {
    const schema = Joi.object().keys({
      centerName: Joi.string().min(6).required(),
      password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
  }
};
