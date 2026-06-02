# AGENTS.md — Supplier SPK (CV Anugerah Mega Makmur)

Aplikasi **Sistem Pendukung Keputusan (SPK)** untuk evaluasi dan seleksi supplier menggunakan metode SMART.

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

### API endpoints (active)

| Module | Base path | Key operations |
|---|---|---|
| **Auth** | `/api/auth` | `login`, `register`, `profile` |
| **Users** | `/api/users` | CRUD, role update, password reset |
| **SPK (Supplier)** | `/api/spk` | Supplier CRUD, supplier selection (SMART), results history |

> Sisa modul HRIS (employees, payroll, attendance, leaves, performance, training, skills, recruitment, departments, positions) masih ada di kode backend tetapi **tidak aktif** di frontend — hanya menyisakan Supplier SPK sebagai fitur utama.

### SPK — Supplier Selection (SMART)

Metode SMART dengan 5 kriteria:
| Kriteria | Bobot |
|---|---|
| Harga | 30% |
| Kualitas | 30% |
| Pengiriman | 20% |
| Layanan | 10% |
| Kapasitas | 10% |
| Bonus ongkos kirim (jika supplier cover) | +0.5 poin |

Threshold default kelulusan: **7.5**.

### Database

- PostgreSQL (required), Prisma migrations in `prisma/`
- Redis configured via `REDIS_URL` env var (optional, for future caching)
- Model utama: `Supplier`, `SpkResult`
- Model HRIS legacy: `User`, `Employee`, `Department`, `Position`, `Document`, `Attendance`, `Leave`, `Payroll`, `Performance`, `Training`, `Skill`, `SkillMatrix`, `Recruitment`

### Conventions

- All non-auth endpoints require `Authorization: Bearer <token>` header
- Role-based access uses `@Roles('SUPER_ADMIN', 'ADMIN_HR')` decorator
- Decimal fields use Prisma `@db.Decimal` for precision
- Timestamps are UTC ISO strings

## Modules

| Modul | Frontend route | Backend API |
|---|---|---|
| Dashboard | `/` | — (aggregated stats) |
| Data Supplier | `/suppliers` | `/api/spk/suppliers` |
| Evaluasi Supplier | `/spk` | `/api/spk/supplier-selection` |
| Kriteria Penilaian | `/criteria` | — (static) |

## Conventions

- UI language: Indonesian (labels, nav, descriptions)
- `Badge` variants: `"default" | "secondary" | "destructive" | "outline" | "success" | "warning"`
- Charts use `recharts` (library installed, `src/components/charts/` directory exists but empty)
