# Roteirize API

Back-end do Roteirize, um app colaborativo de planejamento de viagens em grupo.

> **Status:** em desenvolvimento inicial. Apenas o esqueleto do servidor está implementado.

## Stack

- Node.js 20+
- TypeScript
- Express
- tsx (execução e hot-reload em desenvolvimento)

## Pré-requisitos

- Node.js 20 ou superior ([download](https://nodejs.org))
- npm (incluído no Node)

## Como rodar

Clonar o repositório e entrar na pasta:

```bash
git clone https://github.com/SEU_USUARIO/roteirize-api.git
cd roteirize-api
```

Instalar dependências:

```bash
npm install
```

Subir o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`.

## Endpoints disponíveis

| Método | Rota      | Descrição                                |
| ------ | --------- | ---------------------------------------- |
| GET    | `/health` | Verifica se o servidor está respondendo. |

Exemplo:

```bash
curl http://localhost:3001/health
```

Resposta esperada:

```json
{ "status": "ok" }
```

## Estrutura do projeto

```
roteirize-api/
├── src/
│   └── server.ts       # ponto de entrada do servidor
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Roadmap próximo

- [ ] Integração com Postgres via Docker e Prisma
- [ ] Cadastro de usuário (`POST /users`)
- [ ] Autenticação com JWT
- [ ] Gestão de viagens

## Licença

Projeto pessoal de portfólio.