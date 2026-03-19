import {
  pgTable,
  text,
  uuid,
  timestamp,
  integer,
  boolean,
  decimal,
  jsonb,
  varchar,
  index,
  uniqueIndex,
  foreignKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * PostgreSQL Enums
 */
export const userRoleEnum = pgEnum("user_role", [
  "CITIZEN",
  "CREW",
  "OFFICER",
  "ADMIN",
  "AUDITOR",
]);

export const grievanceStatusEnum = pgEnum("grievance_status", [
  "CREATED",
  "PENDING_CLASSIFICATION",
  "PENDING_ASSIGNMENT",
  "ASSIGNED",
  "IN_PROGRESS",
  "PENDING_VERIFICATION",
  "VERIFIED",
  "RESOLVED",
  "ESCALATED",
  "CONTESTED",
  "CLOSED",
]);

export const grievanceCategoryEnum = pgEnum("grievance_category", [
  "ROADS",
  "WATER_SUPPLY",
  "SANITATION",
  "ELECTRICITY",
  "PUBLIC_TRANSPORT",
  "ENVIRONMENT",
  "BUILDING_VIOLATION",
  "INFRASTRUCTURE",
  "OTHER",
]);

export const priorityEnum = pgEnum("priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
]);

export const authTypeEnum = pgEnum("auth_type", ["GOOGLE", "BASIC"]);

export const slaTypeEnum = pgEnum("sla_type", ["RESPONSE", "RESOLUTION"]);

export const clusterTypeEnum = pgEnum("cluster_type", [
  "GEOGRAPHIC",
  "TOPIC",
  "ANOMALY",
]);

/**
 * Users Table
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    password_hash: text("password_hash"), // NULL for OAuth users
    google_id: varchar("google_id", { length: 255 }), // NULL for basic auth
    phone: varchar("phone", { length: 20 }),
    role: userRoleEnum("role").default("CITIZEN").notNull(),
    auth_type: authTypeEnum("auth_type").notNull(),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    googleIdIdx: uniqueIndex("users_google_id_idx").on(table.google_id),
    roleIdx: index("users_role_idx").on(table.role),
  })
);

/**
 * Departments Table
 */
export const departments = pgTable(
  "departments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    description: text("description"),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    sla_response_hours: integer("sla_response_hours").default(24),
    sla_resolution_hours: integer("sla_resolution_hours").default(72),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    codeIdx: uniqueIndex("departments_code_idx").on(table.code),
  })
);

/**
 * Teams Table
 */
export const teams = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    department_id: uuid("department_id")
      .notNull()
      .references(() => departments.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    phone: varchar("phone", { length: 20 }),
    service_area: jsonb("service_area"), // GeoJSON polygon
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    deptIdx: index("teams_department_id_idx").on(table.department_id),
  })
);

/**
 * Team Members Table
 */
export const team_members = pgTable(
  "team_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    team_id: uuid("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 50 }).default("MEMBER"), // LEAD, MEMBER, etc.
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    teamIdx: index("team_members_team_id_idx").on(table.team_id),
    userIdx: index("team_members_user_id_idx").on(table.user_id),
    uniqueIdx: uniqueIndex("team_members_unique_idx").on(
      table.team_id,
      table.user_id
    ),
  })
);

/**
 * Grievances Table
 */
export const grievances = pgTable(
  "grievances",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    grid_id: varchar("grid_id", { length: 50 }).notNull().unique(), // GRI-YYYY-XXXXXX
    citizen_id: uuid("citizen_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    assigned_team_id: uuid("assigned_team_id").references(() => teams.id), // NULL if unassigned
    assigned_officer_id: uuid("assigned_officer_id").references(
      () => users.id
    ),

    // Grievance Details
    title: varchar("title", { length: 500 }).notNull(),
    description: text("description").notNull(),
    category: grievanceCategoryEnum("category").notNull(),
    priority: priorityEnum("priority").default("MEDIUM").notNull(),
    status: grievanceStatusEnum("status").default("CREATED").notNull(),

    // Location
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    location_address: text("location_address"),

    // AI Processing Results
    ai_category: grievanceCategoryEnum("ai_category"),
    ai_priority: priorityEnum("ai_priority"),
    ai_summary: text("ai_summary"),
    damage_severity: decimal("damage_severity", { precision: 3, scale: 2 }), // 0-1
    assigned_department_id: uuid("assigned_department_id").references(
      () => departments.id
    ),

    // Media
    before_photo_url: text("before_photo_url"),
    after_photo_url: text("after_photo_url"),
    voice_recorded: boolean("voice_recorded").default(false),
    voice_url: text("voice_url"),

    // Vector Search
    embedding_id: varchar("embedding_id", { length: 255 }), // Qdrant ID
    similar_cases_count: integer("similar_cases_count").default(0),

    // Feedback & Contest
    citizen_feedback_rating: integer("citizen_feedback_rating"), // 1-5
    citizen_feedback_text: text("citizen_feedback_text"),
    is_contested: boolean("is_contested").default(false),
    contest_reason: text("contest_reason"),
    contest_evidence_url: text("contest_evidence_url"),

    // Timestamps
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    resolved_at: timestamp("resolved_at", { withTimezone: true }),
  },
  (table) => ({
    gridIdIdx: uniqueIndex("grievances_grid_id_idx").on(table.grid_id),
    citizenIdx: index("grievances_citizen_id_idx").on(table.citizen_id),
    teamIdx: index("grievances_assigned_team_id_idx").on(table.assigned_team_id),
    statusIdx: index("grievances_status_idx").on(table.status),
    categoryIdx: index("grievances_category_idx").on(table.category),
    priorityIdx: index("grievances_priority_idx").on(table.priority),
    createdIdx: index("grievances_created_at_idx").on(table.created_at),
    // PostGIS Spatial Index (created separately)
  })
);

/**
 * SLA Timers Table
 */
export const sla_timers = pgTable(
  "sla_timers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    grievance_id: uuid("grievance_id")
      .notNull()
      .references(() => grievances.id, { onDelete: "cascade" }),
    sla_type: slaTypeEnum("sla_type").notNull(),
    deadline_at: timestamp("deadline_at", { withTimezone: true }).notNull(),
    breached_at: timestamp("breached_at", { withTimezone: true }),
    is_breached: boolean("is_breached").default(false),
    escalation_level: integer("escalation_level").default(0), // 0=none, 1=first, 2=senior
    is_escalated: boolean("is_escalated").default(false),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    grievanceIdx: index("sla_timers_grievance_id_idx").on(table.grievance_id),
    deadlineIdx: index("sla_timers_deadline_at_idx").on(table.deadline_at),
    breachedIdx: index("sla_timers_breached_idx").on(table.is_breached),
  })
);

/**
 * Verifications Table
 */
export const verifications = pgTable(
  "verifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    grievance_id: uuid("grievance_id")
      .notNull()
      .references(() => grievances.id, { onDelete: "cascade" }),
    officer_id: uuid("officer_id")
      .notNull()
      .references(() => users.id),
    photo_url: text("photo_url").notNull(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
    longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
    distance_from_incident: decimal("distance_from_incident", {
      precision: 10,
      scale: 2,
    }), // meters
    is_within_tolerance: boolean("is_within_tolerance").notNull(),
    status: varchar("status", { length: 50 })
      .default("PENDING")
      .notNull(), // PENDING, VERIFIED, REJECTED
    notes: text("notes"),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    grievanceIdx: index("verifications_grievance_id_idx").on(
      table.grievance_id
    ),
    officerIdx: index("verifications_officer_id_idx").on(table.officer_id),
  })
);

/**
 * Audit Logs Table (Immutable append-only)
 */
export const audit_logs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    grievance_id: uuid("grievance_id")
      .notNull()
      .references(() => grievances.id, { onDelete: "cascade" }),
    actor_id: uuid("actor_id").references(() => users.id),
    event_type: varchar("event_type", { length: 50 }).notNull(), // CREATED, STATUS_CHANGED, ESCALATED, etc.
    old_status: grievanceStatusEnum("old_status"),
    new_status: grievanceStatusEnum("new_status"),
    description: text("description"),
    metadata: jsonb("metadata"), // Extra data for the event
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    grievanceIdx: index("audit_logs_grievance_id_idx").on(table.grievance_id),
    actorIdx: index("audit_logs_actor_id_idx").on(table.actor_id),
    eventIdx: index("audit_logs_event_type_idx").on(table.event_type),
    createdIdx: index("audit_logs_created_at_idx").on(table.created_at),
  })
);

/**
 * Geo Clusters Table
 */
export const geo_clusters = pgTable(
  "geo_clusters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cluster_type: clusterTypeEnum("cluster_type").notNull(),
    centroid_lat: decimal("centroid_lat", { precision: 10, scale: 8 }).notNull(),
    centroid_lng: decimal("centroid_lng", { precision: 11, scale: 8 }).notNull(),
    member_count: integer("member_count").default(0),
    crisis_score: decimal("crisis_score", { precision: 3, scale: 2 }).default(
      sql`0.0`
    ), // 0-1
    is_active: boolean("is_active").default(true),
    topics: jsonb("topics"), // Array of top keywords
    metadata: jsonb("metadata"), // Additional cluster data
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    clusterTypeIdx: index("geo_clusters_cluster_type_idx").on(
      table.cluster_type
    ),
    crisisScoreIdx: index("geo_clusters_crisis_score_idx").on(
      table.crisis_score
    ),
    activeIdx: index("geo_clusters_is_active_idx").on(table.is_active),
  })
);

/**
 * Cluster Members Table (Grievances in a cluster)
 */
export const cluster_members = pgTable(
  "cluster_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cluster_id: uuid("cluster_id")
      .notNull()
      .references(() => geo_clusters.id, { onDelete: "cascade" }),
    grievance_id: uuid("grievance_id")
      .notNull()
      .references(() => grievances.id, { onDelete: "cascade" }),
    similarity_score: decimal("similarity_score", {
      precision: 3,
      scale: 2,
    }).default(sql`0.0`), // 0-1
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    clusterIdx: index("cluster_members_cluster_id_idx").on(table.cluster_id),
    grievanceIdx: index("cluster_members_grievance_id_idx").on(
      table.grievance_id
    ),
    uniqueIdx: uniqueIndex("cluster_members_unique_idx").on(
      table.cluster_id,
      table.grievance_id
    ),
  })
);

/**
 * Infrastructure Assets Table
 */
export const infrastructure_assets = pgTable(
  "infrastructure_assets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    department_id: uuid("department_id")
      .notNull()
      .references(() => departments.id),
    asset_type: varchar("asset_type", { length: 100 }).notNull(), // ROAD, WATER_PIPE, etc.
    asset_name: varchar("asset_name", { length: 255 }).notNull(),
    location_lat: decimal("location_lat", { precision: 10, scale: 8 }),
    location_lng: decimal("location_lng", { precision: 11, scale: 8 }),
    complaint_count_7d: integer("complaint_count_7d").default(0),
    complaint_count_30d: integer("complaint_count_30d").default(0),
    unresolved_count: integer("unresolved_count").default(0),
    failure_risk_score: decimal("failure_risk_score", {
      precision: 3,
      scale: 2,
    }).default(sql`0.0`), // 0-1 (from maintenance ML)
    predicted_failure_date: timestamp("predicted_failure_date", {
      withTimezone: true,
    }),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    deptIdx: index("infrastructure_assets_department_id_idx").on(
      table.department_id
    ),
    riskScoreIdx: index("infrastructure_assets_risk_score_idx").on(
      table.failure_risk_score
    ),
  })
);

/**
 * Vector References Table (Qdrant pointer)
 */
export const vector_references = pgTable(
  "vector_references",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    grievance_id: uuid("grievance_id")
      .notNull()
      .references(() => grievances.id, { onDelete: "cascade" }),
    qdrant_id: varchar("qdrant_id", { length: 255 }).notNull(),
    collection_name: varchar("collection_name", { length: 100 })
      .default("grievances")
      .notNull(),
    embedding_model: varchar("embedding_model", { length: 100 }).default(
      "deterministic"
    ), // deterministic, llm-service, etc.
    vector_dimension: integer("vector_dimension").default(768),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    grievanceIdx: uniqueIndex("vector_references_grievance_id_idx").on(
      table.grievance_id
    ),
    qdrantIdx: uniqueIndex("vector_references_qdrant_id_idx").on(table.qdrant_id),
  })
);

/**
 * Daily Metrics Table (Analytics snapshots)
 */
export const daily_metrics = pgTable(
  "daily_metrics",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    metric_date: timestamp("metric_date", { withTimezone: true })
      .notNull()
      .unique(),
    total_grievances: integer("total_grievances").default(0),
    new_grievances: integer("new_grievances").default(0),
    resolved_grievances: integer("resolved_grievances").default(0),
    escalated_grievances: integer("escalated_grievances").default(0),
    contested_grievances: integer("contested_grievances").default(0),
    avg_resolution_time_hours: decimal("avg_resolution_time_hours", {
      precision: 10,
      scale: 2,
    }),
    sla_compliance_rate: decimal("sla_compliance_rate", {
      precision: 3,
      scale: 2,
    }).default(sql`1.0`), // 0-1
    avg_citizen_satisfaction: decimal("avg_citizen_satisfaction", {
      precision: 3,
      scale: 2,
    }),
    category_breakdown: jsonb("category_breakdown"), // {ROADS: 10, WATER: 5, ...}
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    dateIdx: uniqueIndex("daily_metrics_date_idx").on(table.metric_date),
  })
);

/**
 * Sessions Table (for Redis-backed sessions)
 */
export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    user_id: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull(),
    is_active: boolean("is_active").default(true),
    expires_at: timestamp("expires_at", { withTimezone: true }).notNull(),
    created_at: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    userIdx: index("sessions_user_id_idx").on(table.user_id),
    expiresIdx: index("sessions_expires_at_idx").on(table.expires_at),
  })
);

export type User = typeof users.$inferSelect;
export type Department = typeof departments.$inferSelect;
export type Team = typeof teams.$inferSelect;
export type TeamMember = typeof team_members.$inferSelect;
export type Grievance = typeof grievances.$inferSelect;
export type SLATimer = typeof sla_timers.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
export type AuditLog = typeof audit_logs.$inferSelect;
export type GeoCluster = typeof geo_clusters.$inferSelect;
export type ClusterMember = typeof cluster_members.$inferSelect;
export type InfrastructureAsset = typeof infrastructure_assets.$inferSelect;
export type VectorReference = typeof vector_references.$inferSelect;
export type DailyMetric = typeof daily_metrics.$inferSelect;
export type Session = typeof sessions.$inferSelect;
