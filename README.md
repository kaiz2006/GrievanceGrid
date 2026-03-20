# GrievanceGrid

**AI-Powered Public Grievance Redressal System**

## Monorepo Structure

- `apps/frontend`: React + Vite Frontend (Primary)
- `apps/web`: Next.js 15 Frontend (Secondary/Experimental)
- `apps/api`: FastAPI Backend
- `apps/worker`: Celery Background Workers
- `packages/ui`: Shared UI Components
- `packages/database`: Drizzle ORM Schema & Client
- `ai-models/`: Machine Learning Models (LLM, CV, GNN)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run primary frontend (React + Vite):
   ```bash
   npm run dev
   ```

3. Optional: run all apps via Turborepo:
   ```bash
   npm run dev:all
   ```

## Documentation

See the `docs/` folder for detailed specifications.
