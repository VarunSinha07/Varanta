/*
  Warnings:

  - A unique constraint covering the columns `[panNumber]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[aadharNumber]` on the table `customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "bank_account" ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "pin" TEXT;

-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "aadharNumber" TEXT,
ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "panNumber" TEXT;

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "reason" TEXT,
ADD COLUMN     "receiverAccountId" INTEGER;

-- CreateTable
CREATE TABLE "loan_application" (
    "id" SERIAL NOT NULL,
    "loanId" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "interestRate" DECIMAL(65,30) NOT NULL,
    "duration" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loan_application_loanId_key" ON "loan_application"("loanId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_panNumber_key" ON "customer"("panNumber");

-- CreateIndex
CREATE UNIQUE INDEX "customer_aadharNumber_key" ON "customer"("aadharNumber");

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_receiverAccountId_fkey" FOREIGN KEY ("receiverAccountId") REFERENCES "bank_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_application" ADD CONSTRAINT "loan_application_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
