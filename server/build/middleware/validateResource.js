"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => (req, res, next) => {
    try {
        const parsed = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        req.validated = parsed;
        if (parsed.body && req.body && typeof req.body === 'object') {
            Object.assign(req.body, parsed.body);
        }
        if (parsed.params && req.params && typeof req.params === 'object') {
            Object.assign(req.params, parsed.params);
        }
        return next();
    }
    catch (e) {
        if (e instanceof zod_1.ZodError) {
            return res
                .status(400)
                .json({ error: 'Validation failed', issues: e.issues });
        }
        return next(e);
    }
};
exports.validate = validate;
