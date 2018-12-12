"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const addressSchema = new mongoose_1.Schema({
    receiverName: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    city: {
        type: String,
        trim: true,
        required: true,
    },
    state: {
        type: String,
        trim: true,
        required: true,
    },
    address: {
        type: String,
        trim: true,
        required: true,
    },
    postalCode: {
        type: String,
        trim: true,
        required: true,
    },
}, { timestamps: true, autoIndex: true });
const userSchema = new mongoose_1.Schema({
    avatar: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user'],
        default: 'user',
    },
    firstName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
        required: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
    },
    nationalCode: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
        set: function (password) {
            return bcrypt_1.default.hashSync(password, 10);
        },
    },
    isVerified: { type: Boolean, default: false },
    addresses: [addressSchema],
}, { timestamps: true, autoIndex: true });
userSchema.methods.checkPassword = function (password) {
    return bcrypt_1.default.compare(this.password, password);
};
const User = mongoose_1.model('Users', userSchema);
exports.default = User;
