-- Drop old tables if they exist
DROP TABLE IF EXISTS "GroupPick";
DROP TABLE IF EXISTS "ChampionPick";

-- CreateTable
CREATE TABLE "GroupStandingPick" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "group" TEXT NOT NULL,
    "rank1" TEXT NOT NULL,
    "rank2" TEXT NOT NULL,
    "rank3" TEXT NOT NULL,
    "rank4" TEXT NOT NULL,

    CONSTRAINT "GroupStandingPick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupStandingPick_userId_group_key" ON "GroupStandingPick"("userId", "group");

-- AddForeignKey
ALTER TABLE "GroupStandingPick" ADD CONSTRAINT "GroupStandingPick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
