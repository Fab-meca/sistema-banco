require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const contaRoutes = require("./routes/contaRoutes");
const transacaoRoutes = require("./routes/transacaoRoutes");
const contaConjuntaRoutes = require("./routes/contaConjuntaRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/", contaRoutes);
app.use("/", transacaoRoutes);
app.use("/", contaConjuntaRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});