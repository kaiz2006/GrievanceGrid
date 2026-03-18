# Frontend Todo (apps/web — Next.js 15)

## 🗂️ Project Setup
- [ ] Initialize `apps/web` with Next.js 15 and App Router
- [ ] Configure `tailwind.config.ts` with brand color tokens and animation utilities from COMPONENT_SPEC
- [ ] Set up `tsconfig.json` with path aliases (`@/components/*`, `@/app/*`, `@/lib/*`)
- [ ] Configure `next.config.js` (image domains, env variables, etc.)
- [ ] Create `.env.local` with `NEXT_PUBLIC_API_URL` and map tile URL
- [ ] Add ESLint + Prettier config

---

## 📦 Shared UI Package (`packages/ui`)
- [ ] Set up `packages/ui` with exported component library
- [ ] Create `Button` component with variants
- [ ] Create `Input` component
- [ ] Create `Modal` component
- [ ] Create `Card` component
- [ ] Create `Badge` component for status labels (CREATED, IN_PROGRESS, ESCALATED, etc.)
- [ ] Create `Toast` notification system (`success`, `error`, `warning`, `info`)
- [ ] Create `Skeleton` loader components (e.g., `TimelineSkeleton`)
- [ ] Create `ErrorState` component with optional retry callback
- [ ] Set up Storybook for component documentation

---

## 🔐 Authentication Pages
- [ ] Build `/login` page with Google OAuth 2.0 button
- [ ] Build `/login` page with Email/Password (Basic Auth) form
- [ ] Implement JWT token storage and refresh logic in `lib/auth.ts`
- [ ] Create protected route wrapper for authenticated pages
- [ ] Build `/register` page for Basic Auth users

---

## 🏠 Pages & Routing (`apps/web/src/app/`)
- [ ] `page.tsx` — Landing page with project overview and CTA buttons
- [ ] `dashboard/page.tsx` — Citizen dashboard showing their submitted grievances
- [ ] `submit/page.tsx` — Multimodal grievance submission form
- [ ] `track/[grid_id]/page.tsx` — Package-style tracking page
- [ ] `admin/dashboard/page.tsx` — Admin command center dashboard
- [ ] `grievance/[id]/page.tsx` — Full grievance detail view (for officers)
- [ ] `layout.tsx` — Root layout with nav, theme, and toast provider

---

## 📝 Grievance Submission Form (`/submit`)
- [ ] **Location Picker**: "Current Location", "Choose on Map", and "Enter Address" tabs
- [ ] **Interactive Map Picker**: Leaflet map with draggable pin for location selection
- [ ] **Description Textarea**: Character counter, auto-resize
- [ ] **Category Selector**: Dropdown for ROADS, WATER_SUPPLY, SANITATION, ELECTRICITY, etc.
- [ ] **Photo Upload**: Multi-image uploader with preview grid (before photo)
- [ ] **Voice Recorder** (`VoiceRecorderProps`):
  - Hold-to-record button with pulsing animation and duration timer
  - Language selector (Hindi, Tamil, Telugu, Bengali, and 6 more)
  - Playback controls after recording
- [ ] Form validation with Zod and `react-hook-form`
- [ ] On success: show Grid ID and redirect to tracking page

---

## 📦 Tracking Timeline (`/track/[grid_id]`)
- [ ] **Grid ID Header Card**: show Grid ID, status badge, location, submitted date
- [ ] **Timeline Component** (`TimelineNode`):
  - Completed node: green checkmark, solid connecting line
  - Current node: pulsing blue dot animation (2s infinite)
  - Pending node: gray outline, dashed connecting line
  - Slide-in + fade animation on status change
- [ ] **SLA Countdown** (`SLACountdownProps`):
  - Progress bar: Green (>50%), Yellow (25–50%), Red (<25% remaining)
  - Live countdown timer updating every second
- [ ] **Team Card** (`TeamCardProps`):
  - Team name, contact phone, ETA in minutes
  - "View on Map" link with live team location marker
- [ ] **Action Buttons**: Share, Message, Feedback, Escalate
- [ ] WebSocket / polling hook for live status updates

---

## 🗺️ Map Components (`components/map/`)
- [ ] Set up `react-leaflet` with dynamic import (SSR disabled)
- [ ] `GrievanceMapPicker` — For submission form location selection
- [ ] `TrackingMap` — Shows team's live location with bounce animation on update
- [ ] `HeatMap` (`HeatMapProps`):
  - Cluster color scale: Green (0–0.3), Yellow (0.3–0.6), Orange (0.6–0.8), Red (0.8–1.0)
  - Click-to-expand cluster interaction
  - Hover tooltip with cluster details
  - Toggle filters by category/priority

---

## 🛡️ Admin Dashboard (`/admin/dashboard`)
- [ ] **MetricCards** row: New, In Progress, Resolved, Escalated counts
- [ ] **Live HeatMap** (full-width, left panel)
- [ ] **ActionQueue** (right panel):
  - ESCALATED, SLA_AT_RISK, CONTESTED ticket lists
  - "Process All" button
- [ ] **Category Breakdown**: Horizontal bar chart
- [ ] **Predictive Alerts** panel: infrastructure failure warnings from ML
- [ ] WebSocket connection for live data refresh (10-second interval)
- [ ] Optimistic UI updates on action processing

---

## 📱 Officer Mobile View (`components/grievance/`)
- [ ] Mobile-first layout for field officer interface
- [ ] **Photo Carousel**: Before/After image comparison
- [ ] **Grievance Detail**: Category, Priority, Description, location coords
- [ ] **Verification Camera** (`VerificationCameraProps`):
  - Request GPS permission on mount
  - GPS distance validation (must be within 50m of incident)
  - Warning modal if location is too far
- [ ] **Action Buttons**: Start Work, Escalate, Resolve

---

## 🧠 State Management (`store/`)
- [ ] `useUserStore` (Zustand) — user session, role, theme
- [ ] `useNotificationStore` (Zustand) — toast queue
- [ ] `useGrievanceStore` (TanStack Query) — fetching, caching, optimistic updates

---

## 🔌 API Services (`services/`)
- [ ] `grievanceService.ts` — `submitGrievance`, `getGrievance`, `updateStatus`, `addFeedback`, `contest`
- [ ] `trackingService.ts` — `getTrackingInfo` (REST + WebSocket)
- [ ] `voiceService.ts` — `processVoice` (multipart/form-data)
- [ ] `adminService.ts` — `getDashboard`, `getClusters`, `getAnalytics`
- [ ] GraphQL client setup with Apollo Client and generated types from `packages/graphql`

---

## ♿ Accessibility & Polish
- [ ] WCAG 2.1 AA compliance check for all pages
- [ ] Keyboard navigation for all interactive elements
- [ ] Screen reader compatible timeline with ARIA labels
- [ ] Color contrast ratios > 4.5:1 verified
- [ ] Focus indicators on all interactive elements
- [ ] Responsive layouts: Mobile (<640px), Tablet (640–1024px), Desktop (>1024px)
