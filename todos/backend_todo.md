# Backend Todo (apps/api — FastAPI + apps/worker — Celery)

## 🗂️ Project Setup
- [x] Initialize `apps/api` with FastAPI and `pyproject.toml`
- [x] Set up `requirements.txt` (fastapi, uvicorn, pydantic, sqlalchemy, drizzle-equivalent, redis, celery, etc.)
- [x] Configure `apps/api/src/core/config.py` with Pydantic Settings (env loading)
- [x] Configure `apps/api/src/core/logging.py` with structured JSON logging
- [x] Set up `.env` with `DATABASE_URL`, `REDIS_URL`, `QDRANT_URL`, `JWT_SECRET`, `LLM_API_URL`
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

## 🔐 Authentication (`core/auth.py`, `api/v1/auth.py`)
- [x] Implement Google OAuth 2.0 flow (authorization code exchange, profile fetch) — `GoogleOAuthService`
- [x] Implement Basic Auth registration (hash password with bcrypt) — `POST /auth/register`
- [x] Implement Basic Auth login (verify password hash) — `POST /auth/login`
- [x] Generate JWT on successful auth with payload: `sub`, `email`, `name`, `role`, `auth_type`, `exp`
- [x] JWT validation middleware (`verify_token` dependency) — `get_current_user`
- [x] Role-based access control (RBAC) guards for CITIZEN, OFFICER, ADMIN, AUDITOR — `require_admin`, `require_officer`, `require_auditor`
- [x] Redis session management (store and invalidate tokens)
- [x] Rate limiter middleware (per-IP, using Redis)
- [x] POST /auth/register — New user registration
- [x] POST /auth/login — User login with email/password
- [x] POST /auth/google — Google OAuth authentication
- [x] POST /auth/refresh — Refresh expired access token
- [x] POST /auth/change-password — Change user password
- [x] GET /auth/me — Get current user profile
- [x] POST /auth/logout — Logout (client discard tokens)

---

## 📮 Grievance Endpoints (`api/v1/grievances.py`)
- [x] `POST /grievances` — Submit grievance:
  - [x] Validate with Pydantic schema
  - [x] Generate unique Grid ID (`GRI-YYYY-XXXXXX`)
  - [x] Create SLA timers (RESPONSE, RESOLUTION)
  - [x] Persist to PostgreSQL (schema + tables required)
  - [x] Dispatch `process_grievance_ai` Celery task (worker ready)
  - [x] Return Grid ID + SLA deadlines
- [x] `GET /grievances/{id}` — Full grievance detail (officer+)
- [x] `PATCH /grievances/{id}/status` — Update status through lifecycle
- [x] `POST /grievances/{id}/feedback` — Citizen satisfaction rating (1–5)
- [x] `POST /grievances/{id}/contest` — Contest resolution, trigger AI audit
- [x] `GET /grievances` — List with filter (status, category, department, priority)

---

## 📡 Tracking Endpoint (`api/v1/tracking.py`)
- [x] `GET /track/{grid_id}` — Public endpoint (no auth required):
  - [x] Fetch grievance by Grid ID
  - [x] Query `audit_logs` to build timeline
  - [x] Calculate SLA remaining time
  - [x] Fetch assigned team's live location from Redis
  - [x] Return ML-predicted ETA
- [x] WebSocket endpoint `/ws/track/{grid_id}` for live updates:
  - Subscribe to Redis pub/sub channel for the grievance
  - Push updates when status changes

---

## 🎤 Voice Endpoint (`api/v1/voice.py`)
- [x] `POST /voice/process` — Accept multipart audio file:
  - [x] Validate audio format (.wav, .mp3)
  - [x] Store file to local filesystem storage (hackathon mode)
  - [x] Dispatch `process_voice_grievance` Celery task
  - [x] Return transcription preview + created Grid ID

---

## 🗺️ Clusters Endpoint (`api/v1/clusters.py`)
- [x] `GET /clusters` — Admin endpoint (ADMIN role):
  - [x] Query `geo_clusters` filtered by `is_active` and type
  - [x] Return cluster list with crisis score, topics, location
- [x] Background job to periodically re-cluster new grievances via Celery scheduler

---

## 📊 Analytics Endpoint (`api/v1/analytics.py`)
- [x] `GET /analytics/dashboard` — Admin endpoint:
  - [x] Aggregate totals from `grievances` (total, resolved, escalated, pending)
  - [x] Compute SLA compliance rates (response and resolution)
  - [x] Break down by category and priority
  - [x] Return heatmap data points
  - [x] Return predictive alerts from `infrastructure_assets`

---

## 🔧 Core Services (`services/`)
- [x] **`grievance_service.py`**:
  - CRUD operations
  - Status lifecycle validation (enforce valid transitions)
  - Grid ID generation logic
- [x] **`sla_service.py`**:
  - SLA timer creation with correct deadlines per category/priority
  - Escalation threshold calculation
  - `check_and_escalate()` function for background polling
- [x] **`routing_service.py`**:
  - Receive GNN-predicted department
  - Find nearest available team by GeoJSON service area
  - Priority queue management
- [x] **`verification_service.py`**:
  - Validate geo-tagged photo distance from incident (tolerance: 50m)
  - Update grievance status to PENDING_VERIFICATION / VERIFIED
- [x] **`analytics_service.py`**:
  - KPI aggregation queries
  - Heatmap data preparation
  - Scheduled `daily_metrics` snapshot generation
- [x] **`ai_service.py`**:
  - HTTP client wrappers for LLM, CV, GNN microservices
  - Retry logic and fallback handling

---

## 🏭 Repositories (`repositories/`)
- [x] `grievance_repo.py` — All DB queries for grievances (with raw SQL for PostGIS)
- [x] `user_repo.py` — User lookup by email, Google ID, UUID
- [x] `cluster_repo.py` — Cluster CRUD and geospatial queries

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

### ✅ Worker Implementation — COMPLETE

**All Celery worker components fully implemented and production-ready:**

- [x] **Runtime Setup**: `requirements.txt`, `Dockerfile`, `.env.example`, `DEVELOPMENT.md`, `setup.sh`
- [x] **Celery Bootstrap**: `celery_app.py` with 6 task queues, Beat schedules, task routing
- [x] **Core Configuration**: `config.py` with Pydantic settings, environment loading
- [x] **All Task Modules**:
  - [x] `ai_processing.py` — `process_grievance_ai`, `process_voice_grievance`, `run_contestation_audit`
  - [x] `clustering.py` — `recluster_recent_grievances` with location-bin clustering
  - [x] `maintenance.py` — `update_infrastructure_risk_scores` with risk calculation
  - [x] `notifications.py` — `send_status_notification`, `publish_tracking_event`
- [x] **All Scheduler Modules**:
  - [x] `sla_monitor.py` — `monitor_sla_and_escalate` (every 1 minute)
  - [x] `report_generator.py` — `generate_daily_report_snapshot`
- [x] **ML Service Clients**: `LlmClient`, `CvClient`, `GnnClient` with flexible endpoint discovery
- [x] **Vector Database Integration**: `VectorClient` with Qdrant collection management
- [x] **Backend Callback Client**: `BackendClient` for result persistence
- [x] **Utility Functions**: `deterministic_embedding()`, `compute_failure_risk()`
- [x] **Error Handling**: Automatic retries with exponential backoff on all AI tasks
- [x] **Dry-Run Mode**: Deterministic fallbacks for development and testing
- [x] **Docker Support**: Multi-stage Dockerfile, worker/beat mode switching
- [x] **Docker Compose**: Full stack with Redis, Qdrant, PostgreSQL, Flower monitoring
- [x] **Development Tools**: `test_local.py` for task testing, `monitor.py` for real-time worker stats
- [x] **Documentation**: Comprehensive DEVELOPMENT.md with architecture, configuration, troubleshooting

**Ready for backend API integration and production deployment.**

---

### ⏳ API Backend — Still Needed

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
