import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt'
import { db } from '../config/db';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;


    if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email e password são obrigatorios!!' })
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10)

        const result = await db.query(
            `INSERT INTO users (name, email, password_hash)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, created_at`,
            [name, email, passwordHash]
        );

        return res.status(201).json(result.rows[0]);



    } catch(error:any){
        if(error.code =='23505'){
            return res.status(409).json({error:'Este email já está cadastrado'});
        }


        return res.status(500).json({error:'Erro interno do servidor'})
    }
});


export default router;