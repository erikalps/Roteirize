import pg from 'pg';
import { env } from './env';

pg.types.setTypeParser(1082, (value) => value);
const { Pool } = pg;

export const db = new Pool({
  connectionString: env.DATABASE_URL,
});
