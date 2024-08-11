/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `FeedItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FeedItem" ADD COLUMN     "score" INTEGER,
ALTER COLUMN "companyName" DROP NOT NULL,
ALTER COLUMN "shortDescription" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "postDate" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "typeOfJob" DROP NOT NULL,
ALTER COLUMN "experience" DROP NOT NULL,
ALTER COLUMN "englishLevel" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "FeedItem_link_key" ON "FeedItem"("link");
