# Table reference (draft)

| Table | Primary entities | Key FKs |
|-------|------------------|---------|
| `roles` | RBAC role codes | — |
| `users` | Login accounts | `role_id` |
| `parents` | Guardian profiles | `user_id` |
| `students` | Athletes | `parent_id` |
| `coaches` | Staff coaches | `user_id` |
| `sports` | Sport catalog | — |
| `branches` | UAE locations | — |
| `programs` | Training products | `sport_id`, `branch_id` |
| `coach_sports` | Coach ↔ sport | `coach_id`, `sport_id` |
| `coach_branches` | Coach ↔ branch | `coach_id`, `branch_id` |
| `training_sessions` | Scheduled classes | `program_id`, `coach_id`, `branch_id` |
| `enrollments` | Student in program | `student_id`, `program_id`, `branch_id` |
| `attendance_records` | Per-session attendance | `session_id`, `student_id` |
| `subscriptions` | Billing plans | `student_id`, `program_id`, `parent_id` |
| `payments` | Money received | `parent_id`, `subscription_id`, `invoice_id` |
| `invoices` | Bills | `parent_id`, `subscription_id` |
| `offers` | Promotions | — |
| `coupons` | Discount codes | `offer_id` |
| `events` | Events / camps | `branch_id` |
| `notifications` | In-app alerts | `user_id` |
| `documents` | Consent / uploads | `student_id`, `parent_id` |
| `medical_notes` | Health notes | `student_id` |
| `incidents` | Safety reports | `student_id`, `session_id` |
| `audit_logs` | Admin audit trail | `user_id` |

All business tables include `created_at`, `updated_at`; most include soft delete via `deleted_at`.

Full DDL: `database/schema.sql`.
