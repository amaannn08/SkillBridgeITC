# SkillBridge Node.js Backend Implementation Plan

Robust Node.js backend for SkillBridge. Stack: **Node.js + TypeScript + Express + NeonDB (PostgreSQL) + Plain SQL + AWS S3**.

## Open Questions

> [!WARNING]
> **Authentication Flow:** The frontend currently uses Google OAuth. Should:
> - (A) The frontend obtain a Google ID token (via `@react-oauth/google`) and pass it to the backend, where we verify it server-side using Google's token verification API?
> - (B) The backend fully handle the OAuth redirect flow (Passport.js `passport-google-oauth20`)?
>
> Option A is the simpler, more common approach for React + Node setups.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Express.js + Node.js |
| Language | TypeScript |
| Database | NeonDB (PostgreSQL) |
| SQL Client | `postgres` (postgres.js) — plain SQL, no ORM |
| Migrations | Raw `.sql` migration files in `src/db/migrations/` |
| Validation | Zod |
| File Storage | AWS S3 |
| Auth | JWT + Google OAuth token verification |
| Testing | Jest + Supertest |

---

## Folder Structure (Feature-First, Top-Level Domains)

```text
backend/
├── src/
│   ├── app.ts                      # Express app setup + route aggregation
│   ├── server.ts                   # Entry point
│   │
│   ├── config/
│   │   └── env.ts                  # Zod-validated env vars (DB_URL, AWS keys, etc.)
│   │
│   ├── db/
│   │   ├── index.ts                # postgres.js client (neon connection)
│   │   └── migrations/             # Plain SQL migration files
│   │       ├── 0001_users.sql
│   │       ├── 0002_institutions.sql
│   │       ├── 0003_companies.sql
│   │       ├── 0004_jobs.sql
│   │       ├── 0005_batches.sql
│   │       ├── 0006_applications.sql
│   │       └── 0007_notifications.sql
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts       # JWT verification + role extraction
│   │   ├── error.middleware.ts      # Global error handler
│   │   └── validate.middleware.ts   # Zod schema request validation
│   │
│   ├── utils/
│   │   ├── logger.ts                # Structured request logger
│   │   ├── s3.ts                    # AWS S3 upload/download/signed URL helpers
│   │   ├── email.ts                 # Email sending utility (Nodemailer/SMTP)
│   │   └── apiResponse.ts           # Consistent API response wrapper { success, data, error }
│   │
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts          # Google token verify, JWT sign, register user
│   │   ├── auth.routes.ts
│   │   ├── auth.schema.ts           # Zod schemas for auth request bodies
│   │   └── auth.test.ts
│   │
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts         # Admin approval, suspension, user queries
│   │   ├── users.routes.ts
│   │   ├── users.schema.ts
│   │   └── users.test.ts
│   │
│   ├── institutions/
│   │   ├── institutions.controller.ts
│   │   ├── institutions.service.ts
│   │   ├── institutions.routes.ts
│   │   ├── institutions.schema.ts
│   │   └── institutions.test.ts
│   │
│   ├── companies/
│   │   ├── companies.controller.ts
│   │   ├── companies.service.ts
│   │   ├── companies.routes.ts
│   │   ├── companies.schema.ts
│   │   └── companies.test.ts
│   │
│   ├── jobs/
│   │   ├── jobs.controller.ts
│   │   ├── jobs.service.ts
│   │   ├── jobs.routes.ts
│   │   ├── jobs.schema.ts
│   │   └── jobs.test.ts
│   │
│   ├── batches/
│   │   ├── batches.controller.ts
│   │   ├── batches.service.ts       # Batch CRUD, student management, CSV bulk upload
│   │   ├── batches.routes.ts
│   │   ├── batches.schema.ts
│   │   └── batches.test.ts
│   │
│   ├── applications/
│   │   ├── applications.controller.ts
│   │   ├── applications.service.ts  # Submit, withdraw, student status update, ZIP download
│   │   ├── applications.routes.ts
│   │   ├── applications.schema.ts
│   │   └── applications.test.ts
│   │
│   └── notifications/
│       ├── notifications.controller.ts
│       ├── notifications.service.ts
│       ├── notifications.routes.ts
│       └── notifications.test.ts
│
├── package.json
├── tsconfig.json
├── jest.config.js
└── .env
```

---

## Database Migrations (Plain SQL)

Each migration file is run sequentially. A `migrations` table tracks what has been applied.

| File | Creates Table |
|---|---|
| `0001_users.sql` | `users` (id, google_id, email, name, role, approval_status, phone, ...) |
| `0002_institutions.sql` | `institutions` (id, name, type, aicte_code, state, district, ...) |
| `0003_companies.sql` | `companies` (id, name, email_domain, website, sector, ...) |
| `0004_jobs.sql` | `job_requirements`, `job_slots` (normalized — slots extracted to separate table) |
| `0005_batches.sql` | `talent_pool_batches`, `students` (students as a separate normalized table) |
| `0006_applications.sql` | `applications`, `student_statuses` |
| `0007_notifications.sql` | `notifications` |
| `0008_audit_log.sql` | `admin_audit_log` |

> [!NOTE]
> A `scripts/migrate.ts` script will apply migrations in order using the plain `postgres.js` client.

---

## API Endpoints

| Module | Method | Route | Role |
|---|---|---|---|
| **auth** | POST | `/api/auth/google` | Public |
| **auth** | POST | `/api/auth/register` | Authed (no role yet) |
| **auth** | GET | `/api/auth/me` | Authed |
| **users** | GET | `/api/admin/approvals` | super_admin |
| **users** | PATCH | `/api/admin/approvals/:userId` | super_admin |
| **users** | GET | `/api/admin/users` | super_admin |
| **users** | PATCH | `/api/admin/users/:userId/suspend` | super_admin |
| **users** | GET | `/api/admin/analytics` | super_admin |
| **institutions** | GET/PATCH | `/api/institutions/me` | coordinator |
| **companies** | GET/PATCH | `/api/companies/me` | recruiter |
| **jobs** | GET | `/api/jobs` | coordinator / recruiter |
| **jobs** | POST | `/api/jobs` | recruiter |
| **jobs** | GET/PATCH/DELETE | `/api/jobs/:jobId` | recruiter (owner) |
| **batches** | GET/POST | `/api/batches` | coordinator |
| **batches** | GET/PATCH | `/api/batches/:batchId` | coordinator |
| **batches** | POST | `/api/batches/:batchId/students` | coordinator |
| **batches** | PATCH/DELETE | `/api/batches/:batchId/students/:studentId` | coordinator |
| **batches** | POST | `/api/batches/:batchId/students/bulk` | coordinator |
| **applications** | GET/POST | `/api/applications` | coordinator / recruiter |
| **applications** | GET | `/api/applications/:appId` | both |
| **applications** | PATCH | `/api/applications/:appId/students/:studentId` | recruiter |
| **applications** | DELETE | `/api/applications/:appId` | coordinator |
| **applications** | GET | `/api/applications/:appId/download` | recruiter |
| **notifications** | GET | `/api/notifications` | authed |
| **notifications** | PATCH | `/api/notifications/:id/read` | authed |
| **notifications** | PATCH | `/api/notifications/read-all` | authed |

---

## Testing Plan (Jest + Supertest)

Each feature folder contains a `*.test.ts` file. Tests use a real NeonDB test database (seeded before each run).

| Feature | Tests |
|---|---|
| `auth.test.ts` | Google token verification, registration, `/me` endpoint |
| `users.test.ts` | Approve/reject, suspend/reinstate, analytics endpoint |
| `institutions.test.ts` | GET/PATCH institution profile |
| `companies.test.ts` | GET/PATCH company profile |
| `jobs.test.ts` | Create job, get jobs (state filter), update, close |
| `batches.test.ts` | Create batch, add student, bulk CSV upload |
| `applications.test.ts` | Submit application, duplicate application check, withdraw, student status update, ZIP download |
| `notifications.test.ts` | List, mark-read, mark-all-read |

Each test file covers:
- ✅ Happy path (expected 200/201)
- ❌ Validation errors (422 from Zod)
- 🔒 Unauthorized access (401/403)
- 🔁 Business logic constraints (409 duplicate, 413 file too large)

---

## Verification Plan

### Automated Tests
```bash
npm run test       # Runs all *.test.ts files
npm run test:watch # Watch mode during development
```

### Manual Verification
```bash
npm run dev        # Start dev server (ts-node-dev / tsx watch)
```
Connect the Vite frontend via `VITE_API_URL=http://localhost:4000` and confirm auth, approvals, and job flows work end-to-end.
