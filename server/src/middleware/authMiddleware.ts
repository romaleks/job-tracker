import type { NextFunction, Response } from 'express'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import User from '../models/User'
import { Token } from '../types/auth'
import type { AuthRequest } from '../types/express'
import config from '../utils/config'

export const tokenExtractor = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    req.token = null
  }
  next()
}

export const userExtractor = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  if (req.token) {
    const decoded = jwt.verify(req.token, config.SECRET)
    const decodedToken =
      typeof decoded === 'string'
        ? null
        : (decoded as JwtPayload & Partial<Token>)

    if (decodedToken?.id) {
      const user = await User.findById(decodedToken.id)
      req.user = user ? user : undefined
    }
  }
  next()
}

export const userChecker = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }
  return next()
}
