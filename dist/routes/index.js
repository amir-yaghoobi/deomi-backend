"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("./users"));
const errorHandlers_1 = require("./errorHandlers");
exports.default = (app) => {
    const router = express_1.Router();
    const users = users_1.default(app);
    router.use('/users', users);
    router.use(errorHandlers_1.mongoErrorHandler);
    router.use(errorHandlers_1.internalErrorHandler);
    return router;
};
