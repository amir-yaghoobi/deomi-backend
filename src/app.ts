import Pino from 'pino';
import express from 'express';
import helmet from 'helmet';
import { EventEmitter } from 'events';
import routes from './routes';
import fs from 'fs';
import path from 'path';

class Application extends EventEmitter {
  log: Pino.Logger;
  config: any;
  constructor() {
    super();
    this.log = Pino({ level: 'debug' });

    const env = process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '';
    const configPath = path.join(__dirname, '../config', `config${env}.json`);

    this.config = fs.readFileSync(configPath, 'utf8');
    this.config = JSON.parse(this.config);
  }
}

const expressApp = express();

expressApp.use(helmet());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));

expressApp.use('/v1', routes);

export default expressApp;
