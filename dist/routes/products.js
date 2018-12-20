"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_schema_1 = require("./products.schema");
const validation_1 = __importDefault(require("../middlewares/validation"));
const chance_1 = __importDefault(require("chance"));
exports.default = (app) => {
    const router = express_1.Router();
    const { Products } = app.models;
    function findProducts(req, res, next) {
        const { filter, limit, skip, sort } = req.data.query;
        Products.find(filter)
            .select('-__v')
            .setOptions({ limit, skip, sort })
            .then(products => res.status(200).json(products))
            .catch(next);
    }
    function countProducts(req, res, next) {
        const { filter } = req.data.query;
        Products.count(filter)
            .then(count => res.status(200).json({ count }))
            .catch(next);
    }
    function generateDummyData(req, res, next) {
        const chance = chance_1.default();
        for (let i = 0; i < 500; i++) {
            Products.create({
                title: chance.sentence(),
                description: chance.paragraph(),
                price: chance.integer({ min: 10000, max: 160000 }),
                inStock: chance.integer({ min: 1, max: 15 }),
                category: chance.pickone([
                    'cpu',
                    'motherboard',
                    'graphic-card',
                    'ssd',
                    'monitor',
                ]),
                pictures: [
                    'http://s9.picofile.com/file/8346332450/nodejs_601628d09d.png',
                ],
            });
        }
        res.json({ status: 'ok' });
    }
    router.get('/', validation_1.default(products_schema_1.find), findProducts);
    router.get('/count', validation_1.default(products_schema_1.find), countProducts);
    router.get('/dummy', generateDummyData);
    return router;
};
