-- CreateTable
CREATE TABLE "statement_request" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'PDF',
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "statement_request_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "statement_request" ADD CONSTRAINT "statement_request_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "statement_request" ADD CONSTRAINT "statement_request_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "bank_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
