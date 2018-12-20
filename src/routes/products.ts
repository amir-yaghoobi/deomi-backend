import { Router, Request, Response } from 'express';
import Application from '../app';
import { find } from './products.schema';
import JoiMiddleware, { IValidRequest } from '../middlewares/validation';
import { NextFunction } from 'express';
import Chance from 'chance';

export default (app: Application) => {
  const router = Router();
  const { Products } = app.models;

  function findProducts(req: IValidRequest, res: Response, next: NextFunction) {
    const { filter, limit, offset, sort } = req.data.query;
    Products.find(filter)
      .select('-__v')
      .setOptions({ limit, offset, sort })
      .then(products => res.status(200).json(products))
      .catch(next);
  }

  function countProducts(
    req: IValidRequest,
    res: Response,
    next: NextFunction
  ) {
    const { filter } = req.data.query;
    Products.count(filter)
      .then(count => res.status(200).json({ count }))
      .catch(next);
  }

  function generateDummyData(
    req: IValidRequest,
    res: Response,
    next: NextFunction
  ) {
    const chance = Chance();
    for (let i = 0; i < 500; i++) {
      Products.create({
        title: chance.sentence(),
        description: chance.paragraph(),
        price: chance.integer({ min: 10000, max: 160000 }),
        inStock: chance.integer({ min: 1, max: 15 }),
        category: chance.pickone([
          'cpu',
          'motherboard',
          'graphic-card',
          'ssd',
          'monitor',
        ]),
        pictures: [
          'http://s9.picofile.com/file/8346332450/nodejs_601628d09d.png',
        ],
      });
    }

    res.json({ status: 'ok' });
  }

  router.get('/', JoiMiddleware(find), findProducts);
  router.get('/count', JoiMiddleware(find), countProducts);
  router.get('/dummy', generateDummyData);

  return router;
};
