import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../config/db'
import { validate } from '../middlewares/validate'
import { loginSchema } from '../schemas/authSchema'
import {authenticate} from '../middlewares/authenticate'



const router = Router()

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await db.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const user = result.rows[0]
    const senhaCorreta = await bcrypt.compare(password, user.password_hash)

    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (err) {
    console.error('Erro no login:', err)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

router.get('/me', authenticate, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = $1',
      [req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' })
    }

    return res.status(200).json(result.rows[0])
  } catch (err) {
    console.error('Erro ao buscar usuário:', err)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
})

export default router