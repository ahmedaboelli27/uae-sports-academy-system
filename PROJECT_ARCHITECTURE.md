# UAE Sports Academy System — Architecture

## Overview

Monorepo-style layout: React + TypeScript frontend in `src/`, Express + Prisma backend in `server/`. The UI runs in **mock mode** by default so existing pages keep working without PostgreSQL.

---

## Frontend (`src/`)

### Active admin pages (router source of truth)

All admin routes in `src/app/router/routes.tsx` import from:

```
src/features/admin/pages/
```

Including finance:

| Route | Page file |
|-------|-----------|
| `/admin/finance` | `FinanceDashboardPage.tsx` |
| `/admin/finance/subscriptions` | `FinanceSubscriptionsPage.tsx` |
| `/admin/finance/payments` | `FinancePaymentsPage.tsx` |
| `/admin/finance/invoices` | `FinanceInvoicesPage.tsx` |
| Detail/edit/new routes | `Finance*DetailsPage.tsx`, `Finance*EditPage.tsx`, etc. |

### Finance module (not duplicate pages)

```
src/features/admin/finance/
  services/finance.service.ts   ← rich mock finance API (used by finance pages today)
  types/finance.dto.ts
  components/                   ← shared forms (FinanceInvoiceForm, etc.)
```

There are **no** duplicate finance page components under `finance/` — only services, DTOs, and UI building blocks.

### Shared data & types

| Path | Purpose |
|------|---------|
| `src/data/seed/` | Canonical seed arrays exported via `index.ts` |
| `src/services/mock/mock-db.ts` | In-memory DB cloned from seeds |
| `src/services/mock/mock-api.ts` | Simple CRUD mock for core entities |
| `src/types/` | Shared domain types |

### API mode (mock vs Express)

| Variable | Default | Behavior |
|----------|---------|----------|
| `VITE_USE_MOCK_API` | `true` | Mock services (`mockApi`, `finance.service`) |
| `VITE_USE_MOCK_API=false` | — | Use `src/services/api/admin-api.ts` + axios |

| Variable | Default |
|----------|---------|
| `VITE_API_BASE_URL` | `http://localhost:3000` |

Endpoints: `src/services/api/endpoints.ts` → `/api/...`

Facade for incremental migration: `src/services/api/admin-api.ts`

**Note:** Finance dashboard pages still call `finance.service.ts` directly. Wire them to the backend in a later phase.

---

## Backend (`server/`)

```
server/
  prisma/schema.prisma    PostgreSQL models + enums
  prisma/seed.ts            Seed (IDs match frontend seeds)
  src/
    app.ts                  Express app + `/api` routes
    server.ts               Entry point
    config/env.ts           Zod-validated env
    db/prisma.ts            Prisma client singleton
    middlewares/            auth, roles, errors
    utils/                  ApiError, pagination, responses
    modules/                auth, students, parents, coaches, branches,
                            programs, schedule, attendance, finance,
                            dashboard, reports, users (stub)
```

### API base

- Health: `GET /api/health`
- Auth: `POST /api/auth/login`, `GET /api/auth/me` (Bearer JWT)
- Admin (JWT + role `ADMIN` or `ACCOUNTANT`): `GET/POST/PATCH/DELETE` under `/api/admin/...`

List endpoints support: `page`, `limit`, `search`, `status`, `branchId`, `programId`, `dateFrom`, `dateTo`.

Response shape:

```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

Paginated lists include `meta`: `{ page, limit, totalItems, totalPages }`.

### Database

PostgreSQL via Prisma. Core entities: User, Role, Parent, Student, Coach, Branch, Program, Sport, ScheduleSession, AttendanceRecord, Subscription, Invoice, InvoiceLineItem, Payment, Notification, AuditLog.

Soft delete: `deletedAt` on most core tables.

---

## How to run

### Frontend

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Backend

```bash
cd server
cp .env.example .env
# Edit DATABASE_URL and JWT_SECRET

npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

API: http://localhost:3000/api/health

**Seeded login:** `admin@academy.ae` / `Admin@123`

### Connect frontend to API

```env
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=http://localhost:3000
```

Vite dev proxy forwards `/api` → `localhost:3000`.

---

## Migration notes

1. **Finance UI** uses `finance.service.ts` (separate rich mock). **General admin** can use `adminApi` / `mockApi`.
2. Seed IDs in `server/prisma/seed.ts` match `src/data/seed/*` (e.g. `s-1`, `p-1`, `sub-1`).
3. Prefer `admin-api.ts` over duplicating axios calls when migrating pages.
4. `users` admin module returns 501 until implemented.

---

## Remaining TODOs

- [ ] Migrate finance pages from `finance.service.ts` to REST finance endpoints
- [ ] Implement `server/src/modules/users` CRUD
- [ ] Add refresh token / password reset on backend
- [ ] Align Prisma enum values with frontend DTO enums where they differ (e.g. invoice `partially_paid`)
- [ ] E2E tests against seeded database
- [ ] Production Docker Compose (Postgres + API)
