import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';


async function criarUsuarioEObterToken(email: string) {
    await request(app).post('/users').send({
        name: 'Usuário Teste',
        email,
        password: 'senha1234',
    });

    const login = await request(app).post('/auth/login').send({
        email,
        password: 'senha1234',
    });

    return login.body.token;
}

describe('POST /trips', () => {
    it('cria viagem com dados válidos e retorna 201', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');

        const resposta = await request(app)
            .post('/trips')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Férias no Chile',
                destination: 'Santiago',
                start_date: '2026-03-15',
                end_date: '2026-03-22',
            });

        expect(resposta.status).toBe(201);
        expect(resposta.body).toHaveProperty('id');
        expect(resposta.body.title).toBe('Férias no Chile');
        expect(resposta.body.startDate).toBe('2026-03-15');
    });

    it('retorna 401 quando não há token', async () => {
        const resposta = await request(app).post('/trips').send({
            title: 'Sem token',
            destination: 'Santiago',
            start_date: '2026-03-15',
            end_date: '2026-03-22',
        });

        expect(resposta.status).toBe(401);
    });

    it('retorna 400 com os campos inválidos', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');

        const resposta = await request(app)
            .post('/trips')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'a',
                destination: '',
                start_date: '15/03/2026',
                end_date: 'amanhã',
            });

        expect(resposta.status).toBe(400);
        expect(resposta.body).toHaveProperty('error');
        expect(resposta.body.fields).toHaveProperty('title');
        expect(resposta.body.fields).toHaveProperty('destination');
        expect(resposta.body.fields).toHaveProperty('start_date');
        expect(resposta.body.fields).toHaveProperty('end_date');
    });


    it('retorna 400 quando a data de fim é anterior à de início', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');

        const resposta = await request(app).post('/trips')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'curacao',
                destination: 'caribe',
                start_date: '2026-11-22',
                end_date: '2026-11-15',
            });

        expect(resposta.status).toBe(400);
        expect(resposta.body.fields).toHaveProperty('end_date');

    })

    it('retorna 200 quando a lista está vazia', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');

        const resposta = await request(app).get('/trips')
            .set('Authorization', `Bearer ${token}`)

        expect(resposta.status).toBe(200);
        expect(resposta.body).toEqual([]);
    });

    it('não retorna viagens de outro usuário', async () => {
        const tokenAna = await criarUsuarioEObterToken('ana@test.com')
        const respostaAna = await request(app).post('/trips')
            .set('Authorization', `Bearer ${tokenAna}`)
            .send({
                title: 'curacao',
                destination: 'caribe',
                start_date: '2026-11-15',
                end_date: '2026-11-22',
            })

        expect(respostaAna.status).toBe(201);

        const tokenBruno = await criarUsuarioEObterToken('bruno@test.com')
        const respostaBruno = await request(app).get('/trips')
            .set('Authorization', `Bearer ${tokenBruno}`)

        expect(respostaBruno.body).toEqual([]);


        const listagemAna = await request(app).get('/trips')
            .set('Authorization', `Bearer ${tokenAna}`)


        expect(listagemAna.status).toBe(200)
        expect(listagemAna.body).toHaveLength(1)
        expect(listagemAna.body[0].title).toBe('curacao');
        ;

    })

})