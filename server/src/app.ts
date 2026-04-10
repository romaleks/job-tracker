import express from 'express'
import mongoose from 'mongoose'
import { tokenExtractor, userExtractor } from './middleware/authMiddleware'
import errorHandler from './middleware/errorHandler'
import requestLogger from './middleware/requestLogger'
import unknownEndpoint from './middleware/unknownEndpoint'
import authRouter from './routes/auth.routes'
import jobsRouter from './routes/job.routes'
import statsRouter from './routes/stats.routes'
import config from './utils/config'
import logger from './utils/logger'

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)

app.use('/api/auth', authRouter)
app.use('/api/jobs', userExtractor, jobsRouter)
app.use('/api/stats', userExtractor, statsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app
