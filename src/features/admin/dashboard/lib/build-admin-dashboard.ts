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
import type {
  ActivityType,
  AlertSeverity,
  MockAdminDashboardDto,
  AdminDashboardKpiDto,
  OperationalAlertDto,
  RecentActivityDto,
} from '@/features/admin/dashboard/types/admin-dashboard.dto';
import type { DashboardActivityType, DashboardAlertSeverity } from '@/types';
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

function mapActivityType(type: DashboardActivityType): ActivityType {
  const map: Record<DashboardActivityType, ActivityType> = {
    enrollment: 'registration',
    payment: 'payment',
    attendance: 'attendance',
    trial: 'trial',
    subscription: 'renewal',
    alert: 'registration',
  };
  return map[type] ?? 'registration';
}

function mapAlertSeverity(severity: DashboardAlertSeverity): AlertSeverity {
  const map: Record<DashboardAlertSeverity, AlertSeverity> = {
    info: 'info',
    warning: 'warning',
    critical: 'danger',
  };
  return map[severity] ?? 'info';
}

function mapRecentActivities(): RecentActivityDto[] {
  return recentActivitiesSeed.map((activity) => ({
    id: activity.id,
    type: mapActivityType(activity.type),
    title: activity.title,
    description: activity.description,
    time: activity.timestamp ?? '',
  }));
}

function mapOperationalAlerts(): OperationalAlertDto[] {
  return dashboardAlertsSeed.map((alert) => ({
    id: alert.id,
    severity: mapAlertSeverity(alert.severity),
    title: alert.title,
    description: alert.message ?? alert.title ?? '',
  }));
}

export function buildAdminDashboardDto(): MockAdminDashboardDto {
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
    recentActivities: mapRecentActivities(),
    alerts: mapOperationalAlerts(),
    quickActions: dashboardQuickActionsSeed,
    summary: { totalStudents, activeStudents },
    generatedAt: new Date().toISOString(),
  };
}
