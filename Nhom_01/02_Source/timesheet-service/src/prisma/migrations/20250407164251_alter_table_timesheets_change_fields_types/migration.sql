/*
  Warnings:

  - The `activity_id` column on the `timesheets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `project_id` column on the `timesheets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `task_id` column on the `timesheets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "timesheets" DROP COLUMN "activity_id",
ADD COLUMN     "activity_id" INTEGER,
DROP COLUMN "project_id",
ADD COLUMN     "project_id" INTEGER,
DROP COLUMN "task_id",
ADD COLUMN     "task_id" INTEGER;
