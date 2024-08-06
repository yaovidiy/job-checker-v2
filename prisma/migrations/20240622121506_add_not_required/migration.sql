-- AlterTable
ALTER TABLE "User" ALTER COLUMN "github_id" DROP NOT NULL,
ALTER COLUMN "password_hash" DROP NOT NULL;
