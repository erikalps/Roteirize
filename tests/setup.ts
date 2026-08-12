import dotenv from 'dotenv';
import { afterAll } from 'vitest';


dotenv.config({ path: '.env.test' });

if (!process.env.DATABASE_URL?.endsWith('_test')) {
  throw new Error(
    'Os testes só podem rodar em um banco terminado em _test. Verifique o .env.test.'
  );
}

afterAll(async () => {
  const { db } = await import('../src/config/db');
  await db.end();
});