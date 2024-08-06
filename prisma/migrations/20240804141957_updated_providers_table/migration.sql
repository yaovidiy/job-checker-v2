/*
  Warnings:

  - You are about to drop the `OauthAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OauthAccount" DROP CONSTRAINT "OauthAccount_userId_fkey";

-- DropTable
DROP TABLE "OauthAccount";

-- CreateTable
CREATE TABLE "authProviders" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,

    CONSTRAINT "authProviders_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "authProviders" ADD CONSTRAINT "authProviders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
