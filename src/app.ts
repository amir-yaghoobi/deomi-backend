import Pino from 'pino';

import mongoose from 'mongoose';
import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import Users from './models/users';

class Application extends EventEmitter {
  log: Pino.Logger;
  datasources: any;
  models: any;
  config: any;

  constructor() {
    super();
    this.log = Pino({ level: 'debug' });

    const env = process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '';
    const configPath = path.join(__dirname, '../config', `config${env}.json`);

    this.config = fs.readFileSync(configPath, 'utf8');
    this.config = JSON.parse(this.config);

    this.datasources = {};
    this.models = {
      Users,
    };
  }

  private mongoConnectionString(): string {
    const config = this.config.mongodb;
    let auth = '';

    if (config.username && config.password) {
      auth = `${config.username}:${config.password}@`;
    }

    return `mongodb://${auth}${config.host}:${config.port}/${config.database}`;
  }

  attachDataSources() {
    const connectionString = this.mongoConnectionString();
    return mongoose
      .connect(
        connectionString,
        { useNewUrlParser: true }
      )
      .then(mongo => {
        this.datasources.mongo = mongo;
        return mongo;
      });
  }
}


export default Application;
