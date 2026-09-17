const prisma = require("../config/prisma");


async function criar(req, res) {
  try {
    const { numero } = req.body;

    if (!numero) {
      return res.status(400).json({ erro: "O número da conta é obrigatório." });
    }

    const contaExistente = await prisma.conta.findUnique({
      where: { usuarioId: req.usuario.id },
    });
    if (contaExistente) {
      return res.status(400).json({ erro: "Este usuário já possui uma conta." });
    }

    const conta = await prisma.conta.create({
      data: {
        numero,
        usuarioId: req.usuario.id,
      },
    });

    return res.status(201).json(conta);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao criar conta." });
  }
}

async function listar(req, res) {
  try {
    const contas = await prisma.conta.findMany();
    return res.json(contas);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao listar contas." });
  }
}


async function buscarPorId(req, res) {
  try {
    const conta = await prisma.conta.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!conta) {
      return res.status(404).json({ erro: "Conta não encontrada." });
    }

    return res.json(conta);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao buscar conta." });
  }
}


async function atualizar(req, res) {
  try {
    const { numero } = req.body;

    const conta = await prisma.conta.update({
      where: { id: Number(req.params.id) },
      data: { numero },
    });

    return res.json(conta);
  } catch (erro) {
    console.error(erro);
    return res.status(404).json({ erro: "Conta não encontrada." });
  }
}


async function excluir(req, res) {
  try {
    await prisma.conta.delete({
      where: { id: Number(req.params.id) },
    });

    return res.status(204).send();
  } catch (erro) {
    console.error(erro);
    return res.status(404).json({ erro: "Conta não encontrada." });
  }
}

module.exports = { criar, listar, buscarPorId, atualizar, excluir };