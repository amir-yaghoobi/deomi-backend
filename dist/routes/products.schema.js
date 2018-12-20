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
exports.find = {
    query: Joi.object().keys({
        filter: Joi.any()
            .default({})
            .optional(),
        sort: Joi.string()
            .default('-updatedAt')
            .optional(),
        limit: Joi.number()
            .min(1)
            .default(25)
            .optional(),
        offset: Joi.number()
            .min(0)
            .default(0)
            .optional(),
    }),
};
