/*
  Warnings:

  - You are about to drop the column `vibeRequired` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `feeDeducted` on the `Transaction` table. All the data in the column will be lost.
  - The `status` column on the `Transaction` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `avatar` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `connectsLeft` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tier` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `vibeTags` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `budget` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'ULTRA');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_jobId_fkey";

-- DropForeignKey
ALTER TABLE "CreatorProfile" DROP CONSTRAINT "CreatorProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_shopId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "ShopProfile" DROP CONSTRAINT "ShopProfile_userId_fkey";

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "matchRate" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "CreatorProfile" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "styles" TEXT[];

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "vibeRequired",
ADD COLUMN     "budget" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "ShopProfile" ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "vibeText" TEXT;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "feeDeducted",
ADD COLUMN     "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatar",
DROP COLUMN "bio",
DROP COLUMN "connectsLeft",
DROP COLUMN "tier",
DROP COLUMN "vibeTags",
ADD COLUMN     "connects" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "plan" "SubscriptionPlan" NOT NULL DEFAULT 'FREE',
ALTER COLUMN "trialEndsAt" DROP NOT NULL,
ALTER COLUMN "trialEndsAt" DROP DEFAULT;

-- DropTable
DROP TABLE "Message";

-- DropEnum
DROP TYPE "Tier";

-- AddForeignKey
ALTER TABLE "ShopProfile" ADD CONSTRAINT "ShopProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatorProfile" ADD CONSTRAINT "CreatorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
