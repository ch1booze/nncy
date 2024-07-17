/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountNumber_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "TransactionType";

-- CreateTable
CREATE TABLE "Debit" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "transferAccountNumber" CHAR(10) NOT NULL,
    "transferAccountName" TEXT NOT NULL,
    "transferBankCode" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "accountNumber" CHAR(10) NOT NULL,

    CONSTRAINT "Debit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Debit" ADD CONSTRAINT "Debit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Debit" ADD CONSTRAINT "Debit_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "Account"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
