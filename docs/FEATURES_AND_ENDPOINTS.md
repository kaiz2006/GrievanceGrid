# GrievanceGrid - Complete Features & Endpoints Reference

## Overview

GrievanceGrid is an AI-powered public grievance redressal system with the following core capabilities:
- Multimodal grievance submission (text, voice, images)
- AI-powered categorization, routing, and priority assignment
- Real-time tracking with WebSocket updates
- SLA enforcement with auto-escalation
- Two-factor field verification
- Predictive maintenance and analytics

---

## Core Features (from FEATURES.md)

### 1. Intelligent Intake & Engagement

| Feature | Description | Status |
|---------|-------------|--------|
| **Multimodal Transformer Intelligence** | LLMs process unstructured data (voice, text) | ✅ Implemented |
| **Computer Vision Subsystem** | Damage severity estimation from photos | ✅ Implemented (CV service) |
| **Automated Voice-to-Grid** | Voice bot for regional language complaints | ✅ Implemented |
| **Unique Grid ID** | Instant tracking ID generation | ✅ Implemented |

### 2. Autonomous Operations (ML-Powered)

| Feature | Description | Status |
|---------|-------------|--------|
| **AI-Powered Routing Engine** | Auto-categorize and assign in <30s | ✅ Implemented (GNN service) |
| **Dynamic GNN** | Department interdependency analysis | ✅ Implemented |
| **Vector Embeddings** | Similar case finding via Qdrant | ⚠️ Backend endpoint missing |
| **Reinforcement Learning** | Continuous model improvement | 🔄 Partial (worker ready) |

### 3. Transparency & Real-Time Enforcement

| Feature | Description | Status |
|---------|-------------|--------|
| **Live Package-Style Tracking** | Timeline from Created to Feedback | ✅ Implemented |
| **SLA Enforcement** | Auto-escalation on deadline risk | ✅ Implemented |
| **Two-Factor Field Verification** | Geo-tagged photo validation | ❌ Endpoint missing |
| **Automated ETA Updates** | ML-calculated crew arrival times | ✅ Implemented |

### 4. Predictive Governance & Analytics

| Feature | Description | Status |
|---------|-------------|--------|
| **Geospatial Crisis Detection** | DBSCAN + LDA cluster detection | ✅ Implemented |
| **Predictive Maintenance Engine** | Infrastructure failure prediction | ✅ Implemented |
| **Mission-Control Command Center** | Admin dashboard with KPIs | ✅ Implemented |
| **Automated Audit Trigger** | AI audit on contestation | ✅ Implemented |

---

## Complete API Endpoints Reference

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| POST | `/auth/register` | New user registration | None | ✅ |
| POST | `/auth/login` | Email/password login | None | ✅ |
| POST | `/auth/google` | Google OAuth login | None | ✅ |
| POST | `/auth/refresh` | Refresh access token | Refresh Token | ✅ |
| POST | `/auth/change-password` | Change password | Bearer | ✅ |
| GET | `/auth/me` | Get current user profile | Bearer | ✅ |
| POST | `/auth/logout` | Logout (invalidate session) | Bearer | ✅ |

**Request/Response Models:**

```typescript
// POST /auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer";
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: "CITIZEN" | "OFFICER" | "ADMIN" | "AUDITOR";
    is_active: boolean;
    created_at: string;
  };
}
```

---

### Grievances (`/api/v1/grievances`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| POST | `/grievances` | Submit new grievance | Bearer | ✅ |
| GET | `/grievances/{id}` | Get grievance details | Bearer | ✅ |
| GET | `/grievances/me` | Get current user's grievances | Bearer | ❌ Missing |
| PATCH | `/grievances/{id}/status` | Update status | Bearer (Officer) | ✅ |
| POST | `/grievances/{id}/feedback` | Submit satisfaction rating | Bearer | ✅ |
| POST | `/grievances/{id}/contest` | Contest resolution | Bearer | ✅ |
| GET | `/grievances/{id}/similar` | Find similar cases via vector search | Bearer | ❌ Missing |

**Request/Response Models:**

```typescript
// POST /grievances
interface GrievanceCreateRequest {
  title: string;
  description: string;
  category?: string;
  priority?: string;
  latitude?: number;
  longitude?: number;
  location_address?: string;
  before_photo_url?: string;
}

interface GrievanceCreateResponse {
  grievance_id: string;
  grid_id: string;
  processing_task_id: string;
  submitted_at: string;
  response_deadline: string;
  resolution_deadline: string;
  status: string;
}

// GET /grievances/me
interface MyGrievancesResponse {
  count: number;
  items: {
    id: string;
    grid_id: string;
    title: string;
    category: string;
    status: string;
    priority: string;
    description: string;
    location: string;
    created_at: string;
    resolved_at?: string;
    can_feedback: boolean;
    can_contest: boolean;
  }[];
}

// GET /grievances/{id}/similar
interface SimilarCasesResponse {
  count: number;
  cases: {
    grid_id: string;
    title: string;
    similarity_score: number;
    resolution_summary: string;
    resolution_time_hours: number;
    department: string;
  }[];
}
```

---

### Verification (`/api/v1`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| POST | `/verify` | Submit resolution verification | Bearer (Officer) | ❌ Missing |

**Purpose:** Two-factor field verification - validates geo-tagged "after" photo is within 50m of original grievance location.

**Request/Response Models:**

```typescript
// POST /verify
interface VerificationRequest {
  grievance_id: string;
  location: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
  // Photo uploaded as multipart/form-data
}

interface VerificationResponse {
  verification_id: string;
  is_valid: boolean;
  distance_from_incident: string;
  message: string;
}
```

---

### Tracking (`/api/v1/track`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| GET | `/track/{grid_id}` | Get tracking info | None (Public) | ✅ |
| WebSocket | `/ws/track/{grid_id}` | Live status updates | None (Public) | ✅ |

**Response Model:**

```typescript
interface TrackingResponse {
  grid_id: string;
  current_status: string;
  current_sla_type?: string;
  sla_remaining_seconds?: number;
  sla_deadlines: {
    response?: string;
    resolution?: string;
  };
  timeline: {
    status: string;
    timestamp: string;
    description: string;
  }[];
  assigned_team_location?: {
    latitude: number;
    longitude: number;
    updated_at?: string;
  };
  predicted_eta_minutes?: number;
}
```

---

### Voice (`/api/v1/voice`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| POST | `/voice/process` | Upload voice grievance | None | ✅ |
| GET | `/voice/result/{id}` | Get voice processing result | Bearer | ❌ Missing |
| GET | `/voice/languages` | Get supported languages | None | ❌ Missing |
| POST | `/voice/tts` | Text-to-speech conversion | None | ❌ Missing |

**Request/Response Models:**

```typescript
// POST /voice/process (multipart/form-data)
// Returns:
interface VoiceProcessResponse {
  grievance_id: string;
  grid_id: string;
  processing_task_id: string;
  file_name: string;
  audio_url: string;
  transcription_preview: string;
  received_at: string;
  status: string;
}

// GET /voice/languages
interface Language {
  code: string;
  name: string;
}
```

---

### Clusters (`/api/v1/clusters`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| GET | `/clusters` | List geospatial clusters | Bearer (Admin) | ✅ |
| POST | `/clusters/recluster` | Trigger recluster job | Bearer (Admin) | ✅ |
| GET | `/clusters/{id}` | Get cluster details | Bearer (Admin) | ❌ Missing |
| GET | `/clusters/{id}/grievances` | Get grievances in cluster | Bearer (Admin) | ❌ Missing |

**Response Model:**

```typescript
interface ClusterListResponse {
  count: number;
  clusters: {
    cluster_id: string;
    cluster_type: string;
    centroid_lat: number;
    centroid_lng: number;
    member_count: number;
    crisis_score?: number;
    is_active: boolean;
    topics?: string[];
    metadata?: Record<string, any>;
  }[];
}
```

---

### Admin (`/api/v1/admin`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| GET | `/admin/escalations` | List escalated grievances | Bearer (Admin) | ✅ |
| GET | `/admin/sla-breaches` | List SLA breaches | Bearer (Admin) | ✅ |
| GET | `/admin/grievances/{id}/audit` | Get audit history | Bearer (Admin) | ✅ |
| PATCH | `/admin/grievances/{id}/assign-department` | Assign department | Bearer (Admin) | ✅ |
| GET | `/admin/departments` | List all departments | Bearer (Admin) | ❌ Missing |
| GET | `/admin/teams` | List all field teams | Bearer (Admin) | ❌ Missing |
| POST | `/admin/grievances/{id}/assign-team` | Assign team | Bearer (Admin) | ❌ Missing |

---

### Operations (`/api/v1/operations`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| GET | `/operations/sla/active` | Get active SLA timers | Internal Token | ✅ |
| POST | `/operations/sla/{id}/escalate` | Escalate grievance | Internal Token | ✅ |
| GET | `/operations/sla/stats` | Get SLA statistics | Bearer (Admin) | ❌ Missing |
| GET | `/operations/sla/at-risk` | Get SLAs at risk | Bearer (Admin) | ❌ Missing |

---

### Analytics (`/api/v1/analytics`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| GET | `/analytics/dashboard` | Dashboard analytics | Bearer (Admin) | ✅ |
| POST | `/analytics/snapshot` | Generate daily snapshot | Internal Token | ✅ |
| GET | `/analytics/infrastructure/assets` | List infrastructure assets | Internal Token | ✅ |
| POST | `/analytics/infrastructure/risk-update` | Update risk scores | Internal Token | ✅ |

**Response Model:**

```typescript
interface DashboardAnalyticsResponse {
  summary: {
    total_grievances: number;
    resolved: number;
    pending: number;
    escalated: number;
    avg_resolution_hours?: number;
  };
  by_category: {
    category: string;
    count: number;
    resolved: number;
  }[];
  by_priority: {
    priority: string;
    count: number;
    avg_resolution_hours?: number;
  }[];
  sla_compliance: {
    response_sla_met?: number;
    resolution_sla_met?: number;
  };
  heat_map_data: {
    lat: number;
    lng: number;
    intensity: number;
  }[];
  predictive_alerts: {
    asset_id: string;
    asset_type: string;
    asset_name: string;
    risk_score: number;
    predicted_failure_date?: string;
  }[];
}
```

---

### Audits (`/api/v1/audits`)

| Method | Endpoint | Description | Auth | Status |
|--------|----------|-------------|------|--------|
| GET | `/audits/{id}` | Get audit result | Bearer (Admin/Auditor) | ❌ Missing |
| GET | `/audits` | List pending audits | Bearer (Admin/Auditor) | ❌ Missing |
| POST | `/audits/{id}/validate` | Validate audit (approve/reject) | Bearer (Admin/Auditor) | ❌ Missing |
| GET | `/audits/stats` | Get audit statistics | Bearer (Admin/Auditor) | ❌ Missing |

**Response Model:**

```typescript
interface AuditResult {
  audit_id: string;
  grievance_id: string;
  reason: string;
  evidence_photo?: string;
  risk_score: number;
  evidence_severity?: number;
  recommendation: string;
  status: string;
  processed_at: string;
  ai_confidence?: number;
  validation_notes?: string;
}
```

---

## Worker Tasks (Celery)

### AI Processing Queue
| Task | Description | Status |
|------|-------------|--------|
| `process_grievance_ai` | LLM categorization, CV severity, GNN routing, vector indexing | ✅ |
| `process_voice_grievance` | Voice transcription, summarization, categorization | ✅ |
| `run_contestation_audit` | AI audit of contested resolutions | ✅ |

### Analytics Queue
| Task | Description | Status |
|------|-------------|--------|
| `recluster_recent_grievances` | DBSCAN + LDA clustering | ✅ |

### Maintenance Queue
| Task | Description | Status |
|------|-------------|--------|
| `update_infrastructure_risk_scores` | Predictive maintenance scoring | ✅ |

### Notifications Queue
| Task | Description | Status |
|------|-------------|--------|
| `send_status_notification` | SMS/Push/Email notifications | ✅ |
| `publish_tracking_event` | WebSocket update via Redis pub/sub | ✅ |

### SLA Monitor Queue
| Task | Description | Status |
|------|-------------|--------|
| `monitor_sla_and_escalate` | Check SLA timers, trigger escalation | ✅ |

### Reporting Queue
| Task | Description | Status |
|------|-------------|--------|
| `generate_daily_report_snapshot` | Daily metrics persistence | ✅ |

---

## AI Model Services (Docker)

| Service | Port | Description | Status |
|---------|------|-------------|--------|
| LLM Service | 8001 | Text categorization, embedding, summarization | ✅ |
| CV Service | 8002 | Image severity estimation | ✅ |
| GNN Service | 8003 | Department routing prediction | ✅ |

---

## Critical Missing Endpoints Priority

### Priority 1 - Core Features (IMPLEMENTED ✅)
1. **POST /verify** - Two-factor field verification (anti-corruption) ✅
2. **GET /grievances/me** - Citizen's own grievances list ✅
3. **GET /grievances/{id}/similar** - Vector similarity search ✅

### Priority 2 - Admin Convenience (IMPLEMENTED ✅)
4. GET /admin/departments ✅
5. GET /admin/teams ✅
6. POST /admin/grievances/{id}/assign-team ✅
7. GET /operations/sla/stats ✅
8. GET /operations/sla/at-risk ✅

### Priority 3 - Advanced Features (IMPLEMENTED ✅)
9. GET /voice/languages ✅
10. POST /voice/tts ✅
11. GET /voice/result/{id} ✅
12. GET /clusters/{id} ✅
13. GET /clusters/{id}/grievances ✅
14. GET /audits/{id} ✅
15. GET /audits ✅
16. POST /audits/{id}/validate ✅
17. GET /audits/stats ✅

**ALL 17 MISSING ENDPOINTS NOW IMPLEMENTED!**

---

## Database Tables Reference

| Table | Purpose |
|-------|---------|
| `users` | User accounts with roles, auth types |
| `grievances` | Main grievance records with AI fields |
| `sla_timers` | SLA countdown timers |
| `departments` | Government departments |
| `teams` | Field teams with service areas |
| `team_members` | Team membership |
| `geo_clusters` | DBSCAN cluster results |
| `cluster_members` | Grievance-cluster mapping |
| `verifications` | Field verification records |
| `audit_logs` | Immutable event history |
| `vector_references` | Qdrant vector pointers |
| `infrastructure_assets` | Predictive maintenance assets |
| `daily_metrics` | Analytics snapshots |

---

## Environment Variables

### API (apps/api/.env)
```
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://...
QDRANT_URL=http://localhost:6333
JWT_SECRET=...
LLM_API_URL=http://localhost:8001
CV_API_URL=http://localhost:8002
GNN_API_URL=http://localhost:8003
INTERNAL_WORKER_TOKEN=...
CORS_ALLOW_ORIGINS=http://localhost:8080
```

### Worker (apps/worker/.env)
```
CELERY_BROKER_URL=redis://...
CELERY_RESULT_BACKEND=redis://...
API_BASE_URL=http://localhost:8000
LLM_SERVICE_URL=http://localhost:8001
CV_SERVICE_URL=http://localhost:8002
GNN_SERVICE_URL=http://localhost:8003
QDRANT_URL=http://localhost:6333
INTERNAL_WORKER_TOKEN=...
```

### AI Models (ai-models/.env)
```
CUDA_DEVICE=0
USE_GPU=false
LLM_SERVICE_PORT=8001
CV_SERVICE_PORT=8002
GNN_SERVICE_PORT=8003
```
