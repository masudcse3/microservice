/*
  Warnings:

  - Made the column `updatedAt` on table `Inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "updatedAt" SET NOT NULL;
