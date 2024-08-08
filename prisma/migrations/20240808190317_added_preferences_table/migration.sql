-- CreateTable
CREATE TABLE "userPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "djinniSessionCookie" TEXT NOT NULL,
    "douSessionCookie" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "searchValue" TEXT NOT NULL,

    CONSTRAINT "userScore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userPreferences" ADD CONSTRAINT "userPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userScore" ADD CONSTRAINT "userScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
