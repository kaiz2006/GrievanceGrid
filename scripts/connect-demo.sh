#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[demo] Starting infrastructure services"
npm run docker:infra

echo "[demo] Applying database schema"
npm run db:push

echo "[demo] Seeding database with demo users and data"
npm run db:seed

echo "[demo] Demo credentials"
echo "  citizen1@example.com / citizen1"
echo "  officer1@example.com / officer1"
echo "  crew1@example.com / crew1"
echo "  auditor1@example.com / auditor1"
echo "  admin1@example.com / admin1"

echo "[demo] Done. Start app with: npm run dev:lite"
