/*
  Warnings:

  - You are about to drop the column `endDate` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Budget` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "endDate",
DROP COLUMN "startDate",
ALTER COLUMN "spentAmount" SET DEFAULT 0,
ALTER COLUMN "refreshCycle" DROP NOT NULL,
ALTER COLUMN "currentCycleEndDate" DROP NOT NULL;
