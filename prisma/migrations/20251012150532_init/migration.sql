-- CreateEnum
CREATE TYPE "StreamStatus" AS ENUM ('SCHEDULED', 'LIVE', 'ENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "StreamCurrency" AS ENUM ('USD', 'EUR', 'GBP', 'INR');

-- CreateTable
CREATE TABLE "Stream" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "StreamStatus" NOT NULL DEFAULT 'SCHEDULED',
    "price" DECIMAL(10,2) NOT NULL,
    "currency" "StreamCurrency" NOT NULL DEFAULT 'USD',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "statusId" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stream_id_key" ON "Stream"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_statusId_key" ON "Stream"("statusId");

-- CreateIndex
CREATE INDEX "Stream_authorId_idx" ON "Stream"("authorId");
