import { z } from 'zod';

const tripFields = z.object({
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
});

export const createTripSchema = tripFields.refine(
  (data) => new Date(data.end_date) >= new Date(data.start_date),
  {
    error: 'Data de fim não pode ser anterior à data de início',
    path: ['end_date'],
  }
);

export const updateTripSchema = tripFields
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    error: 'Envie ao menos um campo para atualizar',
  })
  .refine(
    (data) =>
      !data.start_date ||
      !data.end_date ||
      new Date(data.end_date) >= new Date(data.start_date),
    {
      error: 'Data de fim não pode ser anterior à data de início',
      path: ['end_date'],
    }
  );

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;