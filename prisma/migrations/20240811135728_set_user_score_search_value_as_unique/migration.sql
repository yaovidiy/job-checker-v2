/*
  Warnings:

  - A unique constraint covering the columns `[searchValue]` on the table `userScore` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "userScore_searchValue_key" ON "userScore"("searchValue");
