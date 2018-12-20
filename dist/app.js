"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const mongoose_1 = __importDefault(require("mongoose"));
const events_1 = require("events");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const users_1 = __importDefault(require("./models/users"));
const products_1 = __importDefault(require("./models/products"));
class Application extends events_1.EventEmitter {
    constructor() {
        super();
        this.log = pino_1.default({ level: 'debug' });
        const env = process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '';
        const configPath = path_1.default.join(__dirname, '../config', `config${env}.json`);
        this.config = fs_1.default.readFileSync(configPath, 'utf8');
        this.config = JSON.parse(this.config);
        this.datasources = {};
        this.models = {
            Users: users_1.default,
            Products: products_1.default,
        };
    }
    mongoConnectionString() {
        const config = this.config.mongodb;
        let auth = '';
        if (config.username && config.password) {
            auth = `${config.username}:${config.password}@`;
        }
        return `mongodb://${auth}${config.host}:${config.port}/${config.database}`;
    }
    attachDataSources() {
        const connectionString = this.mongoConnectionString();
        return mongoose_1.default
            .connect(connectionString, { useNewUrlParser: true })
            .then(mongo => {
            this.datasources.mongo = mongo;
            return mongo;
        });
    }
}
exports.default = Application;
