import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import { CastError, NativeError } from 'mongoose';

export function mongoErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof CastError) {
    return res.status(400).json({
      status: 400,
      errors: [
        {
          message: `${(<any>err).path} is invalid`,
          path: [(<any>err).path],
        },
      ],
    });
  }

  if (err instanceof MongoError) {
    if (err.code === 11000) {
      const key = err.errmsg.indexOf('index:');

      try {
        const duplicatedField = err.errmsg
          .substring(key + 7) // start after index
          .split(' ')[0] // select field name
          .split('_')[0]; // remove trailing _x

        return res.status(409).json({
          status: 409,
          message: 'cannot create a new user',
          errors: [
            {
              message: duplicatedField + ' is already exist',
              path: [duplicatedField],
            },
          ],
        });
      } catch (e) {
        console.warn('cannot parse mongo ERR11000.', e);
      }
    }
  }

  next(err);
}

export function internalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(500).json({
    status: 500,
    msg: 'internal server error',
    errors: [err],
  });
}
