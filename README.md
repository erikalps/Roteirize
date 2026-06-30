# Roteirize

App colaborativo de planejamento de viagens em grupo.

> **Status:** em desenvolvimento inicial. Cadastro, login e autenticação implementados.

## Stack

**Back-end:** Node.js 20+ · TypeScript · Express · PostgreSQL 16 · JWT · bcrypt · Zod v4

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

Instalar dependências e rodar o back-end:

```bash
npm install
npm run dev
```

Instalar dependências e rodar o front-end:

```bash
cd web
npm install
npm run dev
```

Back-end em `http://localhost:3001`, front-end em `http://localhost:5173`.

## Endpoints disponíveis

| Método | Rota         | Autenticação | Descrição                          |
| ------ | ------------ | ------------ | ---------------------------------- |
| GET    | `/health`    | Não          | Verifica servidor e conexão com DB |
| POST   | `/users`     | Não          | Cadastro de usuário                |
| POST   | `/auth/login`| Não          | Login (retorna JWT)                |
| GET    | `/auth/me`   | Sim          | Dados do usuário autenticado       |

## Estrutura do projeto
Roteirize/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── middlewares/
│   │   ├── validate.ts
│   │   └── authenticate.ts
│   ├── routes/
│   │   ├── users.ts
│   │   └── auth.ts
│   ├── schemas/
│   │   ├── userSchema.ts
│   │   └── authSchema.ts
│   ├── types/
│   │   └── express.d.ts
│   └── server.ts
├── web/
│   └── src/
│       ├── pages/
│       │   └── SignUp.tsx
│       ├── services/
│       │   └── api.ts
│       └── App.tsx
├── docker-compose.yml
├── tsconfig.json
└── README.md

## Roadmap

- [ ] Tela de login no front-end
- [ ] Rotas protegidas no front-end
- [ ] CRUD de viagens
- [ ] Grupos e convites
- [ ] Itinerário
- [ ] Colaboração em tempo real
- [ ] Camada de IA

## Licença

Projeto pessoal de portfólio.