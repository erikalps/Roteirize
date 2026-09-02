import { z } from 'zod';

export const createTripSchema = z
  .object({
    title: z
      .string()
      .min(2, { error: 'Título é obrigatório' })
      .max(120, { error: 'Título deve ter no máximo 120 caracteres' }),
    destination: z
      .string()
      .min(2, { error: 'o Destino da viagem é obrigatório' })
      .max(300, { error: 'Destino deve ter no máximo 300 caracteres' }),
    start_date: z.iso.date({ error: 'Data de início inválida' }),
    end_date: z.iso.date({ error: 'Data de fim inválida' }),
  })
  .refine((data) => new Date(data.end_date) >= new Date(data.start_date), {
    error: 'Data de fim não pode ser anterior à data de início',
    path: ['end_date'],
  });

export type CreateTripInput = z.infer<typeof createTripSchema>;