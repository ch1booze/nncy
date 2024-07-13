/*
  Warnings:

  - The values [Domiciliary] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `balance` on the `Account` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('Current', 'Savings', 'Fixed');
ALTER TABLE "Account" ALTER COLUMN "type" TYPE "AccountType_new" USING ("type"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "AccountType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "balance";
