/*
  Warnings:

  - The `postDate` column on the `FeedItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "FeedItem" DROP COLUMN "postDate",
ADD COLUMN     "postDate" TIMESTAMP(3);
