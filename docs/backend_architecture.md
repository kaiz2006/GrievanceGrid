# 🏗️ GrievanceGrid — Backend Architecture Design

> **Stack:** FastAPI (Python) · PostgreSQL · Firebase Auth · Uvicorn  
> **Deployment:** Render / Railway (API) · Supabase / Neon (DB)

---

## 1. Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app factory, startup/shutdown events
│   ├── config.py                # Settings via pydantic-settings (env vars)
│   │
│   ├── core/                    # Cross-cutting concerns
│   │   ├── security.py          # Firebase token verification, RBAC helpers
│   │   ├── dependencies.py      # Reusable FastAPI dependency injections
│   │   ├── exceptions.py        # Custom exception classes & global handlers
│   │   └── rate_limiter.py      # Rate-limiting middleware (slowapi)
│   │
│   ├── models/                  # SQLAlchemy ORM models
│   │   ├── user.py
│   │   ├── complaint.py
│   │   ├── department.py
│   │   ├── assignment.py
│   │   ├── status_history.py
│   │   ├── sla_rule.py
│   │   ├── feedback.py
│   │   ├── grid_lane.py
│   │   └── notification_log.py
│   │
│   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── user.py
│   │   ├── complaint.py
│   │   ├── department.py
│   │   ├── assignment.py
│   │   ├── sla.py
│   │   ├── feedback.py
│   │   ├── analytics.py
│   │   └── common.py            # Pagination, error responses, enums
│   │
│   ├── api/                     # Route handlers (organized by domain)
│   │   ├── v1/
│   │   │   ├── auth.py          # POST /auth/register, /auth/verify-token
│   │   │   ├── complaints.py    # Citizen complaint CRUD
│   │   │   ├── officer.py       # Officer task management
│   │   │   ├── admin.py         # Admin operations & user management
│   │   │   ├── routing.py       # Auto-assign & reassign
│   │   │   ├── sla.py           # SLA rules & overdue queries
│   │   │   ├── analytics.py     # Dashboard KPIs & chart data
│   │   │   ├── notifications.py # Notification preferences
│   │   │   ├── search.py        # Global omni-search
│   │   │   └── health.py        # GET /health
│   │   └── router.py            # Central APIRouter aggregating all v1 routes
│   │
│   ├── services/                # Business logic layer
│   │   ├── complaint_service.py
│   │   ├── routing_engine.py    # Keyword categorization + workload-aware assignment
│   │   ├── sla_engine.py        # SLA monitoring & auto-escalation logic
│   │   ├── notification_service.py
│   │   ├── analytics_service.py
│   │   └── search_service.py
│   │
│   ├── tasks/                   # Background / scheduled tasks
│   │   ├── sla_checker.py       # Cron: check overdue complaints, trigger escalations
│   │   └── notification_dispatcher.py  # Async notification sending (FCM, email, SMS)
│   │
│   └── db/                      # Database layer
│       ├── session.py           # AsyncSession factory (async SQLAlchemy)
│       └── base.py              # Declarative Base import hub
│
├── alembic/                     # Database migrations
│   ├── alembic.ini
│   ├── env.py
│   └── versions/                # Auto-generated migration scripts
│
├── tests/
│   ├── conftest.py              # Fixtures: test DB, test client, mock Firebase
│   ├── test_complaints.py
│   ├── test_routing.py
│   ├── test_sla.py
│   ├── test_auth.py
│   └── test_analytics.py
│
├── requirements.txt
├── .env.example
├── Dockerfile
└── docker-compose.yml           # Local dev: API + Postgres + Redis
```

---

## 2. Database Schema (PostgreSQL)

### Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ COMPLAINTS : submits
    USERS ||--o{ ASSIGNMENTS : "assigned to"
    USERS }o--|| DEPARTMENTS : "belongs to"
    COMPLAINTS ||--o{ ASSIGNMENTS : has
    COMPLAINTS ||--o{ STATUS_HISTORY : has
    COMPLAINTS ||--o| FEEDBACK : receives
    COMPLAINTS }o--|| GRID_LANES : "routed to"
    DEPARTMENTS ||--o{ GRID_LANES : manages
    GRID_LANES ||--|| SLA_RULES : "governed by"
```

### Table Definitions

#### `users`

| Column          | Type                                | Constraints                     | Notes                       |
| --------------- | ----------------------------------- | ------------------------------- | --------------------------- |
| `id`            | `UUID`                              | `PK, DEFAULT gen_random_uuid()` | Internal ID                 |
| `firebase_uid`  | `VARCHAR(128)`                      | `UNIQUE, NOT NULL`              | Firebase Auth UID           |
| `full_name`     | `VARCHAR(255)`                      | `NOT NULL`                      |                             |
| `email`         | `VARCHAR(255)`                      | `UNIQUE`                        | Nullable (phone-only users) |
| `phone`         | `VARCHAR(20)`                       | `UNIQUE`                        |                             |
| `role`          | `ENUM('citizen','officer','admin')` | `NOT NULL, DEFAULT 'citizen'`   | RBAC role                   |
| `department_id` | `UUID`                              | `FK → departments.id, NULLABLE` | Only for officers/admins    |
| `is_active`     | `BOOLEAN`                           | `DEFAULT true`                  | Soft disable                |
| `created_at`    | `TIMESTAMPTZ`                       | `DEFAULT NOW()`                 |                             |
| `updated_at`    | `TIMESTAMPTZ`                       | `DEFAULT NOW()`                 | Auto-updated via trigger    |

#### `departments`

| Column            | Type           | Constraints               | Notes                            |
| ----------------- | -------------- | ------------------------- | -------------------------------- |
| `id`              | `UUID`         | `PK`                      |                                  |
| `name`            | `VARCHAR(100)` | `UNIQUE, NOT NULL`        | e.g. "Electricity", "Sanitation" |
| `description`     | `TEXT`         |                           |                                  |
| `head_officer_id` | `UUID`         | `FK → users.id, NULLABLE` | Dept head for escalations        |
| `is_active`       | `BOOLEAN`      | `DEFAULT true`            |                                  |
| `created_at`      | `TIMESTAMPTZ`  | `DEFAULT NOW()`           |                                  |

#### `grid_lanes`

| Column             | Type                                     | Constraints                     | Notes                       |
| ------------------ | ---------------------------------------- | ------------------------------- | --------------------------- |
| `id`               | `UUID`                                   | `PK`                            |                             |
| `name`             | `VARCHAR(100)`                           | `UNIQUE, NOT NULL`              | e.g. `ELECTRICITY_LIGHTING` |
| `category`         | `VARCHAR(100)`                           | `NOT NULL`                      | e.g. "Street Light"         |
| `department_id`    | `UUID`                                   | `FK → departments.id, NOT NULL` |                             |
| `sla_rule_id`      | `UUID`                                   | `FK → sla_rules.id`             |                             |
| `keywords`         | `TEXT[]`                                 |                                 | Array of routing keywords   |
| `default_priority` | `ENUM('low','medium','high','critical')` | `DEFAULT 'medium'`              |                             |
| `is_active`        | `BOOLEAN`                                | `DEFAULT true`                  |                             |

#### `sla_rules`

| Column               | Type           | Constraints     | Notes                      |
| -------------------- | -------------- | --------------- | -------------------------- |
| `id`                 | `UUID`         | `PK`            |                            |
| `name`               | `VARCHAR(100)` | `NOT NULL`      | e.g. "Electrical Standard" |
| `resolution_hours`   | `INTEGER`      | `NOT NULL`      | SLA deadline in hours      |
| `escalation_1_hours` | `INTEGER`      | `NOT NULL`      | 1st escalation threshold   |
| `escalation_2_hours` | `INTEGER`      |                 | 2nd escalation threshold   |
| `created_at`         | `TIMESTAMPTZ`  | `DEFAULT NOW()` |                            |
| `updated_at`         | `TIMESTAMPTZ`  | `DEFAULT NOW()` |                            |

#### `complaints`

| Column         | Type                                                                  | Constraints                    | Notes                                 |
| -------------- | --------------------------------------------------------------------- | ------------------------------ | ------------------------------------- |
| `id`           | `UUID`                                                                | `PK`                           |                                       |
| `grid_id`      | `VARCHAR(20)`                                                         | `UNIQUE, NOT NULL`             | Human-readable ID: `GG-20260302-A1B2` |
| `citizen_id`   | `UUID`                                                                | `FK → users.id, NOT NULL`      |                                       |
| `category`     | `VARCHAR(100)`                                                        | `NOT NULL`                     |                                       |
| `description`  | `TEXT`                                                                | `NOT NULL`                     |                                       |
| `latitude`     | `DOUBLE PRECISION`                                                    |                                | Geo-tag                               |
| `longitude`    | `DOUBLE PRECISION`                                                    |                                | Geo-tag                               |
| `address`      | `TEXT`                                                                |                                | Reverse-geocoded or manual            |
| `media_urls`   | `TEXT[]`                                                              |                                | Array of Firebase Storage URLs        |
| `status`       | `ENUM('new','assigned','in_progress','resolved','rejected','closed')` | `DEFAULT 'new'`                |                                       |
| `priority`     | `ENUM('low','medium','high','critical')`                              | `DEFAULT 'medium'`             |                                       |
| `grid_lane_id` | `UUID`                                                                | `FK → grid_lanes.id, NULLABLE` | Set by routing engine                 |
| `grid_flag`    | `VARCHAR(50)`                                                         | `DEFAULT NULL`                 | `ESCALATED`, `VIP`, etc.              |
| `sla_deadline` | `TIMESTAMPTZ`                                                         |                                | Calculated: created_at + SLA hours    |
| `resolved_at`  | `TIMESTAMPTZ`                                                         |                                |                                       |
| `created_at`   | `TIMESTAMPTZ`                                                         | `DEFAULT NOW()`                |                                       |
| `updated_at`   | `TIMESTAMPTZ`                                                         | `DEFAULT NOW()`                |                                       |

**Indexes:**

- `idx_complaints_status` on (`status`)
- `idx_complaints_citizen` on (`citizen_id`)
- `idx_complaints_grid_lane` on (`grid_lane_id`)
- `idx_complaints_sla_deadline` on (`sla_deadline`) — for overdue queries
- `idx_complaints_created_at` on (`created_at DESC`)
- `idx_complaints_geo` on (`latitude`, `longitude`) — future PostGIS upgrade

#### `assignments`

| Column                  | Type          | Constraints                    | Notes                         |
| ----------------------- | ------------- | ------------------------------ | ----------------------------- |
| `id`                    | `UUID`        | `PK`                           |                               |
| `complaint_id`          | `UUID`        | `FK → complaints.id, NOT NULL` |                               |
| `officer_id`            | `UUID`        | `FK → users.id, NOT NULL`      |                               |
| `assigned_by`           | `UUID`        | `FK → users.id, NULLABLE`      | NULL = auto-assigned          |
| `is_active`             | `BOOLEAN`     | `DEFAULT true`                 | Only one active per complaint |
| `notes`                 | `TEXT`        |                                | Internal officer notes        |
| `resolution_proof_urls` | `TEXT[]`      |                                | Uploaded proof files          |
| `assigned_at`           | `TIMESTAMPTZ` | `DEFAULT NOW()`                |                               |
| `completed_at`          | `TIMESTAMPTZ` |                                |                               |

#### `status_history`

| Column         | Type          | Constraints                    | Notes             |
| -------------- | ------------- | ------------------------------ | ----------------- |
| `id`           | `UUID`        | `PK`                           |                   |
| `complaint_id` | `UUID`        | `FK → complaints.id, NOT NULL` |                   |
| `old_status`   | `VARCHAR(20)` |                                |                   |
| `new_status`   | `VARCHAR(20)` | `NOT NULL`                     |                   |
| `changed_by`   | `UUID`        | `FK → users.id`                | NULL = system     |
| `note`         | `TEXT`        |                                | Reason or context |
| `created_at`   | `TIMESTAMPTZ` | `DEFAULT NOW()`                |                   |

#### `feedback`

| Column         | Type          | Constraints                  | Notes                      |
| -------------- | ------------- | ---------------------------- | -------------------------- |
| `id`           | `UUID`        | `PK`                         |                            |
| `complaint_id` | `UUID`        | `FK → complaints.id, UNIQUE` | One feedback per complaint |
| `citizen_id`   | `UUID`        | `FK → users.id, NOT NULL`    |                            |
| `rating`       | `SMALLINT`    | `CHECK (1–5), NOT NULL`      |                            |
| `comment`      | `TEXT`        |                              |                            |
| `created_at`   | `TIMESTAMPTZ` | `DEFAULT NOW()`              |                            |

#### `notification_logs`

| Column         | Type                              | Constraints                    | Notes                      |
| -------------- | --------------------------------- | ------------------------------ | -------------------------- |
| `id`           | `UUID`                            | `PK`                           |                            |
| `user_id`      | `UUID`                            | `FK → users.id, NOT NULL`      |                            |
| `complaint_id` | `UUID`                            | `FK → complaints.id, NULLABLE` |                            |
| `channel`      | `ENUM('push','email','sms')`      | `NOT NULL`                     |                            |
| `event_type`   | `VARCHAR(50)`                     | `NOT NULL`                     | e.g. `complaint_submitted` |
| `payload`      | `JSONB`                           |                                | notification content       |
| `status`       | `ENUM('pending','sent','failed')` | `DEFAULT 'pending'`            |                            |
| `sent_at`      | `TIMESTAMPTZ`                     |                                |                            |
| `created_at`   | `TIMESTAMPTZ`                     | `DEFAULT NOW()`                |                            |

---

## 3. API Design (REST)

All endpoints are prefixed with `/api/v1`. Authentication is required on all routes except `/health` and `/auth/*`.

### 3.1 Authentication & Users

| Method | Endpoint             | Role   | Description                                      |
| ------ | -------------------- | ------ | ------------------------------------------------ |
| `POST` | `/auth/register`     | Public | Register user from Firebase token (syncs to DB)  |
| `POST` | `/auth/verify-token` | Public | Verify Firebase JWT, return user profile + role  |
| `GET`  | `/users/me`          | Any    | Get current user profile                         |
| `PUT`  | `/users/me`          | Any    | Update profile (name, phone, notification prefs) |
| `GET`  | `/users`             | Admin  | List all users (with filters: role, department)  |
| `PUT`  | `/users/{id}/role`   | Admin  | Change user role / assign department             |

### 3.2 Complaints

| Method | Endpoint                    | Role          | Description                                        |
| ------ | --------------------------- | ------------- | -------------------------------------------------- |
| `POST` | `/complaints`               | Citizen       | Create new complaint (triggers routing)            |
| `GET`  | `/complaints/me`            | Citizen       | List citizen's own complaints (paginated)          |
| `GET`  | `/complaints/{id}`          | Any\*         | Get complaint detail (citizens see only their own) |
| `GET`  | `/complaints`               | Officer/Admin | List all complaints (filters, pagination, sort)    |
| `PUT`  | `/complaints/{id}/status`   | Officer/Admin | Update status (with status transition validation)  |
| `POST` | `/complaints/{id}/notes`    | Officer       | Add internal note                                  |
| `POST` | `/complaints/{id}/proof`    | Officer       | Upload resolution proof                            |
| `GET`  | `/complaints/{id}/timeline` | Any\*         | Get full status history timeline                   |

**Query Parameters for `GET /complaints`:**

```
?status=new,assigned&category=sanitation&priority=high
&grid_lane=ELECTRICITY_LIGHTING&grid_flag=ESCALATED
&assigned_to={officer_id}&department={dept_id}
&date_from=2026-03-01&date_to=2026-03-31
&search=GG-20260302    (Grid ID search)
&sort_by=created_at&order=desc
&page=1&page_size=25
```

### 3.3 Routing & Assignment

| Method | Endpoint                              | Role         | Description                                        |
| ------ | ------------------------------------- | ------------ | -------------------------------------------------- |
| `POST` | `/routing/auto-assign/{complaint_id}` | System/Admin | Trigger auto-assignment for a complaint            |
| `PUT`  | `/routing/reassign/{complaint_id}`    | Admin        | Manual reassignment to specific officer            |
| `GET`  | `/routing/suggestions/{complaint_id}` | Admin        | Get AI-suggested officers (for Smart Assign modal) |

### 3.4 SLA & Escalation

| Method | Endpoint          | Role          | Description                         |
| ------ | ----------------- | ------------- | ----------------------------------- |
| `GET`  | `/sla/overdue`    | Officer/Admin | List all overdue complaints         |
| `GET`  | `/sla/rules`      | Admin         | List all SLA rules                  |
| `POST` | `/sla/rules`      | Admin         | Create SLA rule                     |
| `PUT`  | `/sla/rules/{id}` | Admin         | Update SLA rule                     |
| `GET`  | `/sla/compliance` | Admin         | SLA compliance stats per department |

### 3.5 Analytics & Dashboard

| Method | Endpoint                            | Role  | Description                                         |
| ------ | ----------------------------------- | ----- | --------------------------------------------------- |
| `GET`  | `/analytics/kpi`                    | Admin | KPI cards: total, resolution rate, avg time, agents |
| `GET`  | `/analytics/by-category`            | Admin | Donut chart: complaint count by category            |
| `GET`  | `/analytics/trend`                  | Admin | Bar chart: daily complaint counts (last 7/30 days)  |
| `GET`  | `/analytics/department-performance` | Admin | Resolution rate & avg time per department           |
| `GET`  | `/analytics/geo`                    | Admin | Geo data for heatmap (lat/lng clusters)             |
| `GET`  | `/analytics/agents`                 | Admin | Active agents, workload, online status              |

### 3.6 Notifications

| Method | Endpoint                     | Role | Description                             |
| ------ | ---------------------------- | ---- | --------------------------------------- |
| `GET`  | `/notifications/me`          | Any  | Get user's notification history         |
| `PUT`  | `/notifications/preferences` | Any  | Update notification channel preferences |

### 3.7 Search

| Method | Endpoint        | Role          | Description                               |
| ------ | --------------- | ------------- | ----------------------------------------- |
| `GET`  | `/search?q=...` | Officer/Admin | Omni-search: Grid ID, citizen name, phone |

### 3.8 Departments & Grid Lanes

| Method | Endpoint            | Role          | Description          |
| ------ | ------------------- | ------------- | -------------------- |
| `GET`  | `/departments`      | Any           | List all departments |
| `POST` | `/departments`      | Admin         | Create department    |
| `PUT`  | `/departments/{id}` | Admin         | Update department    |
| `GET`  | `/grid-lanes`       | Officer/Admin | List all grid lanes  |
| `POST` | `/grid-lanes`       | Admin         | Create grid lane     |
| `PUT`  | `/grid-lanes/{id}`  | Admin         | Update grid lane     |

### 3.9 Health

| Method | Endpoint  | Role   | Description                            |
| ------ | --------- | ------ | -------------------------------------- |
| `GET`  | `/health` | Public | Health check (DB connectivity, uptime) |

---

## 4. Core Backend Logic

### 4.1 Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client (Next.js)
    participant F as Firebase Auth
    participant A as FastAPI
    participant DB as PostgreSQL

    C->>F: Login (OTP / Google)
    F-->>C: Firebase JWT Token
    C->>A: API Request + Authorization: Bearer <token>
    A->>F: Verify token (firebase-admin SDK)
    F-->>A: Decoded token (uid, email, phone)
    A->>DB: Lookup user by firebase_uid
    DB-->>A: User record + role
    A->>A: Enforce RBAC (role vs endpoint)
    A-->>C: Response (200 / 403)
```

**Implementation:**

- Dependency injection via `get_current_user()` on every protected route
- Roles enforced via `require_role("admin")` decorator/dependency
- First-time login auto-creates user with `citizen` role via `/auth/register`

### 4.2 Intelligent Routing Engine (MVP)

```python
# Pseudocode for routing_engine.py

def auto_route(complaint: Complaint) -> RoutingResult:
    """Keyword-based routing with workload-aware assignment."""

    # Step 1: Match grid lane by keywords
    grid_lane = match_keywords(complaint.description, complaint.category)

    # Step 2: Pull SLA rule from lane
    sla_rule = grid_lane.sla_rule
    sla_deadline = complaint.created_at + timedelta(hours=sla_rule.resolution_hours)

    # Step 3: Workload-aware officer selection
    available_officers = get_officers_by_department(grid_lane.department_id)
    officer = select_least_loaded(available_officers)
    # Optional: factor in geo-proximity

    # Step 4: Create assignment & update complaint
    create_assignment(complaint.id, officer.id)
    update_complaint(
        complaint.id,
        status="assigned",
        grid_lane_id=grid_lane.id,
        priority=grid_lane.default_priority,
        sla_deadline=sla_deadline,
    )

    # Step 5: Emit notifications
    notify(officer, event="complaint_assigned", complaint=complaint)
    notify(complaint.citizen, event="complaint_assigned", complaint=complaint)

    return RoutingResult(grid_lane=grid_lane, officer=officer, sla_deadline=sla_deadline)
```

### 4.3 SLA Engine & Escalation

**Background Job** (runs every 5 minutes via `APScheduler` / `Celery Beat`):

```python
# Pseudocode for sla_checker.py

async def check_overdue_complaints():
    """Scan for overdue complaints and trigger escalations."""

    now = datetime.utcnow()

    # Level 1: Overdue by escalation_1_hours
    level_1 = query_complaints(
        status__in=["assigned", "in_progress"],
        sla_deadline__lt=now,
        grid_flag__ne="ESCALATED"
    )
    for complaint in level_1:
        escalate_to_senior_officer(complaint)
        complaint.grid_flag = "ESCALATED"
        log_status_change(complaint, "ESCALATION_L1", changed_by=None)
        notify(admin, event="sla_breach", complaint=complaint)

    # Level 2: Overdue by escalation_2_hours
    level_2 = query_complaints(
        status__in=["assigned", "in_progress"],
        grid_flag="ESCALATED",
        sla_deadline__lt=now - timedelta(hours=24)  # additional window
    )
    for complaint in level_2:
        escalate_to_department_head(complaint)
        complaint.grid_flag = "ESCALATED_L2"
        notify(department_head, event="sla_breach_critical", complaint=complaint)
```

### 4.4 Notification Dispatch

Multi-channel dispatcher using a **task queue** pattern:

| Event               | Citizen               | Officer         | Admin           |
| ------------------- | --------------------- | --------------- | --------------- |
| Complaint Submitted | ✅ Push + SMS         | —               | —               |
| Complaint Assigned  | ✅ Push               | ✅ Push + Email | —               |
| Status Changed      | ✅ Push + SMS         | —               | —               |
| SLA Breach          | —                     | ✅ Push + Email | ✅ Push + Email |
| Complaint Resolved  | ✅ Push + SMS + Email | —               | —               |

**Services:**

- **Push:** Firebase Cloud Messaging (FCM) via `firebase-admin` SDK
- **Email:** SendGrid API (`sendgrid` Python SDK)
- **SMS:** Twilio / MSG91 (configurable per environment)

---

## 5. Security Architecture

### 5.1 Authentication & Authorization

| Layer                | Implementation                                                   |
| -------------------- | ---------------------------------------------------------------- |
| **Auth Provider**    | Firebase Authentication (Phone OTP + Google OAuth)               |
| **Token Format**     | Firebase JWT (RS256), verified server-side via `firebase-admin`  |
| **RBAC**             | Three roles: `citizen`, `officer`, `admin` enforced at API layer |
| **Route Protection** | FastAPI `Depends(get_current_user)` + role-check dependencies    |

### 5.2 Security Measures

| Concern              | Solution                                                                      |
| -------------------- | ----------------------------------------------------------------------------- |
| **Rate Limiting**    | `slowapi` middleware — 10 req/min for complaint creation, 100 req/min general |
| **Input Validation** | Pydantic schemas with strict types + length constraints                       |
| **SQL Injection**    | SQLAlchemy ORM (parameterized queries only)                                   |
| **CORS**             | Whitelist frontend domains only (`CORSMiddleware`)                            |
| **Media Security**   | Firebase Storage signed URLs (time-limited access)                            |
| **Audit Trail**      | `status_history` table logs every state change with `changed_by`              |
| **Data Retention**   | Cron job for pruning: complaints 5 years, logs 2 years                        |

---

## 6. Technology & Dependencies

### Core

| Package               | Purpose                         |
| --------------------- | ------------------------------- |
| `fastapi`             | Web framework                   |
| `uvicorn[standard]`   | ASGI server                     |
| `pydantic[email]`     | Data validation & settings      |
| `pydantic-settings`   | Environment variable management |
| `sqlalchemy[asyncio]` | ORM (async)                     |
| `asyncpg`             | Async PostgreSQL driver         |
| `alembic`             | Database migrations             |

### Auth & Security

| Package            | Purpose                             |
| ------------------ | ----------------------------------- |
| `firebase-admin`   | Firebase JWT verification, FCM push |
| `slowapi`          | Rate limiting                       |
| `python-multipart` | File uploads                        |

### Background Tasks

| Package            | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| `apscheduler`      | Scheduled SLA checks (lightweight option)       |
| `celery` + `redis` | Task queue for notifications (production scale) |

### Notifications

| Package    | Purpose        |
| ---------- | -------------- |
| `sendgrid` | Email delivery |
| `twilio`   | SMS delivery   |

### Dev & Testing

| Package                     | Purpose                       |
| --------------------------- | ----------------------------- |
| `pytest` + `pytest-asyncio` | Testing framework             |
| `httpx`                     | Async test client for FastAPI |
| `faker`                     | Test data generation          |
| `black`                     | Code formatter                |
| `ruff`                      | Linter                        |

---

## 7. Environment Configuration

```env
# .env.example

# App
APP_NAME=GrievanceGrid
APP_ENV=development          # development | staging | production
DEBUG=true
API_V1_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/grievancegrid

# Firebase
FIREBASE_PROJECT_ID=grievancegrid-xxxxx
FIREBASE_CREDENTIALS_PATH=./firebase-service-account.json

# CORS
CORS_ORIGINS=http://localhost:3000

# Rate Limiting
RATE_LIMIT_COMPLAINTS=10/minute
RATE_LIMIT_GENERAL=100/minute

# Notifications
SENDGRID_API_KEY=SG.xxxxx
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
FCM_ENABLED=true

# Background Tasks
REDIS_URL=redis://localhost:6379/0
SLA_CHECK_INTERVAL_MINUTES=5
```

---

## 8. Deployment Architecture

```mermaid
graph TB
    subgraph Client
        A[Next.js Frontend<br/>Vercel]
    end

    subgraph Auth
        B[Firebase Auth]
    end

    subgraph Backend ["Backend (Render / Railway)"]
        C[FastAPI + Uvicorn]
        D[APScheduler<br/>SLA Cron Jobs]
    end

    subgraph Data
        E[(PostgreSQL<br/>Supabase / Neon)]
        F[(Redis<br/>Task Queue)]
    end

    subgraph External
        G[Firebase Cloud Messaging]
        H[SendGrid Email]
        I[Twilio SMS]
        J[Firebase Storage<br/>Media Files]
    end

    A -->|API Calls + JWT| C
    A -->|Auth| B
    C -->|Verify Token| B
    C -->|Queries| E
    C -->|Enqueue Jobs| F
    D -->|SLA Checks| E
    D -->|Dispatch| F
    F -->|Push| G
    F -->|Email| H
    F -->|SMS| I
    A -->|Upload Media| J
```

### Scaling Strategy

- **Horizontal scaling:** Multiple Uvicorn workers behind a load balancer
- **Database:** Connection pooling via `asyncpg` (pool size configured per env)
- **Caching:** Redis for frequently queried KPIs and analytics
- **Target:** 10k concurrent users as per NFR

---

## 9. Key Design Decisions

| Decision                                 | Rationale                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------ |
| **Async FastAPI + asyncpg**              | Non-blocking I/O is critical for real-time data and 10k concurrent user target |
| **UUID primary keys**                    | Avoids sequential ID enumeration attacks; distributed-friendly                 |
| **Grid ID format (`GG-DATE-HASH`)**      | Human-readable IDs for citizens & phone support                                |
| **Separate `assignments` table**         | Supports reassignment history (not just current)                               |
| **`status_history` as append-only**      | Full audit trail, powers the timeline stepper UI                               |
| **`grid_lanes` abstraction**             | Decouples category→department routing from complaints; admin-configurable      |
| **APScheduler for MVP, Celery for prod** | APScheduler runs in-process (simple deploy); Celery for production scale       |
| **`TEXT[]` for media URLs**              | Avoids extra join table; media files live in Firebase Storage                  |
| **API versioning (`/api/v1`)**           | Future-proofing for breaking changes without disrupting clients                |

---

## 10. Data Seeding (Demo)

Pre-populated seed data for demo & development:

- **Departments:** Electricity, Water Supply, Sanitation, Roads & Infrastructure, Public Safety
- **Grid Lanes:** 15–20 lanes mapped to departments with keywords
- **SLA Rules:** 24h (Critical), 48h (High), 72h (Medium), 120h (Low)
- **Users:** 3 admins, 10 officers (2 per dept), 50 citizens
- **Complaints:** 200 sample complaints across all statuses and categories
