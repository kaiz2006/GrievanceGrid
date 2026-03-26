Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = Split-Path -Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "[demo] Starting infrastructure services"
npm run docker:infra

Write-Host "[demo] Applying database schema"
npm run db:push

Write-Host "[demo] Seeding database with demo users and data"
npm run db:seed

Write-Host "[demo] Demo credentials"
Write-Host "  citizen1@example.com / citizen1"
Write-Host "  officer1@example.com / officer1"
Write-Host "  crew1@example.com / crew1"
Write-Host "  auditor1@example.com / auditor1"
Write-Host "  admin1@example.com / admin1"

Write-Host "[demo] Done. Start app with: npm run dev:lite"
