DO $$ BEGIN
 CREATE TYPE "auth_type" AS ENUM('GOOGLE', 'BASIC');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "cluster_type" AS ENUM('GEOGRAPHIC', 'TOPIC', 'ANOMALY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "grievance_category" AS ENUM('ROADS', 'WATER_SUPPLY', 'SANITATION', 'ELECTRICITY', 'PUBLIC_TRANSPORT', 'ENVIRONMENT', 'BUILDING_VIOLATION', 'INFRASTRUCTURE', 'OTHER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "grievance_status" AS ENUM('CREATED', 'PENDING_CLASSIFICATION', 'PENDING_ASSIGNMENT', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_VERIFICATION', 'VERIFIED', 'RESOLVED', 'ESCALATED', 'CONTESTED', 'CLOSED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "priority" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "sla_type" AS ENUM('RESPONSE', 'RESOLUTION');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "user_role" AS ENUM('CITIZEN', 'CREW', 'OFFICER', 'ADMIN', 'AUDITOR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grievance_id" uuid NOT NULL,
	"actor_id" uuid,
	"event_type" varchar(50) NOT NULL,
	"old_status" "grievance_status",
	"new_status" "grievance_status",
	"description" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cluster_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cluster_id" uuid NOT NULL,
	"grievance_id" uuid NOT NULL,
	"similarity_score" numeric(3, 2) DEFAULT 0.0,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "daily_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric_date" timestamp with time zone NOT NULL,
	"total_grievances" integer DEFAULT 0,
	"new_grievances" integer DEFAULT 0,
	"resolved_grievances" integer DEFAULT 0,
	"escalated_grievances" integer DEFAULT 0,
	"contested_grievances" integer DEFAULT 0,
	"avg_resolution_time_hours" numeric(10, 2),
	"sla_compliance_rate" numeric(3, 2) DEFAULT 1.0,
	"avg_citizen_satisfaction" numeric(3, 2),
	"category_breakdown" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "daily_metrics_metric_date_unique" UNIQUE("metric_date")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"description" text,
	"email" varchar(255),
	"phone" varchar(20),
	"sla_response_hours" integer DEFAULT 24,
	"sla_resolution_hours" integer DEFAULT 72,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "departments_name_unique" UNIQUE("name"),
	CONSTRAINT "departments_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "geo_clusters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cluster_type" "cluster_type" NOT NULL,
	"centroid_lat" numeric(10, 8) NOT NULL,
	"centroid_lng" numeric(11, 8) NOT NULL,
	"member_count" integer DEFAULT 0,
	"crisis_score" numeric(3, 2) DEFAULT 0.0,
	"is_active" boolean DEFAULT true,
	"topics" jsonb,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "grievances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grid_id" varchar(50) NOT NULL,
	"citizen_id" uuid NOT NULL,
	"assigned_team_id" uuid,
	"assigned_officer_id" uuid,
	"title" varchar(500) NOT NULL,
	"description" text NOT NULL,
	"category" "grievance_category" NOT NULL,
	"priority" "priority" DEFAULT 'MEDIUM' NOT NULL,
	"status" "grievance_status" DEFAULT 'CREATED' NOT NULL,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"location_address" text,
	"ai_category" "grievance_category",
	"ai_priority" "priority",
	"ai_summary" text,
	"damage_severity" numeric(3, 2),
	"assigned_department_id" uuid,
	"before_photo_url" text,
	"after_photo_url" text,
	"voice_recorded" boolean DEFAULT false,
	"voice_url" text,
	"embedding_id" varchar(255),
	"similar_cases_count" integer DEFAULT 0,
	"citizen_feedback_rating" integer,
	"citizen_feedback_text" text,
	"is_contested" boolean DEFAULT false,
	"contest_reason" text,
	"contest_evidence_url" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "grievances_grid_id_unique" UNIQUE("grid_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "infrastructure_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department_id" uuid NOT NULL,
	"asset_type" varchar(100) NOT NULL,
	"asset_name" varchar(255) NOT NULL,
	"location_lat" numeric(10, 8),
	"location_lng" numeric(11, 8),
	"complaint_count_7d" integer DEFAULT 0,
	"complaint_count_30d" integer DEFAULT 0,
	"unresolved_count" integer DEFAULT 0,
	"failure_risk_score" numeric(3, 2) DEFAULT 0.0,
	"predicted_failure_date" timestamp with time zone,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sla_timers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grievance_id" uuid NOT NULL,
	"sla_type" "sla_type" NOT NULL,
	"deadline_at" timestamp with time zone NOT NULL,
	"breached_at" timestamp with time zone,
	"is_breached" boolean DEFAULT false,
	"escalation_level" integer DEFAULT 0,
	"is_escalated" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "team_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(50) DEFAULT 'MEMBER',
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"department_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"phone" varchar(20),
	"service_area" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password_hash" text,
	"google_id" varchar(255),
	"phone" varchar(20),
	"role" "user_role" DEFAULT 'CITIZEN' NOT NULL,
	"auth_type" "auth_type" NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vector_references" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grievance_id" uuid NOT NULL,
	"qdrant_id" varchar(255) NOT NULL,
	"collection_name" varchar(100) DEFAULT 'grievances' NOT NULL,
	"embedding_model" varchar(100) DEFAULT 'deterministic',
	"vector_dimension" integer DEFAULT 768,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grievance_id" uuid NOT NULL,
	"officer_id" uuid NOT NULL,
	"photo_url" text NOT NULL,
	"latitude" numeric(10, 8) NOT NULL,
	"longitude" numeric(11, 8) NOT NULL,
	"distance_from_incident" numeric(10, 2),
	"is_within_tolerance" boolean NOT NULL,
	"status" varchar(50) DEFAULT 'PENDING' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_grievance_id_idx" ON "audit_logs" ("grievance_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_actor_id_idx" ON "audit_logs" ("actor_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_event_type_idx" ON "audit_logs" ("event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_logs_created_at_idx" ON "audit_logs" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cluster_members_cluster_id_idx" ON "cluster_members" ("cluster_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cluster_members_grievance_id_idx" ON "cluster_members" ("grievance_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cluster_members_unique_idx" ON "cluster_members" ("cluster_id","grievance_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "daily_metrics_date_idx" ON "daily_metrics" ("metric_date");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "departments_code_idx" ON "departments" ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "geo_clusters_cluster_type_idx" ON "geo_clusters" ("cluster_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "geo_clusters_crisis_score_idx" ON "geo_clusters" ("crisis_score");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "geo_clusters_is_active_idx" ON "geo_clusters" ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "grievances_grid_id_idx" ON "grievances" ("grid_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "grievances_citizen_id_idx" ON "grievances" ("citizen_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "grievances_assigned_team_id_idx" ON "grievances" ("assigned_team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "grievances_status_idx" ON "grievances" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "grievances_category_idx" ON "grievances" ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "grievances_priority_idx" ON "grievances" ("priority");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "grievances_created_at_idx" ON "grievances" ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "infrastructure_assets_department_id_idx" ON "infrastructure_assets" ("department_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "infrastructure_assets_risk_score_idx" ON "infrastructure_assets" ("failure_risk_score");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_user_id_idx" ON "sessions" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_expires_at_idx" ON "sessions" ("expires_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sla_timers_grievance_id_idx" ON "sla_timers" ("grievance_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sla_timers_deadline_at_idx" ON "sla_timers" ("deadline_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sla_timers_breached_idx" ON "sla_timers" ("is_breached");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_members_team_id_idx" ON "team_members" ("team_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "team_members_user_id_idx" ON "team_members" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "team_members_unique_idx" ON "team_members" ("team_id","user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_department_id_idx" ON "teams" ("department_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_google_id_idx" ON "users" ("google_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_role_idx" ON "users" ("role");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vector_references_grievance_id_idx" ON "vector_references" ("grievance_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vector_references_qdrant_id_idx" ON "vector_references" ("qdrant_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verifications_grievance_id_idx" ON "verifications" ("grievance_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verifications_officer_id_idx" ON "verifications" ("officer_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_grievance_id_grievances_id_fk" FOREIGN KEY ("grievance_id") REFERENCES "grievances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cluster_members" ADD CONSTRAINT "cluster_members_cluster_id_geo_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "geo_clusters"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cluster_members" ADD CONSTRAINT "cluster_members_grievance_id_grievances_id_fk" FOREIGN KEY ("grievance_id") REFERENCES "grievances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grievances" ADD CONSTRAINT "grievances_citizen_id_users_id_fk" FOREIGN KEY ("citizen_id") REFERENCES "users"("id") ON DELETE restrict ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grievances" ADD CONSTRAINT "grievances_assigned_team_id_teams_id_fk" FOREIGN KEY ("assigned_team_id") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grievances" ADD CONSTRAINT "grievances_assigned_officer_id_users_id_fk" FOREIGN KEY ("assigned_officer_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "grievances" ADD CONSTRAINT "grievances_assigned_department_id_departments_id_fk" FOREIGN KEY ("assigned_department_id") REFERENCES "departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "infrastructure_assets" ADD CONSTRAINT "infrastructure_assets_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sla_timers" ADD CONSTRAINT "sla_timers_grievance_id_grievances_id_fk" FOREIGN KEY ("grievance_id") REFERENCES "grievances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_department_id_departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vector_references" ADD CONSTRAINT "vector_references_grievance_id_grievances_id_fk" FOREIGN KEY ("grievance_id") REFERENCES "grievances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verifications" ADD CONSTRAINT "verifications_grievance_id_grievances_id_fk" FOREIGN KEY ("grievance_id") REFERENCES "grievances"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verifications" ADD CONSTRAINT "verifications_officer_id_users_id_fk" FOREIGN KEY ("officer_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
