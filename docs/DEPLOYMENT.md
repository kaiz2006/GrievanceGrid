# GrievanceGrid Deployment Guide

## Infrastructure Overview

Production deployment designed for sub-100ms ML inference with high availability.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         LOAD BALANCER (ALB)                         │
│                          ssl-termination                             │
└─────────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  Next.js      │       │  Next.js      │       │  Next.js      │
│  Frontend     │       │  Frontend     │       │  Frontend     │
│  (Auto-scale) │       │  (Auto-scale) │       │  (Auto-scale) │
└───────────────┘       └───────────────┘       └───────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  FastAPI       │       │  FastAPI       │       │  FastAPI       │
│  API           │       │  API           │       │  API           │
│  (Auto-scale) │       │  (Auto-scale) │       │  (Auto-scale) │
└───────────────┘       └───────────────┘       └───────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  PostgreSQL   │       │     Qdrant    │       │     Redis     │
│  (Primary +   │       │  (3 nodes)    │       │  (Cluster)    │
│   Replica)    │       │               │       │               │
└───────────────┘       └───────────────┘       └───────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  LLM Server   │       │  CV Server    │       │  GNN Server   │
│  (VLLM)       │       │  (ResNet)     │       │  (PyG)        │
│  GPU: T4      │       │  GPU: T4      │       │  GPU: T4      │
└───────────────┘       └───────────────┘       └───────────────┘
```

---

## Prerequisites

- AWS Account with appropriate permissions
- Terraform >= 1.5.0
- Docker >= 24.0.0
- kubectl >= 1.27.0
- AWS CLI configured

---

## Terraform Infrastructure

### Directory Structure
```
infrastructure/
├── main.tf
├── variables.tf
├── outputs.tf
├── modules/
│   ├── ecs/
│   ├── rds/
│   ├── elasticache/
│   ├── qdrant/
│   └── ml-gpu/
└── terraform.tfvars
```

### Main Configuration

```hcl
# infrastructure/main.tf
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  backend "s3" {
    bucket = "grievancegrid-terraform-state"
    key    = "prod/terraform.tfstate"
  }
}

provider "aws" {
  region = var.aws_region
}

# ECS Cluster for application services
module "ecs_cluster" {
  source = "./modules/ecs"
  
  cluster_name = "grievancegrid-prod"
  vpc_id       = module.vpc.vpc_id
  subnets      = module.vpc.private_subnets
  
  desired_capacity = 3
  max_capacity     = 10
  min_capacity     = 2
  
  instance_type = "t3.large"
}

# PostgreSQL (Supabase)
module "rds" {
  source = "./modules/rds"
  
  identifier     = "grievancegrid-db"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.r6g.xlarge"
  
  allocated_storage = 500
  storage_encrypted = true
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.database_subnets
  
  backup_retention_period = 30
  multi_az                = true
}

# Qdrant Vector Database
module "qdrant" {
  source = "./modules/qdrant"
  
  vpc_id     = module.vpc.vpc_id
  subnets    = module.vpc.private_subnets
  
  replicas = 3
  volume_size = 100
  
  # GPU-optimized for ML inference
  resources = {
    cpu    = "2000"
    memory = "4096"
  }
}

# Redis Cluster
module "elasticache" {
  source = "./modules/elasticache"
  
  cluster_id      = "grievancegrid-redis"
  node_type       = "cache.r6g.xlarge"
  num_cache_nodes = 3
  
  engine         = "redis"
  engine_version = "7.0"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
}

# ML GPU Servers (VLLM, CV, GNN)
module "ml_gpu" {
  source = "./modules/ml-gpu"
  
  vpc_id  = module.vpc.vpc_id
  subnets = module.vpc.private_subnets
  
  # GPU instance for LLM inference
  llm_instance = {
    instance_type = "g5.xlarge"  # 1x NVIDIA A10G
    ami          = "nvidia-cuda-12-ubuntu"
    desired_size = 2
  }
  
  # GPU instance for Computer Vision
  cv_instance = {
    instance_type = "g5.xlarge"
    ami           = "nvidia-cuda-12-ubuntu"
    desired_size  = 2
  }
}
```

### Variables

```hcl
# infrastructure/terraform.tfvars
aws_region = "ap-south-1"  # Mumbai region for low latency

environment = "production"

# Domain
domain_name = "grievancegrid.gov.in"
cert_domain = "*.grievancegrid.gov.in"

# Database
db_name     = "grievancegrid"
db_username = "admin"
db_password = "changeme"  # Use SSM parameter in production

# Redis
redis_auth_token = "changeme"

# ML Models
llm_model_id   = "meta-llama/Llama-3.1-70B-Instruct"
cv_model_path  = "s3://grievancegrid-models/cv/damage-classifier.pth"
gnn_model_path = "s3://grievancegrid-models/gnn/department-gnn.pth"

# Scaling
autoscale_min = 3
autoscale_max = 20
```

### EKS Module (Alternative for Kubernetes)

```hcl
# infrastructure/modules/eks/eks.tf
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 19.0"
  
  cluster_name    = "grievancegrid-eks"
  cluster_version = "1.27"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  eks_managed_node_groups = {
    application = {
      min_size       = 3
      max_size       = 20
      desired_size   = 5
      instance_types = ["t3.xlarge"]
    }
    
    ml_gpu = {
      min_size       = 2
      max_size       = 8
      desired_size   = 2
      instance_types = ["g5.xlarge"]
      
      labels = {
        "nvidia.com/gpu" = "true"
      }
      
      taints = [{
        key    = "nvidia.com/gpu"
        value  = "present"
        effect = "NO_SCHEDULE"
      }]
    }
  }
}
```

---

## Docker Configuration

### Frontend (Next.js)

```dockerfile
# apps/web/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml (Frontend)
services:
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=${API_URL}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - AUTH_SECRET=${AUTH_SECRET}
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

### Backend (FastAPI)

```dockerfile
# apps/api/Dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### ML Services

```dockerfile
# ai-models/llm/Dockerfile
FROM nvidia/cuda:12.1.0-base-ubuntu22.04

WORKDIR /app

# Install vLLM
RUN pip install vllm==0.2.0

# Download model (or mount from volume)
# ENV MODEL_PATH=/models/llama-3.1-70B

COPY . .

EXPOSE 8001
CMD ["python", "-m", "vllm.entrypoints.api_server", \
     "--model", "meta-llama/Llama-3.1-70B-Instruct", \
     "--quantization", "q4_K_M", \
     "--tensor-parallel-size", "1"]
```

```yaml
# docker-compose.ml.yml
services:
  llm:
    build: ./ai-models/llm
    ports:
      - "8001:8001"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    environment:
      - CUDA_VISIBLE_DEVICES=0
      - MODEL_PATH=/models

  cv:
    build: ./ai-models/cv
    ports:
      - "8002:8002"
    volumes:
      - model-cache:/models
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

volumes:
  model-cache:
```

---

## Kubernetes Deployment

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: grievancegrid
spec:
  replicas: 5
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: grievancegrid/api:latest
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: grievancegrid-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: grievancegrid-config
              key: redis-url
        - name: LLM_API_URL
          value: "http://llm-service:8001"
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 5
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: grievancegrid
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 8000
  type: ClusterIP
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: grievancegrid
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## ML Pipeline Configuration

### Quantization for Sub-100ms Latency

```python
# VLLM quantization configuration
VLLM_CONFIG = {
    "model": "meta-llama/Llama-3.1-70B-Instruct",
    "quantization": "q4_k_m",       # 4-bit quantization
    "tensor_parallel_size": 1,        # Single GPU
    "max_num_seqs": 256,
    "gpu_memory_utilization": 0.9,
    "dtype": "half",                 # FP16
}
```

### Expected Latency Targets

| Component | Target Latency | Configuration |
|-----------|---------------|---------------|
| LLM Classification | <100ms | q4_K_M, FP16 |
| CV Damage Estimate | <200ms | ResNet50, FP16 |
| GNN Routing | <30ms | Batched |
| Vector Search | <50ms | Qdrant optimized |
| API Response | <300ms | Cached |

---

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - run: docker build -f apps/web/Dockerfile -t web:${{ github.sha }} ./apps/web
      - run: docker build -f apps/api/Dockerfile -t api:${{ github.sha }} ./apps/api
      - run: docker build -f ai-models/llm/Dockerfile -t llm:${{ github.sha }} ./ai-models/llm

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
      - run: |
          aws ecs update-service --cluster grievancegrid-prod --service api --force-new-deployment
          aws ecs update-service --cluster grievancegrid-prod --service web --force-new-deployment
```

---

## Health Checks & Monitoring

### Application Health Endpoint

```python
# apps/api/src/health.py
@app.get("/health")
async def health_check():
    checks = {
        "database": await check_database(),
        "redis": await check_redis(),
        "qdrant": await check_qdrant(),
        "llm": await check_llm_service()
    }
    
    all_healthy = all(checks.values())
    status_code = 200 if all_healthy else 503
    
    return JSONResponse(
        {"status": "healthy" if all_healthy else "degraded", "checks": checks},
        status_code=status_code
    )
```

### CloudWatch Metrics

```python
# Add to FastAPI middleware
@app.middleware("http")
async def metrics_middleware(request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    # Send to CloudWatch
    cloudwatch.put_metric_data(
        Namespace="GrievanceGrid",
        MetricData=[{
            "MetricName": "RequestDuration",
            "Value": duration,
            "Unit": "Milliseconds",
            "Dimensions": [
                {"Name": "Endpoint", "Value": request.url.path},
                {"Name": "Status", "Value": str(response.status_code)}
            ]
        }]
    )
    
    return response
```

---

## Rollback Procedure

```bash
# Rollback to previous version
aws ecs update-service \
  --cluster grievancegrid-prod \
  --service api \
  --task-definition <previous-task-def> \
  --force-new-deployment

# Or use Blue/Green deployment via CodeDeploy
aws deploy create-deployment \
  --application-name grievancegrid \
  --deployment-group production \
  --revision '{"revisionType": "TaskDefinition", "taskDefinition": "..."}'
```