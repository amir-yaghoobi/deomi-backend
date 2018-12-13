"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
function JoiMiddleware(schema) {
    return (req, res, next) => {
        const totalErrors = [];
        req.data = {};
        if (schema.params) {
            const result = Joi.validate(req.params, schema.params, {
                abortEarly: false,
                convert: true,
            });
            if (result.error && result.error.details) {
                totalErrors.push(...result.error.details);
            }
            else {
                req.data.params = result.value;
            }
        }
        if (schema.body) {
            const result = Joi.validate(req.body, schema.body, {
                abortEarly: false,
                convert: true,
            });
            if (result.error && result.error.details) {
                totalErrors.push(...result.error.details);
            }
            else {
                req.data.body = result.value;
            }
        }
        if (schema.query) {
            const result = Joi.validate(req.query, schema.query, {
                abortEarly: false,
                convert: true,
            });
            if (result.error && result.error.details) {
                totalErrors.push(...result.error.details);
            }
            else {
                req.data.query = result.value;
            }
        }
        if (totalErrors.length > 0) {
            return res.status(400).json({
                status: 400,
                msg: 'Validation Error',
                errors: totalErrors,
            });
        }
        next();
    };
}
exports.default = JoiMiddleware;
