/*
  Warnings:

  - A unique constraint covering the columns `[bvn]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bvn" TEXT,
ADD COLUMN     "dataOfBirth" DATE,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "gender" "Gender";

-- CreateIndex
CREATE UNIQUE INDEX "User_bvn_key" ON "User"("bvn");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
