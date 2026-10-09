-- AlterTable
ALTER TABLE "transacoes" ADD COLUMN     "contaDestinoId" INTEGER;

-- AddForeignKey
ALTER TABLE "transacoes" ADD CONSTRAINT "transacoes_contaDestinoId_fkey" FOREIGN KEY ("contaDestinoId") REFERENCES "contas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
