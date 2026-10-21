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


async function criarViagem(token: string) {
    const resposta = await request(app)
        .post('/trips')
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'Férias no Chile',
            destination: 'Santiago',
            start_date: '2026-03-15',
            end_date: '2026-03-22',
        });



    return resposta.body;
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


describe('GET /trips/:id', () => {
    it('retorna 200 com a viagem do próprio usuário', async () => {
        const token = await criarUsuarioEObterToken('ana@test.com');
        const viagem = await criarViagem(token)

        const resposta = await request(app)
            .get(`/trips/${viagem.id}`)
            .set('Authorization', `Bearer ${token}`);


        expect(resposta.status).toBe(200)
        expect(resposta.body.id).toBe(viagem.id);
        expect(resposta.body.title).toBe('Férias no Chile')

    })


    it('retorna 404 com a viagem de outro usuário', async () => {
        const tokenErika = await criarUsuarioEObterToken('erika@test.com')
        const viagem = await criarViagem(tokenErika)

        const tokenDoug = await criarUsuarioEObterToken('doug@test.com')

        const respost = await request(app)
            .get(`/trips/${viagem.id}`)
            .set('authorization', `Bearer ${tokenDoug}`)


        expect(respost.status).toBe(404)


    })


    it('retorna 404 para id inexistente', async () => {
        const token = await criarUsuarioEObterToken('erika@test.com')

        const resposta = await request(app)
            .get('/trips/00000000-0000-0000-0000-000000000000')
            .set('authorization', `Bearer ${token}`)



        expect(resposta.status).toBe(404)
        expect(resposta.body).toEqual({ error: 'Viagem não encontrada' });

    })


    it('retorna 404 para id mal formado', async () => {
        const token = await criarUsuarioEObterToken('erika@test.com')
        const resposta = await request(app)
            .get('/trips/banana')
            .set('authorization', `Bearer ${token}`)


        expect(resposta.status).toBe(404)
        expect(resposta.body).toEqual({ error: 'Viagem não encontrada' });
    })

    it('retorna 401 para solicitação sem token', async () => {
        const resposta = await request(app)
            .get('/trips/banana')
            .set('authorization', `Bearer `)

        expect(resposta.status).toBe(401)
        expect(resposta.body).toEqual({ error: 'Token inválido ou expirado' })
    })
})

describe('PATCH /trips/:id', () => {
    it('altera só o título e mantém os outros campos', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');
        const viagem = await criarViagem(token);

        const resposta = await request(app)
            .patch(`/trips/${viagem.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Férias no Chile e Argentina' });

        expect(resposta.status).toBe(200);
        expect(resposta.body.title).toBe('Férias no Chile e Argentina');
        expect(resposta.body.destination).toBe(viagem.destination);
        expect(resposta.body.startDate).toBe(viagem.startDate);
        expect(resposta.body.endDate).toBe(viagem.endDate);
    });

    it('retorna 400 quando só a data de fim é enviada e fica antes do início salvo', async () => {
        const token = await criarUsuarioEObterToken('erika@test.com')
        const viagem = await criarViagem(token)

        const resposta = await request(app)
            .patch(`/trips/${viagem.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ end_date: '2026-02-15' });


        expect(resposta.status).toBe(400)
        expect(resposta.body.fields).toHaveProperty('end_date');
    })


    it('retorna 400 quando as duas datas chegam trocadas', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');
        const viagem = await criarViagem(token);

        const resposta = await request(app)
            .patch(`/trips/${viagem.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ start_date: '2026-04-10', end_date: '2026-04-01' });

        expect(resposta.status).toBe(400);
        expect(resposta.body.fields).toHaveProperty('end_date');
    });


    it('retorna 400 com corpo vazio', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');
        const viagem = await criarViagem(token);

        const resposta = await request(app)
            .patch(`/trips/${viagem.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({});

        expect(resposta.status).toBe(400);
        expect(resposta.body.error).toBe('Envie ao menos um campo para atualizar');
    });

    it('retorna 404 ao editar viagem de outro usuário e não altera a viagem', async () => {
        const tokenAna = await criarUsuarioEObterToken('ana@teste.com');
        const viagemAna = await criarViagem(tokenAna);
        const tokenBruno = await criarUsuarioEObterToken('bruno@teste.com');

        const resposta = await request(app)
            .patch(`/trips/${viagemAna.id}`)
            .set('Authorization', `Bearer ${tokenBruno}`)
            .send({ title: 'Viagem do Bruno agora' });

        expect(resposta.status).toBe(404);
        expect(resposta.body).toEqual({ error: 'Viagem não encontrada' });

        const busca = await request(app)
            .get(`/trips/${viagemAna.id}`)
            .set('Authorization', `Bearer ${tokenAna}`);

        expect(busca.body.title).toBe(viagemAna.title);
    });
    it('retorna 404 para id inexistente', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');

        const resposta = await request(app)
            .patch('/trips/00000000-0000-0000-0000-000000000000')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Não existe' });

        expect(resposta.status).toBe(404);
        expect(resposta.body).toEqual({ error: 'Viagem não encontrada' });
    });
    it('retorna 404 para id malformado', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');

        const resposta = await request(app)
            .patch('/trips/banana')
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Id malformado' });

        expect(resposta.status).toBe(404);
        expect(resposta.body).toEqual({ error: 'Viagem não encontrada' });
    });
    it('retorna 401 sem token', async () => {
        const resposta = await request(app)
            .patch('/trips/00000000-0000-0000-0000-000000000000')
            .send({ title: 'Sem token' });

        expect(resposta.status).toBe(401);
    });
});

describe('DELETE /trips/:id', () => {
    it('retorna 204 e remove a viagem', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');
        const viagem = await criarViagem(token);

        const resposta = await request(app)
            .delete(`/trips/${viagem.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).toBe(204);
        expect(resposta.body).toEqual({});

        const busca = await request(app)
            .get(`/trips/${viagem.id}`)
            .set('Authorization', `Bearer ${token}`);

        expect(busca.status).toBe(404);
    });

    it('retorna 404 ao excluir viagem de outro usuário e mantém a viagem', async () => {
        const tokenAna = await criarUsuarioEObterToken('ana@teste.com');
        const viagemAna = await criarViagem(tokenAna);
        const tokenBruno = await criarUsuarioEObterToken('bruno@teste.com');

        const resposta = await request(app)
            .delete(`/trips/${viagemAna.id}`)
            .set('Authorization', `Bearer ${tokenBruno}`);

        expect(resposta.status).toBe(404);
        expect(resposta.body).toEqual({ error: 'Viagem não encontrada' });

        const busca = await request(app)
            .get(`/trips/${viagemAna.id}`)
            .set('Authorization', `Bearer ${tokenAna}`);

        expect(busca.status).toBe(200);
    });

    it('retorna 404 para id inexistente', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');

        const resposta = await request(app)
            .delete('/trips/00000000-0000-0000-0000-000000000000')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).toBe(404);
        expect(resposta.body).toEqual({ error: 'Viagem não encontrada' });
    });

    it('retorna 404 para id malformado', async () => {
        const token = await criarUsuarioEObterToken('ana@teste.com');

        const resposta = await request(app)
            .delete('/trips/banana')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).toBe(404);
        expect(resposta.body).toEqual({ error: 'Viagem não encontrada' });
    });

    it('retorna 401 sem token', async () => {
        const resposta = await request(app).delete(
            '/trips/00000000-0000-0000-0000-000000000000'
        );

        expect(resposta.status).toBe(401);
    });
});