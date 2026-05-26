import type { ChartDataPoint, DashboardKpi } from '@/types/dashboard.types';

export const dashboardKpisSeed: DashboardKpi[] = [
  { key: 'totalStudents', label: 'Total Students', value: 1248, format: 'number', trend: 4.2 },
  { key: 'activeStudents', label: 'Active Students', value: 1089, format: 'number', trend: 2.1 },
  {
    key: 'activeSubscriptions',
    label: 'Active Subscriptions',
    value: 956,
    format: 'number',
    trend: 1.8,
  },
  {
    key: 'expiredSubscriptions',
    label: 'Expired Subscriptions',
    value: 87,
    format: 'number',
    trend: -0.5,
  },
  { key: 'pendingPayments', label: 'Pending Payments', value: 34, format: 'number' },
  {
    key: 'monthlyRevenue',
    label: 'Monthly Revenue',
    value: 485200,
    unit: 'AED',
    format: 'currency',
    trend: 6.3,
  },
  {
    key: 'attendanceRate',
    label: 'Attendance Rate',
    value: 91.4,
    format: 'percent',
    trend: 0.8,
  },
  {
    key: 'trialToPaidConversion',
    label: 'Trial to Paid Conversion',
    value: 38.5,
    format: 'percent',
    trend: 2.4,
  },
  { key: 'renewalRate', label: 'Renewal Rate', value: 82.1, format: 'percent', trend: 1.2 },
  { key: 'dropoutRate', label: 'Dropout Rate', value: 5.8, format: 'percent', trend: -0.3 },
  {
    key: 'coachUtilization',
    label: 'Coach Utilization',
    value: 78.6,
    format: 'percent',
    trend: 1.5,
  },
  {
    key: 'branchUtilization',
    label: 'Branch Utilization',
    value: 84.2,
    format: 'percent',
    trend: 0.9,
  },
];

export const revenueByProgramChartSeed: ChartDataPoint[] = [
  { label: 'Football', value: 42 },
  { label: 'Swimming', value: 31 },
  { label: 'Basketball', value: 18 },
  { label: 'Other', value: 9 },
];

export const revenueByBranchChartSeed: ChartDataPoint[] = [
  { label: 'Dubai Marina', value: 58 },
  { label: 'Abu Dhabi Yas', value: 42 },
];
