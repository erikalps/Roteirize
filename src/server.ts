
import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import { db } from './config/db';
import usersRouter from './routes/users';
import authRouter from './routes/auth'


console.log('JWT_SECRET carregada?', process.env.JWT_SECRET ? 'sim' : 'NÃO')
const app = express();
const PORT = 3001;



app.use(cors({
  origin:  'http://localhost:5173',
}))

app.use(express.json());
app.use('/users', usersRouter)
app.use('/auth', authRouter)

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

