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
├── migrations/
├── requests/
├── web/
│   └── src/
│       ├── pages/
│       │   ├── SignUp.tsx
│       │   ├── Login.tsx
│       │   └── Dashboard.tsx
│       ├── features/
│       │   └── auth/
│       ├── services/
│       │   └── api.ts
│       └── App.tsx
├── docker-compose.yml
├── tsconfig.json
└── README.md
```

## Roadmap

- [x] Tela de login no front-end
- [ ] Rotas protegidas no front-end
- [ ] CRUD de viagens
- [ ] Grupos e convites
- [ ] Itinerário
- [ ] Colaboração em tempo real
- [ ] Camada de IA

## Licença

Projeto pessoal de portfólio.