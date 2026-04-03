"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const requireEnv = (name) => {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
};
const PORT = requireEnv('PORT');
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? requireEnv('TEST_MONGODB_URI')
    : requireEnv('MONGODB_URI');
const SECRET = requireEnv('SECRET');
exports.default = { PORT, MONGODB_URI, SECRET };
