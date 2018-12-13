import { Router, Request, Response } from 'express';
import Application from '../app';
import { CastError, Mongoose } from 'mongoose';
import { IUser, IUserAddress } from '../models/users';
import { registerSchema } from './users.schema';
import JoiMiddleware, { IValidRequest } from '../middlewares/validation';
import { NextFunction } from 'express';

export default (app: Application) => {
  const router = Router();
  const { Users } = app.models;

  function findAll(req: Request, res: Response, next: NextFunction) {
    const { Users } = app.models;
    Users.find()
      .select('-addresses -__v -password')
      .then(users => res.status(200).json(users))
      .catch(next);
  }

  function findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    return Users.findById(id)
      .select('-__v -password')
      .then((user: IUser) => {
        if (!user) {
          return res.status(404).json({ err: 'not found' });
        }

        res.status(200).json(user);
      })
      .catch(next);
  }

  function registerNewUser(
    req: IValidRequest,
    res: Response,
    next: NextFunction
  ) {
    return Users.create(req.data.body)
      .then(user => res.status(201).json(user))
      .catch(next);
  }

  function notImplemented(req: Request, res: Response) {
    res.json({ err: 'not implemented yet' });
  }

  router.get('/', findAll);
  router.post('/', JoiMiddleware(registerSchema), registerNewUser);

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
