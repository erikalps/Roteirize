
# Roteirize API

Back-end do Roteirize, um app colaborativo de planejamento de viagens em grupo.

> **Status:** em desenvolvimento inicial. Servidor com conexão ao banco de dados configurada.

## Stack

- Node.js 20+
- TypeScript
- Express
- PostgreSQL 16
- pg (node-postgres)
- tsx (execução e hot-reload em desenvolvimento)
- Docker

## Pré-requisitos

- Node.js 20 ou superior ([download](https://nodejs.org))
- npm (incluído no Node)
- Docker ([download](https://docs.docker.com/get-docker))

## Como rodar

Clonar o repositório e entrar na pasta:

```bash
git clone https://github.com/erikalps/Roteirize.git
cd Roteirize
```

Instalar dependências:

```bash
npm install
```

Copiar o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

Subir o banco de dados:

```bash
docker compose up -d
```

Subir o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`.

## Endpoints disponíveis

| Método | Rota      | Descrição                                         |
| ------ | --------- | ------------------------------------------------- |
| GET    | `/health` | Verifica se o servidor e o banco estão operantes. |

Exemplo:

```bash
curl http://localhost:3001/health
```

Resposta esperada:

```json
{ "status": "ok", "db": "connected" }
```

## Estrutura do projeto

```
Roteirize/
├── src/
│   ├── config/
│   │   └── db.ts           # singleton de conexão com o banco
│   └── server.ts           # ponto de entrada do servidor
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── README.md
```

## Roadmap próximo

- [ ] Cadastro de usuário (`POST /users`)
- [ ] Autenticação com JWT
- [ ] Gestão de viagens

## Licença

Projeto pessoal de portfólio.
