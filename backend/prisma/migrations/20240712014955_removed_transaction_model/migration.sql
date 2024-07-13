/*
  Warnings:

  - You are about to drop the column `currency` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currencyCode` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "AccountStatus" ADD VALUE 'Inactive';

-- AlterEnum
ALTER TYPE "AccountType" ADD VALUE 'Domiciliary';

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountNumber_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "currency",
ADD COLUMN     "currencyCode" TEXT NOT NULL;

-- DropTable
DROP TABLE "Transaction";

-- DropEnum
DROP TYPE "TransactionType";
