"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const config_1 = __importDefault(require("../utils/config"));
const createUser = async (req, res) => {
    const { username, password, email } = req.body;
    if (username.length < 5) {
        return res
            .status(400)
            .json({ error: 'username must be at least 5 characters long' });
    }
    if (password.length < 8) {
        return res
            .status(400)
            .json({ error: 'password must be at least 8 characters long' });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt_1.default.hash(password, saltRounds);
    const newUser = await User_1.default.create({
        username,
        email,
        passwordHash,
    });
    return res.status(201).json(newUser);
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (password.length < 8) {
        return res
            .status(400)
            .json({ error: 'password must be at least 8 characters long' });
    }
    const user = await User_1.default.findOne({ email });
    const passwordCorrect = user === null ? false : await bcrypt_1.default.compare(password, user.passwordHash);
    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password',
        });
    }
    const userForToken = {
        username: user.username,
        id: user._id,
    };
    const token = jsonwebtoken_1.default.sign(userForToken, config_1.default.SECRET, {
    // expiresIn: 60 * 60,
    });
    return res
        .status(200)
        .json({ token, username: user.username, email: user.email });
};
exports.loginUser = loginUser;
exports.default = { createUser: exports.createUser };
