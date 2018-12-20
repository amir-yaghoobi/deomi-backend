import * as Joi from 'joi';
import { IExpressSchema } from '../middlewares/validation';

export const find: IExpressSchema = {
  query: Joi.object().keys({
    filter: Joi.any()
      .default({})
      .optional(),
    sort: Joi.string()
      .default('-updatedAt')
      .optional(),
    limit: Joi.number()
      .min(1)
      .default(25)
      .optional(),
    skip: Joi.number()
      .min(0)
      .default(0)
      .optional(),
  }),
};
