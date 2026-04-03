"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, _req, res, next) => {
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }
    if (error.name === 'CastError') {
        return res.status(400).json({ error: 'malformatted id' });
    }
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ error: 'token invalid' });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'token expired' });
    }
    return next(error);
};
exports.default = errorHandler;
