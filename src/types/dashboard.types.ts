import type { BaseEntity } from '@/types/api.types';

export type DashboardKpiKey =
  | 'totalStudents'
  | 'activeStudents'
  | 'activeSubscriptions'
  | 'expiredSubscriptions'
  | 'pendingPayments'
  | 'monthlyRevenue'
  | 'revenueByProgram'
  | 'revenueByBranch'
  | 'attendanceRate'
  | 'trialToPaidConversion'
  | 'renewalRate'
  | 'dropoutRate'
  | 'coachUtilization'
  | 'branchUtilization'
  | 'leadSources'
  | 'outstandingPayments';

/** @deprecated Use DashboardKpiKey */
export type KpiKey = DashboardKpiKey;

export type KpiFormat = 'number' | 'currency' | 'percent';

export interface DashboardKpi {
  key: DashboardKpiKey;
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  format?: KpiFormat;
}

/** Single-axis chart point (label + numeric value) */
export interface ChartDataPoint {
  label: string;
  value: number;
}

/** Time-series point for Recharts */
export interface TimeSeriesDataPoint {
  period: string;
  value: number;
}

/** Multi-metric point (e.g. enrolled vs capacity) */
export interface MultiMetricDataPoint {
  label: string;
  enrolled: number;
  capacity: number;
}

export interface DashboardChartSeries {
  id: string;
  name: string;
  data: ChartDataPoint[];
}

export type DashboardActivityType =
  | 'enrollment'
  | 'payment'
  | 'attendance'
  | 'trial'
  | 'subscription'
  | 'alert';

export interface DashboardActivity {
  id: string;
  type: DashboardActivityType;
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
}

export type DashboardAlertSeverity = 'info' | 'warning' | 'critical';

export interface DashboardAlert {
  id: string;
  severity: DashboardAlertSeverity;
  title: string;
  message: string;
  actionLabel?: string;
  actionPath?: string;
}

export interface DashboardQuickAction {
  id: string;
  label: string;
  description: string;
  path: string;
  icon: string;
}

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type?: 'info' | 'warning' | 'success' | 'error';
}
