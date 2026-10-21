import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const { formErrors, fieldErrors } = z.flattenError(result.error);

      return res.status(400).json({
        error: formErrors[0] ?? 'Dados inválidos',
        fields: fieldErrors,
      });
    }

    req.body = result.data;
    next();
  };
}
