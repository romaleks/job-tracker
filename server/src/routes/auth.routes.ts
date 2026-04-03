import { Router } from 'express'
import { createUser, loginUser } from '../controllers/user.controller'
import { validate } from '../middleware/validateResource'
import { LoginUserSchema, RegisterUserSchema } from '../schemas/user.schema'

const router = Router()

router.post('/register', validate(RegisterUserSchema), createUser)

router.post('/login', validate(LoginUserSchema), loginUser)

export default router
