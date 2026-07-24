import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(2, { error: 'Nome deve ter no mínimo 2 caracteres' }),
  email: z.email({ error: 'Email inválido' }).transform(val => val.toLowerCase().trim()),
  password: z.string()
    .min(8, { error: 'Senha deve ter pelo menos 8 caracteres' })
    .regex(/\d/, { error: 'Senha deve conter pelo menos 1 número' })
})

export type CreateUserInput = z.infer<typeof createUserSchema>