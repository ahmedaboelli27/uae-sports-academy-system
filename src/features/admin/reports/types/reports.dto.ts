export type ReportPeriod =
    | 'today'
    | 'this_week'
    | 'this_month'
    | 'this_quarter'
    | 'this_year'
    | 'custom';

export type ReportTrendDirection = 'up' | 'down' | 'stable';

export type ReportHealthStatus = 'excellent' | 'good' | 'warning' | 'critical';

export type ReportSportType =
    | 'football'
    | 'swimming'
    | 'basketball'
    | 'multi_sport'
    | 'fitness'
    | 'martial_arts'
    | 'tennis'
    | 'other';

export interface ReportsFiltersDto {
    period?: ReportPeriod;
    dateFrom?: string;
    dateTo?: string;

    branchId?: string | 'all';
    programId?: string | 'all';
    coachId?: string | 'all';
    sportType?: ReportSportType | 'all';
}

export interface ReportKpiDto {
    id: string;
    title: string;
    value: number | string;
    suffix?: string;
    description: string;

    trendValue: number;
    trendDirection: ReportTrendDirection;

    status: ReportHealthStatus;
}

export interface AttendanceOverviewReportDto {
    totalStudents: number;

    totalAttendanceSheets: number;
    completedSheets: number;
    pendingSheets: number;
    lockedSheets: number;

    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;
    notMarkedCount: number;

    averageAttendanceRate: number;
}

export interface BranchPerformanceReportDto {
    branchId: string;
    branchName: string;
    city: string;
    area: string;

    totalSessions: number;
    completedSessions: number;

    totalStudents: number;
    capacityUsage: number;

    attendanceRate: number;
    absentCount: number;
    lateCount: number;

    healthStatus: ReportHealthStatus;
}

export interface ProgramPerformanceReportDto {
    programId: string;
    programName: string;
    sportType: ReportSportType;

    totalSessions: number;
    completedSessions: number;

    enrolledStudents: number;
    averageAttendanceRate: number;

    absentCount: number;
    lateCount: number;

    healthStatus: ReportHealthStatus;
}

export interface CoachPerformanceReportDto {
    coachId: string;
    coachName: string;
    sportSpecialty: ReportSportType;

    totalSessions: number;
    completedSessions: number;
    pendingAttendanceSheets: number;

    totalStudentsHandled: number;
    averageAttendanceRate: number;

    lateStudentsCount: number;
    absentStudentsCount: number;

    healthStatus: ReportHealthStatus;
}

export interface StudentAttendanceRiskReportDto {
    studentId: string;
    studentCode: string;
    studentName: string;

    parentName: string;
    parentPhone: string;

    programName: string;
    branchName: string;

    totalSessions: number;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    excusedCount: number;

    attendanceRate: number;
    riskStatus: ReportHealthStatus;
}

export interface ScheduleOperationsReportDto {
    totalSessions: number;
    scheduledSessions: number;
    completedSessions: number;
    cancelledSessions: number;
    postponedSessions: number;

    upcomingSessions: number;
    todaySessions: number;

    averageCapacityUsage: number;
    attendanceCompletionRate: number;
}

export interface ReportChartPointDto {
    label: string;
    value: number;
}

export interface ReportTimeSeriesPointDto {
    date: string;
    attendanceRate: number;
    sessionsCount: number;
    studentsCount: number;
}

export interface ReportsDashboardDto {
    filters: Required<ReportsFiltersDto>;

    kpis: ReportKpiDto[];

    attendanceOverview: AttendanceOverviewReportDto;
    scheduleOperations: ScheduleOperationsReportDto;

    branchPerformance: BranchPerformanceReportDto[];
    programPerformance: ProgramPerformanceReportDto[];
    coachPerformance: CoachPerformanceReportDto[];
    studentAttendanceRisks: StudentAttendanceRiskReportDto[];

    attendanceByStatusChart: ReportChartPointDto[];
    branchAttendanceChart: ReportChartPointDto[];
    programAttendanceChart: ReportChartPointDto[];
    attendanceTrend: ReportTimeSeriesPointDto[];
}

export interface ExportReportRequestDto {
    reportType:
    | 'attendance_overview'
    | 'branch_performance'
    | 'program_performance'
    | 'coach_performance'
    | 'student_risk'
    | 'schedule_operations'
    | 'full_dashboard';

    format: 'pdf' | 'excel' | 'csv';

    filters: ReportsFiltersDto;
}

export interface ExportReportResponseDto {
    fileName: string;
    fileUrl: string;
    generatedAt: string;
}