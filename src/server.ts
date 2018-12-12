#!/usr/bin/env node

import jwt from 'jsonwebtoken';
import Chance from 'chance';
import express from 'express';
import helmet from 'helmet';
import routes from './routes';
import Application from './app';

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
//   );
//   next();
// });

// app.get('/', (req, res) => {
//   res.status(200).json({
//     now: new Date(),
//     status: 'up and running',
//   });
// });

// app.get('/products', (req, res) => {
//   const chance = Chance();
//   const products = [];

//   for (let i = 1; i <= 100; i++) {
//     products.push({
//       id: i,
//       name: chance.name(),
//       category: chance.hashtag(),
//       price: chance.integer({ min: 1000, max: 50000 }),
//       description: chance.paragraph(),
//       popular: chance.bool(),
//       imageURL: chance.url(),
//     });
//   }

//   res.status(200).json(products);
// });

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   if (username !== 'sina' || password !== 'password') {
//     return res.status(401).json({
//       status: 401,
//       message: 'invalid username or password',
//     });
//   }

//   jwt.sign(
//     {
//       username: 'sina',
//       firstName: 'sina',
//       lastName: 'haseli',
//     },
//     'super-secret',
//     {
//       expiresIn: '6h',
//     },
//     (err, token) => {
//       if (err) {
//         return res.status(500).json({
//           status: 500,
//           err: err,
//         });
//       }

//       return res.status(200).json({
//         token: token,
//       });
//     }
//   );
// });

const app = new Application();
app.attachDataSources().then(_ => {
  app.log.info('datasources attached successfully');
});
const port = app.config.api.port || '3006';

const expressApp = express();

expressApp.use(helmet());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));

expressApp.use('/v1', routes);

const server = expressApp.listen(port, '0.0.0.0');
server.on('error', onError);
server.on('listening', onListening);

function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      app.log.error(bind + ' required elevated privileges');
      return process.exit(1);
    case 'EADDRINUSE':
      app.log.error(bind + ' is already in use');
      return process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  app.log.info('{>>>>>> API <<<<<<} started at port:"%d"', port);
  expressApp.locals.startedAt = new Date();
}
