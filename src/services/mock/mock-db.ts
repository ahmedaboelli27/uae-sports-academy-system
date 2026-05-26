import {
  attendanceRecordsSeed,
  branchesSeed,
  coachBranchAssignmentsSeed,
  coachSportAssignmentsSeed,
  coachesSeed,
  dashboardKpisSeed,
  enrollmentsSeed,
  invoicesSeed,
  parentsSeed,
  paymentsSeed,
  programsSeed,
  revenueByBranchChartSeed,
  revenueByProgramChartSeed,
  rolesSeed,
  sportsSeed,
  studentsSeed,
  subscriptionsSeed,
  trainingSessionsSeed,
  usersSeed,
} from '@/data/seed';
import type { AttendanceRecord } from '@/types/attendance.types';
import type { Branch } from '@/types/branch.types';
import type {
  Coach,
  CoachBranchAssignment,
  CoachSportAssignment,
} from '@/types/coach.types';
import type { ChartDataPoint, DashboardKpi } from '@/types/dashboard.types';
import type { Invoice, Payment, Subscription } from '@/types/finance.types';
import type { Parent } from '@/types/parent.types';
import type { Program } from '@/types/program.types';
import type { RoleEntity } from '@/types/role.types';
import type { Enrollment, TrainingSession } from '@/types/schedule.types';
import type { Sport } from '@/types/sport.types';
import type { Student } from '@/types/student.types';
import type { User } from '@/types/user.types';

function clone<T>(items: T[]): T[] {
  return items.map((item) => ({ ...item }));
}

/** In-memory mock database — mirrors future PostgreSQL tables */
export const mockDb = {
  roles: clone(rolesSeed) as RoleEntity[],
  users: clone(usersSeed) as User[],
  parents: clone(parentsSeed) as Parent[],
  students: clone(studentsSeed) as Student[],
  coaches: clone(coachesSeed) as Coach[],
  coachSports: clone(coachSportAssignmentsSeed) as CoachSportAssignment[],
  coachBranches: clone(coachBranchAssignmentsSeed) as CoachBranchAssignment[],
  sports: clone(sportsSeed) as Sport[],
  programs: clone(programsSeed) as Program[],
  branches: clone(branchesSeed) as Branch[],
  enrollments: clone(enrollmentsSeed) as Enrollment[],
  trainingSessions: clone(trainingSessionsSeed) as TrainingSession[],
  attendanceRecords: clone(attendanceRecordsSeed) as AttendanceRecord[],
  subscriptions: clone(subscriptionsSeed) as Subscription[],
  payments: clone(paymentsSeed) as Payment[],
  invoices: clone(invoicesSeed) as Invoice[],
  dashboardKpis: clone(dashboardKpisSeed) as DashboardKpi[],
  revenueByProgramChart: clone(revenueByProgramChartSeed) as ChartDataPoint[],
  revenueByBranchChart: clone(revenueByBranchChartSeed) as ChartDataPoint[],
};

export type MockDb = typeof mockDb;
