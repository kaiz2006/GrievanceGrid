# GrievanceGrid Component Specification

## Overview

Detailed UI/UX specifications for the citizen-facing and admin-facing components.

---

## 1. Citizen Timeline Component

### Purpose
Package-style real-time tracking showing grievance journey from submission to resolution.

### Page Location
`/track/[grid_id]`

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  GRIEVANCE TRACKING                                              │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  🆔 Grid ID: GRI-2026-000001    Status: IN_PROGRESS     │  │
│  │  📍 Location: Main Road, Connaught Place                │  │
│  │  📅 Submitted: Mar 17, 2026 09:00 AM                    │  │
│  └──────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  TIMELINE                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ○ ●━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━●                         │
│  │  │              │              │                             │
│  │  ▼              ▼              ▼                             │
│  │ CREATED    ROUTED       IN_PROGRESS                         │
│  │ 09:00 AM   09:00 AM      12:00 PM                           │
│  │           (30s)          (3h 30m)                          │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  SLA COUNTDOWN                                                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐   │
│  │  ⏱️ Resolution Deadline: 48h 23m remaining             │   │
│  │  ████████████████░░░░░░░░░ 62% used                     │   │
│  └────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  TEAM INFO (if assigned)                                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐   │
│  │  👷 Team: PWD-Alpha-3   📞 +91-98765-43210             │   │
│  │  📍 ETA: 15 minutes - View on Map                      │   │
│  └────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  ACTIONS                                                         │
├─────────────────────────────────────────────────────────────────┤
│  [ 📤 Share ] [ 💬 Message ] [ ⭐ Feedback ] [ 🚨 Escalate ]    │
└─────────────────────────────────────────────────────────────────┘
```

### Component Specifications

#### TimelineNode Component
```typescript
interface TimelineNodeProps {
  status: GrievanceStatus;
  timestamp: Date;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  eta?: Date;
}

// States:
// - completed: Green checkmark, solid line
// - current: Pulsing blue dot, animated
// - pending: Gray outline, dashed line
```

#### SLACountdown Component
```typescript
interface SLACountdownProps {
  deadline: Date;
  startTime: Date;
  type: 'response' | 'resolution';
}

// Progress bar colors:
// - Green (>50% time remaining)
// - Yellow (25-50% time remaining)
// - Red (<25% time remaining)
```

#### TeamCard Component
```typescript
interface TeamCardProps {
  teamName: string;
  contactPhone: string;
  currentLocation: { lat: number; lng: number };
  etaMinutes: number;
}
```

### Visual Requirements

#### Color Palette
```css
:root {
  --timeline-completed: #10B981;    /* Emerald */
  --timeline-current: #3B82F6;      /* Blue */
  --timeline-pending: #9CA3AF;      /* Gray */
  --sla-safe: #10B981;
  --sla-warning: #F59E0B;
  --sla-danger: #EF4444;
}
```

#### Animations
- Current node: Pulse animation (2s infinite)
- Status change: Slide-in with fade
- Progress bar: Smooth width transition
- Map marker: Bounce on update

---

## 2. Admin Command Center

### Purpose
Mission-control dashboard for administrators with live KPIs, heatmaps, and action queues.

### Page Location
`/admin/dashboard`

### Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  COMMAND CENTER                              🔔 3 Alerts  👤 Admin     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐        │
│  │ 📥 New: 45       │ │ 🔄 In Progress   │ │ ✅ Resolved       │        │
│  │                 │ │    128            │ │    980 (87%)      │        │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘        │
│                                                                          │
│  ┌──────────────────────────────────────────────┐ ┌────────────────┐    │
│  │                                              │ │ ACTION QUEUE   │    │
│  │            LIVE HEATMAP                      │ │                │    │
│  │                                              │ │ 🔴 Escalated   │    │
│  │   [Map with clustered grievance markers]     │ │   12 tickets   │    │
│  │                                              │ │                │    │
│  │   🔴 = Critical clusters                     │ │ 🟡 SLA at risk │    │
│  │   🟡 = High priority                         │ │   28 tickets   │    │
│  │   🟢 = Normal                                │ │                │    │
│  │                                              │ │ ⚠️ Contested   │    │
│  └──────────────────────────────────────────────┘ │    5 tickets   │    │
│                                                    │                │    │
│  ┌──────────────────────────────────────────────┐ │ [Process All]   │    │
│  │  CATEGORY BREAKDOWN                         │ └────────────────┘    │
│  │  Roads ████████████████ 450                                │    │
│  │  Water ██████████ 320                                     │    │
│  │  Sanitation ██████ 200                                    │    │
│  └──────────────────────────────────────────────┘                       │
│                                                                          │
│  ┌──────────────────────────────────────────────┐                        │
│  │  PREDICTIVE ALERTS (ML)                      │                        │
│  │  ⚠️ Transformer T-1234: 78% failure risk   │                        │
│  │  ⚠️ Water main near Sector 15: Likely leak  │                        │
│  │  📊 Cluster detected: 23 complaints in 2km  │                        │
│  └──────────────────────────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Specifications

#### MetricCard Component
```typescript
interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number; // percentage change
  icon: 'inbox' | 'progress' | 'resolved' | 'escalated';
  onClick?: () => void;
}
```

#### HeatMap Component
```typescript
interface HeatMapProps {
  center: [number, number];
  zoom: number;
  data: HeatPoint[];
  onClusterClick: (clusterId: string) => void;
  showLegend: boolean;
}

// Heat point colors based on crisis_score:
// 0.0-0.3: Green (normal)
// 0.3-0.6: Yellow (elevated)
// 0.6-0.8: Orange (high)
// 0.8-1.0: Red (critical)
```

#### ActionQueue Component
```typescript
interface ActionQueueProps {
  items: ActionItem[];
  onProcess: (itemIds: string[]) => void;
}

interface ActionItem {
  id: string;
  type: 'ESCALATED' | 'SLA_AT_RISK' | 'CONTESTED';
  grievanceId: string;
  description: string;
  urgency: 'high' | 'medium' | 'low';
}
```

#### PredictiveAlert Component
```typescript
interface PredictiveAlertProps {
  alerts: Alert[];
  onDismiss: (alertId: string) => void;
  onInvestigate: (alertId: string) => void;
}
```

### Visual Requirements

#### Grid Layout
- Cards: CSS Grid with auto-fit columns
- Gap: 24px between cards
- Padding: 32px container padding

#### Map Interactions
- Cluster zoom: Click to expand
- Tooltip: Hover for details
- Filter: Toggle by category/priority

#### Real-Time Updates
- WebSocket connection for live data
- Refresh interval: 10 seconds
- Optimistic UI updates

---

## 3. Grievance Submission Form

### Page Location
`/submit`

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  SUBMIT GRIEVANCE                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📍 Location                                               │  │
│  │ [Current Location] [Choose on Map] [Enter Address]      │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │            [Interactive Map Picker]                │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📝 Description                                           │  │
│  │ [Text area with character count]                         │  │
│  │ ┌────────────────────────────────────────────────────┐   │  │
│  │ │ Describe your issue here...                        │   │  │
│  │ │                                                    │   │  │
│  │ └────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 📷 Photo (Optional but recommended)                      │  │
│  │ ┌──────┐ ┌──────┐ ┌──────┐                              │  │
│  │ │ +    │ │      │ │      │                              │  │
│  │ │ Add  │ │      │ │      │                              │  │
│  │ └──────┘ └──────┘ └──────┘                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🎤 Voice Note (Optional)                                 │  │
│  │    [ 🎤 Hold to Record ]                                │  │
│  │    Supported: Hindi, Tamil, Telugu, Bengali...          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Submit Grievance]                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Voice Recording Component
```typescript
interface VoiceRecorderProps {
  onComplete: (audioBlob: Blob) => void;
  supportedLanguages: string[];
  onLanguageChange: (lang: string) => void;
}

// States:
// - idle: "Hold to Record"
// - recording: Pulsing, duration timer
// - processing: "Processing..."
// - completed: Playback controls
```

---

## 4. Officer Mobile View

### Purpose
Field officer interface for verification and status updates.

### Layout (Mobile)

```
┌─────────────────────────────┐
│  NEW GRIEVANCE    ⏰ 2h left │
├─────────────────────────────┤
│                             │
│  [Photo Carousel]           │
│  Before │ After             │
│                             │
│  📍 123 Main Road           │
│  📏 28.6139, 77.2090        │
│                             │
│  Category: ROADS            │
│  Priority: HIGH             │
│  Title: Pothole             │
│                             │
│  Description:               │
│  Large pothole near         │
│  traffic signal...          │
│                             │
├─────────────────────────────┤
│  VERIFICATION               │
│  ┌─────────────────────┐    │
│  │   📷 Take Photo    │    │
│  │   with location    │    │
│  └─────────────────────┘    │
│                             │
│  [Start Work] [Escalate]    │
│  [Resolve]                  │
└─────────────────────────────┘
```

### Verification Camera Component
```typescript
interface VerificationCameraProps {
  onCapture: (photo: Blob, location: GeoLocation) => void;
  incidentLocation: GeoLocation;
  maxDistanceMeters: number;
}

// Geo-validation:
// - Request GPS permission
// - Verify within 50m of incident
// - Show warning if too far
```

---

## 5. Common Components

### Loading States
```typescript
// Skeleton loader for timeline
const TimelineSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
  </div>
);
```

### Error States
```typescript
// Error boundary component
interface ErrorStateProps {
  title: string;
  message: string;
  retry?: () => void;
}
```

### Toast Notifications
```typescript
// Notification types
type ToastType = 'success' | 'error' | 'warning' | 'info';
interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
```

---

## Design Tokens

```css
/* Tailwind config */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        status: {
          created: '#6B7280',
          in_progress: '#3B82F6',
          resolved: '#10B981',
          escalated: '#EF4444',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  }
}
```

---

## Responsive Breakpoints

| Breakpoint | Width | Components |
|------------|-------|-------------|
| Mobile | < 640px | Single column, stacked cards |
| Tablet | 640-1024px | Two column grid |
| Desktop | > 1024px | Full layout with sidebar |

---

## Accessibility Requirements

- WCAG 2.1 AA compliance
- Keyboard navigation for all interactive elements
- Screen reader compatible timeline
- Color contrast ratios > 4.5:1
- Focus indicators on all interactive elements