# GrievanceGrid

**AI-Powered Public Grievance Redressal System**

## Vision

GrievanceGrid transforms how citizens interact with government services by leveraging multimodal AI to create a frictionless, transparent, and efficient grievance redressal system. We bridge the gap between digital-illiterate citizens and government machinery through voice-first interfaces, while empowering administrators with predictive analytics to prevent infrastructure failures before they occur.

## The Problem

Public grievance systems suffer from:
- **Opacity**: Citizens have no visibility into their ticket status
- **Delays**: Complaints bounce between departments for weeks
- **Fraud**: Faked "resolutions" without field verification
- **Inefficiency**: No pattern recognition to predict emerging crises
- **Inaccessibility**: Digital-illiterate citizens excluded from digital systems

## The Solution

GrievanceGrid delivers:
1. **Intelligent Intake**: Voice bots in regional languages, AI parsing of unstructured data, computer vision damage assessment
2. **Autonomous Operations**: ML-powered routing (<30s), GNN-based department coordination, vector similarity search for proven solutions
3. **Transparency**: Live package-style tracking, auto-escalation SLAs, geo-tagged verification
4. **Predictive Governance**: DBSCAN heatmap clusters, predictive maintenance, AI-driven audits

## User Roles

GrievanceGrid is designed around 5 distinct user roles:
- **Citizen**: Submit and track grievances multimodal (voice/text/image).
- **Crew (Field Worker)**: Mobile interface for task execution and geo-verification.
- **Officer (Dept. Head)**: Manage escalations, SLA health, and department teams.
- **Admin (Mission Control)**: High-level analytics, AI audit logs, and system config.
- **Auditor (Independent)**: Investigate contested cases and verify resolution integrity.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite (Primary), Tailwind CSS, Zustand, TanStack Query, Leaflet.js; Next.js 15 kept as secondary |
| Backend | FastAPI, Uvicorn, Pydantic v2, Apollo GraphQL, Redis, Google Auth, Basic Auth (JWT) |
| AI/ML | Llama-3.1, Mistral-7B, VLLM, HuggingFace Transformers, BERT NLP |
| Data | PostgreSQL (Supabase/Neon), Drizzle ORM, Qdrant |

## Quick Start

```bash
# Clone and install
npm install

# Start development
npm run dev

# Optional: run all apps in monorepo
npm run dev:all

# Run ML services
docker-compose -f docker-compose.ml.yml up
```

## Features

### Intelligent Intake & Engagement
- **Multimodal Transformer Intelligence**: Process unstructured voice notes and messy text with LLM understanding
- **Computer Vision**: Auto-estimate damage severity from "Before" photos
- **Voice-to-Grid**: Voice bot for digital-illiterate users in regional languages
- **Unique Grid ID**: Instant tracking ID generation

### Autonomous Operations
- **AI Routing Engine**: Auto-categorize and assign to nearest specialist crew in <30s
- **Dynamic GNN**: Predict fastest resolution path, bypass inter-department delays
- **Vector Embeddings**: Qdrant-powered similarity search for past cases
- **Reinforcement Learning**: Continuous model retraining based on feedback

### Transparency & Enforcement
- **Live Tracking**: Package-style timeline from Created to Feedback
- **SLA Auto-Escalation**: Countdown timers with automatic senior officer alerts
- **Two-Factor Verification**: Geo-tagged "After" photos with coordinate matching
- **Automated ETAs**: ML-calculated crew arrival times

### Predictive Governance
- **Geospatial Crisis Detection**: DBSCAN/LDA heatmap clusters for early warning
- **Predictive Maintenance**: Flag infrastructure likely to fail in 7 days
- **Command Center**: Live KPIs, heatmaps, action queues
- **Auto-Audit Trigger**: AI-led audit on citizen contestation

## Architecture

GrievanceGrid follows Clean Architecture with 6 layers:
1. Intelligent Client (React + Vite Frontend primary, Next.js secondary)
2. API Gateway (GraphQL + REST)
3. Core Application (Domain Services)
4. Durable Data (PostgreSQL)
5. Vector Search (Qdrant)
6. AI/LLM Ingestion (VLLM + Transformers)

## License

Proprietary - All Rights Reserved