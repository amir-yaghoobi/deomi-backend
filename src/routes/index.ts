import { Router } from 'express';
import Application from '../app';
import RegisterUsers from './users';

export default (app: Application) => {
  const router = Router();

  const users = RegisterUsers(app);

  router.use('/users', users);
  return router;
};
