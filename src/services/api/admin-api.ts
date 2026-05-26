/**
 * Backend-ready admin API facade.
 * Pages can migrate from `mockApi` to these functions incrementally.
 */
import { USE_MOCK_API } from '@/config/api-mode';
import { ENDPOINTS } from '@/services/api/endpoints';
import { deleteJson, getJson, getPaginated, patchJson, postJson } from '@/services/api/http';
import { mockApi } from '@/services/mock/mock-api';
import type { ListFilters } from '@/types';
import type { AttendanceRecord } from '@/types/attendance.types';
import type { Branch } from '@/types/branch.types';
import type { Coach } from '@/types/coach.types';
import type { Invoice, Payment, Subscription } from '@/types/finance.types';
import type { Parent } from '@/types/parent.types';
import type { Program } from '@/types/program.types';
import type { Student } from '@/types/student.types';
import type { User } from '@/types/user.types';

export const adminApi = {
  getUsers: (filters?: ListFilters) =>
    USE_MOCK_API
      ? mockApi.getUsers().then((result) => ({
          success: true as const,
          data: result.data,
          meta: {
            page: filters?.page ?? 1,
            pageSize: filters?.pageSize ?? result.data.length,
            totalItems: result.data.length,
            totalPages: 1,
          },
        }))
      : getPaginated<User>(ENDPOINTS.admin.users.list, filters),
  getStudents: (filters?: ListFilters) =>
    USE_MOCK_API
      ? mockApi.getStudents(filters)
      : getPaginated<Student>(ENDPOINTS.admin.students.list, filters),

  getStudentById: (id: string) =>
    USE_MOCK_API
      ? mockApi.getStudentById(id)
      : getJson<Student | null>(ENDPOINTS.admin.students.detail(id)).then((data) => ({
          success: true as const,
          data,
        })),

  getParents: (filters?: ListFilters) =>
    USE_MOCK_API
      ? mockApi.getParents(filters)
      : getPaginated<Parent>(ENDPOINTS.admin.parents.list, filters),

  getParentById: (id: string) =>
    USE_MOCK_API
      ? mockApi.getParentById(id)
      : getJson<Parent | null>(ENDPOINTS.admin.parents.detail(id)).then((data) => ({
          success: true as const,
          data,
        })),

  getCoaches: (filters?: ListFilters) =>
    USE_MOCK_API
      ? mockApi.getCoaches(filters)
      : getPaginated<Coach>(ENDPOINTS.admin.coaches.list, filters),

  getCoachById: (id: string) =>
    USE_MOCK_API
      ? mockApi.getCoachById(id)
      : getJson<Coach | null>(ENDPOINTS.admin.coaches.detail(id)).then((data) => ({
          success: true as const,
          data,
        })),

  getBranches: (filters?: ListFilters) =>
    USE_MOCK_API
      ? mockApi.getBranches(filters)
      : getPaginated<Branch>(ENDPOINTS.admin.branches.list, filters),

  getBranchById: (id: string) =>
    USE_MOCK_API
      ? mockApi.getBranchById(id)
      : getJson<Branch | null>(ENDPOINTS.admin.branches.detail(id)).then((data) => ({
          success: true as const,
          data,
        })),

  getPrograms: (filters?: ListFilters) =>
    USE_MOCK_API
      ? mockApi.getPrograms(filters)
      : getPaginated<Program>(ENDPOINTS.admin.programs.list, filters),

  getProgramById: (id: string) =>
    USE_MOCK_API
      ? mockApi.getProgramById(id)
      : getJson<Program | null>(ENDPOINTS.admin.programs.detail(id)).then((data) => ({
          success: true as const,
          data,
        })),

  getSubscriptions: (filters?: ListFilters) =>
    USE_MOCK_API
      ? mockApi.getSubscriptions(filters)
      : getPaginated<Subscription>(ENDPOINTS.admin.finance.subscriptions.list, filters),

  getInvoices: (filters?: ListFilters) =>
    USE_MOCK_API
      ? mockApi.getInvoices(filters)
      : getPaginated<Invoice>(ENDPOINTS.admin.finance.invoices.list, filters),

  getPayments: (filters?: ListFilters) =>
    USE_MOCK_API
      ? mockApi.getPayments(filters)
      : getPaginated<Payment>(ENDPOINTS.admin.finance.payments.list, filters),

  getAttendance: (filters?: ListFilters) =>
    USE_MOCK_API
      ? mockApi.getAttendance(filters)
      : getPaginated<AttendanceRecord>(ENDPOINTS.admin.attendance.list, filters),

  getAdminDashboard: () =>
    USE_MOCK_API
      ? mockApi.getAdminDashboard()
      : getJson(ENDPOINTS.admin.dashboard).then((data) => ({ success: true as const, data })),

  getReportsSummary: () =>
    getJson(ENDPOINTS.admin.reports.summary),

  createStudent: (body: unknown) =>
    postJson(ENDPOINTS.students.create, body),

  updateStudent: (id: string, body: unknown) =>
    patchJson(ENDPOINTS.students.update(id), body),

  deleteStudent: (id: string) =>
    deleteJson(ENDPOINTS.students.delete(id)),
};
