-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupPick" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "matchId" TEXT NOT NULL,
    "pick" TEXT NOT NULL,

    CONSTRAINT "GroupPick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BracketPick" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "round" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,
    "team" TEXT NOT NULL,

    CONSTRAINT "BracketPick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChampionPick" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "team" TEXT NOT NULL,

    CONSTRAINT "ChampionPick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchResult" (
    "id" SERIAL NOT NULL,
    "matchId" TEXT NOT NULL,
    "homeGoals" INTEGER,
    "awayGoals" INTEGER,
    "result" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',

    CONSTRAINT "MatchResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "GroupPick_userId_matchId_key" ON "GroupPick"("userId", "matchId");

-- CreateIndex
CREATE UNIQUE INDEX "BracketPick_userId_round_slot_key" ON "BracketPick"("userId", "round", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "ChampionPick_userId_key" ON "ChampionPick"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchResult_matchId_key" ON "MatchResult"("matchId");

-- AddForeignKey
ALTER TABLE "GroupPick" ADD CONSTRAINT "GroupPick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BracketPick" ADD CONSTRAINT "BracketPick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChampionPick" ADD CONSTRAINT "ChampionPick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
