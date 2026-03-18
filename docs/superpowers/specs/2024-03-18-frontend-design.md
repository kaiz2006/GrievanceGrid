# Design Specification: GrievanceGrid Frontend

## Goal
Implement a premium, high-performance, and visually striking frontend for GrievanceGrid, starting with the Bento-style landing page.

## Aesthetic Direction
- **Tone**: **Aggressive Industrial Transparency**. High contrast, sharp edges, technical/utilitarian but premium.
- **Typography**: 
  - Display: `Plus Jakarta Sans`
  - Technical/Mono: `JetBrains Mono` or similar for Grid IDs and status codes.
- **Color Palette (from design/grievancegrid_bento_landing_page/code.html)**:
  - Primary: `#381D2A` (Deep Charcoal/Plum)
  - Accent 1: `#FFA552` (Industrial Amber)
  - Accent 2: `#C4D6B0` (Muted Sage/Verification Green)
  - Background: `#FFFFFF` / `#F8FAFC` (Clean White/Slate)

## Architecture
- **Framework**: Next.js 15 (App Router, RSC)
- **Styling**: Tailwind CSS
- **Components**: Atomic design in `packages/ui` (shared) and `apps/web/src/components` (app-specific).
- **State**: Zustand for local/UI state, TanStack Query for server state.

## Components to Build
1. **Design System**: Core tokens for colors, spacing, and typography in `apps/web/src/styles/globals.css`.
2. **Bento Grid**: Flexible grid system for the landing page modules.
3. **Interactive Map**: Leaflet-based component for geospatial visualization.
4. **Live Stream Ticker**: Animated horizontal ticker for real-time resolutions.
5. **Modern Navigation**: Glassmorphism navbar with quick track search.

## Verification Plan
- Cross-browser testing (Chrome, Safari, Firefox).
- Responsive design validation (Mobile/Tablet/Desktop).
- Performance audit (Lighthouse target > 90).
