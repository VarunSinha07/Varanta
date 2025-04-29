/*
  Warnings:

  - Added the required column `accountId` to the `loan_application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "loan_application" ADD COLUMN     "accountId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "loan_application" ADD CONSTRAINT "loan_application_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "bank_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
