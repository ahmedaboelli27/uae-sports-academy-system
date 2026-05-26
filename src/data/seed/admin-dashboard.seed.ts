import type {
  ChartDataPoint,
  DashboardActivity,
  DashboardAlert,
  DashboardQuickAction,
  MultiMetricDataPoint,
  TimeSeriesDataPoint,
} from '@/types';
import { ROUTE_PATHS } from '@/app/router/route-paths';

export const revenueByMonthSeed: TimeSeriesDataPoint[] = [
  { period: 'Jan', value: 382000 },
  { period: 'Feb', value: 401500 },
  { period: 'Mar', value: 418200 },
  { period: 'Apr', value: 435800 },
  { period: 'May', value: 452100 },
  { period: 'Jun', value: 485200 },
];

export const attendanceTrendSeed: TimeSeriesDataPoint[] = [
  { period: 'Week 1', value: 88.2 },
  { period: 'Week 2', value: 89.5 },
  { period: 'Week 3', value: 90.1 },
  { period: 'Week 4', value: 91.4 },
  { period: 'Week 5', value: 90.8 },
  { period: 'Week 6', value: 92.0 },
];

export const studentsByProgramSeed: ChartDataPoint[] = [
  { label: 'Junior Football', value: 412 },
  { label: 'Swimming', value: 318 },
  { label: 'Basketball Elite', value: 245 },
  { label: 'Tennis Juniors', value: 156 },
  { label: 'Other', value: 117 },
];

export const branchPerformanceSeed: ChartDataPoint[] = [
  { label: 'Dubai Marina', value: 92 },
  { label: 'Abu Dhabi Yas', value: 84 },
  { label: 'Sharjah Central', value: 78 },
  { label: 'Al Ain Oasis', value: 71 },
];

export const programCapacitySeed: MultiMetricDataPoint[] = [
  { label: 'Junior Football', enrolled: 22, capacity: 24 },
  { label: 'Swimming', enrolled: 14, capacity: 16 },
  { label: 'Basketball Elite', enrolled: 18, capacity: 20 },
  { label: 'Tennis Juniors', enrolled: 10, capacity: 12 },
];

export const recentActivitiesSeed: DashboardActivity[] = [
  {
    id: 'act-1',
    type: 'enrollment',
    title: 'New enrollment',
    description: 'Yousef Al Mansoori enrolled in Junior Football Academy',
    timestamp: '2025-05-24T09:15:00Z',
    actor: 'Admin Portal',
  },
  {
    id: 'act-2',
    type: 'payment',
    title: 'Payment received',
    description: 'AED 850 received from Fatima Al Mansoori',
    timestamp: '2025-05-24T08:42:00Z',
    actor: 'Finance',
  },
  {
    id: 'act-3',
    type: 'trial',
    title: 'Trial session booked',
    description: 'Ali Mohammed — Football trial at Dubai Marina',
    timestamp: '2025-05-23T16:20:00Z',
    actor: 'Website',
  },
  {
    id: 'act-4',
    type: 'attendance',
    title: 'Attendance marked',
    description: 'Coach Ahmed marked 18/20 present for Session TS-1',
    timestamp: '2025-05-23T14:05:00Z',
    actor: 'Coach Portal',
  },
  {
    id: 'act-5',
    type: 'subscription',
    title: 'Subscription renewed',
    description: 'Mariam Al Mansoori — Swimming Fundamentals renewed',
    timestamp: '2025-05-23T11:30:00Z',
    actor: 'System',
  },
];

export const dashboardAlertsSeed: DashboardAlert[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: '3 overdue invoices',
    message: 'Outstanding billing requires follow-up from finance team.',
    actionLabel: 'View invoices',
    actionPath: ROUTE_PATHS.admin.financeInvoices,
  },
  {
    id: 'alert-2',
    severity: 'warning',
    title: 'Swimming program near capacity',
    message: 'Dubai Marina swimming sessions are at 87% capacity.',
    actionLabel: 'Manage programs',
    actionPath: ROUTE_PATHS.admin.programs,
  },
  {
    id: 'alert-3',
    severity: 'info',
    title: '12 pending trial requests',
    message: 'New trial bookings awaiting coach assignment.',
    actionLabel: 'Review trials',
    actionPath: ROUTE_PATHS.admin.trialRequests,
  },
];

export const dashboardQuickActionsSeed: DashboardQuickAction[] = [
  {
    id: 'qa-1',
    label: 'Add student',
    description: 'Register a new athlete',
    path: ROUTE_PATHS.admin.studentNew,
    icon: 'user-plus',
  },
  {
    id: 'qa-2',
    label: 'Record attendance',
    description: 'Mark session attendance',
    path: ROUTE_PATHS.admin.attendance,
    icon: 'clipboard-check',
  },
  {
    id: 'qa-3',
    label: 'Finance overview',
    description: 'Payments & subscriptions',
    path: ROUTE_PATHS.admin.finance,
    icon: 'wallet',
  },
  {
    id: 'qa-4',
    label: 'Trial requests',
    description: 'Review new trial leads',
    path: ROUTE_PATHS.admin.trialRequests,
    icon: 'calendar-plus',
  },
  {
    id: 'qa-5',
    label: 'Manage coaches',
    description: 'Staff & assignments',
    path: ROUTE_PATHS.admin.coaches,
    icon: 'users',
  },
  {
    id: 'qa-6',
    label: 'Reports',
    description: 'KPIs and analytics',
    path: ROUTE_PATHS.admin.reports,
    icon: 'bar-chart-3',
  },
];
