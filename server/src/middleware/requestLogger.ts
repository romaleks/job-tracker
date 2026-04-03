import { RequestHandler } from 'express'
import logger from '../utils/logger'

const requestLogger: RequestHandler = (request, _response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

export default requestLogger
