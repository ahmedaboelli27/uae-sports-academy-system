import type {
    CreateScheduleSessionRequestDto,
    DeleteScheduleSessionResponseDto,
    ScheduleDetailsDto,
    ScheduleFiltersDto,
    ScheduleListItemDto,
    ScheduleListResponseDto,
    ScheduleSummaryDto,
    UpdateScheduleSessionRequestDto,
} from '../types/schedule.dto';

function mockDelay(ms = 350): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

let scheduleMockData: ScheduleDetailsDto[] = [
    {
        id: 'session-001',
        sessionCode: 'SES-1001',
        title: 'Football Academy - Kids Group A',

        sessionType: 'regular_training',
        status: 'scheduled',
        attendanceStatus: 'not_taken',

        sportType: 'football',

        date: '2026-05-25',
        dayOfWeek: 'monday',
        startTime: '17:00',
        endTime: '18:30',
        durationMinutes: 90,

        branchId: 'branch-dubai',
        branchName: 'Dubai Branch',

        programId: 'program-001',
        programName: 'Football Academy',

        coachId: 'coach-001',
        coachName: 'Ahmed Al Mansoori',

        facilityId: 'facility-dubai-001',
        facilityName: 'Main Football Pitch',

        studentsCount: 18,
        capacity: 24,

        createdAt: '2026-05-20T08:00:00.000Z',
        updatedAt: '2026-05-24T08:00:00.000Z',

        description:
            'Regular football training session focused on ball control, passing, and teamwork for the kids group.',

        branch: {
            id: 'branch-dubai',
            name: 'Dubai Branch',
            city: 'Dubai',
            area: 'Nad Al Sheba',
        },

        program: {
            id: 'program-001',
            programCode: 'PRO-1001',
            name: 'Football Academy',
            sportType: 'football',
        },

        coach: {
            id: 'coach-001',
            coachCode: 'COA-1001',
            fullName: 'Ahmed Al Mansoori',
            sportSpecialty: 'football',
        },

        facility: {
            id: 'facility-dubai-001',
            name: 'Main Football Pitch',
            type: 'football_pitch',
            capacity: 60,
        },

        students: [
            {
                id: 'student-001',
                studentCode: 'STU-1001',
                fullName: 'Mohammed Khaled',
                age: 9,
                attendanceStatus: 'not_marked',
            },
            {
                id: 'student-002',
                studentCode: 'STU-1002',
                fullName: 'Omar Ahmed',
                age: 10,
                attendanceStatus: 'not_marked',
            },
            {
                id: 'student-003',
                studentCode: 'STU-1003',
                fullName: 'Yousef Ali',
                age: 8,
                attendanceStatus: 'not_marked',
            },
        ],

        notes: 'Prepare cones, balls, and hydration station before the session.',
        cancellationReason: null,
        postponementReason: null,
    },
    {
        id: 'session-002',
        sessionCode: 'SES-1002',
        title: 'Swimming Program - Beginner Level',

        sessionType: 'regular_training',
        status: 'scheduled',
        attendanceStatus: 'partially_taken',

        sportType: 'swimming',

        date: '2026-05-26',
        dayOfWeek: 'tuesday',
        startTime: '16:00',
        endTime: '17:00',
        durationMinutes: 60,

        branchId: 'branch-abudhabi',
        branchName: 'Abu Dhabi Branch',

        programId: 'program-002',
        programName: 'Swimming Program',

        coachId: 'coach-002',
        coachName: 'Sara Khaled',

        facilityId: 'facility-abudhabi-001',
        facilityName: 'Indoor Pool',

        studentsCount: 12,
        capacity: 16,

        createdAt: '2026-05-21T08:00:00.000Z',
        updatedAt: '2026-05-24T08:00:00.000Z',

        description:
            'Swimming session focused on water confidence, breathing, floating, and basic movement control.',

        branch: {
            id: 'branch-abudhabi',
            name: 'Abu Dhabi Branch',
            city: 'Abu Dhabi',
            area: 'Khalifa City',
        },

        program: {
            id: 'program-002',
            programCode: 'PRO-1002',
            name: 'Swimming Program',
            sportType: 'swimming',
        },

        coach: {
            id: 'coach-002',
            coachCode: 'COA-1002',
            fullName: 'Sara Khaled',
            sportSpecialty: 'swimming',
        },

        facility: {
            id: 'facility-abudhabi-001',
            name: 'Indoor Pool',
            type: 'swimming_pool',
            capacity: 45,
        },

        students: [
            {
                id: 'student-004',
                studentCode: 'STU-1004',
                fullName: 'Layan Omar',
                age: 7,
                attendanceStatus: 'present',
            },
            {
                id: 'student-005',
                studentCode: 'STU-1005',
                fullName: 'Mariam Hassan',
                age: 8,
                attendanceStatus: 'not_marked',
            },
        ],

        notes: 'Check swimming caps and goggles before entry.',
        cancellationReason: null,
        postponementReason: null,
    },
    {
        id: 'session-003',
        sessionCode: 'SES-1003',
        title: 'Basketball Training - Juniors',

        sessionType: 'assessment',
        status: 'completed',
        attendanceStatus: 'completed',

        sportType: 'basketball',

        date: '2026-05-22',
        dayOfWeek: 'friday',
        startTime: '18:00',
        endTime: '19:30',
        durationMinutes: 90,

        branchId: 'branch-sharjah',
        branchName: 'Sharjah Branch',

        programId: 'program-003',
        programName: 'Basketball Training',

        coachId: 'coach-003',
        coachName: 'Omar Hassan',

        facilityId: 'facility-sharjah-001',
        facilityName: 'Indoor Court',

        studentsCount: 15,
        capacity: 20,

        createdAt: '2026-05-18T08:00:00.000Z',
        updatedAt: '2026-05-22T20:00:00.000Z',

        description:
            'Assessment session for shooting, dribbling, movement, teamwork, and defensive awareness.',

        branch: {
            id: 'branch-sharjah',
            name: 'Sharjah Branch',
            city: 'Sharjah',
            area: 'University City',
        },

        program: {
            id: 'program-003',
            programCode: 'PRO-1003',
            name: 'Basketball Training',
            sportType: 'basketball',
        },

        coach: {
            id: 'coach-003',
            coachCode: 'COA-1003',
            fullName: 'Omar Hassan',
            sportSpecialty: 'basketball',
        },

        facility: {
            id: 'facility-sharjah-001',
            name: 'Indoor Court',
            type: 'indoor_court',
            capacity: 40,
        },

        students: [
            {
                id: 'student-006',
                studentCode: 'STU-1006',
                fullName: 'Hamad Saeed',
                age: 12,
                attendanceStatus: 'present',
            },
            {
                id: 'student-007',
                studentCode: 'STU-1007',
                fullName: 'Ali Nasser',
                age: 13,
                attendanceStatus: 'late',
            },
            {
                id: 'student-008',
                studentCode: 'STU-1008',
                fullName: 'Fahad Salem',
                age: 11,
                attendanceStatus: 'absent',
            },
        ],

        notes: 'Assessment completed and progress notes should be reviewed.',
        cancellationReason: null,
        postponementReason: null,
    },
    {
        id: 'session-004',
        sessionCode: 'SES-1004',
        title: 'Multi-Sport Trial Session',

        sessionType: 'trial_session',
        status: 'postponed',
        attendanceStatus: 'not_taken',

        sportType: 'multi_sport',

        date: '2026-05-27',
        dayOfWeek: 'wednesday',
        startTime: '15:00',
        endTime: '16:00',
        durationMinutes: 60,

        branchId: 'branch-dubai',
        branchName: 'Dubai Branch',

        programId: 'program-004',
        programName: 'Multi-Sport Program',

        coachId: 'coach-004',
        coachName: 'Fatima Al Nuaimi',

        facilityId: 'facility-dubai-002',
        facilityName: 'Kids Training Zone',

        studentsCount: 8,
        capacity: 12,

        createdAt: '2026-05-19T08:00:00.000Z',
        updatedAt: '2026-05-24T18:00:00.000Z',

        description:
            'Trial session for new children to explore movement, coordination, balance, and basic sport skills.',

        branch: {
            id: 'branch-dubai',
            name: 'Dubai Branch',
            city: 'Dubai',
            area: 'Nad Al Sheba',
        },

        program: {
            id: 'program-004',
            programCode: 'PRO-1004',
            name: 'Multi-Sport Program',
            sportType: 'multi_sport',
        },

        coach: {
            id: 'coach-004',
            coachCode: 'COA-1004',
            fullName: 'Fatima Al Nuaimi',
            sportSpecialty: 'multi_sport',
        },

        facility: {
            id: 'facility-dubai-002',
            name: 'Kids Training Zone',
            type: 'kids_zone',
            capacity: 25,
        },

        students: [],

        notes: 'Parents should be notified of the new session time.',
        cancellationReason: null,
        postponementReason: 'Coach availability changed.',
    },
];

function toListItem(session: ScheduleDetailsDto): ScheduleListItemDto {
    return {
        id: session.id,

        sessionCode: session.sessionCode,
        title: session.title,

        sessionType: session.sessionType,
        status: session.status,
        attendanceStatus: session.attendanceStatus,

        sportType: session.sportType,

        date: session.date,
        dayOfWeek: session.dayOfWeek,
        startTime: session.startTime,
        endTime: session.endTime,
        durationMinutes: session.durationMinutes,

        branchId: session.branchId,
        branchName: session.branchName,

        programId: session.programId,
        programName: session.programName,

        coachId: session.coachId,
        coachName: session.coachName,

        facilityId: session.facilityId,
        facilityName: session.facilityName,

        studentsCount: session.studentsCount,
        capacity: session.capacity,

        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
    };
}

function getTodayDate() {
    return new Date().toISOString().slice(0, 10);
}

function getScheduleSummary(sessions: ScheduleDetailsDto[]): ScheduleSummaryDto {
    const totalSessions = sessions.length;
    const today = getTodayDate();

    const totalCapacityUsage = sessions.reduce((total, session) => {
        if (session.capacity <= 0) return total;

        return total + (session.studentsCount / session.capacity) * 100;
    }, 0);

    return {
        totalSessions,

        scheduledSessions: sessions.filter((session) => session.status === 'scheduled')
            .length,

        completedSessions: sessions.filter((session) => session.status === 'completed')
            .length,

        cancelledSessions: sessions.filter((session) => session.status === 'cancelled')
            .length,

        postponedSessions: sessions.filter((session) => session.status === 'postponed')
            .length,

        todaySessions: sessions.filter((session) => session.date === today).length,

        upcomingSessions: sessions.filter(
            (session) => session.date >= today && session.status === 'scheduled',
        ).length,

        totalStudentsScheduled: sessions.reduce(
            (total, session) => total + session.studentsCount,
            0,
        ),

        averageCapacityUsage:
            totalSessions > 0 ? Number((totalCapacityUsage / totalSessions).toFixed(1)) : 0,

        attendanceCompletedSessions: sessions.filter(
            (session) => session.attendanceStatus === 'completed',
        ).length,

        attendancePendingSessions: sessions.filter(
            (session) => session.attendanceStatus !== 'completed',
        ).length,
    };
}

function filterScheduleSessions(
    sessions: ScheduleDetailsDto[],
    filters?: ScheduleFiltersDto,
): ScheduleDetailsDto[] {
    if (!filters) return sessions;

    return sessions.filter((session) => {
        const searchValue = filters.search?.trim().toLowerCase();

        const matchesSearch =
            !searchValue ||
            session.title.toLowerCase().includes(searchValue) ||
            session.sessionCode.toLowerCase().includes(searchValue) ||
            session.branchName.toLowerCase().includes(searchValue) ||
            session.programName.toLowerCase().includes(searchValue) ||
            session.coachName.toLowerCase().includes(searchValue) ||
            session.facilityName.toLowerCase().includes(searchValue) ||
            session.description?.toLowerCase().includes(searchValue);

        const matchesStatus =
            !filters.status ||
            filters.status === 'all' ||
            session.status === filters.status;

        const matchesSessionType =
            !filters.sessionType ||
            filters.sessionType === 'all' ||
            session.sessionType === filters.sessionType;

        const matchesSport =
            !filters.sportType ||
            filters.sportType === 'all' ||
            session.sportType === filters.sportType;

        const matchesAttendance =
            !filters.attendanceStatus ||
            filters.attendanceStatus === 'all' ||
            session.attendanceStatus === filters.attendanceStatus;

        const matchesBranch =
            !filters.branchId ||
            filters.branchId === 'all' ||
            session.branchId === filters.branchId;

        const matchesProgram =
            !filters.programId ||
            filters.programId === 'all' ||
            session.programId === filters.programId;

        const matchesCoach =
            !filters.coachId ||
            filters.coachId === 'all' ||
            session.coachId === filters.coachId;

        const matchesDateFrom =
            !filters.dateFrom || session.date >= filters.dateFrom;

        const matchesDateTo = !filters.dateTo || session.date <= filters.dateTo;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesSessionType &&
            matchesSport &&
            matchesAttendance &&
            matchesBranch &&
            matchesProgram &&
            matchesCoach &&
            matchesDateFrom &&
            matchesDateTo
        );
    });
}

function createId(prefix: string) {
    return `${prefix}-${Date.now()}`;
}

function createSessionCode() {
    const nextNumber = scheduleMockData.length + 1001;
    return `SES-${nextNumber}`;
}

function createBranchSummary(payload: CreateScheduleSessionRequestDto) {
    return {
        id: payload.branchId,
        name: payload.branchName,
        city: payload.branchName,
        area: payload.branchName,
    };
}

function createProgramSummary(payload: CreateScheduleSessionRequestDto) {
    return {
        id: payload.programId,
        programCode: payload.programId.toUpperCase(),
        name: payload.programName,
        sportType: payload.sportType,
    };
}

function createCoachSummary(payload: CreateScheduleSessionRequestDto) {
    return {
        id: payload.coachId,
        coachCode: payload.coachId.toUpperCase(),
        fullName: payload.coachName,
        sportSpecialty: payload.sportType,
    };
}

function createFacilitySummary(payload: CreateScheduleSessionRequestDto) {
    return {
        id: payload.facilityId,
        name: payload.facilityName,
        type: 'other' as const,
        capacity: payload.capacity,
    };
}

export async function getScheduleList(
    filters?: ScheduleFiltersDto,
): Promise<ScheduleListResponseDto> {
    await mockDelay();

    const filteredSessions = filterScheduleSessions(scheduleMockData, filters);

    return {
        summary: getScheduleSummary(scheduleMockData),
        sessions: filteredSessions.map(toListItem),
    };
}

export async function getScheduleSessionById(
    sessionId: string,
): Promise<ScheduleDetailsDto | null> {
    await mockDelay();

    return scheduleMockData.find((session) => session.id === sessionId) ?? null;
}

export async function createScheduleSession(
    payload: CreateScheduleSessionRequestDto,
): Promise<ScheduleDetailsDto> {
    await mockDelay();

    const now = new Date().toISOString();

    const newSession: ScheduleDetailsDto = {
        id: createId('session'),

        sessionCode: createSessionCode(),
        title: payload.title,

        sessionType: payload.sessionType,
        status: payload.status ?? 'scheduled',
        attendanceStatus: payload.attendanceStatus ?? 'not_taken',

        sportType: payload.sportType,

        date: payload.date,
        dayOfWeek: payload.dayOfWeek,
        startTime: payload.startTime,
        endTime: payload.endTime,
        durationMinutes: payload.durationMinutes,

        branchId: payload.branchId,
        branchName: payload.branchName,

        programId: payload.programId,
        programName: payload.programName,

        coachId: payload.coachId,
        coachName: payload.coachName,

        facilityId: payload.facilityId,
        facilityName: payload.facilityName,

        studentsCount: payload.studentsCount ?? 0,
        capacity: payload.capacity,

        createdAt: now,
        updatedAt: now,

        description: payload.description ?? null,

        branch: createBranchSummary(payload),
        program: createProgramSummary(payload),
        coach: createCoachSummary(payload),
        facility: createFacilitySummary(payload),

        students: [],

        notes: payload.notes ?? null,
        cancellationReason: null,
        postponementReason: null,
    };

    scheduleMockData = [newSession, ...scheduleMockData];

    return newSession;
}

export async function updateScheduleSession(
    sessionId: string,
    payload: UpdateScheduleSessionRequestDto,
): Promise<ScheduleDetailsDto | null> {
    await mockDelay();

    const sessionIndex = scheduleMockData.findIndex(
        (session) => session.id === sessionId,
    );

    if (sessionIndex === -1) {
        return null;
    }

    const currentSession = scheduleMockData[sessionIndex];
    const now = new Date().toISOString();

    const updatedSession: ScheduleDetailsDto = {
        ...currentSession,

        title: payload.title ?? currentSession.title,
        description:
            payload.description === undefined
                ? currentSession.description
                : payload.description ?? null,

        sessionType: payload.sessionType ?? currentSession.sessionType,
        status: payload.status ?? currentSession.status,
        attendanceStatus:
            payload.attendanceStatus ?? currentSession.attendanceStatus,

        sportType: payload.sportType ?? currentSession.sportType,

        date: payload.date ?? currentSession.date,
        dayOfWeek: payload.dayOfWeek ?? currentSession.dayOfWeek,
        startTime: payload.startTime ?? currentSession.startTime,
        endTime: payload.endTime ?? currentSession.endTime,
        durationMinutes: payload.durationMinutes ?? currentSession.durationMinutes,

        branchId: payload.branchId ?? currentSession.branchId,
        branchName: payload.branchName ?? currentSession.branchName,

        programId: payload.programId ?? currentSession.programId,
        programName: payload.programName ?? currentSession.programName,

        coachId: payload.coachId ?? currentSession.coachId,
        coachName: payload.coachName ?? currentSession.coachName,

        facilityId: payload.facilityId ?? currentSession.facilityId,
        facilityName: payload.facilityName ?? currentSession.facilityName,

        studentsCount: payload.studentsCount ?? currentSession.studentsCount,
        capacity: payload.capacity ?? currentSession.capacity,

        notes: payload.notes ?? currentSession.notes,

        cancellationReason:
            payload.cancellationReason === undefined
                ? currentSession.cancellationReason
                : payload.cancellationReason,

        postponementReason:
            payload.postponementReason === undefined
                ? currentSession.postponementReason
                : payload.postponementReason,

        updatedAt: now,
    };

    const normalizedUpdatedSession: ScheduleDetailsDto = {
        ...updatedSession,

        branch: {
            ...updatedSession.branch,
            id: updatedSession.branchId,
            name: updatedSession.branchName,
        },

        program: {
            ...updatedSession.program,
            id: updatedSession.programId,
            name: updatedSession.programName,
            sportType: updatedSession.sportType,
        },

        coach: {
            ...updatedSession.coach,
            id: updatedSession.coachId,
            fullName: updatedSession.coachName,
            sportSpecialty: updatedSession.sportType,
        },

        facility: {
            ...updatedSession.facility,
            id: updatedSession.facilityId,
            name: updatedSession.facilityName,
            capacity: updatedSession.capacity,
        },
    };

    scheduleMockData = scheduleMockData.map((session) =>
        session.id === sessionId ? normalizedUpdatedSession : session,
    );

    return normalizedUpdatedSession;
}

export async function deleteScheduleSession(
    sessionId: string,
): Promise<DeleteScheduleSessionResponseDto> {
    await mockDelay();

    const exists = scheduleMockData.some((session) => session.id === sessionId);

    scheduleMockData = scheduleMockData.filter(
        (session) => session.id !== sessionId,
    );

    return {
        id: sessionId,
        deleted: exists,
    };
}