/*
  Warnings:

  - You are about to drop the column `feedPage` on the `Feed` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Feed" DROP COLUMN "feedPage";

-- AlterTable
ALTER TABLE "FeedItem" ADD COLUMN     "sourceId" TEXT;

-- CreateTable
CREATE TABLE "ItemSource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ItemSource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemSource_name_key" ON "ItemSource"("name");

-- AddForeignKey
ALTER TABLE "FeedItem" ADD CONSTRAINT "FeedItem_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "ItemSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
