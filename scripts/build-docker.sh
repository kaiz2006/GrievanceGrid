#!/bin/bash
# GrievanceGrid - Docker Build Orchestration Script

set -e

echo "🚀 Starting GrievanceGrid Docker Build..."

# Build ML Services first
echo "📦 Building ML Services..."
docker build -t grievance-ml-llm ./ai-models/llm
docker build -t grievance-ml-cv ./ai-models/cv
docker build -t grievance-ml-gnn ./ai-models/gnn

# Build Backend App Tier
echo "📦 Building API and Worker..."
docker build -t grievance-api ./apps/api
docker build -t grievance-worker ./apps/worker

echo "✅ All images built successfully!"
echo "Run 'docker compose up' to start the stack."
