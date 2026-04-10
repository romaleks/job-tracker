import { Router } from 'express'
import { getUserStats } from '../controllers/stats.controller'
import { userChecker } from '../middleware/authMiddleware'

const router = Router()

router.get('/', userChecker, getUserStats)

export default router
