# GrievanceGrid Commands Reference

This document lists the current runnable commands and what each command does.

## Quick Start

```bash
# 1) Install dependencies
npm run install:all

# 2) Start frontend + API
npm run dev:lite

# 3) (Optional) Start full stack for demo/hackathon
npm run dev:full
```

## Root Commands

Run all commands below from repository root.

| Command | What it does |
|---|---|
| `npm run install:all` | Installs npm workspaces, then installs Python dependencies for API/Worker and AI models. |
| `npm run install:frontend` | Installs frontend workspace dependencies only. |
| `npm run install:api` | Creates/uses Python venv and installs API requirements. |
| `npm run install:worker` | Creates/uses Python venv and installs Worker requirements. |
| `npm run install:ai` | Creates/uses Python venv and installs AI-model requirements. |
| `npm run dev` | Starts frontend only via Turborepo filter. |
| `npm run dev:lite` | Starts frontend + API. |
| `npm run dev:backend` | Starts API + Worker + database package tasks. |
| `npm run dev:full` | Starts `dev:lite`, Worker, and AI models in parallel. |
| `npm run dev:api` | Starts API workspace dev mode only. |
| `npm run dev:worker` | Starts Worker workspace dev mode only. |
| `npm run dev:ai` | Starts AI model Docker services (foreground). |
| `npm run docker:up` | Starts root docker-compose stack in detached mode. |
| `npm run docker:down` | Stops root docker-compose stack. |
| `npm run docker:infra` | Starts only infra containers (Postgres, Redis, Qdrant). |
| `npm run build` | Runs all build tasks via Turborepo. |
| `npm run build:frontend` | Builds frontend workspace only. |
| `npm run lint` | Runs all lint tasks via Turborepo. |
| `npm run test` | Runs all test tasks via Turborepo. |
| `npm run start` | Starts package `start` scripts in parallel via Turborepo. |
| `npm run start:prod` | Starts API and Worker production commands. |
| `npm run start:api` | Starts API server with uvicorn. |
| `npm run start:worker` | Starts Celery worker queues. |
| `npm run start:ai` | Starts AI model Docker services in detached mode. |
| `npm run stop:ai` | Stops AI model Docker services. |
| `npm run db:generate` | Generates Drizzle migration files from schema. |
| `npm run db:push` | Pushes schema to database directly. |
| `npm run db:migrate` | Applies generated migrations. |
| `npm run db:studio` | Opens Drizzle Studio UI. |
| `npm run db:empty` | Truncates all app tables and resets identities. |
| `npm run db:seed` | Destructive seed for about 10k grievances. |
| `npm run db:seed:large` | Destructive seed for about 50k grievances. |
| `npm run db:seed:xlarge` | Destructive seed for about 200k grievances. |
| `npm run db:setup` | Runs `db:generate` + `db:push` + `db:seed`. |
| `npm run clean` | Runs workspace clean tasks and removes root node_modules. |
| `npm run format` | Formats JS/TS/JSON/MD files using Prettier. |

## Database Package Commands

Run these from `packages/database` when working directly on DB tasks.

| Command | What it does |
|---|---|
| `npm run db:generate` | Generate migrations from `src/schema.ts`. |
| `npm run db:push` | Push schema to DB without migration files. |
| `npm run db:migrate` | Apply migrations with drizzle-kit up. |
| `npm run db:studio` | Open Drizzle Studio on port `4984`. |
| `npm run db:empty` | Truncate all domain tables (`RESTART IDENTITY CASCADE`). |
| `npm run db:seed` | Destructive deterministic seed (`~10k`). |
| `npm run db:seed:large` | Destructive deterministic seed (`~50k`). |
| `npm run db:seed:xlarge` | Destructive deterministic seed (`~200k`). |
| `npm run db:setup` | Generate + push + seed (default volume). |

Notes:
1. `db:empty` and all `db:seed*` commands are destructive.
2. Safety checks block production-like DB URLs unless override env vars are explicitly set.

## Workspace-Specific Commands

### apps/frontend

Run from `apps/frontend`.

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite dev server. |
| `npm run build` | Production build. |
| `npm run build:dev` | Development-mode build. |
| `npm run lint` | Run ESLint. |
| `npm run preview` | Preview built frontend. |
| `npm run test` | Run Vitest once. |
| `npm run test:watch` | Run Vitest in watch mode. |

### apps/api

Run from `apps/api`.

| Command | What it does |
|---|---|
| `npm run install:deps` | Create/use venv and install API Python dependencies. |
| `npm run dev` | Start FastAPI with reload. |
| `npm run start` | Start FastAPI without reload. |
| `npm run test` | Run pytest for API. |

### apps/worker

Run from `apps/worker`.

| Command | What it does |
|---|---|
| `npm run install:deps` | Create/use venv and install Worker Python dependencies. |
| `npm run dev` | Start worker + beat concurrently. |
| `npm run dev:worker` | Start Celery worker queues. |
| `npm run dev:beat` | Start Celery beat scheduler. |
| `npm run start` | Start worker (non-dev command). |
| `npm run test` | Run pytest for worker. |

### ai-models

Run from `ai-models`.

| Command | What it does |
|---|---|
| `npm run install:deps` | Create/use venv and install AI Python dependencies. |
| `npm run dev` | Start AI services with Docker Compose (foreground). |
| `npm run dev:build` | Rebuild and start AI services with Docker Compose. |
| `npm run start` | Start AI services in detached mode. |
| `npm run stop` | Stop AI services. |
| `npm run dev:llm` | Run LLM server directly from source. |
| `npm run dev:cv` | Run CV server directly from source. |
| `npm run dev:gnn` | Run GNN server directly from source. |

## Common Workflows

### Frontend + API only

```bash
npm run install:all
npm run dev:lite
```

### Full hackathon demo stack

```bash
npm run docker:infra
npm run db:setup
npm run dev:full
```

### Reset database and load large data for ML testing

```bash
npm run db:empty
npm run db:seed:large
```

## Service URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:8080 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| LLM Service | http://localhost:8001 |
| CV Service | http://localhost:8002 |
| GNN Service | http://localhost:8003 |

