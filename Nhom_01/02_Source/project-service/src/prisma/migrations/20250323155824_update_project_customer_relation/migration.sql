/*
  Warnings:

  - You are about to drop the `_CustomerProject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customer_id` to the `projects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CustomerProject" DROP CONSTRAINT "_CustomerProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_CustomerProject" DROP CONSTRAINT "_CustomerProject_B_fkey";

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "customer_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CustomerProject";

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
