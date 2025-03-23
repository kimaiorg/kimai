-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "vat_id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "currency" TEXT,
    "timezone" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "homepage" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);
