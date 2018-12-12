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
exports.registerSchema = {
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
