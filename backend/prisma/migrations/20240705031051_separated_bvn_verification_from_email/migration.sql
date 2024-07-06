/*
  Warnings:

  - The values [Domiciliary] on the enum `AccountType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `currencyCode` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `User` table. All the data in the column will be lost.
  - Added the required column `bankName` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Account` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE "Account" DROP COLUMN "currencyCode",
DROP COLUMN "name",
ADD COLUMN     "bankName" TEXT NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isVerified",
ADD COLUMN     "isBVNVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "CurrencyCode";
