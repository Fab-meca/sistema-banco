const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  criar,
  listar,
  buscarPorId,
  excluir,
} = require("../controllers/transacaoController");

router.post("/transacoes", authenticateToken, criar);
router.get("/transacoes", authenticateToken, listar);
router.get("/transacoes/:id", authenticateToken, buscarPorId);
router.delete("/transacoes/:id", authenticateToken, excluir);

module.exports = router;