#!/usr/bin/env node

import express from 'express';
import helmet from 'helmet';
import RegisterRoutes from './routes';
import Application from './app';

const app = new Application();
app.attachDataSources().then(_ => {
  app.log.info('datasources attached successfully');

  const port = app.config.api.port || '3006';
  const host = app.config.api.host || '0.0.0.0';

  const expressApp = express();

  expressApp.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
    );
    next();
  });

  expressApp.use(helmet());
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: false }));

  const routes = RegisterRoutes(app);
  expressApp.use('/v1', routes);

  const server = expressApp.listen(port, host);
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
});
