# 📋 GrievanceGrid — Comprehensive To-Do

> **Project:** GrievanceGrid — Smart Public Service Grievance Management Platform  
> **Stack:** Next.js + Tailwind CSS | FastAPI (Python) | PostgreSQL | Firebase Auth  
> **Status:** Pre-Development

---

## Phase 1 — Foundation & Auth (Weeks 1–2)

### 🏗️ 1.1 Project Setup & Configuration

- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS with the design system color palette
  - [ ] Primary: Deep Sapphire Blue (`#1E40AF`)
  - [ ] Semantic: Ruby Red (`#EF4444`), Amber (`#F59E0B`), Emerald (`#10B981`), Cyan (`#06B6D4`)
  - [ ] Backgrounds: Off-White (`#F8FAFC`), White (`#FFFFFF`), Dark Slate (`#0F172A`)
- [ ] Set up typography — Inter / Plus Jakarta Sans (Google Fonts)
- [ ] Scaffold FastAPI backend project with Uvicorn
- [ ] Define Pydantic models for all core entities
- [ ] Set up PostgreSQL database (Supabase or Neon)
- [ ] Design & run database migrations for core schema:
  - [ ] `users` table (citizens, officers, admins — with roles)
  - [ ] `complaints` table
  - [ ] `departments` table
  - [ ] `assignments` table
  - [ ] `status_history` table
  - [ ] `sla_rules` table
  - [ ] `feedback` table
  - [ ] `grid_lanes` table
- [ ] Set up Git repository, branching strategy, and `.gitignore`
- [ ] Configure ESLint, Prettier (frontend) and Black, Ruff (backend)
- [ ] Set up environment variable management (`.env.local`, `.env`)

### 🔐 1.2 Authentication System

- [ ] Integrate Firebase Authentication
  - [ ] Phone OTP login flow
  - [ ] Google Sign-In flow
  - [ ] JWT token generation & validation
- [ ] Implement Role-Based Access Control (RBAC)
  - [ ] Citizen role
  - [ ] Department Officer role
  - [ ] Admin / Supervisor role
- [ ] Build login / signup UI pages
  - [ ] Mobile-responsive auth screens
  - [ ] OTP input component
- [ ] Protect API routes with Firebase token verification middleware (FastAPI)
- [ ] Protect frontend routes with auth guards (Next.js middleware)

### 📝 1.3 Citizen Complaint Submission Module

- [ ] **API Endpoints (FastAPI):**
  - [ ] `POST /complaints` — Create a new complaint
  - [ ] `GET /complaints/{id}` — Fetch complaint by Grid ID
  - [ ] `GET /complaints/me` — Fetch citizen's own complaints
- [ ] **Complaint creation form (Frontend):**
  - [ ] Category selection dropdown (Infrastructure, Sanitation, Water, Electrical, etc.)
  - [ ] Description text area
  - [ ] Location input — auto-detect via Geolocation API + manual pin on Leaflet map
  - [ ] Media upload (photos/evidence) — store in Firebase Storage / encrypted cloud bucket
  - [ ] Generate unique **Grid ID** on submission
- [ ] **Acceptance criteria validation:**
  - [ ] Complaint created in ≤ 3 seconds
  - [ ] Media upload success rate ≥ 95%

---

## Phase 2 — Routing, Officer Dashboard & Tracking (Weeks 3–4)

### 🤖 2.1 Intelligent Routing Engine

- [ ] Build keyword-based auto-categorization logic (MVP)
  - [ ] Map categories to departments (e.g., "Street Light" → Electricity Dept)
  - [ ] Auto-assign priority tags (Low / Medium / High / Critical)
  - [ ] Set SLA timers per category
  - [ ] Assign `grid_lane` identifier
- [ ] Implement workload-aware officer assignment algorithm
  - [ ] Query active workload per officer
  - [ ] Factor in proximity (geo-based) if available
- [ ] Build manual override capability for admins
- [ ] **API Endpoints:**
  - [ ] `POST /routing/assign` — Trigger auto-assignment
  - [ ] `PUT /routing/reassign/{id}` — Manual reassignment
- [ ] **Target:** Complaint auto-assignment in < 30 seconds

### 👮 2.2 Officer Dashboard

- [ ] **API Endpoints:**
  - [ ] `GET /officer/complaints` — Fetch assigned complaints
  - [ ] `PUT /officer/complaints/{id}/status` — Update status
  - [ ] `POST /officer/complaints/{id}/notes` — Add internal notes
  - [ ] `POST /officer/complaints/{id}/proof` — Upload resolution proof
- [ ] **Dashboard UI (Frontend):**
  - [ ] Task queue view — list of assigned complaints
  - [ ] SLA countdown timer per complaint (visual urgency indicator)
  - [ ] Status transition controls: `Assigned` → `In Progress` → `Resolved` / `Rejected`
  - [ ] Internal notes section
  - [ ] Resolution proof upload (camera integration for mobile field agents)
- [ ] **Acceptance criteria:**
  - [ ] Dashboard load < 2 seconds
  - [ ] Status updates reflect instantly (real-time or polling)

### 📊 2.3 Real-Time Status Tracking (Citizen Side)

- [ ] Build complaint detail view for citizens
  - [ ] Vertical stepper / timeline component showing lifecycle:
    - `Ticket Created` → `Assigned to Dept` → `Field Agent Dispatched` → `Resolved` → `Citizen Feedback Pending`
  - [ ] Left panel: Citizen details, photos/evidence, location map, timestamp
  - [ ] Right panel: Workflow timeline stepper
- [ ] Real-time status update via polling / WebSocket
- [ ] Citizen feedback & rating submission after resolution

---

## Phase 3 — SLA, Notifications & Command Center (Weeks 5–6)

### ⏱️ 3.1 SLA Monitoring & Escalation Engine

- [ ] **Backend logic:**
  - [ ] Configurable SLA rules per complaint category
  - [ ] Background job / cron to check overdue complaints
  - [ ] Auto-escalation rules:
    - Overdue by 24hrs → escalate to Senior Officer, set `grid_flag = ESCALATED`
    - Overdue by 48hrs → escalate to Department Head
  - [ ] Escalation notification triggers
- [ ] **API Endpoints:**
  - [ ] `GET /sla/overdue` — List all overdue complaints
  - [ ] `PUT /sla/rules` — Admin: configure SLA per category
- [ ] **Frontend:**
  - [ ] SLA compliance charts (Recharts)
  - [ ] Escalation alert badges

### 🔔 3.2 Notification System

- [ ] **Push Notifications:** Firebase Cloud Messaging (FCM) integration
- [ ] **Email Notifications:** SendGrid integration
- [ ] **SMS Notifications:** Twilio / MSG91 integration
- [ ] **Trigger event handlers for:**
  - [ ] Complaint submitted (→ citizen confirmation)
  - [ ] Complaint assigned (→ officer notification)
  - [ ] Status changed (→ citizen update)
  - [ ] SLA breach / escalation (→ officer + admin alert)
  - [ ] Complaint resolved (→ citizen feedback request)
- [ ] Notification preferences UI (citizen settings)

### 🖥️ 3.3 Admin Command Center (Main Dashboard)

- [ ] **Layout:** Fixed Sidebar + Dynamic Canvas (as per design doc)
  - [ ] Left Sidebar (collapsed/expanded): Dashboard, Ticket Queue, Workflows, Agent Tracking, Map View, Analytics, Settings
  - [ ] Top App Bar: Global Omni-Search, Notification Bell, "+ Create Manual Ticket" button
- [ ] **Top Row — KPI Summary Cards:**
  - [ ] Total Complaints (Today/Week) with mini sparkline
  - [ ] Resolution Rate (%)
  - [ ] Average Resolution Time vs SLA target
  - [ ] Active Field Agents (Online/Total)
- [ ] **Middle Row Left — Analytics Charts (Recharts):**
  - [ ] Donut Chart: Complaints by Category
  - [ ] Bar Chart: Complaint influx over last 7 days
- [ ] **Middle Row Right — Live Map (Leaflet.js + OpenStreetMap):**
  - [ ] Heatmap / pin-based map of real-time complaint origins
  - [ ] Red clusters for localized crises
- [ ] **Bottom Row — Real-time Action Queue (Data Table):**
  - [ ] Auto-updating live data table of latest grievances
  - [ ] Columns: Grid ID, Citizen Name, Category, Status (color-coded badge), Assigned To, Time Elapsed
  - [ ] Hover states: "Quick Assign" / "View Details" overlay
  - [ ] Sticky headers, inline status editing, filter chips
- [ ] **Dashboard refresh ≤ 10 seconds, heatmap accuracy ≥ 95%**

---

## Phase 4 — UI Components, Interactions & Polish (Week 6–7)

### 🧩 4.1 Key UI Components

- [ ] **"Smart Assign" Modal:**
  - [ ] Glassmorphic modal on unassigned ticket click
  - [ ] AI suggestion: highlight recommended agent/department
  - [ ] Drag-and-drop assignment from "Unassigned" column to agent card
- [ ] **Complaint Detail View (Split-Screen "Invoice" View):**
  - [ ] Left Panel: citizen details, photos, location map, timestamp
  - [ ] Right Panel: vertical stepper workflow timeline
- [ ] **Data Tables Component:**
  - [ ] Sticky headers for large datasets
  - [ ] Inline editing (status dropdown directly in table)
  - [ ] Robust filter chips (category, status, sector, SLA)
  - [ ] Sorting by all columns
- [ ] **Global Omni-Search:**
  - [ ] Search by Complaint ID, Citizen Name, Phone Number
  - [ ] Instant results with debounced input

### ✨ 4.2 Micro-Interactions & Animations

- [ ] Live red pulses next to critical/overdue tickets
- [ ] KPI number count-up animation on dashboard load
- [ ] Skeleton loaders (layout-mimicking) for all data-fetching states
- [ ] Smooth page transitions and hover effects
- [ ] Glassmorphism effects on modals and cards

### 🎨 4.3 Dark Mode

- [ ] Implement dark mode toggle
  - [ ] Dark background: Deep Slate (`#0F172A`), cards: (`#1E293B`)
  - [ ] Ensure all semantic colors contrast well in dark mode
- [ ] Persist theme preference (localStorage)

---

## Phase 5 — Accessibility, Responsiveness & Security (Week 7)

### ♿ 5.1 Accessibility (WCAG AA)

- [ ] Audit all text-to-background contrast ratios
- [ ] Fix status badge contrast (e.g., amber on white → use darker amber borders)
- [ ] Add ARIA labels to all interactive elements
- [ ] Keyboard navigation support for dashboard, tables, and modals
- [ ] Screen reader compatibility testing

### 📱 5.2 Responsive Design

- [ ] **Desktop (1080p / 4K):** Full multi-column command center view
- [ ] **Tablet (iPad):** Sidebar collapses to icons; map stacks above data table
- [ ] **Mobile (Field Agents):**
  - [ ] Task-list format optimized for one-handed thumb use
  - [ ] Camera integration for uploading resolution proof
  - [ ] Simplified navigation

### 🔒 5.3 Security Hardening

- [ ] Firebase Auth token validation on all API endpoints
- [ ] RBAC enforcement at API layer (middleware)
- [ ] Encrypted media storage
- [ ] Full audit trail logging (who changed what, when)
- [ ] Rate limiting for spam prevention (complaint submission)
- [ ] Input sanitization and SQL injection prevention
- [ ] CORS configuration
- [ ] Privacy-ready architecture (data retention policies: complaints 5 years, logs 2 years)

---

## Phase 6 — Testing & Deployment (Week 7)

### 🧪 6.1 Testing

- [ ] **Frontend:**
  - [ ] Unit tests for key components (Jest / React Testing Library)
  - [ ] Integration tests for auth flow, complaint submission
  - [ ] E2E tests for critical user journeys (Playwright / Cypress)
- [ ] **Backend:**
  - [ ] Unit tests for routing engine, SLA engine, RBAC
  - [ ] API endpoint integration tests (pytest)
  - [ ] Load testing — validate 10k concurrent users support
- [ ] **Cross-browser testing** (Chrome, Firefox, Safari, Edge)
- [ ] **Mobile device testing** (iOS Safari, Android Chrome)

### 🚀 6.2 Deployment

- [ ] **Frontend:** Deploy to Vercel
  - [ ] Configure custom domain
  - [ ] Set environment variables
  - [ ] Enable preview deployments for PR branches
- [ ] **Backend:** Deploy to Render / Railway
  - [ ] Configure auto-deploy from main branch
  - [ ] Set up health check endpoint
  - [ ] Configure environment variables & secrets
- [ ] **Database:** Provision Supabase / Neon PostgreSQL
  - [ ] Run production migrations
  - [ ] Set up backups & monitoring
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Configure monitoring & error tracking (Sentry / LogRocket)
- [ ] Demo polish — seed realistic test data

---

## Phase 7 — Future Enhancements (Post-MVP)

### 🔮 7.1 Phase 2 Features (Backlog)

- [ ] Advanced image damage detection (AI-based)
- [ ] Voice complaint intake
- [ ] WhatsApp bot integration
- [ ] Predictive analytics dashboard
- [ ] Multi-city federation support
- [ ] AI upgrade: `sentence-transformers` / BERT-based classification
- [ ] PostGIS integration for advanced geo-queries
- [ ] Multi-language support (English + Hindi, then more)

---

## 🚨 Risk Mitigation Checklist

- [ ] Wrong auto-routing → Implement manual override for all assignments
- [ ] Officer overload → Implement workload balancing algorithm
- [ ] Spam complaints → OTP verification + rate limiting
- [ ] Data privacy concerns → Encryption + RBAC + audit trail
- [ ] Slow adoption → Focus on simple, intuitive UX

---

> **Last Updated:** 2026-02-27  
> **Derived from:** `design.md`, `prd.md`, `tech_stack.md`
