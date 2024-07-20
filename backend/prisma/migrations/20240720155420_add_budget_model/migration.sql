-- CreateEnum
CREATE TYPE "BudgetStatus" AS ENUM ('Active', 'Paused', 'Cancelled', 'Completed');

-- CreateTable
CREATE TABLE "Budget" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "totalAmount" MONEY NOT NULL,
    "spentAmount" MONEY NOT NULL,
    "status" "BudgetStatus" NOT NULL DEFAULT 'Active',
    "refreshCycle" TEXT NOT NULL,
    "currentCycleEndDate" DATE NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
