import { z } from 'zod'
import { Status, Type } from '../types/job'

export const GetJobsQuerySchema = z.object({
  query: z.object({
    status: z.enum(Status).optional(),
    search: z.string().optional(),
    page: z.string().optional().default('1').transform(Number),
    limit: z.string().optional().default('10').transform(Number),
  }),
})

export type GetJobsQuery = z.infer<typeof GetJobsQuerySchema>['query']

export const CreateJobSchema = z.object({
  body: z.object({
    company: z.string().min(1, 'Company is required'),
    position: z.string().min(1, 'Position is required'),
    status: z.enum(Status).optional(),
    type: z.enum(Type).optional(),
    salary: z.number().positive().optional(),
    link: z.url('Invalid job URL').optional(),
  }),
})

export type CreateJobInput = z.infer<typeof CreateJobSchema>['body']

export const UpdateJobSchema = z.object({
  body: z.object({
    status: z.enum(Status),
  }),
})

export type UpdateJobInput = z.infer<typeof UpdateJobSchema>['body']
