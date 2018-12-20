import { Router } from 'express';
import Application from '../app';
import Users from './users';
import Products from './products';
import { mongoErrorHandler, internalErrorHandler } from './errorHandlers';

export default (app: Application) => {
  const router = Router();

  const users = Users(app);
  const products = Products(app);

  router.get('/', (req, res) => {
    res.status(200).json({
      now: new Date(),
      status: 'up and running',
    });
  });

  router.use('/users', users);
  router.use('/products', products);

  router.use(mongoErrorHandler);
  router.use(internalErrorHandler);

  return router;
};
