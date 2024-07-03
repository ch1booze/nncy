/*
  Warnings:

  - The values [Inactive] on the enum `AccountStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `accountEmail` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accountOpeningDate` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `accountPhoneNumber` on the `Account` table. All the data in the column will be lost.
  - Added the required column `currencyCode` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingDate` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AccountStatus_new" AS ENUM ('Active', 'Dormant');
ALTER TABLE "Account" ALTER COLUMN "status" TYPE "AccountStatus_new" USING ("status"::text::"AccountStatus_new");
ALTER TYPE "AccountStatus" RENAME TO "AccountStatus_old";
ALTER TYPE "AccountStatus_new" RENAME TO "AccountStatus";
DROP TYPE "AccountStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "accountEmail",
DROP COLUMN "accountOpeningDate",
DROP COLUMN "accountPhoneNumber",
ADD COLUMN     "currencyCode" "CurrencyCode" NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "openingDate" DATE NOT NULL,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dateOfBirth" DATE;
