import { describe, it, expect } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app';
import { email } from 'zod';

describe('POST/auth/login', () => {
    it('retorna 200 e um token válido com credenciais corretas', async () => {
        await request(app).post('/users').send({
            name: 'Ana',
            email: 'ana@teste.com',
            password: 'senha1234',
        });


        const resposta = await request(app).post('/auth/login').send({
             email: 'ana@teste.com',
            password: 'senha1234',
        })

        expect(resposta.status).toBe(200);
        expect(resposta.body.user.email).toBe('ana@teste.com');


        const payload = jwt.verify(
            resposta.body.token,
            process.env.JWT_SECRET as string
        ) as {userId:string};

        expect(payload.userId).toBe(resposta.body.user.id);
    });

    it('retorna 401 quando a senha está incorreta', async()=>{
        await request(app).post('/users').send({
            name:'ana',
            email:'ana@teste.com',
            password:'senha1234'
        });

        const resposta = await request(app).post('/auth/login').send({
            email:'ana@teste.com',
            password: 'ana123'
        });


        expect(resposta.status).toBe(401);
        expect(resposta.body.error).toBe('Credenciais inválidas');
    })

    it('retorna 401 quando o email não existe', async()=>{
        const resposta = await request(app).post('/auth/login').send({
            email:'ninguem@test.com',
            password:'senha1234',
        });


        expect(resposta.status).toBe(401)
        expect(resposta.body.error).toBe('Credenciais inválidas');
    })

})