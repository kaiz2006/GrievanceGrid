# GrievanceGrid Worker - Development Guide

## Overview

The GrievanceGrid Worker is a Celery-based background processing system that handles:

- **AI Processing**: Text classification, voice transcription, image severity analysis, routing suggestions
- **Clustering**: Geographic clustering of grievances
- **Maintenance**: Infrastructure risk assessment and predictive maintenance
- **Notifications**: Status updates and real-time tracking events
- **SLA Monitoring**: Escalation workflows for overdue grievances
- **Reporting**: Daily analytics snapshots

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│            FastAPI Backend (apps/api)                     │
└────────────────────┬─────────────────────────────────────┘
                     │
          ┌──────────┴───────────┐
          │                      │
   REST API Calls         Task Dispatch (Celery)
          │                      │
          ▼                      ▼
┌──────────────────────────────────────────────────────────┐
│         Redis (Broker + Pub/Sub)                          │
│  - Task Queue (Celery broker)                             │
│  - Result Backend (task results)                          │
│  - Pub/Sub (real-time updates)                            │
└────┬─────────────────────────────┬──────────────────────┘
     │                             │
     ▼                             ▼
┌──────────────────────┐    ┌─────────────────────────┐
│   Celery Worker      │    │   Celery Beat           │
│ (tasks processing)   │    │ (scheduled tasks)       │
└──────────────────────┘    └─────────────────────────┘
     │                              │
     ├──────────────┬─────┬─────────┘
     │              │     │
     ▼              ▼     ▼
┌──────────┐  ┌──────────┐  ┌─────────────┐
│ ML APIs  │  │ Qdrant   │  │ PostgreSQL  │
│ (LLM,CV, │  │ (Vector  │  │ (Audit Log, │
│  GNN)    │  │  DB)     │  │  SLA data)  │
└──────────┘  └──────────┘  └─────────────┘
```

## Quick Start

### 1. Prerequisites

- Python 3.12+
- Redis 7+
- Qdrant (for vector search)
- PostgreSQL (for audit logs)

### 2. Local Setup

```bash
cd apps/worker

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Required Services

```bash
# Terminal 1: Redis
docker run -d --name grievance-redis -p 6379:6379 redis:7-alpine

# Terminal 2: Qdrant
docker run -d --name grievance-qdrant -p 6333:6333 \
  -v $(pwd)/../../../qdrant-data:/qdrant/storage \
  qdrant/qdrant

# Terminal 3: PostgreSQL (if needed for audit logs)
docker run -d --name grievance-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=grievances \
  -p 5432:5432 \
  postgres:16-alpine
```

### 4. Run Worker

```bash
# Terminal 4: Celery Worker
celery -A src.celery_app:celery_app worker --loglevel=INFO

# Terminal 5: Celery Beat (for scheduled tasks)
celery -A src.celery_app:celery_app beat --loglevel=INFO
```

### 5. Test the Setup

```bash
python test_local.py
```

## Configuration

### Environment Variables

Key environment variables in `.env`:

```env
# Worker Configuration
WORKER_APP_NAME=grievancegrid-worker
WORKER_DRY_RUN=true                    # Set to false in production
WORKER_LOG_LEVEL=INFO
WORKER_TIMEZONE=UTC

# Celery/Redis
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1
REDIS_PUBSUB_URL=redis://localhost:6379/0

# API Backend
API_BASE_URL=http://localhost:8000

# ML Services
LLM_SERVICE_URL=http://localhost:8101
CV_SERVICE_URL=http://localhost:8102
GNN_SERVICE_URL=http://localhost:8103

# Vector Database
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=grievances
EMBEDDING_DIMENSION=768

# Timeouts
ML_TIMEOUT_SECONDS=8.0
```

## Tasks Overview

### AI Processing Tasks

#### `process_grievance_ai`
Main grievance enrichment pipeline:
1. **Text Classification** (LLM): Extract category, priority, summary
2. **Damage Assessment** (CV): Estimate severity from images
3. **Vector Indexing**: Embed grievance in Qdrant
4. **Routing** (GNN): Suggest department assignment

```python
from src.tasks import process_grievance_ai

result = process_grievance_ai.delay(
    grievance_id="GRI-2026-000001",
    payload={
        "description": "Pothole on Main Street",
        "before_photo_url": "https://...",
        "latitude": 40.7128,
        "longitude": -74.0060
    }
)
```

#### `process_voice_grievance`
Voice-to-text pipeline:
1. Speech-to-Text (Whisper): Transcribe audio
2. Text Classification: Extract intent
3. Callback: Sync results to backend

#### `run_contestation_audit`
AI audit for contested resolutions:
- Analyze contest reason
- Assess evidence severity
- Generate recommendation

### Clustering & Analytics

#### `recluster_recent_grievances`
Geographic clustering of recent grievances:
- Groups by location bins
- Detects crisis hotspots
- Updates cluster metadata

#### `update_infrastructure_risk_scores`
Predictive maintenance scoring:
- Calculates failure risk per asset
- Flags high-risk infrastructure
- Triggers maintenance alerts

### Notifications

#### `send_status_notification`
Dispatch notifications on status changes:
- Email notifications
- SMS alerts
- Push notifications (when integrated)

#### `publish_tracking_event`
Real-time tracking updates via Redis pub/sub:
- Publishes to `grievance:{id}:updates` channel
- Enables WebSocket live tracking
- Consumer-agnostic design

### Scheduled Jobs

#### SLA Monitor (Every 1 minute)
- Checks grievances approaching SLA deadlines
- Triggers escalation workflows
- Updates SLA timer status

#### Recluster (Every 10 minutes)
- Re-clusters recent grievances
- Updates crisis score
- Identifies hotspots

#### Predictive Maintenance (Hourly)
- Updates infrastructure risk scores
- Flags critical failures
- Generates alerts

#### Daily Reports (Scheduled)
- Aggregates daily metrics
- Generates snapshots
- Archives to reporting database

## Task Queues

The worker routes tasks to specific queues based on type:

```python
task_routes = {
    "src.tasks.ai_processing.*": {"queue": "ai-processing"},
    "src.tasks.notifications.*": {"queue": "notifications"},
    "src.schedulers.sla_monitor.*": {"queue": "sla-monitor"},
    "src.schedulers.report_generator.*": {"queue": "reporting"},
    "src.tasks.clustering.*": {"queue": "analytics"},
    "src.tasks.maintenance.*": {"queue": "maintenance"},
}
```

To run workers for specific queues:

```bash
# AI Processing Worker
celery -A src.celery_app:celery_app worker -Q ai-processing --loglevel=INFO

# Notifications Worker
celery -A src.celery_app:celery_app worker -Q notifications --loglevel=INFO

# Analytics Worker
celery -A src.celery_app:celery_app worker -Q analytics --loglevel=INFO
```

## Dry Run Mode

For development and testing, `WORKER_DRY_RUN=true` enables deterministic returns without calling external services:

```python
# With WORKER_DRY_RUN=true:
- LLM returns default category/priority
- CV returns fixed severity scores
- GNN returns default department
- Qdrant uses fallback embeddings
- Redis pub/sub doesn't publish
- Backend API callbacks are skipped
```

## Error Handling & Retries

All AI processing tasks have built-in retry logic:

```python
@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 3}
)
def process_grievance_ai(...):
    ...
```

- Automatic retry on failures (max 3 attempts)
- Exponential backoff between retries
- Detailed error logging

## Monitoring & Logging

All tasks log structured JSON output:

```json
{
  "timestamp": "2026-03-19T10:30:00Z",
  "task": "src.tasks.ai_processing.process_grievance_ai",
  "level": "INFO",
  "grievance_id": "GRI-2026-000001",
  "result": {
    "ai_category": "ROADS",
    "ai_priority": "HIGH",
    "damage_severity": 0.82,
    "vector_indexed": true,
    "backend_sync": true
  }
}
```

Monitor tasks with Celery Flower:

```bash
pip install flower
celery -A src.celery_app:celery_app flower --port=5555
# Access at http://localhost:5555
```

## Production Deployment

### Docker

```bash
# Build image
docker build -t grievancegrid-worker .

# Run as worker
docker run --env-file .env.prod \
  -e CELERY_MODE=worker \
  grievancegrid-worker

# Run as beat scheduler
docker run --env-file .env.prod \
  -e CELERY_MODE=beat \
  grievancegrid-worker
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grievance-worker
spec:
  replicas: 3
  selector:
    matchLabels:
      app: grievance-worker
  template:
    metadata:
      labels:
        app: grievance-worker
    spec:
      containers:
      - name: worker
        image: grievancegrid-worker:latest
        env:
        - name: CELERY_BROKER_URL
          valueFrom:
            secretKeyRef:
              name: worker-secrets
              key: broker-url
        - name: WORKER_DRY_RUN
          value: "false"
```

### Auto-scaling

Configure RabbitMQ/Redis with proper connection pooling and Celery auto-scaling:

```bash
celery -A src.celery_app:celery_app worker \
  --autoscale=10,3 \
  --pool=prefork \
  --loglevel=INFO
```

## Troubleshooting

### Tasks not being processed

1. Check Redis connection:
   ```bash
   redis-cli ping
   ```

2. Check Celery worker logs:
   ```bash
   celery -A src.celery_app:celery_app worker --loglevel=DEBUG
   ```

3. Check task queue:
   ```bash
   celery -A src.celery_app:celery_app inspect active
   ```

### Slow task processing

1. Check ML service availability (timeout may be too low)
2. Scale to more worker processes: `--autoscale=20,5`
3. Use separate workers per queue for better prioritization

### Memory issues

Limit task concurrency and enable long-running task warnings:

```bash
celery -A src.celery_app:celery_app worker \
  --max-tasks-per-child=100 \
  --time-limit=3600 \
  --soft-time-limit=3540
```

## Client Integration

From API endpoints, dispatch tasks:

```python
from src.tasks import process_grievance_ai

@app.post("/grievances")
async def submit_grievance(payload: GrievanceInput):
    # Create grievance in DB
    grievance = await db.grievances.create(payload)
    
    # Dispatch AI task
    process_grievance_ai.delay(
        grievance.id,
        payload.dict()
    )
    
    return grievance
```

Listen to updates via WebSocket:

```python
@app.websocket("/ws/track/{grid_id}")
async def track_grievance(websocket: WebSocket, grid_id: str):
    await websocket.accept()
    
    # Subscribe to Redis pub/sub
    channel = f"grievance:{grid_id}:updates"
    pubsub = redis_client.pubsub()
    pubsub.subscribe(channel)
    
    async for message in pubsub.listen():
        if message["type"] == "message":
            await websocket.send_json(json.loads(message["data"]))
```

## Resources

- [Celery Documentation](https://docs.celeryproject.org/)
- [Qdrant Vector Database](https://qdrant.tech/)
- [Redis Documentation](https://redis.io/)
- [GrievanceGrid Architecture](../docs/ARCHITECTURE.md)
- [ML Pipeline Guide](../docs/ML_PIPELINE.md)
