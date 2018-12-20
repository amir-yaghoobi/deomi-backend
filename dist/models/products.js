"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    inStock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
    },
    category: {
        type: String,
        trim: true,
        required: true,
    },
    pictures: {
        type: [String],
    },
}, { timestamps: true, autoIndex: true });
const Products = mongoose_1.model('Products', productSchema);
exports.default = Products;
