/*
  Warnings:

  - You are about to drop the column `isFree` on the `Career` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Career` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Career" DROP COLUMN "isFree",
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
