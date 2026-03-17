# GrievanceGrid Database Schema

## Overview

PostgreSQL with Drizzle ORM for relational data and PostGIS for geospatial queries. Vector embeddings are stored in Qdrant, not in the database.

## Drizzle Schema

```typescript
// packages/database/src/schema.ts
import { pgTable, uuid, varchar, text, timestamp, boolean, integer, float, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// ============================================
// ENUMS
// ============================================

export const userRoleEnum = pgEnum('user_role', ['CITIZEN', 'CREW', 'OFFICER', 'ADMIN', 'AUDITOR']);

export const grievanceCategoryEnum = pgEnum('grievance_category', [
  'ROADS',
  'WATER_SUPPLY',
  'SANITATION',
  'ELECTRICITY',
  'PUBLIC_TRANSPORT',
  'ENVIRONMENT',
  'BUILDING_VIOLATION',
  'NOISE_POLUTION',
  'OTHER'
]);

export const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

export const grievanceStatusEnum = pgEnum('grievance_status', [
  'CREATED',
  'AI_PROCESSED',
  'ROUTED',
  'ACKNOWLEDGED',
  'IN_PROGRESS',
  'PENDING_VERIFICATION',
  'VERIFIED',
  'RESOLVED',
  'ESCALATED',
  'CONTESTED',
  'CLOSED'
]);

export const slaTypeEnum = pgEnum('sla_type', ['RESPONSE', 'RESOLUTION', 'VERIFICATION']);

export const clusterTypeEnum = pgEnum('cluster_type', ['DBSCAN_GEO', 'LDA_TOPIC', 'ANOMALY']);

export const assetTypeEnum = pgEnum('asset_type', [
  'TRANSFORMER',
  'WATER_MAIN',
  'ROAD_SEGMENT',
  'STORM_DRAIN',
  'STREET_LIGHT',
  'BUS_STOP'
]);

export const auditActionEnum = pgEnum('audit_action', [
  'CREATED',
  'UPDATED',
  'STATUS_CHANGED',
  'ROUTED',
  'ASSIGNED',
  'ESCALATED',
  'VERIFIED',
  'RESOLVED',
  'CONTESTED',
  'AUDITED'
]);

// ============================================
// USER MANAGEMENT
// ============================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(), // Link for Google Auth or Basic Auth
  phone: varchar('phone', { length: 20 }),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: text('password_hash'), // Null for Google Auth users
  googleId: varchar('google_id', { length: 255 }).unique(), // Null for Basic Auth users
  role: userRoleEnum('role').default('CITIZEN'),
  language: varchar('language', { length: 10 }).default('en'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// ============================================
// GRIEVANCE CORE
// ============================================

export const grievances = pgTable('grievances', {
  id: uuid('id').primaryKey().defaultRandom(),
  gridId: varchar('grid_id', { length: 20 }).unique().notNull(), // GRI-2026-XXXXXX format
  citizenId: uuid('citizen_id').references(() => users.id).notNull(),
  
  category: grievanceCategoryEnum('category').notNull(),
  subcategory: varchar('subcategory', { length: 100 }),
  priority: priorityEnum('priority').default('MEDIUM'),
  status: grievanceStatusEnum('status').default('CREATED'),
  
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  rawInput: text('raw_input'), // Unstructured input for LLM processing
  
  // Location
  locationName: varchar('location_name', { length: 255 }),
  latitude: float('latitude').notNull(),
  longitude: float('longitude').notNull(),
  address: text('address'),
  
  // Media
  beforePhotoUrl: text('before_photo_url'),
  afterPhotoUrl: text('after_photo_url'),
  voiceNoteUrl: text('voice_note_url'),
  
  // AI Analysis
  aiCategory: varchar('ai_category', { length: 50 }),
  aiPriority: float('ai_priority'),
  damageSeverity: float('damage_severity'), // 0-1 scale from CV model
  embeddingId: varchar('embedding_id', { length: 100 }), // Qdrant vector ID
  
  // Routing
  assignedDepartmentId: uuid('assigned_department_id'),
  assignedTeamId: uuid('assigned_team_id'),
  
  // SLA
  slaResponseDeadline: timestamp('sla_response_deadline'),
  slaResolutionDeadline: timestamp('sla_resolution_deadline'),
  responseTimeMinutes: integer('response_time_minutes'),
  resolutionTimeMinutes: integer('resolution_time_minutes'),
  
  // Resolution
  resolutionSummary: text('resolution_summary'),
  resolutionVerified: boolean('resolution_verified').default(false),
  citizenSatisfaction: integer('citizen_satisfaction'), // 1-5 rating
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  resolvedAt: timestamp('resolved_at')
}, (table) => ({
  statusIdx: index('idx_grievances_status').on(table.status),
  categoryIdx: index('idx_grievances_category').on(table.category),
  priorityIdx: index('idx_grievances_priority').on(table.priority),
  departmentIdx: index('idx_grievances_department').on(table.assignedDepartmentId),
  createdIdx: index('idx_grievances_created').on(table.createdAt),
  // Geospatial index added via migration
}));

// ============================================
// SLA TIMERS
// ============================================

export const slaTimers = pgTable('sla_timers', {
  id: uuid('id').primaryKey().defaultRandom(),
  grievanceId: uuid('grievance_id').references(() => grievances.id, { onDelete: 'cascade' }).notNull(),
  
  slaType: slaTypeEnum('sla_type').notNull(),
  startTime: timestamp('start_time').defaultNow(),
  deadline: timestamp('deadline').notNull(),
  escalationAt: timestamp('escalation_at'), // When auto-escalation triggers
  
  isEscalated: boolean('is_escalated').default(false),
  escalatedTo: varchar('escalated_to', { length: 100 }), // Officer ID who received alert
  
  reminderSent: boolean('reminder_sent').default(false),
  
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  uniqueIdx: unique('idx_sla_timer_grievance_type').on(table.grievanceId, table.slaType)
}));

// ============================================
// DEPARTMENTS & TEAMS
// ============================================

export const departments = pgTable('departments', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).unique().notNull(), // e.g., PWD, WATER, ELECTRICITY
  description: text('description'),
  jurisdiction: jsonb('jurisdiction'), // GeoJSON boundary
  
  parentId: uuid('parent_id'),
  
  createdAt: timestamp('created_at').defaultNow()
});

export const teams = pgTable('teams', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  departmentId: uuid('department_id').references(() => departments.id).notNull(),
  
  serviceArea: jsonb('service_area'), // GeoJSON polygon
  
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow()
});

export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  teamId: uuid('team_id').references(() => teams.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  
  role: varchar('role', { length: 20 }).default('MEMBER') // LEAD, MEMBER
}, (table) => ({
  uniqueIdx: unique('idx_team_member_unique').on(table.teamId, table.userId)
}));

// ============================================
// GEOSPATIAL CLUSTERS
// ============================================

export const geoClusters = pgTable('geo_clusters', {
  id: uuid('id').primaryKey().defaultRandom(),
  clusterType: clusterTypeEnum('cluster_type').notNull(),
  centroidLat: float('centroid_lat').notNull(),
  centroidLng: float('centroid_lng').notNull(),
  radiusMeters: float('radius_meters').notNull(),
  
  grievanceCount: integer('grievance_count').default(0),
  densityScore: float('density_score'),
  
  topicKeywords: varchar('topic_keywords', { length: 255 }).array(), // LDA-extracted topics
  crisisScore: float('crisis_score').default(0), // 0-1 urgency score
  
  isActive: boolean('is_active').default(true),
  detectedAt: timestamp('detected_at').defaultNow(),
  lastUpdated: timestamp('last_updated').defaultNow()
}, (table) => ({
  activeIdx: index('idx_clusters_active').on(table.isActive),
  crisisIdx: index('idx_clusters_crisis').on(table.crisisScore)
}));

export const clusterMembers = pgTable('cluster_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  clusterId: uuid('cluster_id').references(() => geoClusters.id).notNull(),
  grievanceId: uuid('grievance_id').references(() => grievances.id).notNull(),
  
  distanceFromCentroid: float('distance_from_centroid')
}, (table) => ({
  uniqueIdx: unique('idx_cluster_member_unique').on(table.clusterId, table.grievanceId)
}));

// ============================================
// VERIFICATION
// ============================================

export const verifications = pgTable('verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  grievanceId: uuid('grievance_id').references(() => grievances.id).notNull(),
  verifierId: uuid('verifier_id').references(() => users.id).notNull(),
  
  photoUrl: text('photo_url').notNull(),
  photoLat: float('photo_lat').notNull(),
  photoLng: float('photo_lng').notNull(),
  
  incidentLat: float('incident_lat').notNull(),
  incidentLng: float('incident_lng').notNull(),
  
  distanceMeters: float('distance_meters'), // Distance from incident location
  isValid: boolean('is_valid'), // Within 50m tolerance
  
  notes: text('notes'),
  
  createdAt: timestamp('created_at').defaultNow()
});

// ============================================
// AUDIT LOGS
// ============================================

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: varchar('entity_type', { length: 50 }).notNull(), // grievance, user, cluster
  entityId: uuid('entity_id').notNull(),
  
  grievanceId: uuid('grievance_id'),
  userId: uuid('user_id'),
  
  action: auditActionEnum('action').notNull(),
  previousState: jsonb('previous_state'),
  newState: jsonb('new_state'),
  
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  entityIdx: index('idx_audit_entity').on(table.entityType, table.entityId),
  grievanceIdx: index('idx_audit_grievance').on(table.grievanceId),
  createdIdx: index('idx_audit_created').on(table.createdAt)
}));

// ============================================
// VECTOR REFERENCES (Stored in Qdrant, not PostgreSQL)
// ============================================

export const vectorReferences = pgTable('vector_references', {
  id: uuid('id').primaryKey().defaultRandom(),
  grievanceId: uuid('grievance_id').references(() => grievances.id).unique().notNull(),
  qdrantPointId: varchar('qdrant_point_id', { length: 100 }).notNull(),
  
  modelVersion: varchar('model_version', { length: 50 }), // e.g., "bert-base-uncased-v1"
  embeddingDim: integer('embedding_dim'), // 768 for BERT
  
  createdAt: timestamp('created_at').defaultNow()
});

// ============================================
// PREDICTIVE MAINTENANCE
// ============================================

export const infrastructureAssets = pgTable('infrastructure_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  assetType: assetTypeEnum('asset_type').notNull(), // TRANSFORMER, WATER_MAIN, ROAD_SEGMENT
  assetId: varchar('asset_id', { length: 100 }).notNull(), // External system ID
  
  locationLat: float('location_lat').notNull(),
  locationLng: float('location_lng').notNull(),
  
  complaintCount: integer('complaint_count').default(0),
  failureRiskScore: float('failure_risk_score'), // 0-1 predicted failure risk
  
  lastComplaintAt: timestamp('last_complaint_at'),
  predictedFailureAt: timestamp('predicted_failure_at'), // 7-day forecast
  
  isActive: boolean('is_active').default(true),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
  assetTypeIdx: index('idx_assets_type').on(table.assetType),
  riskIdx: index('idx_assets_risk').on(table.failureRiskScore)
}));

// ============================================
// ANALYTICS
// ============================================

export const dailyMetrics = pgTable('daily_metrics', {
  id: uuid('id').primaryKey().defaultRandom(),
  date: date('date').notNull(),
  
  totalGrievances: integer('total_grievances').default(0),
  resolvedCount: integer('resolved_count').default(0),
  escalatedCount: integer('escalated_count').default(0),
  avgResolutionTimeMinutes: float('avg_resolution_time_minutes'),
  
  byCategory: jsonb('by_category'), // Category breakdown
  
  createdAt: timestamp('created_at').defaultNow()
}, (table) => ({
  uniqueDateIdx: unique('idx_daily_metrics_date').on(table.date)
}));

// ============================================
// TYPE EXPORTS
// ============================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Grievance = typeof grievances.$inferSelect;
export type NewGrievance = typeof grievances.$inferInsert;
export type GeoCluster = typeof geoClusters.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
```

## Drizzle Client Setup

```typescript
// packages/database/src/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export type Database = typeof db;
```

## SQL Migration Scripts

### Enable Extensions
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

### Grievances Table with Geospatial Index
```sql
CREATE TABLE grievances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grid_id VARCHAR(20) UNIQUE NOT NULL,
  citizen_id UUID REFERENCES users(id),
  
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'MEDIUM',
  status VARCHAR(30) DEFAULT 'CREATED',
  
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  raw_input TEXT,
  
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  location_name VARCHAR(255),
  address TEXT,
  
  before_photo_url TEXT,
  after_photo_url TEXT,
  voice_note_url TEXT,
  
  ai_category VARCHAR(50),
  ai_priority FLOAT,
  damage_severity FLOAT,
  embedding_id VARCHAR(100),
  
  assigned_department_id UUID REFERENCES departments(id),
  assigned_team_id UUID REFERENCES teams(id),
  
  sla_response_deadline TIMESTAMP,
  sla_resolution_deadline TIMESTAMP,
  response_time_minutes INT,
  resolution_time_minutes INT,
  
  resolution_summary TEXT,
  resolution_verified BOOLEAN DEFAULT FALSE,
  citizen_satisfaction INT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE INDEX idx_grievances_status ON grievances(status);
CREATE INDEX idx_grievances_category ON grievances(category);
CREATE INDEX idx_grievances_location ON grievances USING GIST(ST_MakePoint(longitude, latitude));
```

### SLA Timers Table
```sql
CREATE TABLE sla_timers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grievance_id UUID REFERENCES grievances(id) ON DELETE CASCADE,
  sla_type VARCHAR(30) NOT NULL,
  start_time TIMESTAMP DEFAULT NOW(),
  deadline TIMESTAMP NOT NULL,
  escalation_at TIMESTAMP,
  is_escalated BOOLEAN DEFAULT FALSE,
  escalated_to VARCHAR(100),
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(grievance_id, sla_type)
);
```

### Geo Clusters Table
```sql
CREATE TABLE geo_clusters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cluster_type VARCHAR(30) NOT NULL,
  centroid_lat FLOAT NOT NULL,
  centroid_lng FLOAT NOT NULL,
  radius_meters FLOAT NOT NULL,
  grievance_count INT DEFAULT 0,
  density_score FLOAT,
  topic_keywords TEXT[],
  crisis_score FLOAT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  detected_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_clusters_active ON geo_clusters(is_active);
CREATE INDEX idx_clusters_crisis ON geo_clusters(crisis_score DESC);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  grievance_id UUID REFERENCES grievances(id),
  user_id UUID REFERENCES users(id),
  action VARCHAR(30) NOT NULL,
  previous_state JSONB,
  new_state JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_grievance ON audit_logs(grievance_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
```

## Geospatial Queries (PostGIS)

```sql
-- Find grievances within radius
SELECT * FROM grievances
WHERE ST_DWithin(
  ST_MakePoint(longitude, latitude)::geography,
  ST_MakePoint($lng, $lat)::geography,
  $radius_meters
);

-- Cluster grievances using DBSCAN
SELECT 
  ST_ClusterID() as cluster_id,
  ST_ClusterConvexHull(ST_MakePoint(longitude, latitude)) as geometry,
  COUNT(*) as count
FROM grievances
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY ST_ClusterWithin(ST_MakePoint(longitude, latitude), 500);
```

## Vector Search (Qdrant - External)

Vector embeddings are stored in Qdrant, not in PostgreSQL. Use the Qdrant client for similarity search:

```typescript
// Example: Finding similar grievances via Qdrant
import { QdrantClient } from '@qdrant/js-client-rest';

const qdrant = new QdrantClient({ host: 'qdrant', port: 6333 });

async function findSimilarGrievances(queryEmbedding: number[], category: string) {
  const results = await qdrant.search('grievances', {
    vector: queryEmbedding,
    filter: { must: [{ key: 'status', match: { value: 'RESOLVED' } }] },
    limit: 5
  });
  
  return results;
}
```

Reference between PostgreSQL and Qdrant is stored in the `vector_references` table.