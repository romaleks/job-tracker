"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserSchema = exports.RegisterUserSchema = void 0;
const zod_1 = require("zod");
exports.RegisterUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(5, 'Username must be at least 5 characters'),
        email: zod_1.z.string().min(1, 'Email is required'),
        password: zod_1.z.string().min(8, 'Username must be at least 8 characters'),
    }),
});
exports.LoginUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().min(1, 'Email is required'),
        password: zod_1.z.string().min(1, 'Password is required'),
    }),
});
