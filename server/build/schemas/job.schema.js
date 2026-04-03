"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateJobSchema = exports.CreateJobSchema = exports.GetJobsQuerySchema = void 0;
const zod_1 = require("zod");
const job_1 = require("../types/job");
exports.GetJobsQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        status: zod_1.z.enum(job_1.Status).optional(),
        search: zod_1.z.string().optional(),
        page: zod_1.z.string().optional().default('1').transform(Number),
        limit: zod_1.z.string().optional().default('10').transform(Number),
    }),
});
exports.CreateJobSchema = zod_1.z.object({
    body: zod_1.z.object({
        company: zod_1.z.string().min(1, 'Company is required'),
        position: zod_1.z.string().min(1, 'Position is required'),
        status: zod_1.z.enum(job_1.Status).optional(),
        type: zod_1.z.enum(job_1.Type).optional(),
        salary: zod_1.z.number().positive().optional(),
        link: zod_1.z.url('Invalid job URL').optional(),
    }),
});
exports.UpdateJobSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(job_1.Status),
    }),
});
