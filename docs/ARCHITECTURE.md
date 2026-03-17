# GrievanceGrid Architecture

## Overview

GrievanceGrid follows **Clean Architecture** with strict separation of concerns, ensuring maintainability, testability, and scalability. The system comprises 6 distinct layers, each with defined responsibilities and boundaries.

## 6-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 1: Intelligent Client                   │
│         (Next.js 15 RSC, Tailwind, Zustand, Leaflet)           │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 2: API Gateway                          │
│          (GraphQL Apollo Server, FastAPI, Redis)               │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 3: Core Application                    │
│          (Domain Services, Business Logic, Use Cases)          │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 4: Durable Data                         │
│          (PostgreSQL + Drizzle ORM, Supabase/Neon)              │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 5: Vector Search                        │
│                    (Qdrant Vector Database)                     │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 6: AI/LLM Ingestion                    │
│     (VLLM, Llama-3.1, Mistral-7B, Transformers, Whisper)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Intelligent Client

### Purpose
The presentation layer handling UI/UX, state management, and user interactions.

### Components

#### Next.js 15 (React Server Components)
- **Pages**: `/`, `/dashboard`, `/grievance/[id]`, `/submit`, `/track/[id]`
- **Server Components**: Direct data fetching, SEO optimization
- **Client Components**: Interactive maps, forms, real-time updates

#### State Management
- **Zustand**: Global client state (user session, theme, notifications)
- **TanStack Query**: Server state, caching, optimistic updates

#### Mapping & Visualization
- **Leaflet.js**: Interactive maps, heatmaps, cluster visualization
- **React-Leaflet**: React bindings for map components

### Responsibilities
- Render grievance submission forms
- Display live tracking timeline
- Render admin command center dashboard
- Handle voice input for AI intake
- Display geospatial clusters and crisis alerts

---

## Layer 2: API Gateway

### Purpose
Unified entry point for all client requests, handling authentication, rate limiting, and request routing.

### Components

#### GraphQL Server (Apollo Server)
```python
# Schema definition
type Query {
  grievance(id: ID!): Grievance
  grievances(filter: GrievanceFilter): GrievanceConnection!
  clusters: [GeoCluster!]!
  analytics: DashboardAnalytics!
}

type Mutation {
  submitGrievance(input: GrievanceInput!): Grievance!
  updateStatus(id: ID!, status: GrievanceStatus!): Grievance!
  submitVerification(id: ID!, photo: Upload!, coords: Coordinates!): Verification!
}
```

#### REST Endpoints (FastAPI)
```
POST   /api/v1/grievances          # Submit new grievance
GET    /api/v1/grievances/{id}     # Get grievance details
GET    /api/v1/track/{grid_id}     # Live tracking endpoint
POST   /api/v1/verify              # Submit verification photos
GET    /api/v1/clusters            # Get geospatial clusters
POST   /api/v1/voice/process       # Process voice input
```

#### Redis Layer
- Session management
- Rate limiting (100 req/min per IP)
- Pub/sub for real-time updates
- Cache frequently accessed grievances

### Responsibilities
- Parse and validate incoming requests
- Authenticate via Google OAuth 2.0 or Email/Password (Basic Auth)
- Manage user sessions and JWT tokens
- Support for roles: CITIZEN, CREW, OFFICER, ADMIN, AUDITOR
- Route to appropriate core services
- Aggregate responses from multiple services
- Handle CORS and security headers

---

## Layer 3: Core Application

### Purpose
Domain logic, business rules, and use cases. This is the heart of the application.

### Domain Entities

#### Grievance Entity
```python
class Grievance:
    grid_id: str              # Unique tracking ID
    citizen_id: str
    category: GrievanceCategory
    priority: Priority        # LOW, MEDIUM, HIGH, CRITICAL
    status: GrievanceStatus   # CREATED, ROUTED, IN_PROGRESS, VERIFIED, RESOLVED, ESCALATED
    location: GeoLocation
    description: str
    media_urls: List[str]
    created_at: datetime
    updated_at: datetime
    sla_deadline: datetime
    assigned_team: Optional[Team]
```

#### SLA Timer Entity
```python
class SLATimer:
    grievance_id: str
    sla_type: SLAType         # RESPONSE, RESOLUTION, VERIFICATION
    start_time: datetime
    deadline: datetime
    escalation_threshold: datetime
    is_escalated: bool
```

#### GeoCluster Entity
```python
class GeoCluster:
    cluster_id: str
    centroid: GeoLocation
    grievance_count: int
    density: float
    topic_keywords: List[str]
    crisis_score: float
    detected_at: datetime
```

### Use Cases

#### SubmitGrievanceUseCase
1. Validate input (Pydantic models)
2. Generate unique Grid ID
3. Route to AI processing queue
4. Create SLA timers
5. Store in PostgreSQL
6. Index in Qdrant for similarity search

#### RouteGrievanceUseCase
1. Extract location, category from grievance
2. Query GNN routing model
3. Find nearest available team
4. Assign and update status
5. Send notifications

#### VerifyResolutionUseCase
1. Validate geo-tagged photo coordinates
2. Compare with incident coordinates (tolerance: 50m)
3. Update verification status
4. Trigger satisfaction survey

### Services

#### GrievanceService
- CRUD operations for grievances
- Status lifecycle management
- SLA monitoring and escalation

#### RoutingService
- GNN-based department routing
- Team assignment optimization
- Priority queue management

#### AnalyticsService
- KPI aggregation
- Heatmap data preparation
- Report generation

---

## Layer 4: Durable Data

### Purpose
Persistent storage with relational integrity using Drizzle ORM.

### PostgreSQL Schema

#### Core Tables
- `users` - All accounts (CITIZEN, CREW, OFFICER, ADMIN, AUDITOR)
- `grievances` - Main grievance records
- `sla_timers` - SLA tracking
- `teams` - Field worker teams
- `departments` - Government departments
- `audit_logs` - Immutable audit trail
- `verification_photos` - Before/After photos

#### ORM
- **Drizzle** - Type-safe SQL query builder
- **PostGIS** - Geospatial queries
- **uuid-ossp** - UUID generation

### Responsibilities
- ACID transactions
- Referential integrity
- Geospatial indexing (R-tree)
- Note: Vector similarity search handled by Qdrant (Layer 5)

---

## Layer 5: Vector Search

### Purpose
Semantic search and similarity matching using Qdrant vector database.

### Collections

#### grievance_embeddings
```json
{
  "id": "grid_id",
  "vector": [0.1, 0.3, ...],  // 768-dim BERT embeddings
  "payload": {
    "category": "pothole",
    "status": "resolved",
    "resolution": "filled_with_asphalt"
  }
}
```

### Operations
- **Similarity Search**: Find past similar grievances
- **Recommendation**: Suggest proven solutions to officers
- **Deduplication**: Detect duplicate submissions

---

## Layer 6: AI/LLM Ingestion

### Purpose
All ML/AI processing including LLMs, computer vision, and ML models.

### Components

#### Multimodal Transformer (Llama-3.1 / Mistral-7B)
- Unstructured text parsing
- Category classification
- Sentiment analysis
- Resolution suggestion generation

#### Computer Vision Subsystem
- Damage severity estimation (CNN/ResNet)
- Image quality assessment
- Before/After comparison

#### Speech-to-Text (Whisper)
- Regional language transcription
- Audio preprocessing
- Dialect handling

#### Graph Neural Network
- Department dependency modeling
- Optimal routing path calculation
- Bottleneck detection

#### Clustering Models
- DBSCAN for geospatial clustering
- LDA for topic modeling
- Anomaly detection

### Inference Pipeline
```
User Input → Preprocessing → Model Inference → Postprocessing → Response
```

---

## Data Flow

### Grievance Submission Flow
```
1. User submits via Web/Voice/WhatsApp
2. API Gateway receives and validates
3. Core Application creates Grievance entity
4. AI Layer processes (category, priority, embeddings)
5. Routing Service determines optimal department
6. PostgreSQL persists record
7. Qdrant indexes embeddings
8. Redis publishes real-time update
9. Client receives WebSocket notification
```

### Tracking Flow
```
1. User requests status via Grid ID
2. API Gateway retrieves from cache/DB
3. SLA Timer calculates remaining time
4. Timeline constructed from audit logs
5. ETA prediction from ML model
6. Client displays live package-style UI
```

---

## SOLID Implementation

Each layer follows SOLID principles:
- **S**: Single responsibility per service
- **O**: Open for extension, closed for modification
- **L**: Interface segregation via protocols
- **D**: Dependency inversion (abstractions over concretions)

---

## Deployment

The architecture supports horizontal scaling:
- Frontend: CDN-cached static assets
- API: Stateless containers behind load balancer
- Core Services: Auto-scaling groups
- Database: Read replicas + connection pooling
- Vector DB: Distributed Qdrant cluster
- ML: GPU-accelerated inference servers