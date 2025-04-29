-- AlterTable
ALTER TABLE "loan" ADD COLUMN     "accountId" INTEGER,
ADD COLUMN     "purpose" TEXT;

-- AddForeignKey
ALTER TABLE "loan" ADD CONSTRAINT "loan_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "bank_account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
