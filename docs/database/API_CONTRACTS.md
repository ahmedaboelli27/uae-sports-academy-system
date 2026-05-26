# API contracts (future REST v1)

Base URL: `/api/v1`  
Auth: `Authorization: Bearer <access_token>`

Response envelope (matches frontend `ApiResponse<T>` / `PaginatedResponse<T>`):

```json
{
  "success": true,
  "data": {},
  "message": "optional"
}
```

Paginated list:

```json
{
  "success": true,
  "data": [],
  "meta": { "page": 1, "pageSize": 10, "totalItems": 100, "totalPages": 10 }
}
```

Frontend mirror: `src/services/api/endpoints.ts`

---

## Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/login` | Email/password login |
| POST | `/auth/register` | Parent registration |
| POST | `/auth/logout` | Invalidate session |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/forgot-password` | Request reset email |
| POST | `/auth/reset-password` | Complete reset |
| GET | `/auth/me` | Current user profile |

---

## Students

| Method | Path | Description |
|--------|------|-------------|
| GET | `/students` | List (filters: status, branchId, programId, search, page) |
| GET | `/students/:id` | Detail |
| POST | `/students` | Create |
| PATCH | `/students/:id` | Update |
| DELETE | `/students/:id` | Soft delete |

---

## Parents

| Method | Path | Description |
|--------|------|-------------|
| GET | `/parents` | List |
| GET | `/parents/:id` | Detail with children summary |
| POST | `/parents` | Create |
| PATCH | `/parents/:id` | Update |

---

## Coaches

| Method | Path | Description |
|--------|------|-------------|
| GET | `/coaches` | List |
| GET | `/coaches/:id` | Detail with assignments |
| POST | `/coaches` | Create |
| PATCH | `/coaches/:id` | Update |

---

## Programs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/programs` | List |
| GET | `/programs/:id` | Detail |
| POST | `/programs` | Create |
| PATCH | `/programs/:id` | Update |

---

## Branches

| Method | Path | Description |
|--------|------|-------------|
| GET | `/branches` | List |
| GET | `/branches/:id` | Detail |
| POST | `/branches` | Create |
| PATCH | `/branches/:id` | Update |

---

## Attendance

| Method | Path | Description |
|--------|------|-------------|
| GET | `/attendance` | List with filters |
| GET | `/attendance/sessions/:sessionId` | By session |
| GET | `/attendance/students/:studentId` | By student |
| POST | `/attendance` | Record attendance |

---

## Finance

| Method | Path | Description |
|--------|------|-------------|
| GET | `/finance/subscriptions` | List subscriptions |
| GET | `/finance/payments` | List payments |
| GET | `/finance/invoices` | List invoices |
| GET | `/finance/offers` | List offers |
| GET | `/finance/coupons` | List coupons |

---

## Dashboard KPIs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/dashboard/admin/kpis` | Admin KPI cards |
| GET | `/dashboard/admin/charts` | Chart series (revenue by program/branch) |

Mock implementation: `src/services/mock/mock-api.ts`  
Service facades: `src/features/admin/*/services/*.service.ts`
