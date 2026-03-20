# GrievanceGrid API Specification

## Overview

RESTful API with GraphQL overlay for flexible querying. All endpoints return JSON.

## Base URL

```
Production: https://api.grievancegrid.gov.in/v1
Staging:    https://staging-api.grievancegrid.in/v1
Local:      http://localhost:8000/v1
```

---

## Authentication

All endpoints (except public tracking) require authentication via **Google OAuth 2.0** or **Basic Auth** (Name, Email, Password). Upon successful authentication, a JWT token is issued.

```http
Authorization: Bearer <jwt_token>
```

### Token Payload
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "CITIZEN|CREW|OFFICER|ADMIN|AUDITOR",
  "auth_type": "google|basic",
  "exp": 1699999999
}
```

---

## Endpoints

### 1. Submit Grievance

Create a new grievance and receive instant Grid ID.

**Endpoint:** `POST /grievances`

```http
POST /grievances
Content-Type: application/json
Authorization: Bearer <token>

{
  "category": "ROADS",
  "title": "Large pothole on Main Road",
  "description": "There is a large pothole near the traffic signal...",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "123 Main Road, Connaught Place"
  },
  "media": {
    "before_photo": "base64_encoded_or_url"
  }
}
```

**Response:** `201 Created`
```json
{
  "grid_id": "GRI-2026-000001",
  "status": "CREATED",
  "sla_response_deadline": "2026-03-18T10:30:00Z",
  "sla_resolution_deadline": "2026-03-20T10:30:00Z",
  "message": "Your grievance has been submitted. Use GRI-2026-000001 to track."
}
```

---

### 2. Submit via Voice

Process voice note from digital-illiterate users.

**Endpoint:** `POST /voice/process`

```http
POST /voice/process
Content-Type: multipart/form-data
Authorization: Bearer <token>

- audio: <audio_file> (.wav, .mp3)
- language: "hi" | "ta" | "te" | "bn" | ...
- location: { "latitude": 28.6, "longitude": 77.2 }
```

**Response:** `200 OK`
```json
{
  "grid_id": "GRI-2026-000002",
  "transcribed_text": "मुख्य सड़क पर बड़ा गड्ढा है...",
  "detected_category": "ROADS",
  "ai_priority": "HIGH",
  "status": "CREATED"
}
```

---

### 3. Live Package-Style Tracking

Transparent timeline from submission to resolution.

**Endpoint:** `GET /track/{grid_id}`

```http
GET /track/GRI-2026-000001
```

**Response:** `200 OK`
```json
{
  "grid_id": "GRI-2026-000001",
  "current_status": "IN_PROGRESS",
  "timeline": [
    {
      "status": "CREATED",
      "timestamp": "2026-03-17T09:00:00Z",
      "description": "Grievance submitted successfully"
    },
    {
      "status": "AI_PROCESSED",
      "timestamp": "2026-03-17T09:00:15Z",
      "description": "AI categorized as ROADS, Priority: HIGH"
    },
    {
      "status": "ROUTED",
      "timestamp": "2026-03-17T09:00:30Z",
      "description": "Assigned to PWD Department, Team Alpha-3"
    },
    {
      "status": "ACKNOWLEDGED",
      "timestamp": "2026-03-17T10:15:00Z",
      "description": "Team acknowledged, estimate: 2 hours"
    },
    {
      "status": "IN_PROGRESS",
      "timestamp": "2026-03-17T12:00:00Z",
      "description": "Repair work started",
      "eta": "2026-03-17T14:30:00Z"
    }
  ],
  "sla": {
    "response_sla": {
      "deadline": "2026-03-18T10:30:00Z",
      "status": "ON_TRACK"
    },
    "resolution_sla": {
      "deadline": "2026-03-20T10:30:00Z",
      "remaining_hours": 48
    }
  },
  "assigned_team": {
    "name": "Team Alpha-3",
    "contact": "+91-98765-43210",
    "current_location": { "lat": 28.6145, "lng": 77.2095 },
    "eta_minutes": 15
  }
}
```

---

### 4. Get Grievance Details

Full grievance information for officers.

**Endpoint:** `GET /grievances/{id}`

```http
GET /grievances/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <officer_token>
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "grid_id": "GRI-2026-000001",
  "category": "ROADS",
  "priority": "HIGH",
  "status": "IN_PROGRESS",
  "title": "Large pothole on Main Road",
  "description": "There is a large pothole...",
  "citizen": {
    "id": "user_id",
    "name": "John Doe",
    "phone": "+91-98765-43210"
  },
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "address": "123 Main Road"
  },
  "media": {
    "before_photo_url": "https://...",
    "after_photo_url": null
  },
  "ai_analysis": {
    "detected_category": "ROADS",
    "confidence": 0.94,
    "damage_severity": 0.78,
    "suggested_solution": "Fill with asphalt, level with road surface"
  },
  "assigned_department": {
    "id": "dept_pwd",
    "name": "Public Works Department"
  },
  "assigned_team": {
    "id": "team_alpha3",
    "name": "Team Alpha-3"
  },
  "similar_cases": [
    { "grid_id": "GRI-2026-000123", "resolution": "Filled with asphalt, resolved in 24h" }
  ],
  "audit_log": [
    { "action": "CREATED", "timestamp": "..." },
    { "action": "ROUTED", "timestamp": "..." }
  ]
}
```

---

### 5. Submit Resolution (Two-Factor Verification)

Geo-tagged "After" photo required for closure.

**Endpoint:** `POST /verify`

```http
POST /verify
Authorization: Bearer <officer_token>
Content-Type: multipart/form-data

- grievance_id: "550e8400-e29b-41d4-a716-446655440000"
- photo: <image_file>
- location: { "latitude": 28.6139, "longitude": 77.2090 }
- notes: "Pothole filled, road surface restored"
```

**Response:** `200 OK`
```json
{
  "verification_id": "ver_12345",
  "is_valid": true,
  "distance_from_incident": "12 meters",
  "message": "Verification accepted. Grievance marked for closure."
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "VERIFICATION_FAILED",
  "message": "Photo location is 150m from incident (max: 50m)",
  "code": "LOCATION_MISMATCH"
}
```

---

### 6. Update Grievance Status

Officer updates status through workflow.

**Endpoint:** `PATCH /grievances/{id}/status`

```http
PATCH /grievances/550e8400-e29b-41d4-a716-446655440000/status
Authorization: Bearer <officer_token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "notes": "Assigned to field team"
}
```

---

### 7. Get Geospatial Clusters

Admin endpoint for crisis detection.

**Endpoint:** `GET /clusters`

```http
GET /clusters?type=DBSCAN&active=true
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "clusters": [
    {
      "cluster_id": "cluster_001",
      "type": "DBSCAN_GEO",
      "location": { "lat": 28.6150, "lng": 77.2100 },
      "radius_meters": 500,
      "grievance_count": 23,
      "crisis_score": 0.85,
      "topics": ["water_leak", "drainage"],
      "recommended_action": "URGENT: Infrastructure inspection needed"
    }
  ]
}
```

---

### 8. Dashboard Analytics

KPIs for admin command center.

**Endpoint:** `GET /analytics/dashboard`

```http
GET /analytics/dashboard?from=2026-03-01&to=2026-03-17
Authorization: Bearer <admin_token>
```

**Response:** `200 OK`
```json
{
  "summary": {
    "total_grievances": 1250,
    "resolved": 980,
    "pending": 180,
    "escalated": 45,
    "avg_resolution_hours": 28.5
  },
  "by_category": [
    { "category": "ROADS", "count": 450, "resolved": 380 },
    { "category": "WATER_SUPPLY", "count": 320, "resolved": 290 }
  ],
  "by_priority": [
    { "priority": "CRITICAL", "count": 45, "avg_resolution_hours": 12 },
    { "priority": "HIGH", "count": 180, "avg_resolution_hours": 24 }
  ],
  "sla_compliance": {
    "response_sla_met": 94.5,
    "resolution_sla_met": 87.2
  },
  "heat_map_data": [
    { "lat": 28.61, "lng": 77.20, "intensity": 0.8 },
    { "lat": 28.62, "lng": 77.21, "intensity": 0.6 }
  ],
  "predictive_alerts": [
    { "asset_type": "TRANSFORMER", "asset_id": "T-1234", "failure_probability": 0.78 }
  ]
}
```

---

### 9. Infrastructure Assets (Internal)

Fetch all active assets for processing.

**Endpoint:** `GET /analytics/infrastructure/assets`

```http
GET /analytics/infrastructure/assets
X-Internal-Token: <internal_token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "asset_123",
    "asset_type": "STREET_LIGHT",
    "asset_name": "SL-45",
    "complaint_count_7d": 5,
    "complaint_count_30d": 12,
    "unresolved_count": 2
  }
]
```

---

### 10. Infrastructure Risk Update (Internal)

Batch update failure risk scores for assets.

**Endpoint:** `POST /analytics/infrastructure/risk-update`

```http
POST /analytics/infrastructure/risk-update
X-Internal-Token: <internal_token>
Content-Type: application/json

{
  "updates": [
    { "asset_id": "asset_123", "failure_risk_score": 0.85 }
  ]
}
```

**Response:** `200 OK`
```json
{
  "updated_count": 1,
  "timestamp": "2026-03-20T23:45:00Z"
}
```

---

### 11. Citizen Feedback

Submit satisfaction rating after resolution.

**Endpoint:** `POST /grievances/{id}/feedback`

```http
POST /grievances/550e8400-e29b-41d4-a716-446655440000/feedback
Authorization: Bearer <citizen_token>
Content-Type: application/json

{
  "rating": 4,
  "comment": "Resolved quickly, but could be smoother",
  "is_satisfied": false
}
```

---

### 10. Contestation

Contest resolution if unsatisfied (triggers AI audit).

**Endpoint:** `POST /grievances/{id}/contest`

```http
POST /grievances/550e8400-e29b-41d4-a716-446655440000/contest
Authorization: Bearer <citizen_token>
Content-Type: application/json

{
  "reason": "The work was not done properly. Pothole has returned.",
  "evidence_photo": "base64_or_url"
}
```

**Response:** `200 OK`
```json
{
  "status": "CONTESTED",
  "audit_triggered": true,
  "audit_id": "audit_98765",
  "message": "Contestation received. AI audit initiated. You will be contacted within 24 hours."
}
```

---

## GraphQL Schema

```graphql
type Query {
  grievance(id: ID!): Grievance
  grievances(filter: GrievanceFilter, limit: Int, offset: Int): GrievanceConnection!
  track(gridId: String!): TrackingInfo!
  clusters(activeOnly: Boolean): [GeoCluster!]!
  dashboard: DashboardData!
}

type Mutation {
  submitGrievance(input: GrievanceInput!): GrievanceSubmission!
  submitVoiceGrievance(audio: Upload!, language: String!, location: CoordinatesInput!): VoiceGrievanceResult!
  updateGrievanceStatus(id: ID!, status: GrievanceStatus!, notes: String): Grievance!
  submitVerification(grievanceId: ID!, photo: Upload!, location: CoordinatesInput!): VerificationResult!
  submitFeedback(grievanceId: ID!, rating: Int!, comment: String): FeedbackResult!
  contestResolution(grievanceId: ID!, reason: String!, evidence: String): ContestationResult!
}

type Grievance {
  id: ID!
  gridId: String!
  category: GrievanceCategory!
  priority: Priority!
  status: GrievanceStatus!
  title: String!
  description: String!
  location: Location!
  media: Media
  aiAnalysis: AIAnalysis
  assignedTo: Assignment
  timeline: [TimelineEvent!]!
  sla: SLAInfo
}

type TrackingInfo {
  gridId: String!
  currentStatus: GrievanceStatus!
  timeline: [TimelineEvent!]!
  sla: SLATracking!
  teamLocation: Location
  eta: String
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `GRIEVANCE_NOT_FOUND` | Invalid Grid ID |
| `UNAUTHORIZED` | Invalid/missing token |
| `FORBIDDEN` | Insufficient permissions |
| `VALIDATION_ERROR` | Invalid input format |
| `LOCATION_MISMATCH` | Verification photo too far |
| `SLA_VIOLATED` | Deadline exceeded |
| `DUPLICATE_SUBMISSION` | Similar grievance detected |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| POST /grievances | 10/minute/IP |
| GET /track/* | 60/minute/IP |
| POST /voice/* | 5/minute/IP |
| Admin endpoints | 100/minute/IP |