"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const requestLogger_1 = __importDefault(require("./middleware/requestLogger"));
const unknownEndpoint_1 = __importDefault(require("./middleware/unknownEndpoint"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const job_routes_1 = __importDefault(require("./routes/job.routes"));
const config_1 = __importDefault(require("./utils/config"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
logger_1.default.info('connecting to', config_1.default.MONGODB_URI);
mongoose_1.default
    .connect(config_1.default.MONGODB_URI, { family: 4 })
    .then(() => {
    console.log('connected to MongoDB');
})
    .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
});
app.use(express_1.default.json());
app.use(requestLogger_1.default);
app.use(authMiddleware_1.tokenExtractor);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/jobs', authMiddleware_1.userExtractor, job_routes_1.default);
app.use(unknownEndpoint_1.default);
app.use(errorHandler_1.default);
exports.default = app;
