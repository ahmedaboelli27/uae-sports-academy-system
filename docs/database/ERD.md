# Entity-relationship diagram (text)

```
roles ─────────────┐
                   │
users ─────────────┼──► parents ──► students ──► enrollments ◄── programs
    │              │        │           │              │            │
    │              │        │           │              │            ├── sport
    │              │        │           │              │            └── branch
    │              │        │           │
    └──► coaches ──┘        │           ├──► attendance_records ◄── training_sessions
            │               │           │              ▲                    │
            ├── coach_sports  │           │              │                    └── coach
            └── coach_branches│           │
                                │           ├──► subscriptions ──► payments ──► invoices
                                │           │
                                └── (user account)

offers ──► coupons

branches ──► programs ──► training_sessions
branches ──► events

users ──► notifications
students ──► documents
students ──► medical_notes
students / sessions ──► incidents

users ──► audit_logs
```

## Relationship summary

| From | To | Cardinality |
|------|-----|-------------|
| User | Parent | 1 : 0..1 |
| User | Coach | 1 : 0..1 |
| Parent | Student | 1 : N |
| Student | Enrollment | 1 : N |
| Program | Enrollment | 1 : N |
| Branch | Program | 1 : N |
| Coach | Training session | 1 : N |
| Session | Attendance | 1 : N |
| Student | Attendance | 1 : N |
| Student | Subscription | 1 : N |
| Subscription | Payment | 1 : N |
| Payment | Invoice | N : 1 (optional) |

See `database/schema.sql` and `docs/database/TABLES.md` for column-level detail.
