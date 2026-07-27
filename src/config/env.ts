// src/config/env.ts
import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.url({ error: 'DATABASE_URL deve ser uma URL válida' }),
  JWT_SECRET: z.string({ error: 'JWT_SECRET é obrigatório' }).min(1),
  PORT: z.coerce.number().default(3001),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  console.error('Erro nas variáveis de ambiente:')
  console.error(z.flattenError(result.error).fieldErrors)
  process.exit(1)
}

export const env = result.data
