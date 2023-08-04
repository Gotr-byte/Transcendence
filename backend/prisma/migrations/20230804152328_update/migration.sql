-- CreateTable
CREATE TABLE "Blocked" (
    "blockedUserId" INTEGER NOT NULL,
    "blockingUserId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Blocked_blockingUserId_blockedUserId_key" ON "Blocked"("blockingUserId", "blockedUserId");

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blocked" ADD CONSTRAINT "Blocked_blockingUserId_fkey" FOREIGN KEY ("blockingUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
