-- CreateTable
CREATE TABLE "PlayerReport" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "performance" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerReport_pkey" PRIMARY KEY ("id")
);
