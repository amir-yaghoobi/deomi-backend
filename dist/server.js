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
const app = new app_1.default();
app.attachDataSources().then(_ => {
    app.log.info('datasources attached successfully');
    const port = app.config.api.port || '3006';
    const expressApp = express_1.default();
    expressApp.use(helmet_1.default());
    expressApp.use(express_1.default.json());
    expressApp.use(express_1.default.urlencoded({ extended: false }));
    const routes = routes_1.default(app);
    expressApp.use('/v1', routes);
    const server = expressApp.listen(port, '0.0.0.0');
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
