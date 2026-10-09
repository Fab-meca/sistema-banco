# Sistema de Banco

Sistema de Banco desenvolvido para a disciplina de Backend do IFRS Campus Rio Grande, usando Node.js, Express, Prisma e PostgreSQL (Neon), com frontend em React.

## Programas usados

Node.js, Express, Prisma ORM, PostgreSQL (Neon), JWT, Bcrypt, React + Vite

## Instruções para instalação

```bash
git clone https://github.com/Fab-meca/sistema-banco.git
cd sistema-banco
npm install
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://usuario:senha@host/database"
JWT_SECRET="uma_chave_secreta"
PORT=3000
```

## Migrações e backend

```bash
npx prisma migrate dev
npx prisma generate
node server.js
```

A API fica em `http://localhost:3000`.

## Frontend

Em outro terminal:

```bash
cd frontend/JWT_NEON_FRONTEND_BACKEND-main/frontend
npm install
npm run dev
```

O site fica em `http://localhost:5173`. Por ele dá para cadastrar, fazer login, criar conta, depositar, sacar e transferir.

## Modelagem

- **Usuario** ↔ **Conta**: 1:1
- **Conta** ↔ **Transacao**: 1:N (a transação guarda a conta de origem e, nas transferências, a conta de destino)
- **Conta** ↔ **ContaConjunta**: N:N (via tabela pivot)
- Regra de negócio: não permite saldo negativo em saque/transferência

## Autenticação

Todas as rotas, exceto `/register` e `/login`, exigem o token recebido no login:

```
Authorization: Bearer SEU_TOKEN
```

Cada usuário só enxerga as próprias contas e transações.

## Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| POST | /register | Cadastro de usuário |
| POST | /login | Login |
| GET/POST/PUT/DELETE | /contas | CRUD de contas |
| GET/POST/DELETE | /transacoes | Depósito, saque e transferência |
| GET/POST/PUT/DELETE | /contas-conjuntas | CRUD de contas conjuntas (N:N) |

Em `POST /transacoes`, o campo `tipo` pode ser `deposito`, `saque` ou `transferencia`. Na transferência, envie também `numeroDestino` (número da conta que recebe).

`GET /contas-conjuntas/:id` faz join de 3+ tabelas (ContaConjunta + Conta + Usuario), servindo como consulta avançada.

## Testes

Pelo próprio site, ou com a extensão Thunder Client do VS Code para testar a API direto.

Por Fabrício Santos e Théo Gibbon
