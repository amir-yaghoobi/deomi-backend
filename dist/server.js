#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const app_1 = __importDefault(require("./app"));
const app = new app_1.default();
app.attachDataSources().then(_ => {
    app.log.info('datasources attached successfully');
    const port = app.config.api.port || '3006';
    const host = app.config.api.host || '0.0.0.0';
    const expressApp = express_1.default();
    expressApp.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
        next();
    });
    expressApp.use(helmet_1.default());
    expressApp.use(express_1.default.json());
    expressApp.use(express_1.default.urlencoded({ extended: false }));
    const routes = routes_1.default(app);
    expressApp.use('/v1', routes);
    const server = expressApp.listen(port, host);
    server.on('error', onError);
    server.on('listening', onListening);
    function onError(error) {
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
