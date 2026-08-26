# Roteirize

![CI](https://github.com/erikalps/Roteirize/actions/workflows/ci.yml/badge.svg)

App colaborativo de planejamento de viagens em grupo.

**Acesse:** https://roteirize-ten.vercel.app

> O primeiro acesso pode levar até um minuto. A API roda no plano gratuito do Render, que suspende o serviço depois de 15 minutos sem uso. As telas de login e cadastro avisam quando isso acontece.

> **Status:** em desenvolvimento. Cadastro, login, autenticação e rotas protegidas implementados.

## Onde cada parte roda

| Parte | Serviço |
| --- | --- |
| Front-end | Vercel |
| API | Render |
| Banco de dados | Neon (PostgreSQL) |

Cada push na `main` dispara um deploy novo nos dois serviços.

## Stack

**Back-end:** Node.js 20+ · TypeScript · Express · PostgreSQL 16 · JWT · bcrypt · Zod v4 · Vitest

**Front-end:** React · Vite · TypeScript · Axios · React Router

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose

## Como rodar

Clonar o repositório:

```bash
git clone https://github.com/erikalps/Roteirize.git
cd Roteirize
```

Subir o banco de dados:

```bash
docker compose up -d
```

Configurar variáveis de ambiente:

```bash
cp .env.example .env
```

Instalar dependências:

```bash
npm install
```

Criar o schema do banco:

```bash
npm run migrate:up
```

Rodar o back-end:

```bash
npm run dev
```

Configurar variáveis de ambiente do front-end:

```bash
cd web
cp .env.example .env
```

Instalar dependências e rodar o front-end:

```bash
npm install
npm run dev
```

Back-end em `http://localhost:3001`, front-end em `http://localhost:5173`.

## Como rodar os testes

Os testes usam um banco separado (`roteirize_test`) para não afetar os dados de desenvolvimento. O `tests/setup.ts` recusa rodar em qualquer banco cujo nome não termine em `_test`.

Com o Docker rodando, crie o banco de teste:

```bash
docker compose exec postgres psql -U postgres -c "CREATE DATABASE roteirize_test;"
```

Crie o arquivo `.env.test` na raiz, apontando para esse banco:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/roteirize_test
JWT_SECRET=qualquer-valor-para-testes
CORS_ORIGIN=http://localhost:5173
```

Aplique as migrations no banco de teste:

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/roteirize_test npm run migrate:up
```

Rodar os testes:

```bash
npm test              # roda uma vez
npm run test:watch    # reexecuta a cada alteração
npm run test:coverage # gera relatório de cobertura
```

## Endpoints disponíveis

| Método | Rota         | Autenticação | Descrição                          |
| ------ | ------------ | ------------ | ---------------------------------- |
| GET    | `/health`    | Não          | Verifica servidor e conexão com DB |
| POST   | `/users`     | Não          | Cadastro de usuário                |
| POST   | `/auth/login`| Não          | Login (retorna JWT)                |
| GET    | `/auth/me`   | Sim          | Dados do usuário autenticado       |

## Banco de dados

O schema é gerenciado por migrations com [node-pg-migrate](https://github.com/salsita/node-pg-migrate). Os arquivos ficam em `migrations/`, em SQL puro, com as seções separadas pelos marcadores `-- Up Migration` e `-- Down Migration`.

```bash
npm run migrate:up              # aplica as migrations pendentes
npm run migrate:down            # desfaz a última migration
npm run migrate:create nome-da-migration   # gera um novo arquivo .sql em migrations/
```

O runner registra o que já foi aplicado na tabela `pgmigrations`, criada por ele no primeiro `migrate:up`. Ela é controle interno da ferramenta e não deve ser consultada nem alterada pela aplicação.

Migration já aplicada nunca é editada — qualquer mudança de schema entra como uma migration nova.

## Estrutura do projeto

```
Roteirize/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   └── env.ts
│   ├── middlewares/
│   │   ├── authenticate.ts
│   │   └── validate.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── users.ts
│   ├── schemas/
│   │   ├── authSchema.ts
│   │   └── userSchema.ts
│   ├── types/
│   │   └── express.d.ts
│   ├── utils/
│   │   └── db-errors.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── auth.test.ts
│   ├── health.test.ts
│   ├── setup.ts
│   └── users.test.ts
├── migrations/
├── requests/
├── web/
│   ├── src/
│   │   ├── features/
│   │   │   └── auth/
│   │   │       ├── AuthContext.tsx
│   │   │       └── ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── SignUp.tsx
│   │   │   ├── Dashboard.css
│   │   │   └── auth.css
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── utils/
│   │   │   └── validation.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vercel.json
│   └── vite.config.ts
├── docker-compose.yml
├── vitest.config.mts
├── tsconfig.json
└── README.md
```

## Roadmap

- [x] Cadastro de usuário
- [x] Login com JWT
- [x] Rotas protegidas no front-end
- [x] Testes automatizados do back-end
- [x] Deploy em produção (Vercel · Render · Neon)
- [ ] CRUD de viagens
- [ ] Grupos e convites
- [ ] Itinerário
- [ ] Colaboração em tempo real
- [ ] Camada de IA

## Licença

Projeto pessoal de portfólio.