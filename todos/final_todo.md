# Final Todo — Integration, DevOps & Deployment

## 🗂️ Monorepo & Build System
- [ ] Set up Turborepo (`turbo.json`) with `build`, `dev`, `lint` pipelines and `dependsOn` ordering
- [ ] Configure `package.json` root scripts: `dev`, `build`, `lint`, `db:push`, `db:migrate`
- [ ] Ensure all packages compile with correct TypeScript (`tsconfig.json` path aliases)
- [ ] Verify `packages/ui`, `packages/database`, `packages/graphql`, `packages/utils`, `packages/config` are properly linked

---

## 🐳 Dockerization
- [ ] Write `Dockerfile` for `apps/web` (Next.js production build)
- [ ] Write `Dockerfile` for `apps/api` (FastAPI with uvicorn)
- [x] Write `Dockerfile` for `apps/worker` (Celery worker)
- [ ] Write Dockerfiles for each AI model service (`ai-models/llm`, `cv`, `gnn`)
- [ ] Write `docker-compose.yml` (core services):
  - [ ] `postgres` (supabase/postgres with PostGIS)
  - [ ] `redis` (redis:7-alpine)
  - [ ] `qdrant` (qdrant/qdrant)
  - [ ] `api` (FastAPI)
  - [ ] `web` (Next.js)
  - [ ] `worker` (Celery)
- [ ] Write `docker-compose.ml.yml` (ML model services):
  - [ ] `llm-service` (VLLM + Llama-3.1)
  - [ ] `cv-service` (ResNet50)
  - [ ] `gnn-service` (GNN routing)
- [ ] Test full stack locally with `docker-compose up`

---

## 🔗 End-to-End Integration
- [ ] Connect frontend → backend REST API (verify all form submissions and data fetches)
- [ ] Connect frontend → GraphQL API (verify queries and mutations)
- [ ] Connect backend Celery tasks → ML services (verify AI processing pipeline)
- [ ] Connect backend → Qdrant (verify vector indexing and similarity search)
- [ ] Connect backend → Redis pub/sub for WebSocket live tracking
- [ ] Test full grievance lifecycle: Submit → AI Process → Route → In Progress → Verify → Resolve → Feedback

---

## 🛠️ Setup Scripts (`scripts/`)
- [ ] `setup.sh` — Install all dependencies, set up `.env` files, run DB migrations
- [ ] `seed-db.sh` — Seed departments, teams, and sample grievances
- [ ] `migrate-db.sh` — Run Drizzle migrations against target database
- [ ] `build-docker.sh` — Build all Docker images in correct order
- [ ] `deploy.sh` — Deploy to production environment

---

## 🚀 CI/CD (`.github/workflows/`)
- [ ] `ci.yml` — On every PR:
  - Lint all packages
  - Run unit and integration tests
  - Type-check TypeScript
  - Build all Docker images
- [ ] `deploy-prod.yml` — On merge to `main`:
  - Build and push Docker images to container registry
  - Run DB migrations
  - Deploy frontend (CDN)
  - Deploy API containers (auto-scaling groups)
  - Deploy Celery workers
  - Run smoke tests
- [ ] `ml-training.yml` — Scheduled workflow:
  - Retrain RL routing agent on new data
  - Update predictive maintenance model
  - Push updated model weights to storage

---

## 🧪 Testing Strategy
- [ ] Unit tests for all backend services and ML modules
- [ ] Integration tests for all REST + GraphQL endpoints
- [ ] Frontend component tests with React Testing Library
- [ ] E2E tests with Playwright:
  - [ ] Citizen submits grievance via text
  - [ ] Citizen submits grievance via voice
  - [ ] Track grievance with Grid ID (public route)
  - [ ] Officer verifies resolution with geo-tagged photo
  - [ ] Admin views dashboard and processes action queue
  - [ ] Citizen contests resolution and AI audit is triggered
- [ ] Load testing: verify 100 req/min rate limit behavior

---

## ☁️ Infrastructure & Scalability
- [ ] Set up PostgreSQL with read replicas for analytics queries
- [ ] Configure Redis cluster for session management and pub/sub
- [ ] Deploy distributed Qdrant cluster for vector search
- [ ] Set up GPU-accelerated inference servers for ML models
- [ ] Configure CDN for Next.js static assets
- [ ] Set up auto-scaling for API containers behind load balancer
- [ ] Configure database connection pooling (PgBouncer)

---

## 🔒 Security
- [ ] Enable HTTPS/TLS across all services
- [ ] Configure CORS policy on API (allowlist of frontend domains)
- [ ] Set up rate limiting in Redis (100 req/min per IP globally, stricter per endpoint)
- [ ] Enforce `Authorization: Bearer <JWT>` on all non-public endpoints
- [ ] Protect admin endpoints with ADMIN role guard
- [ ] Sanitize all user-uploaded content (images, audio) for malware
- [ ] Set up audit log immutability (append-only, no DELETE on `audit_logs`)

---

## 📊 Monitoring & Observability
- [ ] Set up structured logging across all services (JSON format, correlated by `grievance_id`)
- [ ] Integrate error tracking (e.g., Sentry)
- [ ] Set up metrics dashboard (Grafana + Prometheus): API latency, ML model latency, queue depth
- [ ] Set up SLA breach alerting (PagerDuty / email to admins)
- [ ] Monitor Celery queue depth and worker health

---

## 📝 Documentation
- [ ] Update `README.md` with full local development setup instructions
- [ ] Add API usage examples to `docs/API_SPEC.md`
- [ ] Write onboarding guide for new contributors
- [ ] Create architecture decision records (ADRs) for major design choices
- [ ] Finalize all `docs/` files to be consistent with the final implementation

---

## ✅ Final Checklist (Pre-Launch)
- [ ] All performance targets met (see `ml_todo.md` benchmarks)
- [ ] All E2E tests passing
- [ ] Security audit completed
- [ ] Load test passed at expected peak traffic
- [ ] Monitoring and alerting active
- [ ] CI/CD pipeline green on `main`
- [ ] Staging environment validated by team
- [ ] Production deployment executed and smoke tests passed
