import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { email } from 'zod';


describe('POST /users', () => {
    it('cria usuário com dados válidos e retorna 201', async () => {
        const resposta = await request(app).post('/users').send({
            name: 'Ana',
            email: 'ana@test.com',
            password: 'senha1234'
        });

        expect(resposta.status).toBe(201);
        expect(resposta.body).toHaveProperty('id');
        expect(resposta.body.name).toBe('Ana');
        expect(resposta.body.email).toBe('ana@test.com');

    })

    it('normaliza email para maiusculo', async () => {
        const resposta = await request(app).post('/users').send({
            name: 'Bruno',
            email: 'BRUNO@TESTE.COM',
            password: 'senha1234',
        });

        expect(resposta.status).toBe(201);
        expect(resposta.body.email).toBe('bruno@teste.com');
    })

    it('retorna 409 quando o email já está cadastrado', async () => {
        await request(app).post('/users').send({
            name: 'Ana',
            email: 'ana@teste.com',
            password: 'senha1234',
        });

        const resposta = await request(app).post('/users').send({
            name: 'Ana',
            email: 'ana@teste.com',
            password: 'senha1234',
        });

        expect(resposta.status).toBe(409);
        expect(resposta.body.error).toBe('Este email já está cadastrado');
    });

    it('retorna 400 com os campos inválidos', async () => {
        const resposta = await request(app).post('/users').send({
            name: 'a',
            email: 'erro-email',
            password: '123',
        });


        expect(resposta.status).toBe(400);
        expect(resposta.body).toHaveProperty('error'),
        expect(resposta.body.fields).toHaveProperty('name');
        expect(resposta.body.fields).toHaveProperty('email');
        expect(resposta.body.fields).toHaveProperty('password');


    });

});
