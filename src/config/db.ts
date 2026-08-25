import pg from 'pg';
import { env } from './env';

const { Pool } = pg;

export const db = new Pool({
  connectionString: env.DATABASE_URL,
});
