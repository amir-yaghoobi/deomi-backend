import * as Joi from 'joi';
import { IExpressSchema } from '../middlewares/validation';

export const registerSchema: IExpressSchema = {
  body: Joi.object().keys({
    avatar: Joi.string()
      .trim()
      .required(),
    firstName: Joi.string()
      .min(3)
      .max(32)
      .trim()
      .required(),
    lastName: Joi.string()
      .min(3)
      .max(32)
      .trim()
      .required(),
    phone: Joi.string()
      .regex(/[\d]{11}/)
      .required(),
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required(),
    nationalCode: Joi.string()
      .length(10)
      .required(),
    password: Joi.string()
      .min(6)
      .max(32)
      .required(),
  }),
};

export const newAddressSchema: IExpressSchema = {
  body: Joi.object().keys({
    receiverName: Joi.string()
      .min(3)
      .max(32)
      .trim()
      .required(),
    phone: Joi.string()
      .regex(/[\d]{11}/)
      .required(),
    city: Joi.string()
      .min(2)
      .max(32)
      .trim()
      .required(),
    state: Joi.string()
      .min(2)
      .max(32)
      .trim()
      .required(),
    address: Joi.string()
      .min(5)
      .max(256)
      .trim()
      .required(),
    postalCode: Joi.string()
      .length(10)
      .trim()
      .required(),
  }),
};

export const loginSchema: IExpressSchema = {
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required(),
    password: Joi.string()
      .min(6)
      .max(32)
      .required(),
  }),
};
