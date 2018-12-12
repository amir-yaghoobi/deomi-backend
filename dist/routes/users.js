"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const users_schema_1 = require("./users.schema");
const validation_1 = __importDefault(require("../middlewares/validation"));
const mongodb_1 = require("mongodb");
exports.default = (app) => {
    const router = express_1.Router();
    async function findAll(req, res) {
        const { Users } = app.models;
        const users = await Users.find().select('-addresses -__v');
        res.status(200).json(users);
    }
    function findById(req, res) {
        const { id } = req.params;
        const { Users } = app.models;
        return Users.findById(id)
            .then((user) => {
            if (!user) {
                return res.status(404).json({ err: 'not found' });
            }
            res.status(200).json(user);
        })
            .catch((err) => {
            if (err instanceof mongoose_1.CastError) {
                return res.status(400).json({ err: 'invalid user ID' });
            }
            app.log.error(err);
            res.status(500).json({ err });
        });
    }
    function registerNewUser(req, res) {
        const { Users } = app.models;
        return Users.create(req.data.body)
            .then(user => res.status(200).json(user))
            .catch((err) => {
            if (err instanceof mongodb_1.MongoError) {
                if (err.code === 11000) {
                    const key = err.errmsg.indexOf('index:');
                    try {
                        const duplicatedField = err.errmsg
                            .substring(key + 7) // start after index
                            .split(' ')[0] // select field name
                            .split('_')[0]; // remove trailin _x
                        return res.status(409).json({
                            status: 409,
                            message: 'cannot create a new user',
                            errors: [
                                {
                                    message: duplicatedField + ' is already exist',
                                    path: [duplicatedField],
                                },
                            ],
                        });
                    }
                    catch (e) {
                        app.log.warn('cannot parse mongo ERR11000.', e);
                    }
                }
            }
            res.status(500).json({
                status: 500,
                msg: 'internal server error',
                errors: [err],
            });
        });
    }
    function notImplemented(req, res) {
        res.json({ err: 'not implemented yet' });
    }
    router.get('/', findAll);
    router.post('/', validation_1.default(users_schema_1.registerSchema), registerNewUser);
    router.get('/:id', findById);
    router.put('/:id', notImplemented);
    router.delete('/:id', notImplemented);
    router.get('/:id/addresses', notImplemented);
    router.post('/:id/addresses', notImplemented);
    router.get('/:id/addresses/:addressId', notImplemented);
    router.put('/:id/addresses/:addressId', notImplemented);
    router.delete('/:id/addresses/:addressId', notImplemented);
    return router;
};
