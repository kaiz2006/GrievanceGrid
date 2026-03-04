# 📖 GrievanceGrid — Codebase Documentation

> **Last Updated:** March 4, 2026  
> **Status:** Frontend Landing Page — Refined (Advanced animations & components) · Backend — Architecture Planned (Not Yet Implemented)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Tech Stack](#3-tech-stack)
4. [Frontend — Architecture & Code](#4-frontend--architecture--code)
   - [Configuration Files](#41-configuration-files)
   - [Design System (globals.css)](#42-design-system-globalscss)
   - [App Layout & Routing](#43-app-layout--routing)
   - [Page Composition](#44-page-composition)
   - [Components](#45-components)
5. [Backend — Status](#5-backend--status)
6. [Existing Documentation](#6-existing-documentation)
7. [Known Issues](#7-known-issues)

---

## 1. Project Overview

**GrievanceGrid** is a Smart Public Service CRM that centralizes citizen complaints, automates routing and task assignment, and tracks resolution in real-time. The project is being built as a demo/showcase application with an immersive 3D animated landing page and a planned FastAPI backend.

**Current state of development:**

| Landing Page | ✅ All 7 sections built (High-end aesthetics) |
| 3D Animations | ✅ Interactive Three Fiber & Video backgrounds |
| Scroll Effects | ✅ Lenis + GSAP ScrollTrigger on all sections |
| Design System | ✅ Glassmorphism, Playfair Display (Serif), Glows |
| Backend | 📋 Architecture documented, code not started |

---

## 2. Repository Structure

```
Grievance Grid/
├── README.md                       # Project overview & roadmap
├── backend/                        # (Empty — not yet implemented)
├── docs/
│   ├── prd.md                      # Product Requirements Document
│   ├── design.md                   # UI/UX Design Specification
│   ├── tech_stack.md               # Technology Stack Choices
│   ├── backend_architecture.md     # Backend Architecture Plan
│   ├── todo.md                     # Project To-Do Checklist
│   └── codebase_documentation.md   # This file
└── frontend/
    ├── package.json
    ├── next.config.ts
    ├── tsconfig.json
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    ├── public/                     # Static assets (SVGs)
    │   ├── file.svg
    │   ├── globe.svg
    │   ├── next.svg
    │   ├── vercel.svg
    │   └── window.svg
    └── src/
        ├── app/
        │   ├── layout.tsx          # Root layout (Inter font, metadata, noise overlay)
        │   ├── page.tsx            # Home page (assembles all sections)
        │   ├── globals.css         # Full design system (~330 lines)
        │   └── favicon.ico
        └── components/
            ├── Navbar.tsx          # Card-based navigation wrapper
            ├── CardNav.tsx         # GSAP-powered expandable card navigation
            ├── TiltedCard.tsx      # Framer Motion 3D tilt effect component
            ├── HeroSection.tsx     # Hero content + Video background (advanced)
            ├── HeroScene.tsx       # Three.js scene (Alternative/Legacy)
            ├── FeaturesSection.tsx  # TiltedCard-based feature grid
            ├── HowItWorks.tsx      # 4-step timeline workflow
            ├── StatsSection.tsx    # Animated stat counters
            ├── CTASection.tsx      # Call-to-action banner
            └── Footer.tsx          # Footer with links & socials
```

---

## 3. Tech Stack

### Frontend (Implemented)

| Technology            | Version    | Purpose                          |
| --------------------- | ---------- | -------------------------------- |
| **Next.js**           | `16.1.6`   | React framework (App Router)     |
| **React**             | `19.2.3`   | UI library                       |
| **TypeScript**        | `^5`       | Type safety                      |
| **Tailwind CSS**      | `^4`       | Utility-first CSS framework      |
| **React Three Fiber** | `^9.5.0`   | React renderer for Three.js      |
| **@react-three/drei** | `^10.7.7`  | Useful R3F helpers               |
| **Three.js**          | `^0.183.2` | WebGL 3D library                 |
| **GSAP**              | `^3.14.2`  | Animation engine (ScrollTrigger) |
| **Lenis**             | `^1.0.42`  | Smooth scroll library            |
| **Inter** (Sans)      | —          | Primary typeface                 |
| **Playfair Display**  | —          | Primary Heading typeface (Serif) |
| **Framer Motion**     | `^12.4.7`  | UI animations (Tilt effects)     |

### Backend (Planned)

| Technology        | Purpose                         |
| ----------------- | ------------------------------- |
| **FastAPI**       | Python web framework            |
| **SQLite**        | Demo database (SQLAlchemy ORM)  |
| **Firebase Auth** | Authentication (with mock mode) |
| **Uvicorn**       | ASGI server                     |

---

## 4. Frontend — Architecture & Code

### 4.1 Configuration Files

#### `package.json`

- Project name: `frontend`, version `0.1.0`
- Scripts: `dev`, `build`, `start`, `lint`
- All dependencies listed in the Tech Stack table above

#### `next.config.ts`

- Default Next.js config with no custom options yet

#### `tsconfig.json`

- Target: ES2017, module: ESNext
- Path alias: `@/*` → `./src/*`
- Strict mode enabled
- JSX: `react-jsx`

#### `postcss.config.mjs`

- Standard PostCSS config for Tailwind CSS v4

---

### 4.2 Design System (`globals.css`)

The design system is defined in `src/app/globals.css` (~332 lines) and establishes the visual identity of the entire application.

#### Color Palette (CSS Custom Properties)

```
Core:           --bg-primary: #0f172a (dark navy)
                --bg-secondary: #1e293b
                --bg-tertiary: #334155
                --accent: #1e40af (deep blue)
                --accent-light: #3b82f6
                --accent-glow: #60a5fa

Semantic:       --critical: #ef4444 (red)
                --pending: #f59e0b (amber)
                --resolved: #10b981 (green)
                --new-status: #06b6d4 (cyan)

Text:           --text-primary: #f8fafc
                --text-secondary: #94a3b8
                --text-muted: #64748b

Glassmorphism:  --glass-bg: rgba(255,255,255,0.05)
                --glass-border: rgba(255,255,255,0.08)
                --glass-highlight: rgba(255,255,255,0.12)

Typography:     --font-playfair: Playfair Display (Serif headings)
```

#### Tailwind Theme Integration

Colors are bridged into Tailwind via the `@theme inline` directive, enabling usage as Tailwind classes (e.g., `bg-bg-primary`, `text-accent-light`).

#### Utility Classes

| Class                   | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `.glass`                | Glassmorphism panel (blur 20px, 5% white bg)              |
| `.glass-strong`         | Heavier glass effect (blur 40px, 8% white bg)             |
| `.glass-card`           | Card with glass effect + hover lift + shadow transition   |
| `.gradient-text`        | White-to-gray gradient text                               |
| `.gradient-text-accent` | Blue-to-cyan gradient text                                |
| `.gradient-btn`         | Blue gradient button with hover overlay + lift            |
| `.glow-blue`            | Blue box-shadow glow                                      |
| `.glow-pulse`           | Animated pulsing glow (3s loop)                           |
| `.section-padding`      | Consistent section vertical padding (120px / 80px mobile) |
| `.container-custom`     | Max-width 1280px centered container                       |
| `.fade-in-up`           | GSAP animation start state (opacity 0, Y +40px)           |
| `.stagger-item`         | GSAP stagger animation start state                        |
| `.noise-overlay`        | SVG noise texture overlay (applied to `<body>`)           |
| `.icon-glow`            | Drop-shadow filter for icons                              |
| `.timeline-line`        | Vertical gradient line for the How It Works section       |
| `.timeline-dot`         | Animated pulsing dot on the timeline                      |
| `.stat-number`          | Tabular number font feature for stat counters             |
| `.bg-mask-bottom`       | Linear gradient mask for video backgrounds                |
| `.shimmer-effect`       | Hover shimmer animation for buttons                       |

#### Other Base Styles

- CSS reset (`* { margin:0; padding:0; box-sizing: border-box }`)
- Smooth scrolling, antialiased font rendering
- Custom scrollbar (6px, dark theme)
- Responsive breakpoint at 768px

---

### 4.3 App Layout & Routing

#### `layout.tsx` — Root Layout

**Purpose:** Wraps the entire application with the Inter font and global metadata.

**Key details:**

- Loads **Inter** from Google Fonts with `display: "swap"` for performance
- Font applied via CSS variable `--font-inter`
- SEO metadata: title = "GrievanceGrid — Smart Public Service CRM"
- `<body>` has the `noise-overlay` class for the subtle texture effect

---

### 4.4 Page Composition

#### `page.tsx` — Home Page

**Purpose:** Assembles all 7 landing page sections and initializes smooth scrolling.

**Architecture:**

- Marked as `"use client"` (client component)
- Uses `useEffect` to dynamically import and initialize **Lenis** smooth scrolling
  - Custom easing function: `1.001 - 2^(-10t)` (exponential ease-out)
  - Duration: 1.2s, smooth wheel enabled
  - Fallback: gracefully degrades to native scroll if Lenis unavailable
- Renders sections in order: **Navbar → Hero → Features → How It Works → Stats → CTA → Footer**

---

### 4.5 Components

#### 4.5.1 `Navbar.tsx` & `CardNav.tsx`

**Purpose:** Advanced expandable navigation system using `CardNav` to create a "card stack" interaction.

**Features:**

- **Card Interaction:** Nav items expand into color-coded cards on click/hover.
- **GSAP Animations:** Uses `gsap.timeline` for smooth height expansion and card staggering.
- **Responsive:** Recalculates height dynamically on mobile resize.
- **Customizable:** Props for base color, logo, and nav items.

---

#### 4.5.2 `HeroSection.tsx`

**Purpose:** Redesigned premium hero section with cinematic background.

**Features:**

- **Video Background:** Uses `Background.mp4` with a CSS mask fade (`bg-mask-bottom`).
- **Serif Typography:** Headings use `Playfair Display` for an elegant, professional look.
- **Enhanced CTAs:** "Launch Command Center" button with shimmer, rotation, and glow effects.
- **Advanced Layout:** Centered content with stats pushed to the bottom over the video fade.

**Animations:** Uses GSAP for entry sequences and hover micro-interactions.

---

#### 4.5.3 `TiltedCard.tsx`

**Purpose:** Reusable UI component providing a 3D magnetic tilt effect on mouse hover.

**Technical Details:**

- Powered by **Framer Motion** (`useMotionValue`, `useSpring`).
- Supports interactive captions, image overlays, and custom children.
- Configurable amplitude, scale, and spring physics.

---

#### 4.5.4 `HeroScene.tsx` (Legacy)

**Note:** This component (a React Three Fiber particle/grid scene) is currently replaced by the video background in the main branch but remains in the codebase as an alternative.

---

#### 4.5.5 `FeaturesSection.tsx`

**Refinements:**

- Now wraps feature cards in the `TiltedCard` component for high-end interactivity.
- Updated styling with stronger glassmorphism and animated bottom underlines.

---

#### 4.5.5 `HowItWorks.tsx` (193 lines)

**Purpose:** 4-step timeline showing the grievance lifecycle.

**Steps:**

| Step | Title                   | Color | Description                                   |
| ---- | ----------------------- | ----- | --------------------------------------------- |
| 01   | Citizen Reports         | Cyan  | Submit grievance, get Grid ID instantly       |
| 02   | AI Routes Intelligently | Blue  | Auto-categorize, prioritize, enforce SLA      |
| 03   | Officer Takes Action    | Amber | Task queue with SLA countdown, status updates |
| 04   | Resolution Tracked      | Green | Full lifecycle tracking, citizen feedback     |

**Layout:**

- Desktop: Vertical timeline with icon squares on the left, glass cards on the right
- Mobile: Stacked cards with inline icons (timeline hidden)
- Animated progress line (gradient: blue → green) fills on scroll via `scrub: 1`

**Animations (GSAP + ScrollTrigger):**

- Header fades in at 85%
- Steps slide in from left (`x: -60`) with 0.2s stagger
- Timeline progress bar scales via scroll-linked scrub animation

---

#### 4.5.6 `StatsSection.tsx` (176 lines)

**Purpose:** 4-column impact metrics with animated number counters.

**Stats:**

| Metric              | Value   | Description             |
| ------------------- | ------- | ----------------------- |
| Complaints Resolved | 10,000+ | And counting            |
| Auto-Assign Time    | <30s    | Average routing speed   |
| SLA Compliance      | 90%+    | On-time resolution rate |
| Departments         | 50+     | Connected and active    |

**`AnimatedCounter` sub-component:**

- Takes `target`, `prefix`, `suffix`, and `triggered` props
- Uses `requestAnimationFrame` for smooth counting animation
- Easing: cubic ease-out (`1 - (1 - progress)³`)
- Duration: 2000ms
- Only triggers when the section scrolls into view (70% viewport)

**Animations (GSAP + ScrollTrigger):**

- `ScrollTrigger.create` triggers the counter animation
- Header and stat items animate in with stagger and `back.out` easing
- Expanding bottom accent line on hover (12px → 100% width, color change)

---

#### 4.5.7 `CTASection.tsx` (92 lines)

**Purpose:** Final call-to-action banner encouraging users to get started.

**Features:**

- Large glass card with corner accent borders (top-left, bottom-right)
- Headline: "Start Building a Better Public Service Today"
- Two CTAs: "Get Started Free" (gradient button with glow pulse) + "Contact Sales →"
- Large background glow orb (800×400px)

**Animations (GSAP + ScrollTrigger):**

- Content scales in from 95% with 50px Y offset at 80% viewport

---

#### 4.5.8 `Footer.tsx` (138 lines)

**Purpose:** Site footer with brand info, navigation links, and social media.

**Structure:**

- **Brand column** (2-col span): Logo, tagline, social icons (Twitter/X, GitHub, LinkedIn)
- **Link columns** (3 columns): Product, Resources, Company — each with 4 links
- **Bottom bar:** Copyright (dynamic year) + Terms, Privacy, Security links

**No GSAP animations** — static component.

---

## 5. Backend — Status

The backend directory is currently **empty**. A detailed architecture plan exists in `docs/backend_architecture.md` covering:

- **Framework:** FastAPI (Python) with SQLite via SQLAlchemy
- **Auth:** Firebase Auth with mock mode for demo
- **Database:** 8 tables (users, departments, grid_lanes, sla_rules, complaints, assignments, status_history, feedback)
- **API:** 25+ endpoints across auth, complaints, officer, routing, SLA, analytics, and search
- **Core Logic:** Keyword-based routing engine, SLA checker (background task), smart assignment
- **Demo Data:** 50 seeded complaints, 15 users, 5 departments, 10 grid lanes

> See `docs/backend_architecture.md` for the complete specification.

---

## 6. Existing Documentation

| File                           | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| `docs/prd.md`                  | Product Requirements Document — features, user stories, scope  |
| `docs/design.md`               | UI/UX Design Specification — visual identity, layout, sections |
| `docs/tech_stack.md`           | Technology choices and justifications                          |
| `docs/backend_architecture.md` | Full backend architecture plan with API, schema, logic         |
| `docs/todo.md`                 | Project task checklist with priorities                         |
| `README.md`                    | Repository overview, features, tech stack, roadmap             |

---

## 7. Known Issues

The frontend landing page currently has **multiple errors** that need to be addressed. These are acknowledged and will be resolved in a future iteration. The core UI structure, design system, and all 7 sections are complete in terms of code.

---

_This document covers all code written for the GrievanceGrid project as of March 3, 2026._
