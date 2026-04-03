import { Router } from 'express'
import { createUser } from '../controllers/user.controller'
import { validate } from '../middleware/validateResource'
import { LoginUserSchema } from '../schemas/user.schema'

const router = Router()

router.post('/', validate(LoginUserSchema), createUser)

export default router
