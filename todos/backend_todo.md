# Backend Todo (apps/api — FastAPI + apps/worker — Celery)

## 🗂️ Project Setup
- [ ] Initialize `apps/api` with FastAPI and `pyproject.toml`
- [x] Set up `requirements.txt` (fastapi, uvicorn, pydantic, sqlalchemy, drizzle-equivalent, redis, celery, etc.)
- [ ] Configure `apps/api/src/core/config.py` with Pydantic Settings (env loading)
- [ ] Configure `apps/api/src/core/logging.py` with structured JSON logging
- [ ] Set up `.env` with `DATABASE_URL`, `REDIS_URL`, `QDRANT_URL`, `JWT_SECRET`, `LLM_API_URL`
- [x] Initialize `apps/worker` with Celery and `celery_app.py`

---

## 🗄️ Database (`packages/database`)
- [ ] Initialize `packages/database` with Drizzle ORM
- [ ] Enable PostgreSQL extensions: `uuid-ossp`, `postgis`
- [ ] Write Drizzle schema (`schema.ts`) for all tables:
  - [ ] `users` (with `google_id` and `password_hash` for dual auth)
  - [ ] `grievances` (with all AI fields, location, SLA, media columns)
  - [ ] `sla_timers`
  - [ ] `departments` and `teams` and `team_members`
  - [ ] `geo_clusters` and `cluster_members`
  - [ ] `verifications`
  - [ ] `audit_logs`
  - [ ] `vector_references` (Qdrant pointer)
  - [ ] `infrastructure_assets`
  - [ ] `daily_metrics`
- [ ] Create and run initial database migration
- [ ] Add PostGIS geospatial index on `grievances` table (`GIST` on lat/lng)
- [ ] Write seed script (`scripts/seed-db.sh`) with departments, teams, and sample data
- [ ] Export typed `db` client from `packages/database/src/index.ts`

---

## 🔐 Authentication (`core/security.py`)
- [ ] Implement Google OAuth 2.0 flow (authorization code exchange, profile fetch)
- [ ] Implement Basic Auth registration (hash password with bcrypt)
- [ ] Implement Basic Auth login (verify password hash)
- [ ] Generate JWT on successful auth with payload: `sub`, `email`, `name`, `role`, `auth_type`, `exp`
- [ ] JWT validation middleware (`verify_token` dependency)
- [ ] Role-based access control (RBAC) guards for CITIZEN, CREW, OFFICER, ADMIN, AUDITOR
- [ ] Redis session management (store and invalidate tokens)
- [ ] Rate limiter middleware (per-IP, using Redis)

---

## 📮 Grievance Endpoints (`api/v1/grievances.py`)
- [ ] `POST /grievances` — Submit grievance:
  - Validate with Pydantic schema
  - Generate unique Grid ID (`GRI-YYYY-XXXXXX`)
  - Create SLA timers (RESPONSE, RESOLUTION)
  - Persist to PostgreSQL
  - Dispatch `process_grievance_ai` Celery task
  - Return Grid ID + SLA deadlines
- [ ] `GET /grievances/{id}` — Full grievance detail (officer+)
- [ ] `PATCH /grievances/{id}/status` — Update status through lifecycle
- [ ] `POST /grievances/{id}/feedback` — Citizen satisfaction rating (1–5)
- [ ] `POST /grievances/{id}/contest` — Contest resolution, trigger AI audit
- [ ] `GET /grievances` — List with filter (status, category, department, priority)

---

## 📡 Tracking Endpoint (`api/v1/tracking.py`)
- [ ] `GET /track/{grid_id}` — Public endpoint (no auth required):
  - Fetch grievance by Grid ID
  - Query `audit_logs` to build timeline
  - Calculate SLA remaining time
  - Fetch assigned team's live location from Redis
  - Return ML-predicted ETA
- [ ] WebSocket endpoint `/ws/track/{grid_id}` for live updates:
  - Subscribe to Redis pub/sub channel for the grievance
  - Push updates when status changes

---

## 🎤 Voice Endpoint (`api/v1/voice.py`)
- [ ] `POST /voice/process` — Accept multipart audio file:
  - Validate audio format (.wav, .mp3)
  - Store file to object storage (S3 / Supabase Storage)
  - Dispatch `process_voice_grievance` Celery task
  - Return transcription preview + created Grid ID

---

## 🗺️ Clusters Endpoint (`api/v1/clusters.py`)
- [ ] `GET /clusters` — Admin endpoint (ADMIN role):
  - Query `geo_clusters` filtered by `is_active` and type
  - Return cluster list with crisis score, topics, location
- [ ] Background job to periodically re-cluster new grievances via Celery scheduler

---

## 📊 Analytics Endpoint (`api/v1/analytics.py`)
- [ ] `GET /analytics/dashboard` — Admin endpoint:
  - Aggregate totals from `grievances` (total, resolved, escalated, pending)
  - Compute SLA compliance rates (response and resolution)
  - Break down by category and priority
  - Return heatmap data points
  - Return predictive alerts from `infrastructure_assets`

---

## 🔧 Core Services (`services/`)
- [ ] **`grievance_service.py`**:
  - CRUD operations
  - Status lifecycle validation (enforce valid transitions)
  - Grid ID generation logic
- [ ] **`sla_service.py`**:
  - SLA timer creation with correct deadlines per category/priority
  - Escalation threshold calculation
  - `check_and_escalate()` function for background polling
- [ ] **`routing_service.py`**:
  - Receive GNN-predicted department
  - Find nearest available team by GeoJSON service area
  - Priority queue management
- [ ] **`verification_service.py`**:
  - Validate geo-tagged photo distance from incident (tolerance: 50m)
  - Update grievance status to PENDING_VERIFICATION / VERIFIED
- [ ] **`analytics_service.py`**:
  - KPI aggregation queries
  - Heatmap data preparation
  - Scheduled `daily_metrics` snapshot generation
- [ ] **`ai_service.py`**:
  - HTTP client wrappers for LLM, CV, GNN microservices
  - Retry logic and fallback handling

---

## 🏭 Repositories (`repositories/`)
- [ ] `grievance_repo.py` — All DB queries for grievances (with raw SQL for PostGIS)
- [ ] `user_repo.py` — User lookup by email, Google ID, UUID
- [ ] `cluster_repo.py` — Cluster CRUD and geospatial queries

---

## 🔄 Background Workers (`apps/worker/`)
- [ ] **`ai_processing.py`** Celery task:
  - Call LLM for category + priority extraction
  - Call CV model for image severity score (if photo attached)
  - Generate BERT embedding and index in Qdrant
  - Call GNN for department routing
  - Update grievance record with AI results
- [ ] **`clustering.py`** Celery periodic task:
  - Fetch recent grievances
  - Run DBSCAN and LDA
  - Upsert `geo_clusters` table
- [ ] **`maintenance.py`** Celery periodic task:
  - Query complaint frequency per asset
  - Update `failure_risk_score` in `infrastructure_assets`
- [ ] **`notifications.py`** Celery task:
  - Send push notifications / SMS on status change
  - Publish Redis pub/sub event for WebSocket clients
- [ ] **`sla_monitor.py`** Celery beat scheduler:
  - Poll `sla_timers` every minute
  - Trigger escalation alerts to senior officers if deadline approaching

### ✅ Worker Progress Snapshot (implemented so far)
- [x] Added worker runtime files: `apps/worker/requirements.txt`, `apps/worker/Dockerfile`, `apps/worker/.env.example`, `apps/worker/README.md`
- [x] Added Celery bootstrap and routing: `apps/worker/src/celery_app.py`, `apps/worker/src/config.py`
- [x] Added task modules scaffold: `ai_processing.py`, `clustering.py`, `maintenance.py`, `notifications.py`
- [x] Added scheduler modules scaffold: `sla_monitor.py`, `report_generator.py`
- [x] Configured Celery Beat schedules for SLA monitor, clustering, maintenance, and daily report snapshot
- [x] Added API-to-worker task dispatch client in `apps/api/src/core/worker.py`
- [x] Wired endpoint dispatches:
  - `POST /api/v1/grievances` dispatches `process_grievance_ai`
  - `POST /api/v1/voice/process` dispatches `process_voice_grievance`
  - `POST /api/v1/clusters/recluster` dispatches `recluster_recent_grievances`
- [ ] Replace placeholder task logic with real DB/ML/Qdrant/Redis integrations

---

## 📐 GraphQL (`packages/graphql`)
- [ ] Define `typeDefs.gql` with all types from API_SPEC (Grievance, TrackingInfo, GeoCluster, etc.)
- [ ] Implement resolvers:
  - [ ] `grievance.ts` — `grievance`, `grievances`, `submitGrievance`, `updateStatus`, `submitFeedback`, `contestResolution`
  - [ ] `user.ts` — `me`, auth mutations
  - [ ] `cluster.ts` — `clusters`, `dashboard`
- [ ] Apollo Server setup in `packages/graphql/src/server.ts`
- [ ] Code-gen setup (`codegen.yml`) to auto-generate TypeScript types for frontend

---

## 🧪 Testing
- [ ] Unit tests for all services (mock DB and ML clients)
- [ ] Integration tests for all REST endpoints
- [ ] Test auth flows (Google OAuth mock and Basic Auth)
- [ ] Test SLA escalation logic
- [ ] Test geospatial distance validation (verification 50m tolerance)
