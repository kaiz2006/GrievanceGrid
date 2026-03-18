# GrievanceGrid Worker

Celery-based background worker for AI processing, clustering, notifications, maintenance, and SLA monitoring.

## Local setup

1. Create and activate a Python virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and adjust values.

Important environment keys:

- `LLM_SERVICE_URL`, `CV_SERVICE_URL`, `GNN_SERVICE_URL` for model service calls
- `QDRANT_URL`, `QDRANT_COLLECTION`, `EMBEDDING_DIMENSION` for vector indexing
- `REDIS_PUBSUB_URL` for tracking event publish
- `WORKER_DRY_RUN` to toggle external side effects

## Run worker

```bash
celery -A src.celery_app:celery_app worker --loglevel=INFO
```

## Run beat scheduler

```bash
celery -A src.celery_app:celery_app beat --loglevel=INFO
```

## Current task behavior

- `ai_processing.process_grievance_ai`: calls LLM/CV/GNN endpoints when available and indexes embedding in Qdrant, with deterministic fallback embedding.
- `ai_processing.process_voice_grievance`: uses LLM transcription endpoint when available.
- `clustering.recluster_recent_grievances`: computes deterministic location-bin clusters when grievance points are provided.
- `maintenance.update_infrastructure_risk_scores`: computes deterministic risk baseline per asset when input assets are provided.
- `notifications.publish_tracking_event`: publishes to Redis channel `grievance:<id>:updates` when not in dry-run mode.

## Docker

Worker mode:

```bash
docker run --env-file .env grievancegrid-worker
```

Beat mode:

```bash
docker run --env-file .env -e CELERY_MODE=beat grievancegrid-worker
```