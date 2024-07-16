/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `Account` table. All the data in the column will be lost.
  - You are about to alter the column `number` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(10)`.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Credit', 'Debit');

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "phoneNumber",
ADD COLUMN     "phone" CHAR(13),
ALTER COLUMN "number" SET DATA TYPE CHAR(10);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phone" CHAR(13);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "accountNumber" CHAR(10) NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountNumber_fkey" FOREIGN KEY ("accountNumber") REFERENCES "Account"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
