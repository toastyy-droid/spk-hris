# AGENTS.md — HRIS AMM (CV Anugerah Mega Makmur)

## Repo layout

- `frontend/` — Next.js 14 App Router frontend
- `backend/` — NestJS REST API (Prisma + PostgreSQL)
- `prd.md` — Product Requirements Document (source of truth for specification)

## Frontend

See `frontend/AGENTS.md` for full guidance. Key reminders:

- All pages are `"use client"`; no RSC or server actions exist yet
- UI labels are Indonesian throughout
- No test framework is installed
- Commands: `npm run dev` / `npm run build` / `npm run lint` (from `frontend/`)
- Import UI components from `@/components/ui/<name>`, use `cn()` for conditional classes
- Sidebar navigation is hardcoded in `src/components/sidebar.tsx` — add new routes there too

## Backend

NestJS REST API at `/api` prefix, Prisma ORM against PostgreSQL.

### Commands (from `backend/`)

| Command | Description |
|---|---|
| `npm run dev` | Hot-reload dev server (port 4000) |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run compiled production |
| `npm run lint` | ESLint check |
| `npm run prisma:migrate` | Run dev migrations |
| `npm run prisma:generate` | Regenerate Prisma client after schema changes |
| `npm run prisma:seed` | Seed demo data (admin/admin123) |
| `npm run prisma:studio` | Launch Prisma Studio GUI |

### Setup order

```
npm install
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

### Architecture

- **Auth**: JWT via `passport-jwt`, RBAC via custom `RolesGuard` + `@Roles()` decorator. Roles: `SUPER_ADMIN`, `ADMIN_HR`, `MANAGER`, `KARYAWAN`
- **API base**: `http://localhost:4000/api`
- **Swagger**: `http://localhost:4000/api/docs`
- **Response shape**: all endpoints return `{ success: true, data, timestamp }` via a global interceptor

### API endpoints

| Module | Base path | Key operations |
|---|---|---|
| **Auth** | `/api/auth` | `login`, `register`, `profile` |
| **Users** | `/api/users` | CRUD, role update, password reset |
| **Employees** | `/api/employees` | CRUD, search, stats, contract expiry |
| **Departments** | `/api/departments` | CRUD, org tree |
| **Positions** | `/api/positions` | CRUD, filter by department |
| **Attendance** | `/api/attendance` | check-in/out, today/monthly summary |
| **Leaves** | `/api/leaves` | CRUD, approve/reject, quota |
| **Payroll** | `/api/payroll` | CRUD, monthly process, mark paid, summary |
| **Performance** | `/api/performance` | CRUD, upsert per employee+period |
| **Training** | `/api/training` | CRUD |
| **Skills** | `/api/skills` | Skills CRUD, assign to employee |
| **Recruitment** | `/api/recruitment` | CRUD, pipeline, SPK scoring |
| **SPK** | `/api/spk` | promotion calc, early warnings, results history |

### SPK logic (in-app)

The NestJS SPK module implements SMART-based promotion scoring with 5 criteria (performance 40%, tenure 20%, skill match 20%, discipline 10%, 360 review 10%). A Python Flask microservice for advanced analytics is planned but not yet built.

### Database

- PostgreSQL (required), Prisma migrations in `prisma/`
- Redis configured via `REDIS_URL` env var (optional, for future caching)
- 14 models matching the PRD ERD: `User`, `Employee`, `Department`, `Position`, `Document`, `Attendance`, `Leave`, `Payroll`, `Performance`, `Training`, `Skill`, `SkillMatrix`, `Recruitment`, `SpkResult`

### Conventions

- All non-auth endpoints require `Authorization: Bearer <token>` header
- Role-based access uses `@Roles('SUPER_ADMIN', 'ADMIN_HR')` decorator
- Decimal fields use Prisma `@db.Decimal` for precision
- Timestamps are UTC ISO strings

## Architecture (from PRD)

Future layers not yet built:
- **SPK Engine**: Python Flask microservice (pandas, scikit-learn) — for advanced AHP/ML
- **PDF Engine**: Puppeteer/wkhtmltopdf — for payslip PDF generation
- **Infrastructure**: Docker + Nginx reverse proxy; MinIO/S3 for document storage

## Modules

| Modul | Frontend route | Backend API |
|---|---|---|
| Dashboard | `/` | — (aggregated stats) |
| Data Karyawan | `/employees` | `/api/employees` |
| Payroll | `/payroll` | `/api/payroll` |
| Absensi | `/attendance` | `/api/attendance` |
| Kinerja (KPI + 360°) | `/performance` | `/api/performance` |
| Rekrutmen (ATS) | `/recruitment` | `/api/recruitment` |
| Training & Skill Matrix | `/training` | `/api/training`, `/api/skills` |
| SPK (SMART/AHP) | `/spk` | `/api/spk` |
| Settings | `/settings` | `/api/users` |

## Conventions

- UI language: Indonesian (labels, nav, descriptions)
- `Badge` variants: `"default" | "secondary" | "destructive" | "outline" | "success" | "warning"`
- Charts use `recharts` (library installed, `src/components/charts/` directory exists but empty)
