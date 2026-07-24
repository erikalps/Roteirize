import { Request, Response, NextFunction } from 'express'
import { ZodSchema, z } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        error: 'Dados inválidos',
        fields: z.flattenError(result.error).fieldErrors
      })
    }

    req.body = result.data
    next()
  }
}