import User from '../models/User';
import Center from '../models/Center';

const Joi = require('@hapi/joi');

// Register Validation
// ToDo: dodać do kazdego error details (czego dotyczy błąd), domyśle wartości nie działają - sprawdzić, zrobić

export const registerValidation = (data: User) => {
  const schema = Joi.object().keys({
    login: Joi.string().min(6).required(),
    name: Joi.string().min(6).required(),
    role: Joi.string().default('user'),
    surname: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// Login User Validation
export const loginUserValidation = (data: User) => {
  const schema = Joi.object().keys({
    login: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// Register Center Validation
export const registerCenterValidation = (data: Center) => {
  const schema = Joi.object().keys({
    centerName: Joi.string().min(6).required(),
    city: Joi.string().min(3).required(),
    address: Joi.string().min(6).required(),
    phone: Joi.string().length(9).required(),
    password: Joi.string().min(6).required()
  })
  return schema.validate(data);
}

// Login Center Validation
export const loginCenterValidation = (data: Center) => {
  const schema = Joi.object().keys({
    centerName: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
