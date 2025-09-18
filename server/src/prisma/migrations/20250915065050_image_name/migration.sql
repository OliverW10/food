/*
  Warnings:

  - You are about to drop the column `data` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Image` table. All the data in the column will be lost.
  - Added the required column `storageUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Image" DROP COLUMN "data",
DROP COLUMN "url",
ADD COLUMN     "storageUrl" TEXT NOT NULL;
