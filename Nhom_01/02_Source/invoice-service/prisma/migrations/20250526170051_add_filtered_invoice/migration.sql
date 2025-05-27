/*
  Warnings:

  - A unique constraint covering the columns `[filteredInvoiceId]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "filteredInvoiceId" INTEGER;

-- CreateTable
CREATE TABLE "FilteredInvoice" (
    "id" SERIAL NOT NULL,
    "filterHash" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "projectId" INTEGER,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "activities" INTEGER[],
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 10,
    "taxPrice" DECIMAL(10,2) NOT NULL,
    "finalPrice" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isSaved" BOOLEAN NOT NULL DEFAULT false,
    "filterData" JSONB NOT NULL,
    "responseData" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilteredInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FilteredInvoice_filterHash_key" ON "FilteredInvoice"("filterHash");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_filteredInvoiceId_key" ON "Invoice"("filteredInvoiceId");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_filteredInvoiceId_fkey" FOREIGN KEY ("filteredInvoiceId") REFERENCES "FilteredInvoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
