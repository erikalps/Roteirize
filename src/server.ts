
import 'dotenv/config';
import express from 'express';
import { db } from './config/db';
import usersRouter from './routes/users';


const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/users', usersRouter)

app.get('/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ status: 'ok', db: 'connected' });
   } catch (error) {
    console.error('DB connection error:', error);
    res.status(500).json({ status: 'ok', db: 'disconnected' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});