"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeJob = exports.updateJob = exports.createJob = exports.getJobById = exports.getUserJobs = exports.getAllJobs = void 0;
const Job_1 = __importDefault(require("../models/Job"));
const logger_1 = __importDefault(require("../utils/logger"));
const getAllJobs = async (_req, res) => {
    const jobs = await Job_1.default.find({});
    res.status(200).json(jobs);
};
exports.getAllJobs = getAllJobs;
const getUserJobs = async (req, res) => {
    const validatedQuery = req.validated?.query ?? { page: 1, limit: 10 };
    const { status, search, page, limit } = validatedQuery;
    const queryObject = { createdBy: req.user?._id };
    if (status) {
        queryObject.status = status;
    }
    if (search) {
        // Search in position OR company (case-insensitive)
        queryObject.$or = [
            { position: { $regex: search, $options: 'i' } },
            { company: { $regex: search, $options: 'i' } },
        ];
    }
    const skip = (page - 1) * limit;
    const jobs = await Job_1.default.find(queryObject)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit);
    const totalJobs = await Job_1.default.countDocuments(queryObject);
    logger_1.default.info(page);
    const numOfPages = Math.ceil(totalJobs / limit);
    res.status(200).json({ jobs, totalJobs, numOfPages });
};
exports.getUserJobs = getUserJobs;
const getJobById = async (req, res) => {
    const job = await Job_1.default.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ error: 'job not found' });
    }
    return res.status(200).json(job);
};
exports.getJobById = getJobById;
const createJob = async (req, res) => {
    const body = req.body;
    const newJob = await Job_1.default.create({
        ...body,
        createdBy: req.user?._id,
    });
    res.status(201).json(newJob);
};
exports.createJob = createJob;
const updateJob = async (req, res) => {
    const body = req.body;
    const job = await Job_1.default.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ error: 'job not found' });
    }
    if (req.user?._id.toString() !== job.createdBy.toString()) {
        return res
            .status(401)
            .json({ error: 'only creator of the job can change it' });
    }
    job.status = body.status;
    const savedJob = await job.save();
    return res.status(200).json(savedJob);
};
exports.updateJob = updateJob;
const removeJob = async (req, res) => {
    const job = await Job_1.default.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ error: 'job not found' });
    }
    if (req.user?._id.toString() !== job.createdBy.toString()) {
        return res
            .status(401)
            .json({ error: 'only creator of the job can delete it' });
    }
    await Job_1.default.findByIdAndDelete(job.id);
    return res.status(204).end();
};
exports.removeJob = removeJob;
exports.default = {
    getAllJobs: exports.getAllJobs,
    getJobById: exports.getJobById,
    getUserJobs: exports.getUserJobs,
    createJob: exports.createJob,
    updateJob: exports.updateJob,
    removeJob: exports.removeJob,
};
