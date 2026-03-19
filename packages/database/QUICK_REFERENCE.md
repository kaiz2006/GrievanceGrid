# Quick Reference: Database Schema

## Table Relationship Diagram

```
users (CITIZEN/CREW/OFFICER/ADMIN/AUDITOR)
├── sessions (auth tokens)
└─┬─ grievances (as citizen_id, assigned_officer_id)
  ├── sla_timers (deadline tracking)
  ├── verifications (field checks by crew)
  └── audit_logs (event trail)

departments
├── teams (service areas)
│   └── team_members (links to users)
└── grievances (assigned_department_id)

grievances
├── cluster_members → geo_clusters (crisis hotspots)
├── vector_references → Qdrant embeddings
└── daily_metrics (aggregated KPIs)

infrastructure_assets (maintenance prediction)
```

## Core Queries

### Get all open grievances by department

```sql
SELECT g.* FROM grievances g
WHERE g.assigned_department_id = $1
AND g.status NOT IN ('RESOLVED', 'CLOSED')
ORDER BY g.priority DESC, g.created_at ASC;
```

### Get SLA breached grievances

```sql
SELECT g.*, s.sla_type, s.deadline_at
FROM grievances g
JOIN sla_timers s ON g.id = s.grievance_id
WHERE s.is_breached = true
AND s.escalation_level = 0
ORDER BY s.deadline_at ASC;
```

### Get grievances in crisis hotspot

```sql
SELECT COUNT(*), AVG(g.priority), ST_AsGeoJSON(gc.location)
FROM grievances g
JOIN cluster_members cm ON g.id = cm.grievance_id
JOIN geo_clusters gc ON cm.cluster_id = gc.id
WHERE gc.department_id = $1
AND g.created_at > NOW() - INTERVAL '7 days'
GROUP BY gc.id;
```

### Get officer workload

```sql
SELECT 
  u.name,
  COUNT(g.id) as grievance_count,
  COUNT(CASE WHEN g.status = 'IN_PROGRESS' THEN 1 END) as in_progress,
  AVG(EXTRACT(EPOCH FROM (g.resolved_at - g.created_at))/3600) as avg_resolution_hours
FROM users u
LEFT JOIN grievances g ON u.id = g.assigned_officer_id
WHERE u.role = 'OFFICER'
GROUP BY u.id
ORDER BY grievance_count DESC;
```

### Get daily metrics for dashboard

```sql
SELECT 
  created_date,
  department_id,
  grievances_created,
  grievances_resolved,
  avg_response_time_hours,
  avg_resolution_time_hours,
  sla_response_breach_rate,
  sla_resolution_breach_rate
FROM daily_metrics
WHERE created_date >= NOW() - INTERVAL '30 days'
ORDER BY created_date DESC, department_id;
```

## Enum Values

### UserRole
```
CITIZEN      - Public grievance reporter
CREW         - Field verification team
OFFICER      - Department officer handling grievances
ADMIN        - System administrator
AUDITOR      - Compliance auditor (read-only access)
```

### GrievanceCategory
```
ROADS              - Pothole, damaged roads
WATER_SUPPLY       - Leaks, low pressure
SANITATION         - Garbage, sewage, drainage
ELECTRICITY        - Outages, fallen wires
TRANSPORT          - Bus routes, stops
STREET_LIGHTS      - Non-functional lights
PARK_MAINTENANCE   - Parks and gardens
NOISE_POLLUTION    - Excessive noise
ANIMAL_CONTROL     - Stray animals
PARKING            - Illegal parking
MISCELLANEOUS      - Other issues
```

### GrievanceStatus Lifecycle
```
CREATED      → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED
                   ↓
              REOPENED (if not satisfied)
                   ↓
              IN_PROGRESS → RESOLVED → CLOSED

                   ↓
              CONTESTED (if disputed)
                   ↓
              UNDER_AUDIT → AUDIT_RESOLVED
```

### VerificationType
```
INITIAL      - First verification after assignment
FOLLOW_UP    - Progress check during work
CLOSURE      - Final verification before resolution
```

## JSON Field Structures

### grievances.media_urls
```json
[
  {
    "type": "PHOTO|VIDEO|DOCUMENT",
    "url": "s3://bucket/path/file.jpg",
    "uploaded_at": "2026-01-15T10:30:00Z",
    "description": "Pothole damage"
  }
]
```

### grievances.metadata
```json
{
  "weather": "rainy",
  "traffic_level": "high",
  "estimated_cost": 5000,
  "equipment_needed": ["excavator", "cement"]
}
```

### team.service_area (PostGIS GeoJSON)
```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [28.5244, 77.1855],
      [28.5244, 77.2155],
      [28.5544, 77.2155],
      [28.5544, 77.1855],
      [28.5244, 77.1855]
    ]
  ]
}
```

## Key Indexes for Performance

```sql
-- Lookups
CREATE INDEX ix_grievances_grid_id ON grievances(grid_id);
CREATE INDEX ix_grievances_citizen_id ON grievances(citizen_id);
CREATE INDEX ix_grievances_assigned_department_id ON grievances(assigned_department_id);
CREATE INDEX ix_grievances_assigned_team_id ON grievances(assigned_team_id);

-- Status filtering
CREATE INDEX ix_grievances_status ON grievances(status);
CREATE INDEX ix_grievances_priority ON grievances(priority);

-- Time ranges
CREATE INDEX ix_grievances_created_at ON grievances(created_at DESC);
CREATE INDEX ix_sla_timers_deadline_at ON sla_timers(deadline_at);

-- Geospatial
CREATE INDEX ix_geo_clusters_location ON geo_clusters USING GIST(location);

-- Full-text (future)
-- CREATE INDEX ix_grievances_fulltext ON grievances USING GIN(
--   to_tsvector('english', title || ' ' || description)
-- );
```

## Common API Patterns

### Submit Grievance (POST /grievances)

```typescript
// Request
{
  title: "Large pothole on Main Street",
  description: "Dangerous pit causing traffic issues",
  category: "ROADS",
  priority: "HIGH",           // Will be overridden by AI
  latitude: "28.5244",
  longitude: "77.1855",
  location_address: "Main Street near Central Market",
  media_urls: [
    { type: "PHOTO", url: "s3://..." }
  ]
}

// On Create:
// 1. Generate grid_id = "GRI-2026-000001" (auto-increment)
// 2. Assign to citizen_id from JWT
// 3. Store with status = "CREATED"
// 4. Enqueue worker task: "process_grievance_ai"
//    - AI categorization
//    - Priority scoring
//    - Department assignment
//    - Damage severity estimation
// 5. Create SLA timers:
//    - RESPONSE deadline = now + 24h
//    - RESOLUTION deadline = now + 72h
```

### Assign to Department (PATCH /grievances/{id}/assign)

```typescript
// Typically done by AI or manual admin action
// 1. Update grievances.assigned_department_id
// 2. Find team in service area:
//    SELECT teams.* FROM teams
//    WHERE department_id = $1
//    AND ST_Contains(service_area, ST_Point($lat, $lon))
// 3. Update grievances.assigned_team_id
// 4. Pick lead officer from team_members with role=LEAD
// 5. Update grievances.assigned_officer_id
// 6. Change status → "ASSIGNED"
// 7. Notify officer via send_status_notification task
```

### Update Status (PATCH /grievances/{id}/status)

```typescript
// Workflow:
CREATED → ASSIGNED → IN_PROGRESS → RESOLVED → CLOSED

// On status change:
// 1. Update grievances.status
// 2. If RESOLVED: set grievances.resolved_at = now()
// 3. If RESOLVED: mark sla_timers.is_breached = false (if deadline passed)
// 4. If RESOLVED: update daily_metrics (aggregation)
// 5. Notify citizen via send_status_notification task
// 6. Add audit_logs entry
// 7. Trigger verification workflow if needed
```

### Fetch Dashboard Metrics (GET /metrics/daily)

```typescript
// Returns:
{
  period: "2026-01-15",
  total_grievances: 1543,
  created: 45,
  resolved: 38,
  closed: 32,
  departments: [
    {
      id: "dept_123",
      name: "Public Works",
      grievances_count: 425,
      avg_response_time_hours: 18.5,
      avg_resolution_time_hours: 62.3,
      sla_response_compliance: 0.92,
      sla_resolution_compliance: 0.88,
      crisis_hotspots: 3,
      officer_workload: [
        {
          officer_name: "Priya Singh",
          grievances: 12,
          in_progress: 5,
          avg_resolution_time: 48.2
        }
      ]
    }
  ]
}
```

## Database Connection Pooling

### Node.js (Recommended)

```typescript
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool);
```

### Python (FastAPI)

```python
from psycopg_pool import AsyncConnectionPool

async def lifespan(app: FastAPI):
    async with await AsyncConnectionPool.open(
        os.environ['DATABASE_URL'],
        min_size=5,
        max_size=20,
    ) as pool:
        app.state.db_pool = pool
        yield
```

## Performance Tips

1. **Always paginate** - Use `LIMIT/OFFSET` for large result sets
   ```sql
   SELECT * FROM grievances ORDER BY created_at DESC LIMIT 50 OFFSET 0;
   ```

2. **Use geospatial indexes** - PostGIS queries are fast with proper indexes
   ```sql
   CREATE INDEX ix_teams_service_area ON teams USING GIST(service_area);
   ```

3. **Batch operations** - Insert multiple records in one query
   ```typescript
   await db.insert(grievances).values([...]) // Much faster than loop
   ```

4. **Connection pooling** - Share connections across requests
   ```typescript
   // NOT: new Pool() per request
   // YES: Global pool with pooling
   ```

5. **Cache frequently accessed data** - Use Redis for:
   - Department list
   - Team service areas
   - Officer assignments
   - Daily metrics

## Monitoring Queries

```sql
-- Slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Cache hit ratio (target: >99%)
SELECT 
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit) as heap_hit,
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;

-- Table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Active connections
SELECT datname, usename, application_name, state, count(*)
FROM pg_stat_activity
GROUP BY datname, usename, application_name, state;
```

## Backup/Restore

```bash
# Backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql $DATABASE_URL < backup_20260115_153000.sql

# Compressed backup (recommended for production)
pg_dump -Fc $DATABASE_URL > backup.dump
pg_restore -d grievances backup.dump
```

---

**Last Updated**: Schema v1.0.0  
**Database**: PostgreSQL 16  
**ORM**: Drizzle v0.30+
