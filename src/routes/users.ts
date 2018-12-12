import { Router, Request, Response } from 'express';
import Application from '../app';
import { CastError } from 'mongoose';
import { IUser, IUserAddress } from '../models/users';
import {} from 'express';

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

  async function registerNewUser(req: Request, res: Response) {
    res.status(201).json({});
  }

  function notImplemented(req: Request, res: Response) {
    res.json({ err: 'not implemented yet' });
  }

  router.get('/', findAll);
  router.post('/', registerNewUser);

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
