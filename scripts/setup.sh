#!/bin/bash
# GrievanceGrid - Local Development Setup Script

set -e

echo "🛠️ Starting GrievanceGrid Setup..."

# 1. Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# 2. Setup environment files if they don't exist
echo "🔑 Setting up environment files..."
if [ ! -f .env ]; then
  cp apps/api/.env.example .env 2>/dev/null || echo "INTERNAL_WORKER_TOKEN=dev-secret-token" > .env
  echo "Created root .env"
fi

# 3. Build packages
echo "🏗️ Building shared packages..."
npx turbo run build --filter="./packages/*"

echo "✅ Setup complete! You can now run 'npm run dev' or 'docker compose up'."
