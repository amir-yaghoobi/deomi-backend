"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = require("mongoose");
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
    async function registerNewUser(req, res) {
        const users = await app.models.Users;
        const amir = {
            avatar: 'https://avatars1.githubusercontent.com/u/14129756?s=400&u=2d2fc8ad968dbe2d7c61dcf8b8b3cf3726ade88d&v=4',
            role: 'admin',
            firstName: 'امیرحسین',
            lastName: 'یعقوبی',
            phone: '989335010082',
            email: 'a.yaghoobi.dev@gmail.com',
            nationalCode: '0018036791',
            password: 'battle2021',
            isVerified: false,
            addresses: [
                {
                    receiverName: 'الله',
                    phone: '02177555183',
                    city: 'تهران',
                    state: 'تهران',
                    address: 'خیابان سلمان فارسی',
                    postalCode: '161514181316',
                },
            ],
        };
        users.create(amir);
        res.status(201).json({});
    }
    function notImplemented(req, res) {
        res.json({ err: 'not implemented yet' });
    }
    router.get('/', findAll);
    router.post('/', registerNewUser);
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
