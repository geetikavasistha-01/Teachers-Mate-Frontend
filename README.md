<div align="center">

<br />

<img src="public/logo.svg" alt="Teachers-Mate" width="72" height="72" />

<h1>Teachers-Mate — Backend</h1>

<p><strong>REST API & Data Persistence Engine</strong></p>

<p>
  A production-hardened Node.js REST API powering the Teachers-Mate platform — handling authentication, attendance transaction processing, and institutional data management with sub-100ms response targets.
</p>

<br />

[![CI/CD](https://img.shields.io/github/actions/workflow/status/your-org/teachers-mate-backend/ci.yml?label=CI%2FCD&style=flat-square&logo=github)](https://github.com/your-org/teachers-mate-backend/actions)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

<br />

[API Reference](#api-reference) · [Frontend Repository](https://github.com/your-org/teachers-mate-frontend) · [Report a Bug](https://github.com/your-org/teachers-mate-backend/issues) · [Request a Feature](https://github.com/your-org/teachers-mate-backend/issues)

<br />

</div>

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Core Responsibilities](#core-responsibilities)
- [Tech Stack & Rationale](#tech-stack--rationale)
- [Repository Structure](#repository-structure)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Authentication Flow](#authentication-flow)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Security Posture](#security-posture)
- [Contributing](#contributing)
- [License](#license)

---

## System Architecture

The Teachers-Mate Backend is a **stateless REST API server** built on the Node.js + Express stack. It is designed to be horizontally scalable — any number of instances can run concurrently because all persistent state is isolated in a PostgreSQL database layer, never held in application memory.

```
                          ┌─────────────────────────────────┐
                          │     Teachers-Mate Frontend       │
                          │        (React SPA / CDN)         │
                          └───────────────┬─────────────────┘
                                          │ HTTPS
                          ┌───────────────▼─────────────────┐
                          │        Reverse Proxy / CDN       │
                          │   (Render / Nginx / Cloudflare)  │
                          └───────────────┬─────────────────┘
                                          │
              ┌───────────────────────────▼──────────────────────────────┐
              │                  Express Application Server               │
              │                                                           │
              │   ┌────────────┐   ┌────────────┐   ┌────────────────┐  │
              │   │  Middleware │ → │   Router   │ → │   Controllers  │  │
              │   │ (auth, CORS│   │  (routes/) │   │  (handlers/)   │  │
              │   │  rate lmt) │   └────────────┘   └───────┬────────┘  │
              │   └────────────┘                            │            │
              │                                    ┌────────▼────────┐   │
              │                                    │   Service Layer  │   │
              │                                    │  (business logic)│   │
              │                                    └────────┬────────┘   │
              └─────────────────────────────────────────────┼────────────┘
                                                            │
                          ┌─────────────────────────────────▼──────────┐
                          │          PostgreSQL (Render Managed DB)      │
                          │    Users · Instructors · Classes · Sessions  │
                          └─────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **Layered architecture** — Each request flows through a defined pipeline: Middleware → Router → Controller → Service → Database. This enforces single-responsibility at every layer and isolates business logic from HTTP concerns, making unit testing straightforward.
- **Stateless JWT authentication** — The server issues signed JWTs and validates them on each request. No server-side session store is required, enabling frictionless horizontal scaling.
- **Connection pooling** — Database connections are managed via `pg-pool`, maintaining a warm pool of reusable connections. This avoids the latency overhead of establishing a new TCP connection per query.
- **Environment-driven configuration** — All environment-sensitive values (DB credentials, JWT secrets, port bindings) are injected at runtime via environment variables, with no hard-coded secrets in source.

---

## Core Responsibilities

| Domain | Responsibility |
|---|---|
| **Identity & Access** | User registration, credential hashing (bcrypt), JWT issuance and validation |
| **Attendance Transactions** | Create, read, update, and delete attendance records with session-level granularity |
| **Course Management** | CRUD operations for class rosters, session scheduling, and enrollment relationships |
| **Analytics Aggregation** | Server-side computation of attendance rates, trend data, and per-student health scores |
| **Request Authorization** | Route-level middleware enforcing role-based access — instructors may only mutate their own course data |
| **Error Normalization** | Global error handler ensuring consistent JSON error envelopes across all failure modes |

---

## Tech Stack & Rationale

| Technology | Version | Role | Why This Choice |
|---|---|---|---|
| **Node.js** | 18.x LTS | Runtime | Non-blocking I/O event loop handles high concurrency of simultaneous attendance submissions without thread contention |
| **Express.js** | 4.x | HTTP Framework | Minimal, unopinionated routing layer — no hidden magic, full control over middleware pipeline ordering |
| **PostgreSQL** | 15.x | Primary Database | ACID compliance guarantees transactional integrity for attendance records; relational model cleanly represents the many-to-many student ↔ class relationship |
| **pg / node-postgres** | 8.x | Database Driver | Mature, battle-tested PostgreSQL driver with native connection pool support; avoids ORM abstraction overhead for complex aggregate queries |
| **bcryptjs** | 2.x | Password Hashing | Adaptive work factor ensures hashing cost scales with hardware improvements; resistant to brute-force via intentional computational expense |
| **jsonwebtoken** | 9.x | Auth Token Issuance | Industry-standard HS256/RS256 signed tokens; stateless verification requires no round-trip to a session store |
| **cors** | 2.x | CORS Policy Enforcement | Explicit allowlist of permitted origins prevents cross-origin abuse from unapproved frontends |
| **dotenv** | 16.x | Environment Management | Loads `.env` into `process.env` at startup; keeps secrets out of source control |

---

## Repository Structure

```
teachers-mate-backend/
│
├── src/
│   ├── server.js                 # Application entry point — binds Express app to PORT, initialises DB pool
│   ├── app.js                    # Express app factory — registers global middleware, mounts routers
│   │
│   ├── config/
│   │   └── db.js                 # pg-pool configuration — connection string, pool size, idle timeout
│   │
│   ├── middleware/
│   │   ├── auth.js               # JWT verification middleware — decodes token, attaches user to req.user
│   │   ├── errorHandler.js       # Global error handler — normalises all thrown errors to JSON envelopes
│   │   └── rateLimiter.js        # express-rate-limit config — 100 req/15min per IP on auth routes
│   │
│   ├── routes/
│   │   ├── auth.routes.js        # POST /auth/register, POST /auth/login
│   │   ├── classes.routes.js     # GET|POST /classes, GET|PUT|DELETE /classes/:id
│   │   ├── attendance.routes.js  # GET|POST /attendance, PUT|DELETE /attendance/:id
│   │   └── dashboard.routes.js   # GET /dashboard/summary — aggregated analytics data
│   │
│   ├── controllers/
│   │   ├── auth.controller.js    # Validates request body, delegates to auth service, returns HTTP response
│   │   ├── classes.controller.js
│   │   ├── attendance.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js       # bcrypt hashing, JWT sign/verify, user lookup logic
│   │   ├── classes.service.js    # Course roster business logic, ownership validation
│   │   ├── attendance.service.js # Attendance record operations, duplicate-entry guards
│   │   └── dashboard.service.js  # Aggregate SQL queries — attendance rates, trend windows
│   │
│   └── models/
│       └── schema.sql            # DDL definitions — tables, indexes, foreign key constraints
│
├── .env.example                  # Environment variable template
├── render.yaml                   # Render deployment manifest — service type, build/start commands
└── package.json
```

---

## Data Model

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│      users       │       │     classes      │       │   enrollments    │
│──────────────────│       │──────────────────│       │──────────────────│
│ id (PK)          │──┐    │ id (PK)          │──┐    │ id (PK)          │
│ name             │  │    │ name             │  │    │ user_id (FK)     │
│ email (UNIQUE)   │  │    │ subject          │  │    │ class_id (FK)    │
│ password_hash    │  │    │ instructor_id(FK)│  │    └──────────────────┘
│ role             │  │    │ schedule         │  │
│ created_at       │  └───▶│──────────────────│  │    ┌──────────────────┐
└──────────────────┘        │ ...              │  │    │  attendance      │
                            └──────────────────┘  │    │──────────────────│
                                                   └───▶│ id (PK)          │
                                                        │ enrollment_id(FK)│
                                                        │ session_date     │
                                                        │ status           │
                                                        │ marked_at        │
                                                        └──────────────────┘
```

The `attendance` table records one row per `enrollment` per `session_date`. A `UNIQUE` constraint on `(enrollment_id, session_date)` prevents duplicate marks for the same student in the same session at the database level, independent of application logic.

---

## API Reference

All endpoints are prefixed with `/api/v1`. All request and response bodies use `application/json`.

### Authentication

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `POST` | `/auth/register` | No | Register a new instructor account |
| `POST` | `/auth/login` | No | Authenticate and receive a JWT |

**`POST /auth/register` — Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@school.edu",
  "password": "minimum-8-chars"
}
```

**`POST /auth/login` — Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": 1, "name": "Jane Smith", "email": "jane@school.edu" }
}
```

### Classes

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/classes` | Yes | List all classes belonging to the authenticated instructor |
| `POST` | `/classes` | Yes | Create a new class |
| `GET` | `/classes/:id` | Yes | Retrieve a specific class with its enrolled students |
| `PUT` | `/classes/:id` | Yes | Update class metadata |
| `DELETE` | `/classes/:id` | Yes | Delete a class and cascade-remove its attendance records |

### Attendance

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/attendance?classId=&date=` | Yes | Retrieve attendance for a given class and session date |
| `POST` | `/attendance` | Yes | Submit a batch of attendance marks for a session |
| `PUT` | `/attendance/:id` | Yes | Amend a single attendance record |
| `DELETE` | `/attendance/:id` | Yes | Remove a single attendance record |

### Dashboard

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| `GET` | `/dashboard/summary` | Yes | Aggregate statistics — total sessions, average attendance rate, at-risk student flags |

### Error Response Envelope

All errors follow a consistent structure:

```json
{
  "status": "error",
  "statusCode": 401,
  "message": "Token is invalid or has expired.",
  "timestamp": "2024-11-15T09:23:11.000Z"
}
```

---

## Authentication Flow

```
Client                              Server
  │                                   │
  │── POST /auth/login ──────────────▶│
  │   { email, password }             │
  │                                   │── Lookup user by email
  │                                   │── bcrypt.compare(password, hash)
  │                                   │── jwt.sign({ userId, role }, SECRET)
  │◀── 200 OK ── { token, user } ─────│
  │                                   │
  │── GET /classes ──────────────────▶│
  │   Authorization: Bearer <token>   │
  │                                   │── jwt.verify(token, SECRET)
  │                                   │── Attach decoded payload to req.user
  │                                   │── Query DB WHERE instructor_id = req.user.id
  │◀── 200 OK ── [ ...classes ] ──────│
```

JWTs are signed with `HS256` and expire after `7 days` by default (configurable via `JWT_EXPIRES_IN`). The client is responsible for persisting the token and including it in the `Authorization` header of every protected request.

---

## Getting Started

### Prerequisites

- **Node.js** `>= 18.0.0` — [Download](https://nodejs.org/)
- **PostgreSQL** `>= 14.0` running locally or a managed instance (e.g., [Render Postgres](https://render.com/docs/databases), [Supabase](https://supabase.com/))
- **npm** `>= 9.0.0`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-org/Teachers-Mate-Backend.git
cd Teachers-Mate-Backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your database credentials and secrets (see below)

# 4. Initialise the database schema
psql -U your_user -d your_database -f src/models/schema.sql

# 5. Start the development server
npm run dev
```

The API server will be available at **`http://localhost:10000`**.

---

## Environment Configuration

```env
# Server
PORT=10000
NODE_ENV=development

# Database — connection string for pg-pool
DATABASE_URL=postgresql://user:password@localhost:5432/teachers_mate

# JWT
JWT_SECRET=your-256-bit-secret-here
JWT_EXPIRES_IN=7d

# CORS — comma-separated list of allowed frontend origins
CORS_ORIGINS=http://localhost:5173,https://teachers-mate.vercel.app
```

> **Security note:** `JWT_SECRET` must be a cryptographically random string of at least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start server with `nodemon` — auto-restarts on file changes |
| `npm start` | Start server in production mode (no file watching) |
| `npm test` | Run Jest test suite |
| `npm run lint` | Run ESLint across all source files |
| `npm run db:migrate` | Apply pending SQL migration files |
| `npm run db:seed` | Populate database with development seed data |

---

## Deployment

### Render (Recommended)

This repository includes a `render.yaml` manifest for one-click deployment on Render.

```yaml
services:
  - type: web
    name: teachers-mate-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: teachers-mate-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true

databases:
  - name: teachers-mate-db
    databaseName: teachers_mate
    plan: free
```

Render automatically provisions a managed PostgreSQL instance and injects the `DATABASE_URL` as an environment variable, eliminating manual connection string management.

**Manual deployment:**
```bash
# Build is not required for Node.js; Render runs startCommand directly
npm start
```

---

## Security Posture

| Layer | Control |
|---|---|
| **Passwords** | `bcryptjs` with work factor `12` — computationally expensive by design |
| **Tokens** | JWTs with short-lived expiry; secrets stored only in environment variables |
| **Transport** | HTTPS enforced at the reverse proxy layer; HTTP requests redirected |
| **CORS** | Explicit origin allowlist — requests from unapproved domains are rejected at the middleware layer |
| **Rate Limiting** | `express-rate-limit` applied to `/auth/*` routes — 10 requests per 15 minutes per IP to mitigate credential stuffing |
| **SQL Injection** | All queries use parameterised statements via `pg` — no raw string interpolation |
| **Input Validation** | Request body validation on all mutation endpoints — malformed payloads are rejected before reaching the service layer |

---

## Contributing

1. Fork the repository and create your branch from `main`: `git checkout -b feat/your-feature-name`
2. Write or update tests for any changed behaviour
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `docs:`
4. Open a Pull Request with a clear description, and reference any related issues
5. Ensure all CI checks pass (`lint`, `test`) before requesting review

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.

---

<div align="center">

Built with care by the Teachers-Mate team · [Frontend Repository →](https://github.com/your-org/teachers-mate-frontend)

</div>
