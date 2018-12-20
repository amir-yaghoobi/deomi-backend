import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Application from '../app';
import Users, { IUser, IUserAddress } from '../models/users';
import { registerSchema, newAddressSchema, loginSchema } from './users.schema';
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

function invalidEmailOrPassword(res: Response) {
  return res.status(403).json({
    status: 403,
    errors: [
      {
        message: 'Invalid Email or Password',
        path: ['email', 'password'],
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

  async function login(req: IValidRequest, res: Response, next: NextFunction) {
    const { email, password } = req.data.body;
    try {
      const user = await Users.findOne({ email });
      if (!user) {
        return invalidEmailOrPassword(res);
      }
      const isMatch = await user.checkPassword(password);
      if (!isMatch) {
        return invalidEmailOrPassword(res);
      }

      const payload = {
        id: user.id,
        role: user.role,
        avatar: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      };
      const token = await jwt.sign(payload, app.config.api.secret, {
        expiresIn: '6h',
      });

      return res.status(200).json({
        status: 200,
        token: token,
      });
    } catch (err) {
      next(err);
    }
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
    return Users.deleteOne({ _id: req.params.id })
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

    return Users.findById(id)
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

  router.post('/login', JoiMiddleware(loginSchema), login);
  router.post('/logout', notImplemented);

  router.get('/:id', findUserById);
  router.put('/:id', notImplemented);
  router.delete('/:id', deleteUserById);

  router.get('/:id/addresses', findAllAddresses);
  router.post('/:id/addresses', JoiMiddleware(newAddressSchema), addNewAddress);

  router.get('/:id/addresses/:addressId', notImplemented);
  router.put('/:id/addresses/:addressId', notImplemented);
  router.delete('/:id/addresses/:addressId', notImplemented);

  return router;
};
