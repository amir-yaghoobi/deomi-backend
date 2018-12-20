"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("./users"));
const products_1 = __importDefault(require("./products"));
const errorHandlers_1 = require("./errorHandlers");
exports.default = (app) => {
    const router = express_1.Router();
    const users = users_1.default(app);
    const products = products_1.default(app);
    router.get('/', (req, res) => {
        res.status(200).json({
            now: new Date(),
            status: 'up and running',
        });
    });
    router.use('/users', users);
    router.use('/products', products);
    router.use(errorHandlers_1.mongoErrorHandler);
    router.use(errorHandlers_1.internalErrorHandler);
    return router;
};
