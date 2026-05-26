# Database design — UAE Sports Academy

## Why PostgreSQL

PostgreSQL is a strong fit for this academy platform because it provides:

- **Relational integrity** for parents, students, enrollments, sessions, and payments
- **JSONB** for audit metadata and flexible CMS payloads
- **Mature indexing** for reporting KPIs and attendance queries
- **Row-level security** (future) for multi-branch data isolation
- **Wide ecosystem** with Node.js (NestJS/Fastify), Prisma/Drizzle, and hosting on AWS RDS / Azure / Supabase

## Main modules

| Module | Tables | Purpose |
|--------|--------|---------|
| Identity | `roles`, `users` | Authentication and RBAC |
| People | `parents`, `students`, `coaches` | Academy stakeholders |
| Catalog | `sports`, `programs`, `branches` | Offerings and locations |
| Scheduling | `training_sessions`, `enrollments` | Timetables and registrations |
| Attendance | `attendance_records` | Session check-ins |
| Finance | `subscriptions`, `payments`, `invoices`, `offers`, `coupons` | Billing |
| Operations | `events`, `notifications`, `documents`, `medical_notes`, `incidents` | Day-to-day ops |
| Compliance | `audit_logs` | Traceability |

## Main relationships

- One **user** maps to at most one **parent** or **coach** profile.
- One **parent** has many **students**.
- **Students** enroll in **programs** via **enrollments** (branch-scoped).
- **Programs** belong to a **branch** and **sport**.
- **Coaches** run **training_sessions**; **attendance_records** link students to sessions.
- **Subscriptions** tie students to programs; **payments** settle **invoices**.

## Future backend recommendation

- **API:** NestJS or Fastify + TypeScript
- **ORM:** Prisma or Drizzle aligned with `database/schema.sql`
- **Auth:** JWT access + refresh tokens; role claims from `roles.code`
- **Deployment:** PostgreSQL 14+ on managed cloud; Redis optional for sessions/queues

The frontend Phase 2 layer (`services/`, `types/`, `data/seed/`) mirrors this schema so UI modules can swap `mockApi` for `axiosClient` + `ENDPOINTS` with minimal changes.
