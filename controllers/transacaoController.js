const prisma = require("../config/prisma");

async function criar(req, res) {
  try {
    const { tipo, valor, contaId } = req.body;

    if (!tipo || !valor || !contaId) {
      return res.status(400).json({ erro: "Tipo, valor e contaId são obrigatórios." });
    }

    const conta = await prisma.conta.findUnique({ where: { id: Number(contaId) } });
    if (!conta) {
      return res.status(404).json({ erro: "Conta não encontrada." });
    }

    // Regra de negócio: não permitir saldo negativo em saque/transferência
    if ((tipo === "saque" || tipo === "transferencia") && conta.saldo < valor) {
      return res.status(400).json({ erro: "Saldo insuficiente para essa operação." });
    }

    const novoSaldo =
      tipo === "deposito" ? conta.saldo + valor : conta.saldo - valor;

    const [transacao] = await prisma.$transaction([
      prisma.transacao.create({
        data: { tipo, valor, contaId: Number(contaId) },
      }),
      prisma.conta.update({
        where: { id: Number(contaId) },
        data: { saldo: novoSaldo },
      }),
    ]);

    return res.status(201).json(transacao);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao criar transação." });
  }
}

async function listar(req, res) {
  try {
    const transacoes = await prisma.transacao.findMany();
    return res.json(transacoes);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao listar transações." });
  }
}

async function buscarPorId(req, res) {
  try {
    const transacao = await prisma.transacao.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!transacao) {
      return res.status(404).json({ erro: "Transação não encontrada." });
    }
    return res.json(transacao);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao buscar transação." });
  }
}

async function excluir(req, res) {
  try {
    await prisma.transacao.delete({ where: { id: Number(req.params.id) } });
    return res.status(204).send();
  } catch (erro) {
    console.error(erro);
    return res.status(404).json({ erro: "Transação não encontrada." });
  }
}

module.exports = { criar, listar, buscarPorId, excluir };