-- Migration baseline: contract fields already exist in DB via db push
-- This migration file is created to sync migration history

ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "contractDocumentId" TEXT;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "contractStatus" TEXT;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "contractUrl" TEXT;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "auditTrailUrl" TEXT;
ALTER TABLE "Application" ADD COLUMN IF NOT EXISTS "signUrl" TEXT;
