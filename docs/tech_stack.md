🎨 Frontend

Primary Choice:

React (with Next.js)

Tailwind CSS

Recharts (analytics)

Leaflet.js (maps)

🔐 Authentication

Use: Firebase Authentication

JWT tokens

⚙️ Backend
FastAPI (Python)

Stack:

Python FastAPI

Uvicorn

Pydantic models

🗄️ Database
PostgreSQL

👉 Final pick: PostgreSQL

🗺️ Maps & Geo

Use:

Leaflet.js (frontend)

OpenStreetMap (free)

PostGIS (optional advanced)

🤖 AI / Smart Routing Layer (Phase 2 Ready)

Python

scikit-learn

keyword rules (MVP)

Later upgrade to:

sentence-transformers

BERT-based classification

📡 Notifications
MVP

Firebase Cloud Messaging (push)

Email via SendGrid

SMS via Twilio / MSG91 (India)

☁️ Deployment
Frontend

Vercel (best for Next.js)

Backend

Render
or

Railway

Database

Supabase Postgres
or

Neon Postgres

🏗️ Final Architecture
Citizen App (Next.js)
↓
Firebase Auth
↓
FastAPI Backend
↓
PostgreSQL
↓
Notification Services
↓
Admin Command Center
