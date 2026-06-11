-- CreateTable
CREATE TABLE "OddsSnapshot" (
    "id" SERIAL NOT NULL,
    "matchId" TEXT NOT NULL,
    "home" DOUBLE PRECISION NOT NULL,
    "draw" DOUBLE PRECISION NOT NULL,
    "away" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OddsSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OddsSnapshot_matchId_key" ON "OddsSnapshot"("matchId");
