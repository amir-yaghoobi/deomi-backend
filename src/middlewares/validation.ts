import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

export interface IExpressSchema {
  body?: Joi.Schema;
  params?: Joi.Schema;
  query?: Joi.Schema;
}

export interface IValidRequest extends Request {
  data: {
    param?: any;
    body?: any;
    query?: any;
  };
}

export default function JoiMiddleware(schema: IExpressSchema) {
  return (req: any, res: Response, next: NextFunction) => {
    const totalErrors = [];

    req.data = {};

    if (schema.params) {
      const result = Joi.validate(req.params, schema.params, {
        abortEarly: false,
        convert: true,
      });
      if (result.error && result.error.details) {
        totalErrors.push(...result.error.details);
      } else {
        req.data.params = result.value;
      }
    }
    if (schema.body) {
      const result = Joi.validate(req.body, schema.body, {
        abortEarly: false,
        convert: true,
      });
      if (result.error && result.error.details) {
        totalErrors.push(...result.error.details);
      } else {
        req.data.body = result.value;
      }
    }

    if (schema.query) {
      const result = Joi.validate(req.query, schema.query, {
        abortEarly: false,
        convert: true,
      });
      if (result.error && result.error.details) {
        totalErrors.push(...result.error.details);
      } else {
        req.data.query = result.value;
      }
    }

    if (totalErrors.length > 0) {
      return res.status(400).json({
        status: 400,
        msg: 'Validation Error',
        errors: totalErrors,
      });
    }

    next();
  };
}
