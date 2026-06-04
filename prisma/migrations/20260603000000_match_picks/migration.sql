-- Drop GroupStandingPick (replaced by per-match picks)
DROP TABLE IF EXISTS "GroupStandingPick";

-- CreateTable
CREATE TABLE "MatchPick" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "matchId" TEXT NOT NULL,
    "pick" TEXT NOT NULL,
    CONSTRAINT "MatchPick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MatchPick_userId_matchId_key" ON "MatchPick"("userId", "matchId");

-- AddForeignKey
ALTER TABLE "MatchPick" ADD CONSTRAINT "MatchPick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
