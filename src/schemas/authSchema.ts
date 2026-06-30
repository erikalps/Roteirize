import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({ error: 'Email inválido ou ausente' }),
  password: z
    .string({ error: 'Senha é obrigatória' })
    .min(1, 'Senha é obrigatória')
})

export type LoginInput = z.infer<typeof loginSchema>