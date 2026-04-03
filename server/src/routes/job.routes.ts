import { Router } from 'express'
import {
  createJob,
  getAllJobs,
  getJobById,
  getUserJobs,
  removeJob,
  updateJob,
} from '../controllers/job.controller'
import { userChecker } from '../middleware/authMiddleware'
import { validate } from '../middleware/validateResource'
import {
  CreateJobSchema,
  GetJobsQuerySchema,
  UpdateJobSchema,
} from '../schemas/job.schema'

const router = Router()

router.get('/', getAllJobs)

router.get('/user', [userChecker, validate(GetJobsQuerySchema)], getUserJobs)

router.get('/:id', getJobById)

router.post('/', [userChecker, validate(CreateJobSchema)], createJob)

router.put('/:id', [userChecker, validate(UpdateJobSchema)], updateJob)

router.delete('/:id', userChecker, removeJob)

export default router
