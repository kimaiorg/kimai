/*
  Warnings:

  - You are about to drop the `examples` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "examples";

-- CreateTable
CREATE TABLE "timesheets" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3),
    "duration" INTEGER,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "timesheets_pkey" PRIMARY KEY ("id")
);
