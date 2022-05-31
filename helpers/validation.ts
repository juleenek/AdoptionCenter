import User from '../models/User';
import Center from '../models/Center';
import Dog from '../models/Dog';
import Event from '../models/Event';
const Joi = require('@hapi/joi').extend(require('@joi/date'));

export const registerUserValidation = (data: User) => {
  const schema = Joi.object().keys({
    login: Joi.string().min(5).required(),
    name: Joi.string().min(2).required(),
    role: Joi.string().empty('user'),
    surname: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
  });
  return schema.validate(data);
};

// Login User Validation
export const loginUserValidation = (data: User) => {
  const schema = Joi.object().keys({
    login: Joi.string().min(5).required(),
    password: Joi.string().min(5).required(),
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
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// Register Center Validation <= register dog???
export const registerDogValidation = (data: Dog) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    breed: Joi.string().required(),
    age: Joi.number(),
    gender: Joi.string().min(4).max(6).required(),
  });
  return schema.validate(data);
};

// Login Center Validation
export const loginCenterValidation = (data: Center) => {
  const schema = Joi.object().keys({
    centerName: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// Event Validation
export const eventValidation = (data: Event) => {
  const schema = Joi.object().keys({
    dogId: Joi.string().required(),
    date: Joi.date()
      .required()
      .greater(Date.now() + 48 * 60 * 60 * 100)
      .format('DD/MM/YYYY'), 
    message: Joi.string(),
  });
  return schema.validate(data);
};
