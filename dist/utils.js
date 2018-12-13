"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
function MongoErrorHandler(err) {
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
}
exports.MongoErrorHandler = MongoErrorHandler;
