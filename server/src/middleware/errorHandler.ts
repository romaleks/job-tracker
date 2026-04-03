import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (error: Error, _req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  return next(error)
}

export default errorHandler
