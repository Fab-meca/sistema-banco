const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const {
  criar,
  listar,
  buscarPorId,
  atualizar,
  excluir,
} = require("../controllers/contaConjuntaController");

router.post("/contas-conjuntas", authenticateToken, criar);
router.get("/contas-conjuntas", authenticateToken, listar);
router.get("/contas-conjuntas/:id", authenticateToken, buscarPorId);
router.put("/contas-conjuntas/:id", authenticateToken, atualizar);
router.delete("/contas-conjuntas/:id", authenticateToken, excluir);

module.exports = router;