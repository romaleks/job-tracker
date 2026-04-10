import { ErrorRequestHandler } from 'express'

interface MongoDuplicateKeyError extends Error {
  code?: number
  keyPattern?: Record<string, unknown>
}

const isMongoDuplicateKeyError = (
  error: Error,
): error is MongoDuplicateKeyError => {
  const maybeMongoError = error as MongoDuplicateKeyError
  return maybeMongoError.code === 11000
}

const errorHandler: ErrorRequestHandler = (error: Error, _req, res, next) => {
  if (isMongoDuplicateKeyError(error)) {
    const duplicateUsername = Boolean(error.keyPattern?.username)
    const duplicateEmail = Boolean(error.keyPattern?.email)

    if (duplicateUsername) {
      return res.status(409).json({ error: 'username already in use' })
    }

    if (duplicateEmail) {
      return res.status(409).json({ error: 'email already in use' })
    }

    return res.status(409).json({ error: 'duplicate value' })
  }

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
