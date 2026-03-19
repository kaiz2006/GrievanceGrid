# @grievancegrid/database

PostgreSQL database schema and ORM layer for GrievanceGrid using Drizzle ORM.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env.local

# 3. Full setup (generate migrations + apply + seed)
npm run db:setup
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate migrations from schema changes |
| `npm run db:push` | Apply pending migrations to PostgreSQL |
| `npm run db:migrate` | Run migrations (manual control) |
| `npm run db:seed` | Populate database with initial data |
| `npm run db:studio` | Open interactive Drizzle Studio UI |
| `npm run db:setup` | One-command setup: generate → push → seed |

## Database Schema

### Tables (14 total)

#### Authentication & Access Control
- **users** - User accounts with roles (CITIZEN, CREW, OFFICER, ADMIN, AUDITOR)
- **sessions** - OAuth/JWT session tokens with expiry

#### Organizational Structure
- **departments** - City departments with SLA targets
- **teams** - Department teams with GeoJSON service areas
- **team_members** - Team membership with role assignments

#### Grievance Management
- **grievances** - Main grievance records with full lifecycle tracking
- **sla_timers** - Response and Resolution SLA deadline tracking
- **verifications** - On-site verification records by crew

#### Analytics & ML
- **daily_metrics** - Department performance KPIs (response time, resolution rate)
- **geo_clusters** - Geospatial hotspot analysis for crisis response
- **cluster_members** - Grievances grouped in hotspot clusters
- **infrastructure_assets** - Predictive maintenance tracking

#### Vector Search & Audit
- **vector_references** - Qdrant embedding pointers for semantic search
- **audit_logs** - Immutable append-only event trail

### Key Enums

- `UserRole` - CITIZEN, CREW, OFFICER, ADMIN, AUDITOR
- `AuthType` - BASIC, GOOGLE_OAUTH
- `GrievanceCategory` - ROADS, WATER_SUPPLY, SANITATION, ELECTRICITY, TRANSPORT, etc.
- `GrievancePriority` - LOW, MEDIUM, HIGH, CRITICAL
- `GrievanceStatus` - CREATED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED, REOPENED, CONTESTED
- `SLAType` - RESPONSE, RESOLUTION
- `VerificationType` - INITIAL, FOLLOW_UP, CLOSURE
- `VerificationStatus` - PENDING, VERIFIED, REJECTED, ESCALATED

## Schema Highlights

### Grievances Table

```typescript
{
  id: UUID                      // Primary key
  grid_id: STRING              // Human-friendly ID (GRI-2026-000001)
  citizen_id: UUID             // Reporter (FK: users)
  assigned_department_id: UUID // Department responsible
  assigned_team_id: UUID       // Assigned team (FK: teams)
  assigned_officer_id: UUID    // Lead officer (FK: users)
  
  // Core fields
  title: STRING
  description: TEXT
  category: ENUM
  priority: ENUM
  status: ENUM
  
  // Location
  latitude: STRING
  longitude: STRING
  location_address: STRING
  service_area_id: UUID        // Geofenced area
  
  // Media
  media_urls: JSON[]           // Photos, videos, documents
  
  // AI Enrichment
  ai_category: ENUM
  ai_priority: ENUM
  ai_summary: TEXT
  damage_severity: DECIMAL     // 0-1 severity score
  recommended_department_id: UUID
  
  // Feedback
  citizen_feedback: TEXT
  citizen_rating: INTEGER      // 1-5
  
  // Contestation
  is_contested: BOOLEAN
  contest_reason: TEXT
  
  // Tracking
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
  resolved_at: TIMESTAMP
}
```

### SLA Timers Table

```typescript
{
  id: UUID
  grievance_id: UUID          // FK: grievances
  sla_type: ENUM              // RESPONSE or RESOLUTION
  deadline_at: TIMESTAMP
  notified_at: TIMESTAMP      // When warning sent
  is_breached: BOOLEAN
  breach_notified_at: TIMESTAMP
  escalation_level: INTEGER   // 0=none, 1=dept_head, 2=admin
}
```

### Geo Clusters Table

```typescript
{
  id: UUID
  department_id: UUID
  location: GEOMETRY          // PostGIS point
  hotspot_radius_m: INTEGER
  grievance_count: INTEGER
  average_severity: DECIMAL
  crisis_score: DECIMAL       // 0-1 criticality
  last_analyzed_at: TIMESTAMP
  cluster_members: []         // Grievance IDs in cluster
}
```

## Environment Setup

See [SETUP.md](./SETUP.md) for detailed instructions:

1. PostgreSQL installation and configuration
2. Docker Compose alternative for local development
3. Connection string configuration
4. Migration generation and application
5. Initial data seeding
6. Troubleshooting guide

### Basic Setup

```bash
# Create .env with your PostgreSQL connection
echo 'DATABASE_URL="postgresql://user:pass@localhost:5432/grievances"' > .env.local

# Run full setup
npm run db:setup
```

## Using the Database

### TypeScript/Node.js

```typescript
import { db } from '@grievancegrid/database'
import { grievances, users } from '@grievancegrid/database/schema'

// Query
const allGrievances = await db.query.grievances.findMany()
const highPriority = await db.query.grievances.findMany({
  where: eq(grievances.priority, 'HIGH')
})

// Insert
const newGrievance = await db.insert(grievances).values({
  grid_id: 'GRI-2026-000001',
  title: 'Pothole on Main Street',
  // ...
}).returning()

// Update
await db.update(grievances)
  .set({ status: 'RESOLVED' })
  .where(eq(grievances.id, grievanceId))

// Delete
await db.delete(grievances).where(eq(grievances.id, grievanceId))
```

### Python (FastAPI)

Options:
1. **Call TypeScript endpoints** - Use HTTP client to call Node.js API endpoints
2. **Raw SQL via pg driver** - Execute raw queries directly
3. **Hybrid approach** - Keep database in PostgreSQL, use SQLAlchemy for Python ORM

```python
# Option 2: Raw SQL in FastAPI
import psycopg
from psycopg.rows import dict_row

async def get_grievances():
    async with await psycopg.AsyncConnection.connect(os.environ['DATABASE_URL']) as conn:
        async with conn.cursor(row_factory=dict_row) as cur:
            await cur.execute('SELECT * FROM grievances WHERE status = %s', ('CREATED',))
            return await cur.fetchall()
```

## Design Decisions

### Why Drizzle ORM?

- ✅ Type-safe SQL builder with IntelliSense
- ✅ Zero runtime overhead
- ✅ Seamless TypeScript integration
- ✅ Powerful query composition
- ✅ Native PostgreSQL features (JSONB, Enums, PostGIS)

### Schema Design Principles

- **Normalization**: Proper 3NF to avoid redundancy
- **Auditability**: All changes logged in `audit_logs`
- **Scalability**: Strategic indexes on frequently queried columns
- **Flexibility**: JSONB fields for semi-structured data (media, metadata)
- **Geospatial**: PostGIS support for location-based queries

### Index Strategy

- Primary Keys: `users.id`, `grievances.id`, etc.
- Lookups: `grievances.grid_id`, `grievances.citizen_id`, `grievances.assigned_department_id`
- Ranges: `grievances.created_at`, `grievances.status`
- Geospatial: `geo_clusters.location` (PostGIS index)
- Full-text: Future: `grievances.title`, `grievances.description`

## Integration Points

### Worker (apps/worker)

```python
from packages.database import get_db

# Process grievance from queue
async def process_grievance_ai(task):
    db = get_db()
    grievance = db.query.grievances.findFirst(id=task.grievance_id)
    
    # AI enrichment...
    
    db.update(grievances).set({
        ai_category: ...,
        ai_priority: ...,
        ai_summary: ...
    }).where(eq(grievances.id, grievance.id))
```

### API (apps/api)

```python
from packages.database import db

@app.post("/grievances")
async def create_grievance(req: GrievanceSchema):
    grievance = db.insert(grievances).values({
        grid_id: generate_grid_id(),
        citizen_id: current_user.id,
        ...
    }).returning()[0]
    
    # Trigger worker tasks
    celery_app.send_task('process_grievance_ai', args=[grievance.id])
    
    return grievance
```

### Web (apps/web)

```typescript
import { getRPCClient } from '@grievancegrid/database'

export async function getGrievances() {
  const client = getRPCClient()
  return client.query.grievances.findMany()
}
```

## Development Workflow

1. **Schema Changes**
   ```bash
   # Edit src/schema.ts
   npm run db:generate    # Creates migration
   npm run db:push        # Applies to database
   ```

2. **Query Development**
   ```bash
   npm run db:studio      # Open visual query builder
   ```

3. **Data Testing**
   ```bash
   npm run db:seed        # Reset with sample data
   ```

## Production Considerations

- **Connection Pooling**: Use PgBouncer for multiple app instances
- **Backup Strategy**: Daily snapshots, WAL archiving
- **Monitoring**: Track slow queries, connections, cache hit ratio
- **Security**: SSL connections, IP whitelisting, secrets management
- **Versioning**: Tag releases with schema versions

See [SETUP.md](./SETUP.md) for production deployment checklist.

## Troubleshooting

### Migration Conflicts

```bash
# Reset database (development only)
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
npm run db:setup
```

### Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check service
sudo systemctl status postgresql

# View logs
sudo tail -f /var/log/postgresql/postgresql.log
```

### Drizzle Studio Won't Start

```bash
npm run db:studio      # If UI won't load, check:
# - DATABASE_URL is correct
# - PostgreSQL is accessible
# - Port 3001 is available
```

## References

- [Drizzle Documentation](https://orm.drizzle.team/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [PostGIS Manual](https://postgis.net/documentation/)
- [GrievanceGrid Architecture](../docs/ARCHITECTURE.md)
- [Database Schema Spec](../docs/DATABASE_SCHEMA.md)

## License

Part of GrievanceGrid - Proprietary
