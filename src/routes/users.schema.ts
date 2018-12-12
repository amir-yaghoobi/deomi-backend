import * as Joi from 'joi';
import { IExpressSchema } from '../middlewares/validation';

export const registerSchema: IExpressSchema = {
  body: Joi.object().keys({
    avatar: Joi.string()
      .trim()
      .required(),
    firstName: Joi.string()
      .max(32)
      .trim()
      .required(),
    lastName: Joi.string()
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
