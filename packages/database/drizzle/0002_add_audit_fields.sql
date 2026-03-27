-- Add contestation audit fields to grievances table
-- Enables auditor role to validate contested grievances

ALTER TABLE "grievances"
ADD COLUMN "contest_audit_id" varchar(255),
ADD COLUMN "contest_audit_status" varchar(50) DEFAULT 'PENDING',
ADD COLUMN "contest_risk_score" numeric(3, 2),
ADD COLUMN "contest_ai_recommendation" text,
ADD COLUMN "contest_ai_confidence" numeric(3, 2),
ADD COLUMN "contest_validation_notes" text,
ADD COLUMN "contest_validated_by" uuid,
ADD COLUMN "contest_validated_at" timestamp with time zone;

-- Create index for audit queries
CREATE INDEX IF NOT EXISTS "grievances_contest_audit_id_idx" ON "grievances"("contest_audit_id");
CREATE INDEX IF NOT EXISTS "grievances_contest_audit_status_idx" ON "grievances"("contest_audit_status");
CREATE INDEX IF NOT EXISTS "grievances_is_contested_idx" ON "grievances"("is_contested") WHERE "is_contested" = true;
