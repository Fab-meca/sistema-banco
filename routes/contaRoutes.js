const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir,
} = require("../controllers/contaController");

//rotas q existem p deixar loguado
router.post("/contas", authenticateToken, criar);
router.get("/contas", authenticateToken, listar);
router.get("/contas/:id", authenticateToken, buscarPorId);
router.put("/contas/:id", authenticateToken, atualizar);
router.delete("/contas/:id", authenticateToken, excluir);

module.exports = router;