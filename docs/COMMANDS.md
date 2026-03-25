# GrievanceGrid Development Commands

## Quick Start

```bash
# Install ALL dependencies (frontend, api, worker, database, graphql, ui, ai-models)
npm run install:all

# Start Recommended services (Frontend + API)
npm run dev:lite

# Start ALL services (requires Docker)
npm run dev:full

```

---

## Installation Commands

### Install Everything
```bash
npm run install:all
```

This runs:
1. `turbo run install:deps` - All npm workspaces + Python venv packages
2. `cd ai-models && npm run install:deps` - AI models Python venv

### Install Individual Packages

| Command | Package | What it does |
|---------|---------|--------------|
| `npm run install:frontend` | apps/frontend | `npm install` |
| `npm run install:api` | apps/api | Python venv + pip install |
| `npm run install:worker` | apps/worker | Python venv + pip install |
| `npm run install:ai` | ai-models | Python venv + pip install |

---

## Development Commands

### Start Everything
```bash
npm run dev:full
```

### Recommended: Start Lite (Frontend + API)
```bash
npm run dev:lite
```


Runs in parallel:
- Frontend (Vite on port 8080)
- API (FastAPI on port 8000)
- Worker (Celery)
- GraphQL server
- AI Models (Docker: LLM 8001, CV 8002, GNN 8003)

| Command | Service | What it runs |
|---------|---------|--------------|
| `npm run dev` | Frontend only | Vite (8080) |
| `npm run dev:lite` | Frontend + API | Vite + FastAPI |
| `npm run dev:api` | Backend API | FastAPI (8000) |
| `npm run dev:worker` | Worker only | Celery (worker + beat) |
| `npm run dev:backend` | API + Worker + DB | FastAPI + Celery + DB tasks |
| `npm run dev:ai` | AI models (Docker) | LLM, CV, GNN services |
| `npm run dev:full` | Full stack | Everything (Lite + Worker + AI) |


---

## Production Commands

```bash
# Start all production services
npm run start

# Start API + Worker (production mode)
npm run start:prod

# Individual production starts
npm run start:api      # uvicorn production server
npm run start:worker   # celery worker
npm run start:ai       # docker-compose up -d
npm run stop:ai        # docker-compose down
```

---

## Docker Commands

```bash
npm run docker:up      # Start ALL services in Docker (containers)
npm run docker:down    # Stop all Docker services
npm run docker:infra   # Start only infrastructure (Postgres, Redis, Qdrant)
npm run dev:ai         # Start only AI services (LLM, CV, GNN)
```

---


## Database Commands

```bash
npm run db:generate    # Generate Drizzle migrations
npm run db:push        # Push schema to database
npm run db:migrate     # Run migrations
npm run db:studio      # Open Drizzle Studio
npm run db:seed        # Destructive seed (10k grievances)
npm run db:seed:large  # Destructive seed (50k grievances)
npm run db:seed:xlarge # Destructive seed (200k grievances)
npm run db:setup       # Full setup (generate + push + seed)
```

Note: seeding is destructive in this hackathon setup (tables are truncated and refilled).

---

## Build & Quality Commands

```bash
npm run build          # Build all packages
npm run lint           # Lint all packages
npm run test           # Run all tests
npm run clean          # Clean node_modules
npm run format         # Format with Prettier
```

---

## Package Structure

```
GrievanceGrid/
├── apps/
│   ├── frontend/      # React + Vite (port 8080)
│   ├── api/           # FastAPI backend (port 8000)
│   └── worker/        # Celery worker
├── packages/
│   ├── database/      # Drizzle ORM schema
│   ├── graphql/       # GraphQL server
│   └── ui/            # Shared UI components
└── ai-models/         # ML microservices (Docker)
    ├── llm/           # LLM service (port 8001)
    ├── cv/            # Computer Vision (port 8002)
    └── gnn/           # Graph Neural Network (port 8003)
```

---

## Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:8080 | React web app |
| API | http://localhost:8000 | FastAPI backend |
| API Docs | http://localhost:8000/docs | Swagger UI |
| LLM Service | http://localhost:8001 | AI text processing |
| CV Service | http://localhost:8002 | Image classification |
| GNN Service | http://localhost:8003 | Department routing |

---

## Requirements

- **Node.js** 18+
- **Python** 3.11+
- **Docker Desktop** (for AI models)
- **PostgreSQL** 16
- **Redis** 7

---

## Environment Files

Each app has its own `.env` file:

```
apps/frontend/.env      # VITE_API_BASE_URL, VITE_WS_URL
apps/api/.env           # DATABASE_URL, REDIS_URL, JWT_SECRET
apps/worker/.env        # CELERY_BROKER_URL, REDIS_URL
ai-models/.env          # LLM_API_URL, CV_API_URL, GNN_API_URL
```

---

## Troubleshooting

### Python venv already exists
The install script handles this automatically - it will skip venv creation and just run pip install.

### Docker not running
`npm run dev:ai` requires Docker Desktop to be running. Start Docker Desktop first.

### Port already in use
Check what's using the port:
```bash
# Windows
netstat -ano | findstr :8000

# Kill process
taskkill /PID <pid> /F
```

### Database connection failed
1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `apps/api/.env`
3. Run `npm run db:setup` to create tables
