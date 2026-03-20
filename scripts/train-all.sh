#!/bin/bash
# GrievanceGrid - Real ML Training Automator

set -e

echo "🏗️ Starting Real ML Model Training..."

# 1. Train CV Model
echo "📸 Training CV Severity Classifier (ResNet50)..."
docker compose run --rm ml-cv python src/training/trainer.py

# 2. Train GNN Model
echo "🕸️ Training GNN Routing Model (GAT)..."
docker compose run --rm ml-gnn python src/trainer.py

# 3. Train RL Agent (Optional)
echo "🎯 Training RL Routing Agent..."
docker compose run --rm ml-llm python src/rl_agent/train_offline.py

echo "✨ All models trained and saved to their respective /models directories!"
echo "👉 Now set WORKER_DRY_RUN=False in apps/worker/.env to activate live inference."
