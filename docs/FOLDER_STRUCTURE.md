# GrievanceGrid Folder Structure

## Monorepo Layout

GrievanceGrid uses a monorepo structure separating frontend, backend, and AI components.

```
grievancegrid/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy-prod.yml
│   │   └── ml-training.yml
│   └── ISSUE_TEMPLATE.md
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── docker-compose.ml.yml
├── package.json
├── turbo.json
├── tsconfig.json
├── README.md
├── apps/
│   ├── web/                    # Next.js Frontend
│   ├── api/                   # FastAPI Backend
│   └── worker/                # Celery Workers
├── packages/
│   ├── ui/                    # Shared UI components
│   ├── config/                # Shared configuration
│   ├── database/              # Prisma client & migrations
│   ├── graphql/               # GraphQL schema & resolvers
│   └── utils/                 # Shared utilities
├── ai-models/
│   ├── llm/                   # LLM processing code
│   ├── cv/                    # Computer vision models
│   ├── gnn/                   # Graph neural network
│   └── clustering/            # DBSCAN/LDA models
├── docs/                      # Documentation
├── scripts/                   # Build & deployment scripts
└── scripts/                   # Build & deployment scripts
```

---

## Apps (Deployable Services)

### apps/web (Frontend - Next.js 15)

```
apps/web/
├── public/
│   ├── images/
│   └── locales/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── dashboard/
│   │   ├── submit/
│   │   ├── track/
│   │   └── admin/
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── grievance/          # Grievance-specific components
│   │   ├── map/                # Leaflet map components
│   │   ├── timeline/           # Tracking timeline
│   │   └── admin/              # Admin dashboard components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Client-side utilities
│   ├── store/                 # Zustand stores
│   ├── services/              # API client functions
│   ├── types/                 # TypeScript types
│   └── styles/                # Global styles
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.local
```

### apps/api (Backend - FastAPI)

```
apps/api/
├── src/
│   ├── main.py                # FastAPI entry point
│   ├── app.py                 # App configuration
│   ├── api/
│   │   ├── v1/
│   │   │   ├── grievances.py  # Grievance endpoints
│   │   │   ├── voice.py       # Voice processing
│   │   │   ├── tracking.py    # Package-style tracking
│   │   │   ├── clusters.py    # Geo clusters
│   │   │   ├── admin.py       # Admin endpoints
│   │   │   └── analytics.py   # Dashboard analytics
│   │   └── dependencies.py    # Shared dependencies
│   ├── core/
│   │   ├── config.py          # Settings
│   │   ├── security.py        # Auth & JWT
│   │   └── logging.py         # Logging config
│   ├── services/              # Business logic
│   │   ├── grievance_service.py
│   │   ├── routing_service.py
│   │   ├── sla_service.py
│   │   ├── verification_service.py
│   │   ├── ai_service.py
│   │   └── analytics_service.py
│   ├── models/                # Domain models
│   │   ├── grievance.py
│   │   ├── user.py
│   │   ├── department.py
│   │   └── cluster.py
│   ├── repositories/          # Data access layer
│   │   ├── grievance_repo.py
│   │   ├── user_repo.py
│   │   └── cluster_repo.py
│   ├── schemas/               # Pydantic models
│   │   ├── grievance.py
│   │   ├── user.py
│   │   └── common.py
│   └── ml/                    # ML integration
│       ├── llm_client.py
│       ├── cv_client.py
│       ├── gnn_client.py
│       └── vector_client.py
├── unit/
└── integration/
├── Dockerfile
├── requirements.txt
├── pyproject.toml
└── .env
```

### apps/worker (Background Workers)

```
apps/worker/
├── src/
│   ├── celery_app.py          # Celery configuration
│   ├── tasks/
│   │   ├── ai_processing.py  # LLM/CV processing
│   │   ├── clustering.py      # DBSCAN jobs
│   │   ├── maintenance.py     # Predictive maintenance
│   │   └── notifications.py   # Push notifications
│   └── schedulers/
│       ├── sla_monitor.py      # SLA escalation
│       └── report_generator.py
├── requirements.txt
└── Dockerfile
```

---

## Packages (Shared Libraries)

### packages/ui (Component Library)

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Card/
│   │   ├── Badge/
│   │   ├── Timeline/
│   │   └── Map/
│   ├── hooks/
│   ├── utils/
│   └── index.ts
├── package.json
├── tsconfig.json
└── storybook/
```

### packages/database (Drizzle ORM + PostgreSQL)

```
packages/database/
├── drizzle/
│   ├── meta/
│   │   └── _migration.ts
│   └── schema.ts              # Drizzle schema definitions
├── src/
│   ├── index.ts              # Drizzle client
│   ├── types.ts
│   └── utils.ts
├── package.json
├── drizzle.config.ts
└── README.md
```

### packages/graphql (GraphQL Schema)

```
packages/graphql/
├── src/
│   ├── schema/
│   │   ├── typeDefs.gql
│   │   ├── resolvers/
│   │   │   ├── grievance.ts
│   │   │   ├── user.ts
│   │   │   └── cluster.ts
│   │   └── index.ts
│   ├── client/
│   │   ├── generated.ts
│   │   └── operations/
│   └── server.ts
├── package.json
└── codegen.yml
```

### packages/config (Shared Configuration)

```
packages/config/
├── src/
│   ├── index.ts
│   ├── environments.ts
│   └── constants.ts
├── package.json
└── tsconfig.json
```

### packages/utils (Shared Utilities)

```
packages/utils/
├── src/
│   ├── date.ts
│   ├── geo.ts
│   ├── validation.ts
│   ├── crypto.ts
│   └── logger.ts
├── package.json
└── tsconfig.json
```

---

## AI Models

### ai-models/llm (Language Models)

```
ai-models/llm/
├── src/
│   ├── client.py              # VLLM client wrapper
│   ├── processor.py           # LLM processing logic
│   ├── prompts/               # System prompts
│   │   ├── classification.md
│   │   ├── routing.md
│   │   └── resolution.md
│   └── config.py              # Model configuration
├── models/                    # Saved model weights
├── Dockerfile
├── requirements.txt
└── README.md
```

### ai-models/cv (Computer Vision)

```
ai-models/cv/
├── src/
│   ├── model.py               # ResNet50 model
│   ├── inference.py           # Inference pipeline
│   ├── training/             # Training scripts
│   └── data/                  # Preprocessing
├── models/
│   └── damage_classifier.pth
├── data/
│   ├── train/
│   └── test/
├── requirements.txt
├── Dockerfile
└── README.md
```

### ai-models/gnn (Graph Neural Network)

```
ai-models/gnn/
├── src/
│   ├── model.py               # GNN architecture
│   ├── data_loader.py         # Graph construction
│   ├── trainer.py             # Training loop
│   └── inference.py           # Route prediction
├── models/
│   └── department_gnn.pth
├── data/
│   └── department_graph.json
├── requirements.txt
└── README.md
```

### ai-models/clustering

```
ai-models/clustering/
├── src/
│   ├── dbscan.py              # DBSCAN implementation
│   ├── lda.py                 # Topic modeling
│   └── anomaly.py             # Anomaly detection
├── notebooks/                 # Jupyter analysis
├── requirements.txt
└── README.md
```

---

## Scripts

```
scripts/
├── setup.sh                   # Local setup
├── deploy.sh                  # Production deploy
├── migrate-db.sh              # Database migrations
├── seed-db.sh                # Seed data
├── build-docker.sh           # Build all images
└── build-docker.sh           # Build all images
```

---

## Configuration Files

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {}
  }
}
```

```yaml
# docker-compose.yml (Core services)
version: '3.8'
services:
  postgres:
    image: supabase/postgres
    ports:
      - "5432:5432"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  qdrant:
    image: qdrant/qdrant
    ports:
      - "6333:6333"
  
  api:
    build: ./apps/api
    ports:
      - "8000:8000"
  
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
```

---

## Environment Variables

```
# .env (Shared)
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
QDRANT_URL=http://qdrant:6333

# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_MAP_TILE_URL=...

# apps/api/.env
JWT_SECRET=...
LLM_API_URL=...

# ai-models/.env
MODEL_PATH=/models
CUDA_DEVICE=cuda:0
```

---

## Import Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@grievancegrid/ui": ["packages/ui/src"],
      "@grievancegrid/config": ["packages/config/src"],
      "@grievancegrid/graphql": ["packages/graphql/src"],
      "@grievancegrid/utils": ["packages/utils/src"],
      "@grievancegrid/db": ["packages/database/src"],
      "@/components/*": ["apps/web/src/components/*"],
      "@/app/*": ["apps/web/src/app/*"],
      "@/lib/*": ["apps/web/src/lib/*"]
    }
  }
}
```

---

## Package Manager Scripts

```json
// package.json (Root)
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "db:push": "turbo run db:push --filter=@grievancegrid/database",
    "db:migrate": "turbo run db:migrate --filter=@grievancegrid/database"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```