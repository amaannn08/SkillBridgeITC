# SkillBridge ITC Platform

> Government-grade placement coordination platform connecting ITIs, Polytechnics, and Engineering Colleges with Food Industry recruiters across India.

## Overview

SkillBridge ITC is a dual-portal system that streamlines the employment pipeline between educational institutions and industry. Built with Next.js 14, MongoDB, and NextAuth v5 with Google OAuth.

### User Roles

| Role | Access | Description |
|---|---|---|
| **Coordinator** | `/coordinator/*` | Institution placement officer — manages talent batches, applies to jobs, tracks placement |
| **Recruiter** | `/recruiter/*` | Company HR — posts job requirements, reviews applications, manages student shortlisting |
| **Super Admin** | `/admin/*` | Government oversight — approves accounts, views analytics, manages platform |

### Core Features

- 🔐 **Google OAuth** with role-based access control and admin approval workflow
- 📋 **Job Requirements** — qualification slots (ITI/Diploma/B.Tech), deadline tracking, geographic scope
- 👥 **Talent Pool Batches** — student management with individual or CSV bulk upload, resume storage
- 📥 **Applications** — coordinator applies batches to jobs; recruiters shortlist/select per student
- 📊 **Analytics** — bar charts, placement funnel, interactive India map view
- 🔔 **Notifications** — real-time in-app notifications with unread counts
- 📧 **Email** — Resend integration for approval/rejection emails and weekly digest
- 📋 **Audit Log** — complete admin action history
- 💬 **Feedback** — coordinator post-placement star ratings

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Database**: MongoDB + Mongoose
- **Auth**: NextAuth v5 (Auth.js) — Google OAuth
- **Styling**: Custom CSS design system (no Tailwind utilities in components)
- **Charts**: Recharts
- **Map**: React-Leaflet with CartoDB dark tiles
- **Email**: Resend
- **CSV**: PapaParser
- **ZIP**: Archiver (resume bulk download)
- **Toast**: Sonner

## Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── (public)/          # Landing, login, register, pending, rejected
│   │   ├── admin/             # Super admin portal
│   │   ├── coordinator/       # Institution coordinator portal
│   │   ├── recruiter/         # Industry recruiter portal
│   │   └── api/               # All API routes
│   ├── components/
│   │   ├── shared/            # StatsCard, Badges, Modal, NotificationBell, GeoMap
│   │   └── Sidebar.tsx
│   ├── lib/                   # auth, db, email, notify, storage, validators
│   └── models/                # Mongoose models
├── .env.example               # All required env vars documented
└── vercel.json                # Cron job config
```

## Getting Started

```bash
# 1. Clone and install
cd app
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in MONGODB_URI, AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ADMIN_EMAIL

# 3. Run development server
npm run dev

# 4. Seed demo data (optional)
npm run seed
```

## Environment Variables

See [`.env.example`](app/.env.example) for the full reference. Minimum required:

```env
MONGODB_URI=mongodb+srv://...
AUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
ADMIN_EMAIL=your@email.com
```

## Deployment (Vercel)

1. Connect your GitHub repo to Vercel
2. Set all env vars from `.env.example` in Vercel dashboard
3. Deploy — cron job auto-configures from `vercel.json`

## API Routes

| Route | Auth | Description |
|---|---|---|
| `GET /api/jobs` | Any approved | List jobs (filtered by role/state) |
| `POST /api/jobs` | Recruiter | Create job requirement |
| `GET /api/batches` | Coordinator | List own batches |
| `POST /api/batches/:id/students/bulk` | Coordinator | CSV bulk import |
| `POST /api/applications` | Coordinator | Apply batch to job |
| `PATCH /api/applications/:id/students/:sid` | Recruiter | Update student status |
| `GET /api/applications/:id/download` | Recruiter | Download resume ZIPs |
| `GET /api/admin/analytics` | Super Admin | Platform analytics |
| `GET /api/admin/audit` | Super Admin | Audit log |
| `GET /api/statistics` | Public | Platform summary stats |
| `GET /api/vacancies` | Public | Open job listings |
| `GET /api/map` | Public | Geographic job distribution |

---

Built for SkillBridge ITC · Government of India · 2024
