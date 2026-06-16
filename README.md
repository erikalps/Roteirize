# Roteirize

App colaborativo de planejamento de viagens em grupo. Permite criar viagens, convidar pessoas, montar roteiros em conjunto e tomar decisões em grupo sobre atividades.

> **Status:** em desenvolvimento. Fluxo de cadastro de usuário implementado ponta-a-ponta. Próxima entrega: login.

## Estrutura do repositório

Monorepo com back-end na raiz e front-end em `web/`.

```
roteirize/
├── src/                # back-end (Express + TypeScript)
│   ├── config/         # configuração de conexão com o banco
│   ├── middlewares/    # middlewares Express (ex: validação)
│   ├── routes/         # endpoints HTTP
│   ├── schemas/        # schemas Zod de validação
│   └── server.ts       # ponto de entrada
├── migrations/         # migrations SQL manuais
├── requests/           # arquivos .http para teste manual
├── web/                # front-end (React + Vite)
│   ├── src/
│   │   ├── pages/      # componentes de tela
│   │   ├── services/   # cliente HTTP (axios)
│   │   └── main.tsx
│   └── .env.example
├── docker-compose.yml
├── .env.example
└── package.json
```

## Stack

**Back-end**
- Node.js 20+
- TypeScript
- Express
- PostgreSQL 16 (via Docker)
- `pg` (driver SQL puro, sem ORM)
- bcrypt (hash de senhas)
- Zod (validação de entrada)

**Front-end**
- React 18
- TypeScript
- Vite
- React Router
- axios

## Pré-requisitos

- Node.js 20 ou superior ([download](https://nodejs.org))
- Docker e Docker Compose ([download](https://www.docker.com))

## Como rodar

### 1. Clonar e instalar dependências

```bash
git clone https://github.com/SEU_USUARIO/roteirize.git
cd roteirize
npm install
cd web && npm install && cd ..
```

### 2. Configurar variáveis de ambiente

Na raiz:

```bash
cp .env.example .env
```

Em `web/`:

```bash
cp web/.env.example web/.env
```

### 3. Subir o banco de dados

```bash
docker compose up -d
```

Confirma que o container subiu:

```bash
docker ps
```

### 4. Rodar as migrations

```bash
docker exec -i roteirize-db psql -U postgres -d roteirize < migrations/001_create_users.sql
```

### 5. Subir o back-end

```bash
npm run dev
```

O back estará em `http://localhost:3001`.

### 6. Subir o front-end

Em outro terminal:

```bash
cd web
npm run dev
```

O front estará em `http://localhost:5173`.

## Endpoints disponíveis

| Método | Rota      | Descrição                                       | Auth |
| ------ | --------- | ----------------------------------------------- | ---- |
| GET    | `/health` | Verifica se o servidor está respondendo.        | —    |
| POST   | `/users`  | Cria um novo usuário com nome, email e senha.   | —    |

Exemplos de uso estão em `requests/users.http`.

## Funcionalidades implementadas

- [x] Esqueleto do servidor com `/health`
- [x] Banco PostgreSQL local via Docker
- [x] Tabela `users` com SQL puro
- [x] Cadastro de usuário com hash de senha (bcrypt)
- [x] Validação de entrada com Zod
- [x] Tela de cadastro no front-end com validação client-side
- [x] Integração front-back via axios

## Roadmap próximo

- [ ] Autenticação com JWT (login e proteção de rotas)
- [ ] Tela de login no front-end
- [ ] Criação e gestão de viagens
- [ ] Convites de pessoas para uma viagem
- [ ] Roteiro com atividades por dia
- [ ] Colaboração em tempo real (presença, locks, chat)
- [ ] Sugestões com IA

## Decisões de arquitetura

- **Monorepo:** back-end e front-end no mesmo repositório para simplificar gestão de issues e versionamento conjunto em fase inicial.
- **`pg` em vez de ORM:** escolha pedagógica para construir entendimento mais profundo de SQL e do funcionamento de drivers de banco. Pode ser revisitada quando o número de queries crescer.
- **JWT em localStorage:** simplicidade adequada à fase de portfólio. Trade-off conhecido: vulnerabilidade a XSS. Alternativa mais segura (httpOnly cookie + refresh token) registrada como melhoria futura.

## Licença

Projeto pessoal de portfólio.