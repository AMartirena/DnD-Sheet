-- CreateTable
CREATE TABLE "SoundButton" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'geral',
    "color" TEXT NOT NULL DEFAULT '#7a5c2e',
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "loop" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SoundButton_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SoundButton_userId_idx" ON "SoundButton"("userId");

-- AddForeignKey
ALTER TABLE "SoundButton" ADD CONSTRAINT "SoundButton_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
