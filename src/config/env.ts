// src/config/env.ts
import 'dotenv/config';
import { z } from 'zod';

const HOSTS_LOCAIS = ['localhost', '127.0.0.1', '::1', 'host.docker.internal'];

// O pg só negocia TLS se a connection string trouxer sslmode: sem o parâmetro,
// a conexão com um banco remoto sobe em texto claro e sem nenhum aviso.
const exigeSslQuandoRemoto = (url: string) => {
  const { hostname, searchParams } = new URL(url);
  return HOSTS_LOCAIS.includes(hostname) || searchParams.has('sslmode');
};

const envSchema = z.object({
  DATABASE_URL: z
    .url({ error: 'DATABASE_URL deve ser uma URL válida' })
    .refine(exigeSslQuandoRemoto, {
      error:
        'DATABASE_URL de banco remoto precisa do parâmetro sslmode (ex.: ?sslmode=require)',
    }),
  JWT_SECRET: z.string({ error: 'JWT_SECRET é obrigatório' }).min(1),
  // O header Origin nunca chega com barra no final, então a origem é normalizada
  // para a comparação do cors não falhar por causa dela.
  CORS_ORIGIN: z
    .url({ error: 'CORS_ORIGIN deve ser uma URL válida' })
    .transform((v) => v.replace(/\/$/, '')),
  PORT: z.coerce.number().default(3001),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Erro nas variáveis de ambiente:');
  console.error(z.flattenError(result.error).fieldErrors);
  process.exit(1);
}

export const env = result.data;
