/*
  Warnings:

  - Added the required column `balanceAfter` to the `Debit` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `amount` on the `Debit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Debit" ADD COLUMN     "balanceAfter" MONEY NOT NULL,
DROP COLUMN "amount",
ADD COLUMN     "amount" MONEY NOT NULL;
