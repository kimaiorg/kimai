-- CreateEnum
CREATE TYPE "RequestTimesheetStatus" AS ENUM ('PROCESSING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "timesheets" ADD COLUMN     "request_status" "RequestTimesheetStatus" NOT NULL DEFAULT 'PROCESSING';
