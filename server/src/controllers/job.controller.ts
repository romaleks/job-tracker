import { Request, Response } from 'express'
import Job from '../models/Job'
import {
  CreateJobInput,
  GetJobsQuery,
  UpdateJobInput,
} from '../schemas/job.schema'
import { AuthRequest } from '../types/express'

export const getAllJobs = async (_req: Request, res: Response) => {
  const jobs = await Job.find({})
  res.status(200).json(jobs)
}

export const getUserJobs = async (req: AuthRequest, res: Response) => {
  const { status, search, page, limit } = req.validated?.query as GetJobsQuery
  const queryObject: any = { createdBy: req.user?._id }

  if (status) {
    queryObject.status = status
  }

  if (search) {
    // Search in position OR company (case-insensitive)
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ]
  }

  const skip = (page - 1) * limit

  const jobs = await Job.find(queryObject)
    .sort('-createdAt')
    .skip(skip)
    .limit(limit)

  const totalJobs = await Job.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalJobs / limit)

  res.status(200).json({ jobs, totalJobs, numOfPages })
}

export const getJobById = async (req: AuthRequest, res: Response) => {
  const job = await Job.findById(req.params.id)

  if (!job) {
    return res.status(404).json({ error: 'job not found' })
  }

  return res.status(200).json(job)
}

export const createJob = async (req: AuthRequest, res: Response) => {
  const body = req.validated?.body as CreateJobInput

  const newJob = await Job.create({
    ...body,
    createdBy: req.user?._id,
  })

  res.status(201).json(newJob)
}

export const updateJob = async (req: AuthRequest, res: Response) => {
  const body = req.validated?.body as UpdateJobInput

  const job = await Job.findById(req.params.id)

  if (!job) {
    return res.status(404).json({ error: 'job not found' })
  }

  if (req.user?._id.toString() !== job.createdBy.toString()) {
    return res
      .status(401)
      .json({ error: 'only creator of the job can change it' })
  }

  job.status = body.status
  const savedJob = await job.save()

  return res.status(200).json(savedJob)
}

export const removeJob = async (req: AuthRequest, res: Response) => {
  const job = await Job.findById(req.params.id)

  if (!job) {
    return res.status(404).json({ error: 'job not found' })
  }

  if (req.user?._id.toString() !== job.createdBy.toString()) {
    return res
      .status(401)
      .json({ error: 'only creator of the job can delete it' })
  }

  await Job.findByIdAndDelete(job.id)
  return res.status(204).end()
}

export default {
  getAllJobs,
  getJobById,
  getUserJobs,
  createJob,
  updateJob,
  removeJob,
}
