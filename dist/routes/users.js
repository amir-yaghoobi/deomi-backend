"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("../models/users"));
const users_schema_1 = require("./users.schema");
const validation_1 = __importDefault(require("../middlewares/validation"));
exports.default = (app) => {
    const router = express_1.Router();
    const { Users } = app.models;
    function findAll(req, res, next) {
        const { Users } = app.models;
        Users.find()
            .select('-addresses -__v -password')
            .then(users => res.status(200).json(users))
            .catch(next);
    }
    function findById(req, res, next) {
        const { id } = req.params;
        return Users.findById(id)
            .select('-__v -password')
            .then((user) => {
            if (!user) {
                return res.status(404).json({ err: 'not found' });
            }
            res.status(200).json(user);
        })
            .catch(next);
    }
    function registerNewUser(req, res, next) {
        return Users.create(req.data.body)
            .then(user => res.status(201).json(user))
            .catch(next);
    }
    function deleteById(req, res, next) {
        return users_1.default.deleteOne({ _id: req.params.id })
            .then(x => {
            res.status(200).json({
                status: 200,
                isDeleted: x.n > 0,
            });
        })
            .catch(next);
    }
    function notImplemented(req, res) {
        res.json({ err: 'not implemented yet' });
    }
    router.get('/', findAll);
    router.post('/', validation_1.default(users_schema_1.registerSchema), registerNewUser);
    router.get('/:id', findById);
    router.put('/:id', notImplemented);
    router.delete('/:id', deleteById);
    router.get('/:id/addresses', notImplemented);
    router.post('/:id/addresses', notImplemented);
    router.get('/:id/addresses/:addressId', notImplemented);
    router.put('/:id/addresses/:addressId', notImplemented);
    router.delete('/:id/addresses/:addressId', notImplemented);
    return router;
};
