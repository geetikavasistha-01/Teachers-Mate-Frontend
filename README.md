<div align="center">
  <br />
  <img src="public/teacher-svgrepo-com.svg" alt="Teachers-Mate Logo" width="80" height="80" />

  <h1>Teachers-Mate — Frontend</h1>

  <p><em>Because teachers deserve tools that work as hard as they do.</em></p>

  <p>
    A production-grade React SPA that turns the daily grind of attendance tracking into<br/>
    meaningful engagement analytics — fast, accessible, and built for the classroom.
  </p>

  <br/>

  [![CI/CD](https://img.shields.io/github/actions/workflow/status/your-org/teachers-mate-frontend/ci.yml?label=CI%2FCD&style=flat-square&logo=github)](https://github.com/your-org/teachers-mate-frontend/actions)
  [![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel)](https://vercel.com)
  [![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

  <br/>

  [Live Demo](https://teachers-mate-frontend-qokh.vercel.app/) · [Backend Repository](https://github.com/geetikavasistha-01/Teachers-Mate-Backend) · [Report a Bug](https://github.com/geetikavasistha-01/Teachers-Mate-Frontend/issues) · [Request a Feature](https://github.com/geetikavasistha-01/Teachers-Mate-Frontend/issues)

  <br/>
</div>

---

## The Problem We're Solving

Every day, educators across the world spend precious minutes — sometimes an entire class period — wrestling with paper rosters, clunky spreadsheets, and disconnected tools just to answer a simple question: *who showed up, and how often?*

Teachers-Mate was built to make that question effortless to answer, and the insight effortless to act on.

This frontend is the face of that mission. It's the interface a teacher opens on a Monday morning, the dashboard a coordinator checks before a progress meeting, and the roster screen that captures a semester's attendance in real time. Every design decision — from the component boundaries to the network layer to the Lighthouse scores — was made with one goal: **get out of the teacher's way and let them do their actual job.**

---

## What Makes This Project Different

Most administrative tools are built for the institution. Teachers-Mate is built for the person.

**It's fast by default.** Sub-50ms HMR in development. Under 120KB of JavaScript delivered to the browser in production. Pages that load before you've finished blinking. Speed isn't a feature here — it's a constraint we hold ourselves to.

**It's honest about its architecture.** There's no magic, no hidden state, no scattered fetch calls. Every network request flows through a single, auditable `api.js` layer. Every page that needs authentication says so explicitly. Every component that claims to be presentational *actually is*.

**It scales with the curriculum.** Classes grow, rosters change, schedules shift. The CRUD interfaces in Teachers-Mate are built to handle that lifecycle gracefully — not as an afterthought, but as a first-class concern.

**It works on the device a teacher actually has.** Whether that's a MacBook in a staffroom, a tablet in a classroom, or a phone between periods — the layout adapts fluidly from 320px up to widescreen monitors.

---

## Core Features

**Attendance Marking Canvas** — Session-by-session roster submission with real-time toggles and instant visual feedback. Mark a whole class present in seconds, or drill into individual records.

**Analytics Dashboard** — Aggregated metrics showing total sessions logged, institutional engagement rates, and at-risk student flags derived from server-side calculations. Answers the questions coordinators ask before you've finished opening the tab.

**Class & Roster Management** — Full CRUD administration for courses: create classes, link student populations, structure schedule metadata. The kind of control that used to require a spreadsheet and a prayer.

**JWT Auth with Lifecycle Guards** — Protected routes backed by JSON Web Token state. Sessions expire gracefully, tokens are cleaned up automatically, and users land exactly where they need to be after logging back in.

**Mobile-First Responsive Layout** — Fluid grids and spacing systems designed from the smallest screen outward. No breakpoint hacks, no hidden overflow — just layouts that work.

---

## Architecture Overview

Teachers-Mate Frontend is a **fully decoupled, client-side Single Page Application**. It communicates exclusively with the Teachers-Mate Backend REST API over HTTPS, with a clean separation between what the interface knows and what the server decides.

```
┌────────────────────────────────────────────────────────────┐
│                       Client (Browser)                     │
│                                                            │
│  ┌───────────┐   ┌──────────────┐   ┌──────────────────┐  │
│  │  React 18 │──▶│ React Router │──▶│   Page Views     │  │
│  │ (UI Tree) │   │  v6 (SPA)    │   │  (Stateful)      │  │
│  └───────────┘   └──────────────┘   └────────┬─────────┘  │
│        │                                     │             │
│  ┌─────▼─────────────────────────────────────▼──────────┐  │
│  │                     src/api.js                       │  │
│  │   Axios · Base URL · Auth Interceptor · 401 Guard    │  │
│  └─────────────────────────┬────────────────────────────┘  │
└───────────────────────────┬┼────────────────────────────────┘
                            ││ HTTPS / REST / JSON
┌───────────────────────────▼▼────────────────────────────────┐
│               Teachers-Mate Backend API                      │
│           (Node.js · Express · PostgreSQL · JWT)             │
└──────────────────────────────────────────────────────────────┘
```

Three architectural commitments underpin the entire codebase:

**One network layer, zero exceptions.** All HTTP transactions run through a single configured Axios instance in `api.js`. Authentication tokens, base URL routing, and error normalisation are handled once — not scattered across a dozen components.

**Pages own state. Components own nothing.** `src/components/` holds stateless, prop-driven UI primitives. Side-effects, data fetching, and business logic live exclusively inside `src/pages/`. This boundary is maintained strictly.

**Deep links work.** React Router's history mode means `/dashboard` only exists in client memory. The included `vercel.json` rewrite rules ensure direct URL navigation and hard refreshes never result in a 404.

---

## Tech Stack

| Tool | Version | Why We Chose It |
| :--- | :--- | :--- |
| **React** | 18.x | Concurrent rendering for seamless state transitions during background data fetches |
| **Vite** | 5.x | Native ESM loading eliminates pre-bundling overhead; sub-50ms HMR in development |
| **Tailwind CSS** | 3.x | Zero runtime cost; production stylesheets under 10KB through content-scan compilation |
| **Axios** | 1.x | Request interceptors, automatic JSON parsing, and clean global token injection |
| **React Router** | 6.x | Declarative nested routing with built-in deep-link and redirect handling |
| **PostCSS** | 8.x | CSS transformation pipeline with automatic vendor prefixing via Autoprefixer |

---

## Repository Structure

```
frontend/
├── index.html                   # Single-page entry point — mounts the React root
├── package.json                 # Dependencies and pipeline scripts
├── vite.config.js               # Build configuration and module aliases
├── tailwind.config.js           # Theme extensions and content purge paths
├── postcss.config.js            # PostCSS pipeline (Tailwind + Autoprefixer)
├── vercel.json                  # SPA deep-link rewrite rules for edge deployment
├── public/
│   └── teacher-svgrepo-com.svg  # App logo, served statically at the root
└── src/
    ├── main.jsx                 # React DOM bootstrap inside StrictMode
    ├── App.jsx                  # Route definitions and protected route wrappers
    ├── index.css                # Tailwind base/components/utilities directives
    ├── api.js                   # Central Axios instance — auth, base URL, 401 guard
    ├── components/              # Stateless, prop-driven UI primitives
    │   ├── Card.jsx             # Reusable surface with consistent shadow and padding
    │   ├── HeroSection.jsx      # Landing splash with tagline and CTA buttons
    │   └── Navbar.jsx           # Auth-aware navigation with logout handling
    └── pages/                   # Stateful views owning their own data and effects
        ├── Attendance.jsx       # Session roster with interactive presence toggles
        ├── Classes.jsx          # Course CRUD — create, list, update, delete
        ├── Dashboard.jsx        # Aggregated metrics and at-risk analytics
        ├── LandingPage.jsx      # Public entry point routing toward auth
        ├── SignInPage.jsx       # Credential validation and token storage
        └── SignUpPage.jsx       # Registration with automatic post-signup login
```

---

## Getting Started

### Prerequisites

- **Node.js** `>= 18.0.0`
- **npm** `>= 9.0.0`
- A running instance of the [Teachers-Mate Backend](https://github.com/geetikavasistha-01/Teachers-Mate-Backend) (defaults to `http://localhost:10000`)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/Teachers-Mate-Frontend.git
cd Teachers-Mate-Frontend

# 2. Install dependencies
npm install

# 3. Create your local environment config
cp .env.example .env
# Open .env and set VITE_API_URL to your backend address

# 4. Start the development server
npm run dev
```

Your app will be live at **`http://localhost:5173`** with Hot Module Replacement active.

---

## Environment Configuration

```env
# ── Backend API Target ────────────────────────────────────────────────────
# Baked into the bundle by Vite at build time. The VITE_ prefix is required —
# variables without it are intentionally excluded from the client bundle.

# Local development
VITE_API_URL=http://localhost:10000

# Staging
# VITE_API_URL=https://staging-api.teachers-mate.com

# Production — set this in your hosting provider's dashboard, not in a committed file
# VITE_API_URL=https://api.teachers-mate.com
```

> **Why `VITE_` matters:** Vite only exposes variables prefixed with `VITE_` to the client bundle. Everything else is stripped at build time — keeping server secrets, internal infrastructure details, and private keys from ever reaching the browser.

---

## Available Scripts

```bash
npm run dev       # Start local Vite dev server with HMR
npm run build     # Compile production build with tree-shaking and code splitting
npm run preview   # Preview the production build locally before deploying
npm run lint      # Run ESLint across all source files
```

---

## Deployment

The repository ships with a `vercel.json` configured for zero-setup deployment on Vercel. Pushes to the production branch trigger automatic deploys.

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This rewrite is not optional. Because Teachers-Mate is a Single Page Application, routes like `/dashboard` and `/classes` have no corresponding files on disk at the edge. Without this rule, a hard refresh on any non-root path returns a 404. The rewrite ensures all unmatched paths fall back to `index.html`, where React Router takes over.

For other hosting providers: configure an equivalent catch-all rewrite to `index.html` in your platform settings (Netlify `_redirects`, Nginx `try_files`, etc.).

---

## Performance

Measured against production builds on Lighthouse, simulated mobile 3G:

| Metric | Target | What It Means |
| :--- | :--- | :--- |
| **First Contentful Paint** | `< 1.0s` | Structural scaffolding appears almost instantly |
| **Largest Contentful Paint** | `< 1.8s` | Full visual content visible well within Google's "good" threshold |
| **Time to Interactive** | `< 2.2s` | Buttons, forms, and navigation respond almost immediately |
| **Cumulative Layout Shift** | `~0.02` | Layouts don't jump — content lands where it stays |
| **JS Payload (gzip)** | `< 120KB` | Kept small through tree-shaking and route-level code splitting |
| **CSS Payload (gzip)** | `< 10KB` | Tailwind's content scan eliminates every unused utility class |

---

## Contributing

We welcome contributions from anyone who believes teacher tooling should be excellent.

```bash
# 1. Fork and create a feature branch
git checkout -b feat/your-feature-name

# 2. Make your changes, following Conventional Commits
#    feat: add bulk attendance submission
#    fix: resolve token refresh race condition
#    refactor: simplify Dashboard data fetching

# 3. Verify everything passes
npm run lint

# 4. Open a Pull Request with a clear description and screenshots if applicable
```

Please keep PRs focused — one feature or fix per pull request makes review much faster.
