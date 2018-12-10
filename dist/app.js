"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pino_1 = __importDefault(require("pino"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const events_1 = require("events");
const routes_1 = __importDefault(require("./routes"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Application extends events_1.EventEmitter {
    constructor() {
        super();
        this.log = pino_1.default({ level: 'debug' });
        const env = process.env.NODE_ENV ? '.' + process.env.NODE_ENV : '';
        const configPath = path_1.default.join(__dirname, '../config', `config${env}.json`);
        this.config = fs_1.default.readFileSync(configPath, 'utf8');
        this.config = JSON.parse(this.config);
    }
}
const expressApp = express_1.default();
expressApp.use(helmet_1.default());
expressApp.use(express_1.default.json());
expressApp.use(express_1.default.urlencoded({ extended: false }));
expressApp.use('/v1', routes_1.default);
exports.default = expressApp;
