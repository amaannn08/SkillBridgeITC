# SkillBridge ITC

Government placement coordination portal ([PRD](SkillBridge_PRD_v1.docx)): Next.js app under **`app/`**—MongoDB, NextAuth (Google OAuth), coordinator/recruiter/super-admin workflows.

## Quick start

```bash
cd app
npm install
cp .env.example .env.local   # create from template if present; set MONGODB_URI, AUTH_SECRET, Google OAuth vars
npm run seed                 # Super Admin (ADMIN_EMAIL)
npm run dev
```

Production builds require Google OAuth credentials. Local development can use email-only dev sign-in on `/login` when `NODE_ENV=development`.

See [`app/package.json`](app/package.json) scripts (`build`, `start`, `seed`, `lint`).
