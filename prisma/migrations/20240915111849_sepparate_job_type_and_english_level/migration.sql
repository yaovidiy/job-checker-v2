/*
  Warnings:

  - You are about to drop the column `companyName` on the `FeedItem` table. All the data in the column will be lost.
  - You are about to drop the column `englishLevel` on the `FeedItem` table. All the data in the column will be lost.
  - You are about to drop the column `typeOfJob` on the `FeedItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FeedItem" DROP COLUMN "companyName",
DROP COLUMN "englishLevel",
DROP COLUMN "typeOfJob",
ADD COLUMN     "englishLevelId" TEXT,
ADD COLUMN     "jobTypeId" TEXT;

-- CreateTable
CREATE TABLE "ItemJobType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ItemJobType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnglishLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EnglishLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemJobType_name_key" ON "ItemJobType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EnglishLevel_name_key" ON "EnglishLevel"("name");

-- AddForeignKey
ALTER TABLE "FeedItem" ADD CONSTRAINT "FeedItem_jobTypeId_fkey" FOREIGN KEY ("jobTypeId") REFERENCES "ItemJobType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedItem" ADD CONSTRAINT "FeedItem_englishLevelId_fkey" FOREIGN KEY ("englishLevelId") REFERENCES "EnglishLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
