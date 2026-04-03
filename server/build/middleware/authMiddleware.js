"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userChecker = exports.userExtractor = exports.tokenExtractor = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const config_1 = __importDefault(require("../utils/config"));
const tokenExtractor = (req, _res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        req.token = authorization.replace('Bearer ', '');
    }
    else {
        req.token = null;
    }
    next();
};
exports.tokenExtractor = tokenExtractor;
const userExtractor = async (req, _res, next) => {
    if (req.token) {
        const decoded = jsonwebtoken_1.default.verify(req.token, config_1.default.SECRET);
        const decodedToken = typeof decoded === 'string'
            ? null
            : decoded;
        if (decodedToken?.id) {
            const user = await User_1.default.findById(decodedToken.id);
            req.user = user ? user : undefined;
        }
    }
    next();
};
exports.userExtractor = userExtractor;
const userChecker = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'token missing or invalid' });
    }
    return next();
};
exports.userChecker = userChecker;
