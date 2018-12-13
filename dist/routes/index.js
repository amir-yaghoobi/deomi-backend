"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const chance_1 = __importDefault(require("chance"));
const users_1 = __importDefault(require("./users"));
const errorHandlers_1 = require("./errorHandlers");
exports.default = (app) => {
    const router = express_1.Router();
    const users = users_1.default(app);
    router.get('/', (req, res) => {
        res.status(200).json({
            now: new Date(),
            status: 'up and running',
        });
    });
    router.get('/products', (req, res) => {
        const chance = chance_1.default();
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
        jsonwebtoken_1.default.sign({
            username: 'sina',
            firstName: 'sina',
            lastName: 'haseli',
        }, 'super-secret', {
            expiresIn: '6h',
        }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    status: 500,
                    err: err,
                });
            }
            return res.status(200).json({
                token: token,
            });
        });
    });
    router.use('/users', users);
    router.use(errorHandlers_1.mongoErrorHandler);
    router.use(errorHandlers_1.internalErrorHandler);
    return router;
};
