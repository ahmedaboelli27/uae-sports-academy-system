export type DashboardTrend = "up" | "down" | "neutral";

export type ActivityType =
  | "registration"
  | "payment"
  | "attendance"
  | "trial"
  | "renewal";

export type AlertSeverity = "info" | "warning" | "danger" | "success";

export interface DashboardKpiCardDto {
  id: string;
  titleKey: string;
  value: string;
  change: string;
  trend: DashboardTrend;
  descriptionKey: string;
}

export interface RevenueChartPointDto {
  month: string;
  revenue: number;
  subscriptions: number;
}

export interface AttendanceChartPointDto {
  day: string;
  attendanceRate: number;
  absences: number;
}

export interface ProgramDistributionDto {
  name: string;
  students: number;
}

export interface BranchPerformanceDto {
  branch: string;
  students: number;
  revenue: number;
  attendanceRate: number;
}

export interface RecentActivityDto {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
}

export interface OperationalAlertDto {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
}

export interface AdminDashboardDto {
  kpis: DashboardKpiCardDto[];
  revenueByMonth: RevenueChartPointDto[];
  attendanceTrend: AttendanceChartPointDto[];
  programDistribution: ProgramDistributionDto[];
  branchPerformance: BranchPerformanceDto[];
  recentActivities: RecentActivityDto[];
  alerts: OperationalAlertDto[];
}