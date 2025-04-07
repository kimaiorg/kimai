-- AlterTable
ALTER TABLE "timesheets" ADD COLUMN     "activity_id" TEXT,
ADD COLUMN     "project_id" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'running',
ADD COLUMN     "task_id" TEXT,
ADD COLUMN     "username" TEXT;
