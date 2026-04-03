"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const validateResource_1 = require("../middleware/validateResource");
const user_schema_1 = require("../schemas/user.schema");
const router = (0, express_1.Router)();
router.post('/', (0, validateResource_1.validate)(user_schema_1.LoginUserSchema), user_controller_1.createUser);
exports.default = router;
