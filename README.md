Sistema de Banco desenvolvido para a disciplina de Bac-Eend do IFRS Campus Rio Grande, usando Node.js, Express, Prisma e PostgreSQL (Neon).

Programas usados: Node.js, Express, Prisma ORM, PostgreSQL (Neon), JWT, Bcrypt

Instruções para instalação:

```bash
git clone https://github.com/Fab-meca/sistema-banco.git
cd sistema-banco
npm install
```

Variáveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://usuario:senha@host/database"
JWT_SECRET="uma_chave_secreta"
PORT=3000
```

Migrações

```bash
npx prisma migrate dev
node server.js
```

Modelagem

- **Usuario** ↔ **Conta**: 1:1
- **Conta** ↔ **Transacao**: 1:N
- **Conta** ↔ **ContaConjunta**: N:N (via tabela pivot)
- Regra de negócio: não permite saldo negativo em saque/transferência

Rotas da API

| Método | Rota | Descrição |
|---|---|---|
| POST | /register | Cadastro de usuário |
| POST | /login | Login |
| GET/POST/PUT/DELETE | /contas | CRUD de contas |
| GET/POST/DELETE | /transacoes | Depósito, saque, transferência |
| GET/POST/PUT/DELETE | /contas-conjuntas | CRUD de contas conjuntas (N:N) |

`GET /contas-conjuntas/:id` faz join de 3+ tabelas (ContaConjunta + Conta + Usuario), servindo como consulta avançada.

Para testes use a extensão Thunder Client do VS Code



Por Fabrício Santos
