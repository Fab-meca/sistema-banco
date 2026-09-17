-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "contas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacoes" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contaId" INTEGER NOT NULL,

    CONSTRAINT "transacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_conjuntas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "saldo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contas_conjuntas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_conjuntas_contas" (
    "id" SERIAL NOT NULL,
    "contaId" INTEGER NOT NULL,
    "contaConjuntaId" INTEGER NOT NULL,

    CONSTRAINT "contas_conjuntas_contas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contas_numero_key" ON "contas"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "contas_usuarioId_key" ON "contas"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "contas_conjuntas_contas_contaId_contaConjuntaId_key" ON "contas_conjuntas_contas"("contaId", "contaConjuntaId");

-- AddForeignKey
ALTER TABLE "contas" ADD CONSTRAINT "contas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "contas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_conjuntas_contas" ADD CONSTRAINT "contas_conjuntas_contas_contaId_fkey" FOREIGN KEY ("contaId") REFERENCES "contas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_conjuntas_contas" ADD CONSTRAINT "contas_conjuntas_contas_contaConjuntaId_fkey" FOREIGN KEY ("contaConjuntaId") REFERENCES "contas_conjuntas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
