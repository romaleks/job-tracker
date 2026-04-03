import { NextFunction, Response } from 'express'
import { ZodError, ZodObject } from 'zod'
import { ValidatedRequest } from '../types/express'

export const validate =
  (schema: ZodObject) =>
  (req: ValidatedRequest, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })

      req.validated = validated

      return next()
    } catch (e: unknown) {
      if (e instanceof ZodError) {
        return res
          .status(400)
          .json({ error: 'Validation failed', issues: e.issues })
      }

      return next(e)
    }
  }
