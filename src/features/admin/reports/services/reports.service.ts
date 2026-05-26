import type {
    AttendanceOverviewReportDto,
    BranchPerformanceReportDto,
    CoachPerformanceReportDto,
    ExportReportRequestDto,
    ExportReportResponseDto,
    ProgramPerformanceReportDto,
    ReportChartPointDto,
    ReportHealthStatus,
    ReportKpiDto,
    ReportsDashboardDto,
    ReportsFiltersDto,
    ReportTimeSeriesPointDto,
    ScheduleOperationsReportDto,
    StudentAttendanceRiskReportDto
} from '../types/reports.dto';

function mockDelay(ms = 350): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

const defaultFilters: Required<ReportsFiltersDto> = {
    period: 'this_month',
    dateFrom: '',
    dateTo: '',
    branchId: 'all',
    programId: 'all',
    coachId: 'all',
    sportType: 'all',
};

const branchPerformanceMockData: BranchPerformanceReportDto[] = [
    {
        branchId: 'branch-dubai',
        branchName: 'Dubai Branch',
        city: 'Dubai',
        area: 'Nad Al Sheba',

        totalSessions: 64,
        completedSessions: 52,

        totalStudents: 420,
        capacityUsage: 78,

        attendanceRate: 86,
        absentCount: 34,
        lateCount: 21,

        healthStatus: 'excellent',
    },
    {
        branchId: 'branch-abudhabi',
        branchName: 'Abu Dhabi Branch',
        city: 'Abu Dhabi',
        area: 'Khalifa City',

        totalSessions: 48,
        completedSessions: 39,

        totalStudents: 310,
        capacityUsage: 72,

        attendanceRate: 79,
        absentCount: 42,
        lateCount: 28,

        healthStatus: 'good',
    },
    {
        branchId: 'branch-sharjah',
        branchName: 'Sharjah Branch',
        city: 'Sharjah',
        area: 'University City',

        totalSessions: 36,
        completedSessions: 27,

        totalStudents: 240,
        capacityUsage: 68,

        attendanceRate: 71,
        absentCount: 51,
        lateCount: 33,

        healthStatus: 'warning',
    },
];

const programPerformanceMockData: ProgramPerformanceReportDto[] = [
    {
        programId: 'program-001',
        programName: 'Football Academy',
        sportType: 'football',

        totalSessions: 54,
        completedSessions: 46,

        enrolledStudents: 260,
        averageAttendanceRate: 84,

        absentCount: 39,
        lateCount: 24,

        healthStatus: 'excellent',
    },
    {
        programId: 'program-002',
        programName: 'Swimming Program',
        sportType: 'swimming',

        totalSessions: 42,
        completedSessions: 34,

        enrolledStudents: 180,
        averageAttendanceRate: 78,

        absentCount: 36,
        lateCount: 19,

        healthStatus: 'good',
    },
    {
        programId: 'program-003',
        programName: 'Basketball Training',
        sportType: 'basketball',

        totalSessions: 32,
        completedSessions: 24,

        enrolledStudents: 150,
        averageAttendanceRate: 73,

        absentCount: 41,
        lateCount: 27,

        healthStatus: 'warning',
    },
    {
        programId: 'program-004',
        programName: 'Multi-Sport Program',
        sportType: 'multi_sport',

        totalSessions: 20,
        completedSessions: 14,

        enrolledStudents: 95,
        averageAttendanceRate: 68,

        absentCount: 29,
        lateCount: 16,

        healthStatus: 'warning',
    },
];

const coachPerformanceMockData: CoachPerformanceReportDto[] = [
    {
        coachId: 'coach-001',
        coachName: 'Ahmed Al Mansoori',
        sportSpecialty: 'football',

        totalSessions: 38,
        completedSessions: 34,
        pendingAttendanceSheets: 2,

        totalStudentsHandled: 220,
        averageAttendanceRate: 87,

        lateStudentsCount: 14,
        absentStudentsCount: 25,

        healthStatus: 'excellent',
    },
    {
        coachId: 'coach-002',
        coachName: 'Sara Khaled',
        sportSpecialty: 'swimming',

        totalSessions: 31,
        completedSessions: 27,
        pendingAttendanceSheets: 3,

        totalStudentsHandled: 160,
        averageAttendanceRate: 81,

        lateStudentsCount: 13,
        absentStudentsCount: 28,

        healthStatus: 'good',
    },
    {
        coachId: 'coach-003',
        coachName: 'Omar Hassan',
        sportSpecialty: 'basketball',

        totalSessions: 27,
        completedSessions: 22,
        pendingAttendanceSheets: 4,

        totalStudentsHandled: 145,
        averageAttendanceRate: 74,

        lateStudentsCount: 20,
        absentStudentsCount: 34,

        healthStatus: 'warning',
    },
    {
        coachId: 'coach-004',
        coachName: 'Fatima Al Nuaimi',
        sportSpecialty: 'multi_sport',

        totalSessions: 18,
        completedSessions: 12,
        pendingAttendanceSheets: 5,

        totalStudentsHandled: 88,
        averageAttendanceRate: 66,

        lateStudentsCount: 12,
        absentStudentsCount: 24,

        healthStatus: 'warning',
    },
];

const studentAttendanceRisksMockData: StudentAttendanceRiskReportDto[] = [
    {
        studentId: 'student-001',
        studentCode: 'STU-1001',
        studentName: 'Mohammed Khaled',

        parentName: 'Khaled Ahmed',
        parentPhone: '+971 50 111 2222',

        programName: 'Football Academy',
        branchName: 'Dubai Branch',

        totalSessions: 12,
        presentCount: 10,
        absentCount: 1,
        lateCount: 1,
        excusedCount: 0,

        attendanceRate: 91,
        riskStatus: 'excellent',
    },
    {
        studentId: 'student-007',
        studentCode: 'STU-1007',
        studentName: 'Mariam Hassan',

        parentName: 'Hassan Ali',
        parentPhone: '+971 55 222 3333',

        programName: 'Swimming Program',
        branchName: 'Abu Dhabi Branch',

        totalSessions: 10,
        presentCount: 7,
        absentCount: 2,
        lateCount: 1,
        excusedCount: 0,

        attendanceRate: 80,
        riskStatus: 'good',
    },
    {
        studentId: 'student-011',
        studentCode: 'STU-1011',
        studentName: 'Ali Nasser',

        parentName: 'Nasser Ali',
        parentPhone: '+971 56 222 3333',

        programName: 'Basketball Training',
        branchName: 'Sharjah Branch',

        totalSessions: 11,
        presentCount: 6,
        absentCount: 3,
        lateCount: 2,
        excusedCount: 0,

        attendanceRate: 72,
        riskStatus: 'warning',
    },
    {
        studentId: 'student-017',
        studentCode: 'STU-1017',
        studentName: 'Salma Tarek',

        parentName: 'Tarek Mahmoud',
        parentPhone: '+971 58 222 3333',

        programName: 'Multi-Sport Program',
        branchName: 'Dubai Branch',

        totalSessions: 8,
        presentCount: 3,
        absentCount: 3,
        lateCount: 1,
        excusedCount: 1,

        attendanceRate: 62,
        riskStatus: 'critical',
    },
];

const attendanceTrendMockData: ReportTimeSeriesPointDto[] = [
    {
        date: '2026-05-01',
        attendanceRate: 77,
        sessionsCount: 12,
        studentsCount: 180,
    },
    {
        date: '2026-05-08',
        attendanceRate: 80,
        sessionsCount: 15,
        studentsCount: 210,
    },
    {
        date: '2026-05-15',
        attendanceRate: 83,
        sessionsCount: 18,
        studentsCount: 245,
    },
    {
        date: '2026-05-22',
        attendanceRate: 79,
        sessionsCount: 16,
        studentsCount: 230,
    },
    {
        date: '2026-05-29',
        attendanceRate: 85,
        sessionsCount: 20,
        studentsCount: 270,
    },
];

function normalizeFilters(
    filters?: ReportsFiltersDto,
): Required<ReportsFiltersDto> {
    return {
        ...defaultFilters,
        ...filters,
    };
}

function getHealthStatusByRate(rate: number): ReportHealthStatus {
    if (rate >= 85) return 'excellent';
    if (rate >= 75) return 'good';
    if (rate >= 65) return 'warning';
    return 'critical';
}

function getTrendDirection(value: number) {
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'stable';
}

function filterBranches(
    branches: BranchPerformanceReportDto[],
    filters: Required<ReportsFiltersDto>,
) {
    return branches.filter((branch) => {
        const matchesBranch =
            filters.branchId === 'all' || branch.branchId === filters.branchId;

        return matchesBranch;
    });
}

function filterPrograms(
    programs: ProgramPerformanceReportDto[],
    filters: Required<ReportsFiltersDto>,
) {
    return programs.filter((program) => {
        const matchesProgram =
            filters.programId === 'all' || program.programId === filters.programId;

        const matchesSport =
            filters.sportType === 'all' || program.sportType === filters.sportType;

        return matchesProgram && matchesSport;
    });
}

function filterCoaches(
    coaches: CoachPerformanceReportDto[],
    filters: Required<ReportsFiltersDto>,
) {
    return coaches.filter((coach) => {
        const matchesCoach =
            filters.coachId === 'all' || coach.coachId === filters.coachId;

        const matchesSport =
            filters.sportType === 'all' || coach.sportSpecialty === filters.sportType;

        return matchesCoach && matchesSport;
    });
}

function filterStudentRisks(
    students: StudentAttendanceRiskReportDto[],
    filters: Required<ReportsFiltersDto>,
) {
    return students.filter((student) => {
        const matchesBranch =
            filters.branchId === 'all' ||
            student.branchName.toLowerCase().includes(filters.branchId.replace('branch-', ''));

        const matchesProgram =
            filters.programId === 'all' ||
            student.programName.toLowerCase().includes(
                filters.programId.replace('program-', ''),
            );

        return matchesBranch && matchesProgram;
    });
}

function buildAttendanceOverview(
    branchPerformance: BranchPerformanceReportDto[],
    programPerformance: ProgramPerformanceReportDto[],
): AttendanceOverviewReportDto {
    const totalStudents = branchPerformance.reduce(
        (total, branch) => total + branch.totalStudents,
        0,
    );

    const totalAttendanceSheets = programPerformance.reduce(
        (total, program) => total + program.totalSessions,
        0,
    );

    const completedSheets = programPerformance.reduce(
        (total, program) => total + program.completedSessions,
        0,
    );

    const absentCount = programPerformance.reduce(
        (total, program) => total + program.absentCount,
        0,
    );

    const lateCount = programPerformance.reduce(
        (total, program) => total + program.lateCount,
        0,
    );

    const presentCount = Math.max(totalStudents - absentCount - lateCount, 0);
    const excusedCount = Math.round(absentCount * 0.2);
    const notMarkedCount = Math.max(totalAttendanceSheets - completedSheets, 0);

    const averageAttendanceRate =
        programPerformance.length > 0
            ? Number(
                (
                    programPerformance.reduce(
                        (total, program) => total + program.averageAttendanceRate,
                        0,
                    ) / programPerformance.length
                ).toFixed(1),
            )
            : 0;

    return {
        totalStudents,

        totalAttendanceSheets,
        completedSheets,
        pendingSheets: Math.max(totalAttendanceSheets - completedSheets, 0),
        lockedSheets: Math.round(completedSheets * 0.35),

        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        notMarkedCount,

        averageAttendanceRate,
    };
}

function buildScheduleOperations(
    branchPerformance: BranchPerformanceReportDto[],
): ScheduleOperationsReportDto {
    const totalSessions = branchPerformance.reduce(
        (total, branch) => total + branch.totalSessions,
        0,
    );

    const completedSessions = branchPerformance.reduce(
        (total, branch) => total + branch.completedSessions,
        0,
    );

    const scheduledSessions = Math.max(totalSessions - completedSessions, 0);
    const cancelledSessions = Math.round(totalSessions * 0.04);
    const postponedSessions = Math.round(totalSessions * 0.06);
    const upcomingSessions = Math.round(scheduledSessions * 0.65);
    const todaySessions = Math.min(8, upcomingSessions);

    const averageCapacityUsage =
        branchPerformance.length > 0
            ? Number(
                (
                    branchPerformance.reduce(
                        (total, branch) => total + branch.capacityUsage,
                        0,
                    ) / branchPerformance.length
                ).toFixed(1),
            )
            : 0;

    const attendanceCompletionRate =
        totalSessions > 0
            ? Number(((completedSessions / totalSessions) * 100).toFixed(1))
            : 0;

    return {
        totalSessions,
        scheduledSessions,
        completedSessions,
        cancelledSessions,
        postponedSessions,

        upcomingSessions,
        todaySessions,

        averageCapacityUsage,
        attendanceCompletionRate,
    };
}

function buildKpis(
    attendanceOverview: AttendanceOverviewReportDto,
    scheduleOperations: ScheduleOperationsReportDto,
): ReportKpiDto[] {
    return [
        {
            id: 'attendance-rate',
            title: 'Average Attendance Rate',
            value: attendanceOverview.averageAttendanceRate,
            suffix: '%',
            description: 'Average attendance rate across all selected attendance sheets.',

            trendValue: 4.8,
            trendDirection: getTrendDirection(4.8),

            status: getHealthStatusByRate(attendanceOverview.averageAttendanceRate),
        },
        {
            id: 'completed-sessions',
            title: 'Completed Sessions',
            value: scheduleOperations.completedSessions,
            description: 'Total completed sessions within the selected filters.',

            trendValue: 8.2,
            trendDirection: getTrendDirection(8.2),

            status: 'good',
        },
        {
            id: 'capacity-usage',
            title: 'Capacity Usage',
            value: scheduleOperations.averageCapacityUsage,
            suffix: '%',
            description: 'Average capacity usage across selected branches and programs.',

            trendValue: 2.4,
            trendDirection: getTrendDirection(2.4),

            status: getHealthStatusByRate(scheduleOperations.averageCapacityUsage),
        },
        {
            id: 'pending-attendance',
            title: 'Pending Attendance Sheets',
            value: attendanceOverview.pendingSheets,
            description: 'Attendance sheets that still require completion or review.',

            trendValue: -3.1,
            trendDirection: getTrendDirection(-3.1),

            status: attendanceOverview.pendingSheets > 20 ? 'warning' : 'good',
        },
    ];
}

function buildAttendanceByStatusChart(
    attendanceOverview: AttendanceOverviewReportDto,
): ReportChartPointDto[] {
    return [
        {
            label: 'Present',
            value: attendanceOverview.presentCount,
        },
        {
            label: 'Absent',
            value: attendanceOverview.absentCount,
        },
        {
            label: 'Late',
            value: attendanceOverview.lateCount,
        },
        {
            label: 'Excused',
            value: attendanceOverview.excusedCount,
        },
        {
            label: 'Not Marked',
            value: attendanceOverview.notMarkedCount,
        },
    ];
}

function buildBranchAttendanceChart(
    branches: BranchPerformanceReportDto[],
): ReportChartPointDto[] {
    return branches.map((branch) => ({
        label: branch.branchName,
        value: branch.attendanceRate,
    }));
}

function buildProgramAttendanceChart(
    programs: ProgramPerformanceReportDto[],
): ReportChartPointDto[] {
    return programs.map((program) => ({
        label: program.programName,
        value: program.averageAttendanceRate,
    }));
}

function filterTrendByPeriod(
    trend: ReportTimeSeriesPointDto[],
    filters: Required<ReportsFiltersDto>,
): ReportTimeSeriesPointDto[] {
    if (filters.period !== 'custom') {
        return trend;
    }

    return trend.filter((point) => {
        const matchesFrom = !filters.dateFrom || point.date >= filters.dateFrom;
        const matchesTo = !filters.dateTo || point.date <= filters.dateTo;

        return matchesFrom && matchesTo;
    });
}

export async function getReportsDashboard(
    filters?: ReportsFiltersDto,
): Promise<ReportsDashboardDto> {
    await mockDelay();

    const normalizedFilters = normalizeFilters(filters);

    const branchPerformance = filterBranches(
        branchPerformanceMockData,
        normalizedFilters,
    );

    const programPerformance = filterPrograms(
        programPerformanceMockData,
        normalizedFilters,
    );

    const coachPerformance = filterCoaches(
        coachPerformanceMockData,
        normalizedFilters,
    );

    const studentAttendanceRisks = filterStudentRisks(
        studentAttendanceRisksMockData,
        normalizedFilters,
    );

    const attendanceOverview = buildAttendanceOverview(
        branchPerformance,
        programPerformance,
    );

    const scheduleOperations = buildScheduleOperations(branchPerformance);

    const kpis = buildKpis(attendanceOverview, scheduleOperations);

    const attendanceByStatusChart =
        buildAttendanceByStatusChart(attendanceOverview);

    const branchAttendanceChart = buildBranchAttendanceChart(branchPerformance);

    const programAttendanceChart = buildProgramAttendanceChart(programPerformance);

    const attendanceTrend = filterTrendByPeriod(
        attendanceTrendMockData,
        normalizedFilters,
    );

    return {
        filters: normalizedFilters,

        kpis,

        attendanceOverview,
        scheduleOperations,

        branchPerformance,
        programPerformance,
        coachPerformance,
        studentAttendanceRisks,

        attendanceByStatusChart,
        branchAttendanceChart,
        programAttendanceChart,
        attendanceTrend,
    };
}

export async function exportReport(
    payload: ExportReportRequestDto,
): Promise<ExportReportResponseDto> {
    await mockDelay(600);

    const timestamp = new Date().toISOString();

    const extensionByFormat: Record<ExportReportRequestDto['format'], string> = {
        pdf: 'pdf',
        excel: 'xlsx',
        csv: 'csv',
    };

    const extension = extensionByFormat[payload.format];

    return {
        fileName: `${payload.reportType}-${timestamp.slice(0, 10)}.${extension}`,
        fileUrl: '#',
        generatedAt: timestamp,
    };
}