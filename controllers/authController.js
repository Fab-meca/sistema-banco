const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Nome, email e senha são obrigatórios." });
    }

    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ erro: "Já existe um usuário com esse email." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash },
    });

    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao registrar usuário." });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios." });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ erro: "Email ou senha inválidos." });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Email ou senha inválidos." });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({ token });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: "Erro interno ao fazer login." });
  }
}

module.exports = { register, login };