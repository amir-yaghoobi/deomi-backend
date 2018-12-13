import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Chance from 'chance';
import Application from '../app';
import RegisterUsers from './users';
import { mongoErrorHandler, internalErrorHandler } from './errorHandlers';

export default (app: Application) => {
  const router = Router();

  const users = RegisterUsers(app);

  router.get('/', (req, res) => {
    res.status(200).json({
      now: new Date(),
      status: 'up and running',
    });
  });

  router.get('/products', (req, res) => {
    const chance = Chance();
    const products = [];

    for (let i = 1; i <= 100; i++) {
      products.push({
        id: i,
        name: chance.name(),
        category: chance.hashtag(),
        price: chance.integer({ min: 1000, max: 50000 }),
        description: chance.paragraph(),
        popular: chance.bool(),
        imageURL: chance.url(),
      });
    }

    res.status(200).json(products);
  });

  router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username !== 'sina' || password !== 'password') {
      return res.status(401).json({
        status: 401,
        message: 'invalid username or password',
      });
    }

    jwt.sign(
      {
        username: 'sina',
        firstName: 'sina',
        lastName: 'haseli',
      },
      'super-secret',
      {
        expiresIn: '6h',
      },
      (err, token) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            err: err,
          });
        }

        return res.status(200).json({
          token: token,
        });
      }
    );
  });

  router.use('/users', users);

  router.use(mongoErrorHandler);
  router.use(internalErrorHandler);

  return router;
};
