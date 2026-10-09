const prisma = require("../config/prisma");

const TIPOS = ["deposito", "saque", "transferencia"];

const arredonda = (n) => Math.round(n * 100) / 100;

async function criar(req, res) {
  try {
    const { tipo, contaId, numeroDestino } = req.body;
    const valor = Number(req.body.valor);

    if (!tipo || !contaId || !req.body.valor) {
      return res.status(400).json({ erro: "Tipo, valor e contaId são obrigatórios." });
    }

    if (!TIPOS.includes(tipo)) {
      return res.status(400).json({ erro: "Tipo de transação inválido." });
    }

    if (!(valor > 0)) {
      return res.status(400).json({ erro: "O valor deve ser maior que zero." });
    }

    const conta = await prisma.conta.findFirst({
      where: { id: Number(contaId), usuarioId: req.usuario.id },
    });
    if (!conta) {
      return res.status(404).json({ erro: "Conta não encontrada." });
    }

    let contaDestino = null;
    if (tipo === "transferencia") {
      if (!numeroDestino) {
        return res.status(400).json({ erro: "Informe o número da conta de destino." });
      }

      contaDestino = await prisma.conta.findUnique({
        where: { numero: String(numeroDestino).trim() },
      });
      if (!contaDestino) {
        return res.status(404).json({ erro: "Conta de destino não encontrada." });
      }
      if (contaDestino.id === conta.id) {
        return res
          .status(400)
          .json({ erro: "A conta de destino deve ser diferente da conta de origem." });
      }
    }

    if ((tipo === "saque" || tipo === "transferencia") && conta.saldo < valor) {
      return res.status(400).json({ erro: "Saldo insuficiente para essa operação." });
    }

    const novoSaldo = arredonda(
      tipo === "deposito" ? conta.saldo + valor : conta.saldo - valor
    );

    const operacoes = [
      prisma.transacao.create({
        data: {
          tipo,
          valor,
          contaId: conta.id,
          contaDestinoId: contaDestino ? contaDestino.id : null,
        },
      }),
      prisma.conta.update({
        where: { id: conta.id },
        data: { saldo: novoSaldo },
      }),
    ];

    if (contaDestino) {
      operacoes.push(
        prisma.conta.update({
          where: { id: contaDestino.id },
          data: { saldo: arredonda(contaDestino.saldo + valor) },
        })
      );
    }

    const [transacao] = await prisma.$transaction(operacoes);

    return res.status(201).json(transacao);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao criar transação." });
  }
}

async function listar(req, res) {
  try {
    const transacoes = await prisma.transacao.findMany({
      where: {
        OR: [
          { conta: { usuarioId: req.usuario.id } },
          { contaDestino: { usuarioId: req.usuario.id } },
        ],
      },
      include: {
        conta: { select: { id: true, numero: true } },
        contaDestino: { select: { id: true, numero: true } },
      },
      orderBy: { data: "desc" },
    });
    return res.json(transacoes);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao listar transações." });
  }
}

async function buscarPorId(req, res) {
  try {
    const transacao = await prisma.transacao.findFirst({
      where: {
        id: Number(req.params.id),
        OR: [
          { conta: { usuarioId: req.usuario.id } },
          { contaDestino: { usuarioId: req.usuario.id } },
        ],
      },
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
    const transacao = await prisma.transacao.findFirst({
      where: { id: Number(req.params.id), conta: { usuarioId: req.usuario.id } },
    });
    if (!transacao) {
      return res.status(404).json({ erro: "Transação não encontrada." });
    }
    await prisma.transacao.delete({ where: { id: transacao.id } });
    return res.status(204).send();
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao excluir transação." });
  }
}

module.exports = { criar, listar, buscarPorId, excluir };