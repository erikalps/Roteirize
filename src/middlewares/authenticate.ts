import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export function authenticate(req: Request, res: Response, next: NextFunction): void{
     const header = req.headers.authorization

    if(!header){
        res.status(401).json({error:'token não fornecido'})
        return 
    }

    const token = header.split(' ')[1]

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
        req.userId = payload.userId
        next()
    } catch {
        res.status(401).json({error: 'Token inválido ou expirado'})
    }



}
   