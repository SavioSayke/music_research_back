-- CreateTable
CREATE TABLE "TrackCache" (
    "trackId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackCache_pkey" PRIMARY KEY ("trackId")
);
