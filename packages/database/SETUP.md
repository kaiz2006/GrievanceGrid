# Database Setup Guide for GrievanceGrid

## Overview

This guide walks through setting up the PostgreSQL database for GrievanceGrid using Drizzle ORM.

## Prerequisites

- PostgreSQL 16+ installed and running
- Node.js 18+ and npm installed
- Basic understanding of PostgreSQL and environment variables

## Step 1: PostgreSQL Setup

### Option A: Local PostgreSQL (Development)

**On macOS (using Homebrew):**
```bash
brew install postgresql
brew services start postgresql
createdb grievances
psql grievances
```

**On Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb grievances
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

**On Windows:**
- Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
- During setup, create user `postgres` with password `postgres`
- Ensure PostgreSQL service is running

### Option B: Docker (Recommended for Development)

```bash
# From project root
docker-compose -f apps/worker/docker-compose.yml up -d postgres

# Create database
docker exec -it grievancegrid-postgres psql -U postgres -c "CREATE DATABASE grievances;"
```

### Verify Connection

```bash
psql postgresql://grievances:grievances@localhost:5432/grievances -c "SELECT 1;"
```

Expected output: `1`

## Step 2: Environment Configuration

Create `.env.local` in the `packages/database` directory:

```env
# PostgreSQL Connection
DATABASE_URL="postgresql://grievances:grievances@localhost:5432/grievances"

# Drizzle Configuration
DRIZZLE_CONFIG_PATH="./drizzle.config.ts"

# Optional: For Drizzle Studio
DRIZZLE_INTROSPECT=true
```

Create `.env` in the root directory so it's accessible to all apps:

```env
# Database
DATABASE_URL="postgresql://grievances:grievances@localhost:5432/grievances"

# API
API_PORT=8000
LOG_LEVEL=debug

# Worker
CELERY_BROKER_URL="redis://localhost:6379/0"
CELERY_RESULT_BACKEND="redis://localhost:6379/1"

# Vector DB
QDRANT_URL="http://localhost:6333"

# ML Services (update endpoints as needed)
LLM_SERVICE_URL="http://localhost:8001"
CV_SERVICE_URL="http://localhost:8002"
GNN_SERVICE_URL="http://localhost:8003"
```

## Step 3: Install Dependencies

```bash
cd packages/database
npm install
```

## Step 4: Generate & Apply Migrations

### Generate migrations from schema:

```bash
npm run db:generate
```

This creates migration files in `packages/database/drizzle/migrations/` based on your `schema.ts`.

Expected output:
```
✔ Generated 1 migration file in drizzle/migrations folder
```

### Apply migrations to database:

```bash
npm run db:push
```

This applies all pending migrations to PostgreSQL.

Expected output:
```
✔ All migrations successfully applied!
```

### Alternative: One-Command Setup

```bash
npm run db:setup
```

This runs: generate → push → seed (all in one)

## Step 5: Seed Initial Data

The seed script populates the database with:
- 5 Departments (Public Works, Water Supply, Sanitation, Electricity, Transport)
- 4 Teams with geographic service areas
- 4 Sample Users (Citizen, Officer, Admin, Crew)
- 2 Sample Grievances with SLA timers
- 10 SLA timer entries

```bash
npm run db:seed
```

Expected output:
```
✅ Database seeding completed successfully!

📊 Summary:
  • Departments: 5
  • Teams: 4
  • Users: 4
  • Grievances: 2
  • SLA Timers: 4

🔑 Test Credentials:
  Citizen:  citizen@example.com
  Officer:  officer@example.com
  Admin:    admin@example.com
  Crew:     crew@example.com
```

## Step 6: Verify Database Structure

### View all tables:

```bash
psql postgresql://grievances:grievances@localhost:5432/grievances -c "\dt"
```

Expected tables:
- `users` - User accounts with authentication
- `departments` - City departments
- `teams` - Department teams with GeoJSON service areas
- `team_members` - Team membership with roles
- `grievances` - Grievance records with full lifecycle
- `sla_timers` - SLA deadline tracking
- `verifications` - Field verification records
- `audit_logs` - Immutable event audit trail
- `geo_clusters` - Crisis hotspot clustering
- `cluster_members` - Grievances in clusters
- `infrastructure_assets` - Predictive maintenance assets
- `vector_references` - Qdrant vector embedding pointers
- `daily_metrics` - Daily performance metrics
- `sessions` - User session tokens

### View table structure:

```bash
psql postgresql://grievances:grievances@localhost:5432/grievances -c "\d grievances"
```

### Query sample data:

```bash
psql postgresql://grievances:grievances@localhost:5432/grievances -c "SELECT grid_id, title, status FROM grievances;"
```

## Step 7: Interactive Database Exploration

Launch Drizzle Studio for visual database browsing:

```bash
npm run db:studio
```

Opens web UI at `http://localhost:3001` where you can:
- Browse tables and data
- Run SQL queries
- Visualize relationships
- Export data

## Step 8: Using Database in API

In `apps/api/src/main.py`:

```python
from packages.database import db

# Query example
@app.get("/grievances")
async def list_grievances():
    # Import from generated TypeScript (or use raw SQL)
    result = await db.query.grievances.findMany()
    return result

@app.post("/grievances")
async def create_grievance(grievance: GrievanceSchema):
    # Insert
    result = await db.insert(grievances).values({...}).returning()
    return result
```

Note: Python API needs to execute TypeScript/SQL or use an API layer. Alternative approaches:
1. Use TypeScript/Node.js for API alongside Python backend
2. Expose database through REST endpoints
3. Use raw SQL via pg driver in Python

## Troubleshooting

### Connection Failed

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solutions:**
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check connection string in `.env`
- Ensure password is correct

### Migration Already Applied

**Error:** `Error: migration file already exists`

**Solution:**
```bash
# Reset migrations (development only!)
npm run db:reset  # If available
# OR manually delete migration file and regenerate
```

### Cannot Access Database

**Error:** `FATAL: Ident authentication failed for user "grievances"`

**Solution (Linux):**
```bash
sudo -u postgres psql -c "ALTER USER grievances WITH PASSWORD 'grievances';"
```

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5432`

**Solution:**
```bash
# Find process using port 5432
lsof -i :5432

# Kill process
kill -9 <PID>

# Or use different port in DATABASE_URL
```

### Seed Script Fails

**Error:** `Error: duplicate key value violates unique constraint`

**Solution:**
```bash
# Reset database (development only)
psql postgresql://grievances:grievances@localhost:5432/grievances -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Re-run migrations
npm run db:push
npm run db:seed
```

## Production Deployment

### Security Checklist

- [ ] Use strong password for database user
- [ ] Enable SSL connections: `postgresql://user:pass@host:5432/db?sslmode=require`
- [ ] Restrict database access to trusted IPs
- [ ] Use environment variables for connection string
- [ ] Enable PostgreSQL audit logging
- [ ] Regular backups (daily or per-SLA requirement)
- [ ] Use connection pooling (PgBouncer)

### Backup & Recovery

```bash
# Backup database
pg_dump postgresql://grievances:grievances@localhost:5432/grievances > backup.sql

# Restore from backup
psql postgresql://grievances:grievances@localhost:5432/grievances < backup.sql

# Backup with compression
pg_dump -Fc postgresql://grievances:grievances@localhost:5432/grievances > backup.dump
pg_restore -d grievances backup.dump
```

## Next Steps

After database setup:

1. **Run API server** (see [apps/api/README.md](../../apps/api/README.md))
   - API will use database for grievance CRUD operations

2. **Start worker** (see [apps/worker/README.md](../../apps/worker/README.md))
   - Worker will consume grievances and store results

3. **Launch frontend** (see [apps/web/README.md](../../apps/web/README.md))
   - Frontend queries API for display

4. **Monitor database** with Drizzle Studio or pgAdmin

## Database Schema Overview

### Core Entities

- **Users**: Citizen, Officer, Crew, Admin, Auditor roles with OAuth/Basic auth
- **Departments**: City departments with SLA targets
- **Teams**: Department teams with GeoJSON service areas
- **Grievances**: Complete lifecycle with AI enrichment and media
- **SLA Timers**: Response and Resolution deadline tracking

### Analytics & ML

- **Daily Metrics**: Aggregated performance KPIs per department
- **Geo Clusters**: Geospatial hotspot identification
- **Vector References**: Qdrant embedding pointers for semantic search
- **Infrastructure Assets**: Predictive maintenance tracking

### Audit & Security

- **Audit Logs**: Immutable append-only event trail
- **Sessions**: Secure token-based session management
- **Verifications**: Field verification audit records

## Reference

- [Drizzle Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [GrievanceGrid Architecture](../docs/ARCHITECTURE.md)
- [Database Schema](../docs/DATABASE_SCHEMA.md)
