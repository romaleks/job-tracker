import { Router } from 'express'
import { getMarketOverview } from '../controllers/public.controller'

const router = Router()

router.get('/market-overview', getMarketOverview)

export default router
