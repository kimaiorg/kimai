-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('START_TIMESHEET', 'CHANGE_EXPENSE_QUANTITY');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PROCESSING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "tasks" ALTER COLUMN "status" SET DEFAULT 'DOING';

-- CreateTable
CREATE TABLE "requests" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "type" "RequestType" NOT NULL,
    "status" "RequestStatus" NOT NULL,
    "target_id" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "team_id" INTEGER,
    "previous_data" JSONB,
    "request_data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
