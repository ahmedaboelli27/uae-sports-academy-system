# Database seed notes

Phase 2 frontend seeds live in `src/data/seed/`. When the PostgreSQL backend is implemented:

1. Map seed UUID strings to `gen_random_uuid()` or keep deterministic UUIDs for dev.
2. Insert `roles` before `users`.
3. Insert `users` before `parents` / `coaches`.
4. Insert `sports`, `branches`, then `programs`.
5. Insert `students` after `parents`.
6. Load finance and attendance after enrollments exist.

Use a migration tool (e.g. Prisma, Drizzle, Flyway) alongside `schema.sql`.
