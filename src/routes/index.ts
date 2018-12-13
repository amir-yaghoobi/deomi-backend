import { Router } from 'express';
import Application from '../app';
import RegisterUsers from './users';
import { mongoErrorHandler, internalErrorHandler } from './errorHandlers';

export default (app: Application) => {
  const router = Router();

  const users = RegisterUsers(app);

  router.use('/users', users);

  router.use(mongoErrorHandler);
  router.use(internalErrorHandler);

  return router;
};
