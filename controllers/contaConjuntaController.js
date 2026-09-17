const prisma = require("../config/prisma");

async function criar(req, res) {
  try {
    const { nome, contaIds } = req.body;

    if (!nome || !Array.isArray(contaIds) || contaIds.length === 0) {
      return res
        .status(400)
        .json({ erro: "Nome e uma lista de contaIds (pelo menos 1) são obrigatórios." });
    }

    const contaConjunta = await prisma.contaConjunta.create({
      data: {
        nome,
        contas: {
          create: contaIds.map((id) => ({ contaId: Number(id) })),
        },
      },
      include: {
        contas: { include: { conta: true } },
      },
    });

    return res.status(201).json(contaConjunta);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao criar conta conjunta." });
  }
}

async function listar(req, res) {
  try {
    const contasConjuntas = await prisma.contaConjunta.findMany({
      include: { contas: { include: { conta: true } } },
    });
    return res.json(contasConjuntas);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao listar contas conjuntas." });
  }
}

async function buscarPorId(req, res) {
  try {
    const contaConjunta = await prisma.contaConjunta.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        contas: {
          include: {
            conta: { include: { usuario: true } },
          },
        },
      },
    });

    if (!contaConjunta) {
      return res.status(404).json({ erro: "Conta conjunta não encontrada." });
    }

    return res.json(contaConjunta);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao buscar conta conjunta." });
  }
}

async function atualizar(req, res) {
  try {
    const { nome } = req.body;

    const contaConjunta = await prisma.contaConjunta.update({
      where: { id: Number(req.params.id) },
      data: { nome },
    });

    return res.json(contaConjunta);
  } catch (erro) {
    console.error(erro);
    return res.status(404).json({ erro: "Conta conjunta não encontrada." });
  }
}

async function excluir(req, res) {
  try {
    await prisma.contaConjuntaConta.deleteMany({
      where: { contaConjuntaId: Number(req.params.id) },
    });

    await prisma.contaConjunta.delete({ where: { id: Number(req.params.id) } });

    return res.status(204).send();
  } catch (erro) {
    console.error(erro);
    return res.status(404).json({ erro: "Conta conjunta não encontrada." });
  }
}

module.exports = { criar, listar, buscarPorId, atualizar, excluir };