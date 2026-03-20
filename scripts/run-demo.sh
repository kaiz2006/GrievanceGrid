#!/bin/bash
# GrievanceGrid - Hackathon Demo Launcher

set -e

echo "🚀 Launching GrievanceGrid Full-Stack Demo..."

# 1. Start Infrastructure (Background)
echo "🐳 Starting databases and infrastructure..."
docker compose up -d postgres redis qdrant

# 2. Wait for DB to be ready
echo "⏳ Waiting for PostgreSQL..."
until docker exec grievance-postgres pg_isready -U grievances; do
  sleep 2
done

# 3. Apply Migrations
echo "🔄 Applying database migrations..."
./scripts/migrate-db.sh

# 4. Start all services (Worker, API, ML)
echo "🌟 Starting all applications and AI services..."
docker compose up -d

echo "✨ All services are running!"
echo "📡 API: http://localhost:8000"
echo "🖥️ Flower (Worker Monitor): http://localhost:5555"
echo "💬 Qdrant Console: http://localhost:6333/dashboard"

echo ""
echo "👉 Now run 'npm run dev' to start the React frontend."
