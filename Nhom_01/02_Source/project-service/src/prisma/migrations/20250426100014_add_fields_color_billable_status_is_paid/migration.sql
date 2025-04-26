-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "color" TEXT;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "billable" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "is_paid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quantity" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PROCESSING';
