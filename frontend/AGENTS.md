# AGENTS.md — Supplier SPK Frontend

## Stack
- Next.js 14 App Router (TypeScript strict)
- Tailwind CSS 3 + `tailwindcss-animate` plugin
- Radix UI primitives + `class-variance-authority` (shadcn/ui-style)
- `clsx` + `tailwind-merge` via `cn()` in `src/lib/utils.ts`
- `lucide-react` for icons, `recharts` for charts
- `next-themes` for dark/light mode (CSS variables in `globals.css`)

## Path alias
```ts
"@/*" // → "./src/*"
```

## Commands
```sh
npm run dev      # next dev (http://localhost:3000)
npm run build    # next build
npm run start    # next start
npm run lint     # next lint (ESLint: next/core-web-vitals + next/typescript)
```
No typecheck, test, or codegen scripts exist.
- **Backend API**: `http://localhost:4000/api` (NestJS, port 4000) — Swagger at `/api/docs`

## Architecture
- **App Router** — all pages under `src/app/<route>/page.tsx`
- **All pages are `"use client"`** — no RSC or server actions yet
- **Layout** (`layout.tsx`): `<Sidebar>` + `<Header>` wrapper with `h-screen` flex; `<main>` uses `bg-muted/30`
- **Active routes**: `/` (Dashboard), `/suppliers`, `/spk`, `/criteria`
- **Legacy HRIS routes** (tidak aktif di sidebar): `/employees`, `/attendance`, `/performance`, `/positions`, `/departments`, `/skills`
- **Components**: `src/components/ui/` (16 shadcn-style primitives), `src/components/` (sidebar, header, charts/)
- **Excel export**: `exceljs` is installed, shared utility at `src/lib/excel.ts` — `generateExcel()`, `downloadExcel()`, `excelFilename()`. Outputs styled `.xlsx` (teal header, zebra stripes, borders, auto-filter, frozen header row)
- **CSV**: `src/lib/csv.ts` also exists for simple text-based exports
- **Charts**: `recharts` is installed but `src/components/charts/` is empty — no chart components built yet
- **Language**: Indonesian (UI labels, nav items)

## Conventions
- Import UI components from `@/components/ui/<name>`
- Use `cn()` for conditional Tailwind classes
- `Card` + `CardHeader`/`CardTitle`/`CardContent` is the primary layout pattern
- All routes use a consistent `<h1>` + `<p>description</p>` heading pattern
- `Badge` accepts `variant`: `"default" | "secondary" | "destructive" | "outline" | "success" | "warning"`
- Sidebar navigation is hardcoded in `sidebar.tsx` — add new routes there too
- Local fonts: GeistSans (`--font-geist-sans`) and GeistMono (`--font-geist-mono`)

## Testing
No test framework is installed. Skip test-related commands.
