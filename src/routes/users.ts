import { Router, Request, Response } from 'express';
import Application from '../app';
import { CastError, Mongoose } from 'mongoose';
import { IUser, IUserAddress } from '../models/users';
import * as Joi from 'joi';
import JoiMiddleware, {
  IExpressSchema,
  IValidRequest,
} from '../middlewares/validation';
import { MongoError } from 'mongodb';

export default (app: Application) => {
  const router = Router();

  async function findAll(req: Request, res: Response) {
    const { Users } = app.models;
    const users = await Users.find({});
    res.status(200).json(users);
  }

  function findById(req: Request, res: Response) {
    const { id } = req.params;
    const { Users } = app.models;
    return Users.findById(id)
      .then((user: IUser) => {
        if (!user) {
          return res.status(404).json({ err: 'not found' });
        }

        res.status(200).json(user);
      })
      .catch((err: Error) => {
        if (err instanceof CastError) {
          return res.status(400).json({ err: 'invalid user ID' });
        }

        app.log.error(err);
        res.status(500).json({ err });
      });
  }

  function registerNewUser(req: IValidRequest, res: Response) {
    const { Users } = app.models;
    return Users.create(req.data.body)
      .then(user => res.status(200).json(user))
      .catch((err: Error) => {
        if (err instanceof MongoError) {
          if (err.code === 11000) {
            const key = err.errmsg.indexOf('index:');

            try {
              const duplicatedField = err.errmsg
                .substring(key + 7)
                .split(' ')[0]
                .split('_')[0];

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
              app.log.warn('cannot parse mongo ERR11000.', e);
            }
          }
        }

        res.status(500).json({
          status: 500,
          msg: 'internal server error',
          errors: [err],
        });
      });
  }

  function notImplemented(req: Request, res: Response) {
    res.json({ err: 'not implemented yet' });
  }

  const postUserSchema: IExpressSchema = {
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

  router.get('/', findAll);
  router.post('/', JoiMiddleware(postUserSchema), registerNewUser);

  router.get('/:id', findById);
  router.put('/:id', notImplemented);
  router.delete('/:id', notImplemented);

  router.get('/:id/addresses', notImplemented);
  router.post('/:id/addresses', notImplemented);

  router.get('/:id/addresses/:addressId', notImplemented);
  router.put('/:id/addresses/:addressId', notImplemented);
  router.delete('/:id/addresses/:addressId', notImplemented);

  return router;
};
