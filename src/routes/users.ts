import { Router, Request, Response } from 'express';
import Application from '../app';
import User, { IUser, IUserAddress } from '../models/users';
import { registerSchema, newAddress } from './users.schema';
import JoiMiddleware, { IValidRequest } from '../middlewares/validation';
import { NextFunction } from 'express';

function userNotFound(res: Response) {
  return res.status(404).json({
    status: 404,
    errors: [
      {
        message: 'User not found',
        path: ['_id'],
      },
    ],
  });
}

export default (app: Application) => {
  const router = Router();
  const { Users } = app.models;

  function findAllUsers(req: Request, res: Response, next: NextFunction) {
    const { Users } = app.models;
    Users.find()
      .select('-addresses -__v -password')
      .then(users => res.status(200).json(users))
      .catch(next);
  }

  function findUserById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    return Users.findById(id)
      .select('-__v -password')
      .then((user: IUser) => {
        if (!user) {
          return userNotFound(res);
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

  function deleteUserById(
    req: IValidRequest,
    res: Response,
    next: NextFunction
  ) {
    return User.deleteOne({ _id: req.params.id })
      .then(x => {
        res.status(200).json({
          status: 200,
          isDeleted: x.n > 0,
        });
      })
      .catch(next);
  }

  function findAllAddresses(
    req: IValidRequest,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;

    return User.findById(id)
      .select('addresses')
      .then(addresses => {
        if (!addresses) {
          return userNotFound(res);
        }
        return res.status(200).json(addresses);
      })
      .catch(next);
  }

  function addNewAddress(
    req: IValidRequest,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    const { body } = req.data;
    return Users.findById(id)
      .then(user => {
        user.addresses.push(body);
        return user.save().then(_ => {
          res.status(201).json(body);
        });
      })
      .catch(next);
  }

  function notImplemented(req: Request, res: Response) {
    res.json({ err: 'not implemented yet' });
  }

  router.get('/', findAllUsers);
  router.post('/', JoiMiddleware(registerSchema), registerNewUser);

  router.get('/:id', findUserById);
  router.put('/:id', notImplemented);
  router.delete('/:id', deleteUserById);

  router.get('/:id/addresses', findAllAddresses);
  router.post('/:id/addresses', JoiMiddleware(newAddress), addNewAddress);

  router.get('/:id/addresses/:addressId', notImplemented);
  router.put('/:id/addresses/:addressId', notImplemented);
  router.delete('/:id/addresses/:addressId', notImplemented);

  return router;
};
