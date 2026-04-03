import { Request } from 'express'
import { IUser } from '../models/User'

export interface ValidatedRequest extends Request {
  validated?: {
    body?: unknown
    query?: unknown
    params?: unknown
  }
}

export interface AuthRequest extends ValidatedRequest {
  token?: string | null
  user?: IUser
}
