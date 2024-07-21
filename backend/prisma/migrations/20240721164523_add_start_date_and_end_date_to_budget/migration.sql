/*
  Warnings:

  - The values [Cancelled] on the enum `BudgetStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `startDate` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BudgetStatus_new" AS ENUM ('Active', 'Paused', 'Completed');
ALTER TABLE "Budget" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Budget" ALTER COLUMN "status" TYPE "BudgetStatus_new" USING ("status"::text::"BudgetStatus_new");
ALTER TYPE "BudgetStatus" RENAME TO "BudgetStatus_old";
ALTER TYPE "BudgetStatus_new" RENAME TO "BudgetStatus";
DROP TYPE "BudgetStatus_old";
ALTER TABLE "Budget" ALTER COLUMN "status" SET DEFAULT 'Active';
COMMIT;

-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "endDate" DATE,
ADD COLUMN     "startDate" DATE NOT NULL;
