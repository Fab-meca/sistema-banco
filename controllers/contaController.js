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
    const contas = await prisma.conta.findMany({
      where: { usuarioId: req.usuario.id },
    });
    return res.json(contas);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao listar contas." });
  }
}

async function buscarPorId(req, res) {
  try {
    const conta = await prisma.conta.findFirst({
      where: { id: Number(req.params.id), usuarioId: req.usuario.id },
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

    if (!numero) {
      return res.status(400).json({ erro: "O número da conta é obrigatório." });
    }

    const conta = await prisma.conta.findFirst({
      where: { id: Number(req.params.id), usuarioId: req.usuario.id },
    });

    if (!conta) {
      return res.status(404).json({ erro: "Conta não encontrada." });
    }

    const atualizada = await prisma.conta.update({
      where: { id: conta.id },
      data: { numero },
    });

    return res.json(atualizada);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao atualizar conta." });
  }
}

async function excluir(req, res) {
  try {
    const conta = await prisma.conta.findFirst({
      where: { id: Number(req.params.id), usuarioId: req.usuario.id },
    });

    if (!conta) {
      return res.status(404).json({ erro: "Conta não encontrada." });
    }

    await prisma.$transaction([
      prisma.transacao.updateMany({
      where: { contaDestinoId: conta.id },
      data: { contaDestinoId: null },
      }),
      prisma.transacao.deleteMany({ where: { contaId: conta.id } }),
      prisma.contaConjuntaConta.deleteMany({ where: { contaId: conta.id } }),
      prisma.conta.delete({ where: { id: conta.id } }),
    ]);

    return res.status(204).send();
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao excluir conta." });
  }
}

module.exports = { criar, listar, buscarPorId, atualizar, excluir };