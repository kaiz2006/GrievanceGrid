# GrievanceGrid — AI-Powered Public Grievance Redressal

GrievanceGrid is a next-generation platform for public grievance redressal, utilizing LLMs, Computer Vision, and Graph Neural Networks to automate classification, severity estimation, and optimal routing.

## 🏗️ Monorepo Architecture

- **`apps/frontend`**: Primary React + Vite frontend with Tailwind CSS.
- **`apps/api`**: FastAPI backend providing REST and WebSocket (Tracking) APIs.
- **`apps/worker`**: Celery worker for background ML processing and notifications.
- **`ai-models/`**: Dedicated services for Llama-3.1, ResNet50, and GNN routing.
- **`packages/database`**: Drizzle ORM schema and PostgreSQL client.
- **`packages/ui`**: Shared design system components.

## 🚀 Quick Start (Local)

### 1. Initial Setup
Run the automated setup script to install dependencies and configure environments:
```bash
./scripts/setup.sh
```

### 2. Database Migrations
Start the infrastructure containers and run migrations:
```bash
docker compose up -d postgres redis qdrant
./scripts/migrate-db.sh
```

### 3. Run Development Servers
Start all applications in development mode:
```bash
npm run dev
```

## 🐳 Docker Orchestration
For a full-stack production-like environment:
```bash
# Build all images
./scripts/build-docker.sh

# Start the entire stack
docker compose up
```

## 📚 Documentation
- [API Specification](docs/API_SPEC.md)
- [ML Architecture](ai-models/README.md)
- [Database Schema](packages/database/README.md)
