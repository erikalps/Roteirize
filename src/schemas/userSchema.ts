import { z } from 'zod'

export const createUserSchema = z.object({
  name: z
    .string({ error: 'Nome é obrigatório' })
    .min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.email({ error: 'Email inválido ou ausente' }),
  password: z
    .string({ error: 'Senha é obrigatória' })
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[0-9]/, 'Senha deve conter pelo menos 1 número')
})

export type CreateUserInput = z.infer<typeof createUserSchema>