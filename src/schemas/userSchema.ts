import {z} from 'zod'

export const createUserSchema = z.object({
    name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres'),
    email:z.string().email('email invalido'),
    password: z.string()
    .min(8, 'senha deve ter pelo menos 8 caracteres')
    .regex(/\d/, 'Senha deve conter pelo menos 1 número')
})
