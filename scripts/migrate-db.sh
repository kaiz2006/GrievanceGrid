#!/bin/bash
# GrievanceGrid - Database Migration Script

set -e

echo "🔄 Running GrievanceGrid Database Migrations..."

# Navigate to the database package or api where drizzle is configured
cd packages/database

# Check if drizzle-kit is installed and run push/migrate
if [ -f "package.json" ]; then
  npm run db:push
else
  echo "⚠️ packages/database/package.json not found. Attempting root migrate..."
  cd ../..
  npm run db:push
fi

echo "✅ Migrations complete!"
