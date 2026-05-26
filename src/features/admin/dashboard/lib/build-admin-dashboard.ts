import {
  attendanceTrendSeed,
  branchPerformanceSeed,
  dashboardAlertsSeed,
  dashboardQuickActionsSeed,
  programCapacitySeed,
  recentActivitiesSeed,
  revenueByMonthSeed,
  studentsByProgramSeed,
} from '@/data/seed/admin-dashboard.seed';
import { mockDb } from '@/services/mock/mock-db';
import type { AdminDashboardDto, AdminDashboardKpiDto } from '@/features/admin/dashboard/types/admin-dashboard.dto';
import type { DashboardKpiKey } from '@/types';

const ADMIN_KPI_KEYS: DashboardKpiKey[] = [
  'totalStudents',
  'activeStudents',
  'activeSubscriptions',
  'expiredSubscriptions',
  'pendingPayments',
  'monthlyRevenue',
  'attendanceRate',
  'trialToPaidConversion',
  'renewalRate',
  'dropoutRate',
  'coachUtilization',
  'branchUtilization',
];

export function buildAdminDashboardDto(): AdminDashboardDto {
  const kpis: AdminDashboardKpiDto[] = mockDb.dashboardKpis
    .filter((k) => ADMIN_KPI_KEYS.includes(k.key))
    .map((k) => ({
      key: k.key,
      label: k.label,
      value: typeof k.value === 'number' ? k.value : Number(k.value) || 0,
      format: k.format ?? 'number',
      unit: k.unit,
      trend: k.trend,
    }));

  const totalStudents = kpis.find((k) => k.key === 'totalStudents')?.value ?? 0;
  const activeStudents = kpis.find((k) => k.key === 'activeStudents')?.value ?? 0;

  return {
    kpis,
    charts: {
      revenueByMonth: revenueByMonthSeed,
      attendanceTrend: attendanceTrendSeed,
      studentsByProgram: studentsByProgramSeed,
      branchPerformance: branchPerformanceSeed,
      programCapacity: programCapacitySeed,
      revenueByProgram: mockDb.revenueByProgramChart,
      revenueByBranch: mockDb.revenueByBranchChart,
    },
    recentActivities: recentActivitiesSeed,
    alerts: dashboardAlertsSeed,
    quickActions: dashboardQuickActionsSeed,
    summary: { totalStudents, activeStudents },
    generatedAt: new Date().toISOString(),
  };
}
