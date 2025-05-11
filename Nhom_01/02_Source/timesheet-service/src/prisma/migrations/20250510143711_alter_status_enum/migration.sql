/*
  Warnings:

  - The `status` column on the `timesheets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TimesheetStatus" AS ENUM ('NORMAL', 'PENDING', 'REJECTED');

-- AlterTable
ALTER TABLE "timesheets" DROP COLUMN "status",
ADD COLUMN     "status" "TimesheetStatus" NOT NULL DEFAULT 'PENDING';
