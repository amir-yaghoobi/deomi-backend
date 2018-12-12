"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const Joi = __importStar(require("joi"));
const validation_1 = __importDefault(require("../middlewares/validation"));
const mongodb_1 = require("mongodb");
exports.default = (app) => {
    const router = express_1.Router();
    async function findAll(req, res) {
        const { Users } = app.models;
        const users = await Users.find({});
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
                            .substring(key + 7)
                            .split(' ')[0]
                            .split('_')[0];
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
    const postUserSchema = {
        body: Joi.object().keys({
            avatar: Joi.string()
                .trim()
                .required(),
            firstName: Joi.string()
                .max(32)
                .trim()
                .required(),
            lastName: Joi.string()
                .max(32)
                .trim()
                .required(),
            phone: Joi.string()
                .regex(/[\d]{11}/)
                .required(),
            email: Joi.string()
                .email()
                .trim()
                .lowercase()
                .required(),
            nationalCode: Joi.string()
                .length(10)
                .required(),
            password: Joi.string()
                .min(6)
                .max(32)
                .required(),
        }),
    };
    router.get('/', findAll);
    router.post('/', validation_1.default(postUserSchema), registerNewUser);
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
