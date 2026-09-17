const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ erro: "Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
    if (erro) {
      return res.status(401).json({ erro: "Token inválido ou expirado." });
    }
    req.usuario = usuario;
    next();
  });
}

module.exports = authenticateToken;