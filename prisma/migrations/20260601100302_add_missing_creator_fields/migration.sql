-- AlterTable
ALTER TABLE "CreatorProfile" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "followersCount" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "priceRange" TEXT,
ADD COLUMN     "socialLinks" JSONB;
