# GrievanceGrid Worker

🚀 **Celery-based background processing system** for AI-powered grievance handling.

Handles AI enrichment, clustering, notifications, maintenance, and SLA monitoring for the GrievanceGrid platform.

## 📋 Features

- **AI Processing**: Text classification, voice transcription, image analysis, intelligent routing
- **Geospatial Clustering**: Real-time crisis hotspot detection
- **Predictive Maintenance**: Infrastructure risk assessment
- **Real-time Notifications**: Status updates and tracking events
- **SLA Monitoring**: Escalation workflows for overdue grievances
- **Scheduled Reporting**: Daily analytics snapshots

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Redis 7+
- Qdrant (vector database)
- PostgreSQL (for audit logs)

### 1. Setup

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate              # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings
```

### 2. Start Required Services

```bash
# Redis (message broker)
docker run -d -p 6379:6379 redis:7-alpine

# Qdrant (vector database)
docker run -d -p 6333:6333 qdrant/qdrant

# PostgreSQL (optional, for audit logs)
docker run -d -p 5432:5432 \
  -e POSTGRES_PASSWORD=password \
  postgres:16-alpine
```

### 3. Run Worker

```bash
# Terminal 1: Celery Worker (processes tasks)
celery -A src.celery_app:celery_app worker --loglevel=INFO

# Terminal 2: Celery Beat (scheduled tasks)
celery -A src.celery_app:celery_app beat --loglevel=INFO
```

### 4. Test Setup

```bash
python test_local.py
```

## 🔧 Configuration

Essential environment variables in `.env`:

```env
# Worker
WORKER_DRY_RUN=true                    # Set to false in production
WORKER_LOG_LEVEL=INFO

# Celery/Redis
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/1

# ML Services
LLM_SERVICE_URL=http://localhost:8101
CV_SERVICE_URL=http://localhost:8102
GNN_SERVICE_URL=http://localhost:8103

# Vector DB
QDRANT_URL=http://localhost:6333
EMBEDDING_DIMENSION=768

# Backend API
API_BASE_URL=http://localhost:8000
```

See [DEVELOPMENT.md](DEVELOPMENT.md) for comprehensive configuration guide.

## 📚 Tasks

### AI Processing
- `process_grievance_ai` - Text classification, image analysis, vector indexing, routing
- `process_voice_grievance` - Speech-to-text and classification
- `run_contestation_audit` - AI audit for contested resolutions

### Analytics
- `recluster_recent_grievances` - Geographic clustering (every 10 min)
- `update_infrastructure_risk_scores` - Maintenance scoring (hourly)

### Notifications
- `send_status_notification` - Status change notifications
- `publish_tracking_event` - Real-time tracking via pub/sub

### Scheduled
- `monitor_sla_and_escalate` - SLA monitoring (every 1 min)
- `generate_daily_report_snapshot` - Daily reports

## 🐳 Docker

### Build

```bash
docker build -t grievancegrid-worker .
```

### Run as Worker

```bash
docker run --env-file .env \
  -e CELERY_MODE=worker \
  grievancegrid-worker
```

### Run as Beat Scheduler

```bash
docker run --env-file .env \
  -e CELERY_MODE=beat \
  grievancegrid-worker
```

### Docker Compose

```bash
docker-compose up worker beat
```

## 📖 Full Documentation

See [DEVELOPMENT.md](DEVELOPMENT.md) for:
- Detailed architecture
- All task specifications
- Queue configuration
- Production deployment
- Troubleshooting guide
- Monitoring and logging

## 🔗 Related

- [API Documentation](../api/README.md)
- [Architecture Guide](../../docs/ARCHITECTURE.md)
- [ML Pipeline Guide](../../docs/ML_PIPELINE.md)
- [Celery Docs](https://docs.celeryproject.org/)

Beat mode:

```bash
docker run --env-file .env -e CELERY_MODE=beat grievancegrid-worker
```