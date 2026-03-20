# Final Todo — Integration, DevOps & Deployment

## Audit Addendum (2026-03-20)
- [x] Finalize canonical frontend architecture: `apps/frontend` (React + Vite) is primary and `apps/web` is secondary/experimental; align integrations/tests/docs to this choice.
- [ ] Replace mock frontend services with real API integration across whichever frontend(s) stay active.
- [x] Add `apps/api/Dockerfile` and `apps/web/Dockerfile` for deployable containers.
- [x] Add root-level orchestration compose for full-stack local run (api, worker, redis, postgres, qdrant, ml, frontend).
- [x] Create `.github/workflows/ci.yml`, `.github/workflows/deploy-prod.yml`, and `.github/workflows/ml-training.yml` (workflows folder currently empty).
- [ ] Run and automate full lifecycle E2E validation: submit -> AI processing -> route -> track -> verify -> feedback -> contest.
- [x] Enforce non-stub ML readiness checks before production release.

## 🗂️ Monorepo & Build System
- [x] Set up Turborepo (`turbo.json`) with `build`, `dev`, `lint` pipelines and `dependsOn` ordering
- [x] Configure `package.json` root scripts: `dev`, `build`, `lint`, `db:push`, `db:migrate`
- [ ] Ensure all packages compile with correct TypeScript (`tsconfig.json` path aliases)
- [ ] Verify `packages/ui`, `packages/database`, `packages/graphql`, `packages/utils`, `packages/config` are properly linked

---

## 🐳 Dockerization
- [ ] Write `Dockerfile` for `apps/web` (Next.js production build)
- [x] Write `Dockerfile` for `apps/api` (FastAPI with uvicorn)
- [x] Write `Dockerfile` for `apps/worker` (Celery worker) — **COMPLETE**
- [x] Write Dockerfiles for each AI model service (`ai-models/llm`, `cv`, `gnn`)
- [x] Write root `docker-compose.yml` (core services for full stack)
- [x] Worker-scoped compose exists (`apps/worker/docker-compose.yml`) with Redis, Qdrant, PostgreSQL, Worker, Beat, Flower
- [x] Write `docker-compose.ml.yml` (ML model services):
  - [x] `llm-service` (VLLM + Llama-3.1)
  - [x] `cv-service` (ResNet50)
  - [x] `gnn-service` (GNN routing)

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
- [x] `seed-db.sh` — Seed departments, teams, and sample grievances
- [ ] `migrate-db.sh` — Run Drizzle migrations against target database
- [ ] `build-docker.sh` — Build all Docker images in correct order
- [ ] `deploy.sh` — Deploy to production environment

---

- [x] `ci.yml` — On every PR (Optional/Hackathon Ready)
- [ ] `deploy-prod.yml` — **SKIP** (Local run only)
- [ ] `ml-training.yml` — **SKIP** (Manual training/scripts preferred for hackathon)

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

## ☁️ Infrastructure & Scalability — **SKIP (Running Locally)**
- [ ] Set up PostgreSQL with read replicas
- [ ] Configure Redis cluster
- [ ] Deploy distributed Qdrant cluster
- [ ] Set up GPU-accelerated inference servers
- [ ] Configure CDN for Next.js static assets
- [ ] Set up auto-scaling
- [ ] Configure database connection pooling (PgBouncer)

---

## 🔒 Security
- [x] Enable HTTPS/TLS across all services
- [x] Configure CORS policy on API (allowlist of frontend domains)
- [x] Set up rate limiting in Redis (100 req/min per IP globally, stricter per endpoint)
- [x] Enforce `Authorization: Bearer <JWT>` on all non-public endpoints
- [x] Protect admin endpoints with ADMIN role guard
- [x] Sanitize all user-uploaded content (images, audio) for malware
- [x] Set up audit log immutability (append-only, no DELETE on `audit_logs`)

---

## 📊 Monitoring & Observability — **OPTIONAL (Local Logs Sufficient)**
- [x] Set up structured logging across all services (JSON format)
- [ ] Integrate error tracking (e.g., Sentry)
- [ ] Set up metrics dashboard (Grafana + Prometheus)
- [ ] Set up SLA breach alerting
- [x] Monitor Celery queue depth and worker health

---

## 📝 Documentation
- [ ] Update `README.md` with full local development setup instructions
- [ ] Add API usage examples to `docs/API_SPEC.md`
- [ ] Write onboarding guide for new contributors
- [ ] Create architecture decision records (ADRs) for major design choices
- [ ] Finalize all `docs/` files to be consistent with the final implementation

---

## ✅ Final Checklist (Hackathon Ready)
- [x] All performance targets met (verified via benchmarks)
- [ ] All E2E demo paths successful: Submit -> AI -> Route -> Track
- [x] Local Docker Compose stack working perfectly
- [ ] README updated with clear "How to Run" instructions
