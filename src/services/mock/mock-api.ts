import { apiSuccess } from '@/services/api/api-response.types';
import { mockDelay } from '@/services/mock/mock-delay';
import { mockDb } from '@/services/mock/mock-db';
import { filterBySearch, paginateItems } from '@/lib/pagination';
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types';
import type { AttendanceRecord } from '@/types/attendance.types';
import type { Branch } from '@/types/branch.types';
import type { Coach } from '@/types/coach.types';
import type { ChartDataPoint, DashboardKpi } from '@/types/dashboard.types';
import type { Invoice, Payment, Subscription } from '@/types/finance.types';
import type { Parent } from '@/types/parent.types';
import type { Program } from '@/types/program.types';
import type { Student } from '@/types/student.types';
import type { User } from '@/types/user.types';
import { buildAdminDashboardDto } from '@/features/admin/dashboard/lib/build-admin-dashboard';

async function withDelay<T>(factory: () => T): Promise<T> {
  await mockDelay();
  return factory();
}

export const mockApi = {
  getUsers: (): Promise<ApiResponse<User[]>> =>
    withDelay(() => apiSuccess(mockDb.users.filter((u) => !u.deletedAt))),

  getStudents: (filters?: ListFilters): Promise<PaginatedResponse<Student>> =>
    withDelay(() => {
      const filtered = filterBySearch(
        mockDb.students.filter((s) => !s.deletedAt),
        filters?.search,
        ['firstName', 'lastName', 'id'],
      );
      return paginateItems(filtered, filters);
    }),

  getStudentById: (id: string): Promise<ApiResponse<Student | null>> =>
    withDelay(() => apiSuccess(mockDb.students.find((s) => s.id === id) ?? null)),

  getParents: (filters?: ListFilters): Promise<PaginatedResponse<Parent>> =>
    withDelay(() => paginateItems(mockDb.parents.filter((p) => !p.deletedAt), filters)),

  getParentById: (id: string): Promise<ApiResponse<Parent | null>> =>
    withDelay(() => apiSuccess(mockDb.parents.find((p) => p.id === id) ?? null)),

  getCoaches: (filters?: ListFilters): Promise<PaginatedResponse<Coach>> =>
    withDelay(() => paginateItems(mockDb.coaches.filter((c) => !c.deletedAt), filters)),

  getCoachById: (id: string): Promise<ApiResponse<Coach | null>> =>
    withDelay(() => apiSuccess(mockDb.coaches.find((c) => c.id === id) ?? null)),

  getPrograms: (filters?: ListFilters): Promise<PaginatedResponse<Program>> =>
    withDelay(() => {
      const filtered = filterBySearch(
        mockDb.programs.filter((p) => !p.deletedAt),
        filters?.search,
        ['name', 'slug'],
      );
      return paginateItems(filtered, filters);
    }),

  getProgramById: (id: string): Promise<ApiResponse<Program | null>> =>
    withDelay(() => apiSuccess(mockDb.programs.find((p) => p.id === id) ?? null)),

  getBranches: (filters?: ListFilters): Promise<PaginatedResponse<Branch>> =>
    withDelay(() => paginateItems(mockDb.branches.filter((b) => !b.deletedAt), filters)),

  getBranchById: (id: string): Promise<ApiResponse<Branch | null>> =>
    withDelay(() => apiSuccess(mockDb.branches.find((b) => b.id === id) ?? null)),

  getSubscriptions: (filters?: ListFilters): Promise<PaginatedResponse<Subscription>> =>
    withDelay(() => paginateItems(mockDb.subscriptions, filters)),

  getPayments: (filters?: ListFilters): Promise<PaginatedResponse<Payment>> =>
    withDelay(() => paginateItems(mockDb.payments, filters)),

  getInvoices: (filters?: ListFilters): Promise<PaginatedResponse<Invoice>> =>
    withDelay(() => paginateItems(mockDb.invoices, filters)),

  getAttendance: (filters?: ListFilters): Promise<PaginatedResponse<AttendanceRecord>> =>
    withDelay(() => paginateItems(mockDb.attendanceRecords, filters)),

  getAdminDashboard: (): Promise<ApiResponse<ReturnType<typeof buildAdminDashboardDto>>> =>
    withDelay(() => apiSuccess(buildAdminDashboardDto())),

  getDashboardKpis: (): Promise<ApiResponse<DashboardKpi[]>> =>
    withDelay(() => apiSuccess(mockDb.dashboardKpis)),

  getChartData: (): Promise<
    ApiResponse<{ revenueByProgram: ChartDataPoint[]; revenueByBranch: ChartDataPoint[] }>
  > =>
    withDelay(() =>
      apiSuccess({
        revenueByProgram: mockDb.revenueByProgramChart,
        revenueByBranch: mockDb.revenueByBranchChart,
      }),
    ),
};
