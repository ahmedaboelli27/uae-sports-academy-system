import type {
  AttendanceDetailsDto,
  AttendanceFiltersDto,
  AttendanceListItemDto,
  AttendanceListResponseDto,
  AttendanceRecordStatus,
  AttendanceSessionStatus,
  AttendanceStatusCountDto,
  AttendanceStudentDto,
  AttendanceSummaryDto,
  CreateAttendanceSheetRequestDto,
  DeleteAttendanceSheetResponseDto,
  MarkAttendanceStudentRequestDto,
  UpdateAttendanceSheetRequestDto,
} from '../types/attendance.dto';

function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

let attendanceMockData: AttendanceDetailsDto[] = [
  {
    id: 'attendance-001',
    attendanceCode: 'ATT-1001',

    sessionId: 'session-001',
    sessionCode: 'SES-1001',
    sessionTitle: 'Football Academy - Kids Group A',

    sessionType: 'regular_training',
    sportType: 'football',

    date: '2026-05-25',
    dayOfWeek: 'monday',
    startTime: '17:00',
    endTime: '18:30',

    branchId: 'branch-dubai',
    branchName: 'Dubai Branch',

    programId: 'program-001',
    programName: 'Football Academy',

    coachId: 'coach-001',
    coachName: 'Ahmed Al Mansoori',

    facilityName: 'Main Football Pitch',

    sessionStatus: 'in_progress',

    totalStudents: 5,
    presentCount: 2,
    absentCount: 1,
    lateCount: 1,
    excusedCount: 0,
    notMarkedCount: 1,

    attendanceRate: 60,

    markedBy: 'Admin User',
    markedAt: '2026-05-25T17:20:00.000Z',

    createdAt: '2026-05-25T08:00:00.000Z',
    updatedAt: '2026-05-25T17:20:00.000Z',

    session: {
      id: 'session-001',
      sessionCode: 'SES-1001',
      title: 'Football Academy - Kids Group A',

      sessionType: 'regular_training',
      sportType: 'football',

      date: '2026-05-25',
      dayOfWeek: 'monday',
      startTime: '17:00',
      endTime: '18:30',

      branchId: 'branch-dubai',
      branchName: 'Dubai Branch',

      programId: 'program-001',
      programName: 'Football Academy',

      coachId: 'coach-001',
      coachName: 'Ahmed Al Mansoori',

      facilityId: 'facility-dubai-001',
      facilityName: 'Main Football Pitch',
    },

    students: [
      {
        id: 'student-001',
        studentCode: 'STU-1001',
        fullName: 'Mohammed Khaled',
        age: 9,

        parentName: 'Khaled Ahmed',
        parentPhone: '+971 50 111 2222',

        status: 'present',

        checkInTime: '17:00',
        checkOutTime: null,

        lateMinutes: 0,
        notes: null,
      },
      {
        id: 'student-002',
        studentCode: 'STU-1002',
        fullName: 'Omar Ahmed',
        age: 10,

        parentName: 'Ahmed Omar',
        parentPhone: '+971 50 222 3333',

        status: 'late',

        checkInTime: '17:12',
        checkOutTime: null,

        lateMinutes: 12,
        notes: 'Arrived late due to traffic.',
      },
      {
        id: 'student-003',
        studentCode: 'STU-1003',
        fullName: 'Yousef Ali',
        age: 8,

        parentName: 'Ali Hassan',
        parentPhone: '+971 50 333 4444',

        status: 'absent',

        checkInTime: null,
        checkOutTime: null,

        lateMinutes: 0,
        notes: 'Parent did not notify the academy.',
      },
      {
        id: 'student-004',
        studentCode: 'STU-1004',
        fullName: 'Hamad Saeed',
        age: 9,

        parentName: 'Saeed Nasser',
        parentPhone: '+971 50 444 5555',

        status: 'present',

        checkInTime: '16:58',
        checkOutTime: null,

        lateMinutes: 0,
        notes: null,
      },
      {
        id: 'student-005',
        studentCode: 'STU-1005',
        fullName: 'Ali Nasser',
        age: 9,

        parentName: 'Nasser Salem',
        parentPhone: '+971 50 555 6666',

        status: 'not_marked',

        checkInTime: null,
        checkOutTime: null,

        lateMinutes: 0,
        notes: null,
      },
    ],

    generalNotes: 'Attendance is still being completed by the coach.',

    lockedBy: null,
    lockedAt: null,
  },
  {
    id: 'attendance-002',
    attendanceCode: 'ATT-1002',

    sessionId: 'session-002',
    sessionCode: 'SES-1002',
    sessionTitle: 'Swimming Program - Beginner Level',

    sessionType: 'regular_training',
    sportType: 'swimming',

    date: '2026-05-26',
    dayOfWeek: 'tuesday',
    startTime: '16:00',
    endTime: '17:00',

    branchId: 'branch-abudhabi',
    branchName: 'Abu Dhabi Branch',

    programId: 'program-002',
    programName: 'Swimming Program',

    coachId: 'coach-002',
    coachName: 'Sara Khaled',

    facilityName: 'Indoor Pool',

    sessionStatus: 'not_started',

    totalStudents: 4,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    excusedCount: 0,
    notMarkedCount: 4,

    attendanceRate: 0,

    markedBy: null,
    markedAt: null,

    createdAt: '2026-05-26T08:00:00.000Z',
    updatedAt: '2026-05-26T08:00:00.000Z',

    session: {
      id: 'session-002',
      sessionCode: 'SES-1002',
      title: 'Swimming Program - Beginner Level',

      sessionType: 'regular_training',
      sportType: 'swimming',

      date: '2026-05-26',
      dayOfWeek: 'tuesday',
      startTime: '16:00',
      endTime: '17:00',

      branchId: 'branch-abudhabi',
      branchName: 'Abu Dhabi Branch',

      programId: 'program-002',
      programName: 'Swimming Program',

      coachId: 'coach-002',
      coachName: 'Sara Khaled',

      facilityId: 'facility-abudhabi-001',
      facilityName: 'Indoor Pool',
    },

    students: [
      {
        id: 'student-006',
        studentCode: 'STU-1006',
        fullName: 'Layan Omar',
        age: 7,

        parentName: 'Omar Salem',
        parentPhone: '+971 55 111 2222',

        status: 'not_marked',

        checkInTime: null,
        checkOutTime: null,

        lateMinutes: 0,
        notes: null,
      },
      {
        id: 'student-007',
        studentCode: 'STU-1007',
        fullName: 'Mariam Hassan',
        age: 8,

        parentName: 'Hassan Ali',
        parentPhone: '+971 55 222 3333',

        status: 'not_marked',

        checkInTime: null,
        checkOutTime: null,

        lateMinutes: 0,
        notes: null,
      },
      {
        id: 'student-008',
        studentCode: 'STU-1008',
        fullName: 'Noura Khaled',
        age: 7,

        parentName: 'Khaled Sami',
        parentPhone: '+971 55 333 4444',

        status: 'not_marked',

        checkInTime: null,
        checkOutTime: null,

        lateMinutes: 0,
        notes: null,
      },
      {
        id: 'student-009',
        studentCode: 'STU-1009',
        fullName: 'Reem Ahmed',
        age: 8,

        parentName: 'Ahmed Fawzi',
        parentPhone: '+971 55 444 5555',

        status: 'not_marked',

        checkInTime: null,
        checkOutTime: null,

        lateMinutes: 0,
        notes: null,
      },
    ],

    generalNotes: null,

    lockedBy: null,
    lockedAt: null,
  },
  {
    id: 'attendance-003',
    attendanceCode: 'ATT-1003',

    sessionId: 'session-003',
    sessionCode: 'SES-1003',
    sessionTitle: 'Basketball Training - Juniors',

    sessionType: 'assessment',
    sportType: 'basketball',

    date: '2026-05-22',
    dayOfWeek: 'friday',
    startTime: '18:00',
    endTime: '19:30',

    branchId: 'branch-sharjah',
    branchName: 'Sharjah Branch',

    programId: 'program-003',
    programName: 'Basketball Training',

    coachId: 'coach-003',
    coachName: 'Omar Hassan',

    facilityName: 'Indoor Court',

    sessionStatus: 'completed',

    totalStudents: 6,
    presentCount: 4,
    absentCount: 1,
    lateCount: 1,
    excusedCount: 0,
    notMarkedCount: 0,

    attendanceRate: 83,

    markedBy: 'Omar Hassan',
    markedAt: '2026-05-22T19:45:00.000Z',

    createdAt: '2026-05-22T08:00:00.000Z',
    updatedAt: '2026-05-22T19:45:00.000Z',

    session: {
      id: 'session-003',
      sessionCode: 'SES-1003',
      title: 'Basketball Training - Juniors',

      sessionType: 'assessment',
      sportType: 'basketball',

      date: '2026-05-22',
      dayOfWeek: 'friday',
      startTime: '18:00',
      endTime: '19:30',

      branchId: 'branch-sharjah',
      branchName: 'Sharjah Branch',

      programId: 'program-003',
      programName: 'Basketball Training',

      coachId: 'coach-003',
      coachName: 'Omar Hassan',

      facilityId: 'facility-sharjah-001',
      facilityName: 'Indoor Court',
    },

    students: [
      {
        id: 'student-010',
        studentCode: 'STU-1010',
        fullName: 'Hamad Saeed',
        age: 12,

        parentName: 'Saeed Hamad',
        parentPhone: '+971 56 111 2222',

        status: 'present',

        checkInTime: '17:55',
        checkOutTime: '19:30',

        lateMinutes: 0,
        notes: null,
      },
      {
        id: 'student-011',
        studentCode: 'STU-1011',
        fullName: 'Ali Nasser',
        age: 13,

        parentName: 'Nasser Ali',
        parentPhone: '+971 56 222 3333',

        status: 'late',

        checkInTime: '18:15',
        checkOutTime: '19:30',

        lateMinutes: 15,
        notes: 'Joined after warm-up.',
      },
      {
        id: 'student-012',
        studentCode: 'STU-1012',
        fullName: 'Fahad Salem',
        age: 11,

        parentName: 'Salem Fahad',
        parentPhone: '+971 56 333 4444',

        status: 'absent',

        checkInTime: null,
        checkOutTime: null,

        lateMinutes: 0,
        notes: 'Absent without prior notice.',
      },
      {
        id: 'student-013',
        studentCode: 'STU-1013',
        fullName: 'Khalifa Omar',
        age: 12,

        parentName: 'Omar Khalifa',
        parentPhone: '+971 56 444 5555',

        status: 'present',

        checkInTime: '17:58',
        checkOutTime: '19:30',

        lateMinutes: 0,
        notes: null,
      },
      {
        id: 'student-014',
        studentCode: 'STU-1014',
        fullName: 'Sultan Ahmed',
        age: 12,

        parentName: 'Ahmed Sultan',
        parentPhone: '+971 56 555 6666',

        status: 'present',

        checkInTime: '17:59',
        checkOutTime: '19:30',

        lateMinutes: 0,
        notes: null,
      },
      {
        id: 'student-015',
        studentCode: 'STU-1015',
        fullName: 'Rashed Khaled',
        age: 13,

        parentName: 'Khaled Rashed',
        parentPhone: '+971 56 666 7777',

        status: 'present',

        checkInTime: '17:57',
        checkOutTime: '19:30',

        lateMinutes: 0,
        notes: null,
      },
    ],

    generalNotes: 'Assessment attendance completed and reviewed.',

    lockedBy: null,
    lockedAt: null,
  },
  {
    id: 'attendance-004',
    attendanceCode: 'ATT-1004',

    sessionId: 'session-004',
    sessionCode: 'SES-1004',
    sessionTitle: 'Multi-Sport Trial Session',

    sessionType: 'trial_session',
    sportType: 'multi_sport',

    date: '2026-05-27',
    dayOfWeek: 'wednesday',
    startTime: '15:00',
    endTime: '16:00',

    branchId: 'branch-dubai',
    branchName: 'Dubai Branch',

    programId: 'program-004',
    programName: 'Multi-Sport Program',

    coachId: 'coach-004',
    coachName: 'Fatima Al Nuaimi',

    facilityName: 'Kids Training Zone',

    sessionStatus: 'locked',

    totalStudents: 3,
    presentCount: 2,
    absentCount: 0,
    lateCount: 0,
    excusedCount: 1,
    notMarkedCount: 0,

    attendanceRate: 100,

    markedBy: 'Fatima Al Nuaimi',
    markedAt: '2026-05-27T16:10:00.000Z',

    createdAt: '2026-05-27T08:00:00.000Z',
    updatedAt: '2026-05-27T16:30:00.000Z',

    session: {
      id: 'session-004',
      sessionCode: 'SES-1004',
      title: 'Multi-Sport Trial Session',

      sessionType: 'trial_session',
      sportType: 'multi_sport',

      date: '2026-05-27',
      dayOfWeek: 'wednesday',
      startTime: '15:00',
      endTime: '16:00',

      branchId: 'branch-dubai',
      branchName: 'Dubai Branch',

      programId: 'program-004',
      programName: 'Multi-Sport Program',

      coachId: 'coach-004',
      coachName: 'Fatima Al Nuaimi',

      facilityId: 'facility-dubai-002',
      facilityName: 'Kids Training Zone',
    },

    students: [
      {
        id: 'student-016',
        studentCode: 'STU-1016',
        fullName: 'Yara Mohamed',
        age: 6,

        parentName: 'Mohamed Adel',
        parentPhone: '+971 58 111 2222',

        status: 'present',

        checkInTime: '14:55',
        checkOutTime: '16:00',

        lateMinutes: 0,
        notes: 'Trial completed successfully.',
      },
      {
        id: 'student-017',
        studentCode: 'STU-1017',
        fullName: 'Salma Tarek',
        age: 6,

        parentName: 'Tarek Mahmoud',
        parentPhone: '+971 58 222 3333',

        status: 'excused',

        checkInTime: null,
        checkOutTime: null,

        lateMinutes: 0,
        notes: 'Parent requested excused absence.',
      },
      {
        id: 'student-018',
        studentCode: 'STU-1018',
        fullName: 'Adam Hany',
        age: 7,

        parentName: 'Hany Samir',
        parentPhone: '+971 58 333 4444',

        status: 'present',

        checkInTime: '15:00',
        checkOutTime: '16:00',

        lateMinutes: 0,
        notes: null,
      },
    ],

    generalNotes: 'Sheet locked after coach review.',

    lockedBy: 'Admin User',
    lockedAt: '2026-05-27T16:30:00.000Z',
  },
];

function toListItem(attendance: AttendanceDetailsDto): AttendanceListItemDto {
  return {
    id: attendance.id,

    attendanceCode: attendance.attendanceCode,

    sessionId: attendance.sessionId,
    sessionCode: attendance.sessionCode,
    sessionTitle: attendance.sessionTitle,

    sessionType: attendance.sessionType,
    sportType: attendance.sportType,

    date: attendance.date,
    dayOfWeek: attendance.dayOfWeek,
    startTime: attendance.startTime,
    endTime: attendance.endTime,

    branchId: attendance.branchId,
    branchName: attendance.branchName,

    programId: attendance.programId,
    programName: attendance.programName,

    coachId: attendance.coachId,
    coachName: attendance.coachName,

    facilityName: attendance.facilityName,

    sessionStatus: attendance.sessionStatus,

    totalStudents: attendance.totalStudents,
    presentCount: attendance.presentCount,
    absentCount: attendance.absentCount,
    lateCount: attendance.lateCount,
    excusedCount: attendance.excusedCount,
    notMarkedCount: attendance.notMarkedCount,

    attendanceRate: attendance.attendanceRate,

    markedBy: attendance.markedBy,
    markedAt: attendance.markedAt,

    createdAt: attendance.createdAt,
    updatedAt: attendance.updatedAt,
  };
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function createAttendanceCode() {
  const nextNumber = attendanceMockData.length + 1001;
  return `ATT-${nextNumber}`;
}

function countByStatus(
  students: AttendanceStudentDto[],
  status: AttendanceRecordStatus,
) {
  return students.filter((student) => student.status === status).length;
}

function calculateAttendanceRate(students: AttendanceStudentDto[]) {
  if (students.length === 0) return 0;

  const presentCount = countByStatus(students, 'present');
  const lateCount = countByStatus(students, 'late');
  const excusedCount = countByStatus(students, 'excused');

  const effectiveAttended = presentCount + lateCount + excusedCount;

  return Number(((effectiveAttended / students.length) * 100).toFixed(1));
}

function calculateSessionStatus(
  students: AttendanceStudentDto[],
  currentStatus?: AttendanceSessionStatus,
): AttendanceSessionStatus {
  if (currentStatus === 'locked') {
    return 'locked';
  }

  if (students.length === 0) {
    return 'not_started';
  }

  const notMarkedCount = countByStatus(students, 'not_marked');

  if (notMarkedCount === students.length) {
    return 'not_started';
  }

  if (notMarkedCount > 0) {
    return 'in_progress';
  }

  return 'completed';
}

function recalculateAttendanceSheet(
  attendance: AttendanceDetailsDto,
): AttendanceDetailsDto {
  const totalStudents = attendance.students.length;

  const presentCount = countByStatus(attendance.students, 'present');
  const absentCount = countByStatus(attendance.students, 'absent');
  const lateCount = countByStatus(attendance.students, 'late');
  const excusedCount = countByStatus(attendance.students, 'excused');
  const notMarkedCount = countByStatus(attendance.students, 'not_marked');

  const attendanceRate = calculateAttendanceRate(attendance.students);

  return {
    ...attendance,

    totalStudents,
    presentCount,
    absentCount,
    lateCount,
    excusedCount,
    notMarkedCount,

    attendanceRate,

    sessionStatus: calculateSessionStatus(
      attendance.students,
      attendance.sessionStatus,
    ),
  };
}

function getAttendanceSummary(
  attendanceSheets: AttendanceDetailsDto[],
): AttendanceSummaryDto {
  const totalAttendanceSheets = attendanceSheets.length;

  const totalStudents = attendanceSheets.reduce(
    (total, sheet) => total + sheet.totalStudents,
    0,
  );

  const totalPresent = attendanceSheets.reduce(
    (total, sheet) => total + sheet.presentCount,
    0,
  );

  const totalAbsent = attendanceSheets.reduce(
    (total, sheet) => total + sheet.absentCount,
    0,
  );

  const totalLate = attendanceSheets.reduce(
    (total, sheet) => total + sheet.lateCount,
    0,
  );

  const totalExcused = attendanceSheets.reduce(
    (total, sheet) => total + sheet.excusedCount,
    0,
  );

  const totalNotMarked = attendanceSheets.reduce(
    (total, sheet) => total + sheet.notMarkedCount,
    0,
  );

  const attendanceRateTotal = attendanceSheets.reduce(
    (total, sheet) => total + sheet.attendanceRate,
    0,
  );

  return {
    totalAttendanceSheets,

    completedSheets: attendanceSheets.filter(
      (sheet) => sheet.sessionStatus === 'completed',
    ).length,

    inProgressSheets: attendanceSheets.filter(
      (sheet) => sheet.sessionStatus === 'in_progress',
    ).length,

    notStartedSheets: attendanceSheets.filter(
      (sheet) => sheet.sessionStatus === 'not_started',
    ).length,

    lockedSheets: attendanceSheets.filter(
      (sheet) => sheet.sessionStatus === 'locked',
    ).length,

    totalStudents,
    totalPresent,
    totalAbsent,
    totalLate,
    totalExcused,
    totalNotMarked,

    averageAttendanceRate:
      totalAttendanceSheets > 0
        ? Number((attendanceRateTotal / totalAttendanceSheets).toFixed(1))
        : 0,
  };
}

function filterAttendanceSheets(
  attendanceSheets: AttendanceDetailsDto[],
  filters?: AttendanceFiltersDto,
): AttendanceDetailsDto[] {
  if (!filters) return attendanceSheets;

  return attendanceSheets.filter((sheet) => {
    const searchValue = filters.search?.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      sheet.attendanceCode.toLowerCase().includes(searchValue) ||
      sheet.sessionCode.toLowerCase().includes(searchValue) ||
      sheet.sessionTitle.toLowerCase().includes(searchValue) ||
      sheet.branchName.toLowerCase().includes(searchValue) ||
      sheet.programName.toLowerCase().includes(searchValue) ||
      sheet.coachName.toLowerCase().includes(searchValue) ||
      sheet.facilityName.toLowerCase().includes(searchValue) ||
      sheet.students.some(
        (student) =>
          student.fullName.toLowerCase().includes(searchValue) ||
          student.studentCode.toLowerCase().includes(searchValue) ||
          student.parentName.toLowerCase().includes(searchValue) ||
          student.parentPhone.toLowerCase().includes(searchValue),
      );

    const matchesSessionStatus =
      !filters.sessionStatus ||
      filters.sessionStatus === 'all' ||
      sheet.sessionStatus === filters.sessionStatus;

    const matchesRecordStatus =
      !filters.recordStatus ||
      filters.recordStatus === 'all' ||
      sheet.students.some((student) => student.status === filters.recordStatus);

    const matchesSessionType =
      !filters.sessionType ||
      filters.sessionType === 'all' ||
      sheet.sessionType === filters.sessionType;

    const matchesSport =
      !filters.sportType ||
      filters.sportType === 'all' ||
      sheet.sportType === filters.sportType;

    const matchesBranch =
      !filters.branchId ||
      filters.branchId === 'all' ||
      sheet.branchId === filters.branchId;

    const matchesProgram =
      !filters.programId ||
      filters.programId === 'all' ||
      sheet.programId === filters.programId;

    const matchesCoach =
      !filters.coachId ||
      filters.coachId === 'all' ||
      sheet.coachId === filters.coachId;

    const matchesDateFrom = !filters.dateFrom || sheet.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || sheet.date <= filters.dateTo;

    return (
      matchesSearch &&
      matchesSessionStatus &&
      matchesRecordStatus &&
      matchesSessionType &&
      matchesSport &&
      matchesBranch &&
      matchesProgram &&
      matchesCoach &&
      matchesDateFrom &&
      matchesDateTo
    );
  });
}

function buildStudentsFromRequest(
  students: MarkAttendanceStudentRequestDto[],
): AttendanceStudentDto[] {
  return students.map((student, index) => ({
    id: student.studentId,
    studentCode: `STU-${String(index + 2001).padStart(4, '0')}`,
    fullName: `Student ${index + 1}`,
    age: 8 + index,

    parentName: `Parent ${index + 1}`,
    parentPhone: '+971 50 000 0000',

    status: student.status,

    checkInTime: student.checkInTime ?? null,
    checkOutTime: student.checkOutTime ?? null,

    lateMinutes: student.lateMinutes ?? 0,
    notes: student.notes ?? null,
  }));
}

function updateStudentsFromRequest(
  currentStudents: AttendanceStudentDto[],
  students: MarkAttendanceStudentRequestDto[],
): AttendanceStudentDto[] {
  return currentStudents.map((student) => {
    const updatedStudent = students.find(
      (item) => item.studentId === student.id,
    );

    if (!updatedStudent) {
      return student;
    }

    return {
      ...student,

      status: updatedStudent.status,

      checkInTime:
        updatedStudent.checkInTime === undefined
          ? student.checkInTime
          : updatedStudent.checkInTime,

      checkOutTime:
        updatedStudent.checkOutTime === undefined
          ? student.checkOutTime
          : updatedStudent.checkOutTime,

      lateMinutes:
        updatedStudent.lateMinutes === undefined
          ? student.lateMinutes
          : updatedStudent.lateMinutes,

      notes:
        updatedStudent.notes === undefined ? student.notes : updatedStudent.notes,
    };
  });
}

export function getAttendanceStatusCounts(
  students: AttendanceStudentDto[],
): AttendanceStatusCountDto[] {
  const total = students.length;

  const statuses: AttendanceRecordStatus[] = [
    'present',
    'absent',
    'late',
    'excused',
    'not_marked',
  ];

  return statuses.map((status) => {
    const count = countByStatus(students, status);

    return {
      status,
      count,
      percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0,
    };
  });
}

export async function getAttendanceList(
  filters?: AttendanceFiltersDto,
): Promise<AttendanceListResponseDto> {
  await mockDelay();

  const normalizedData = attendanceMockData.map(recalculateAttendanceSheet);
  const filteredSheets = filterAttendanceSheets(normalizedData, filters);

  return {
    summary: getAttendanceSummary(normalizedData),
    attendanceSheets: filteredSheets.map(toListItem),
  };
}

export async function getAttendanceById(
  attendanceId: string,
): Promise<AttendanceDetailsDto | null> {
  await mockDelay();

  const attendance =
    attendanceMockData.find((sheet) => sheet.id === attendanceId) ?? null;

  if (!attendance) {
    return null;
  }

  return recalculateAttendanceSheet(attendance);
}

export async function createAttendanceSheet(
  payload: CreateAttendanceSheetRequestDto,
): Promise<AttendanceDetailsDto> {
  await mockDelay();

  const now = new Date().toISOString();

  const newAttendance: AttendanceDetailsDto = recalculateAttendanceSheet({
    id: createId('attendance'),

    attendanceCode: createAttendanceCode(),

    sessionId: payload.sessionId,
    sessionCode: payload.sessionCode,
    sessionTitle: payload.sessionTitle,

    sessionType: payload.sessionType,
    sportType: payload.sportType,

    date: payload.date,
    dayOfWeek: payload.dayOfWeek,
    startTime: payload.startTime,
    endTime: payload.endTime,

    branchId: payload.branchId,
    branchName: payload.branchName,

    programId: payload.programId,
    programName: payload.programName,

    coachId: payload.coachId,
    coachName: payload.coachName,

    facilityName: payload.facilityName,

    sessionStatus: payload.sessionStatus ?? 'not_started',

    totalStudents: 0,
    presentCount: 0,
    absentCount: 0,
    lateCount: 0,
    excusedCount: 0,
    notMarkedCount: 0,

    attendanceRate: 0,

    markedBy: payload.markedBy ?? null,
    markedAt: payload.markedBy ? now : null,

    createdAt: now,
    updatedAt: now,

    session: {
      id: payload.sessionId,
      sessionCode: payload.sessionCode,
      title: payload.sessionTitle,

      sessionType: payload.sessionType,
      sportType: payload.sportType,

      date: payload.date,
      dayOfWeek: payload.dayOfWeek,
      startTime: payload.startTime,
      endTime: payload.endTime,

      branchId: payload.branchId,
      branchName: payload.branchName,

      programId: payload.programId,
      programName: payload.programName,

      coachId: payload.coachId,
      coachName: payload.coachName,

      facilityId: payload.facilityId,
      facilityName: payload.facilityName,
    },

    students: buildStudentsFromRequest(payload.students),

    generalNotes: payload.generalNotes ?? null,

    lockedBy: null,
    lockedAt: null,
  });

  attendanceMockData = [newAttendance, ...attendanceMockData];

  return newAttendance;
}

export async function updateAttendanceSheet(
  attendanceId: string,
  payload: UpdateAttendanceSheetRequestDto,
): Promise<AttendanceDetailsDto | null> {
  await mockDelay();

  const attendanceIndex = attendanceMockData.findIndex(
    (sheet) => sheet.id === attendanceId,
  );

  if (attendanceIndex === -1) {
    return null;
  }

  const currentAttendance = attendanceMockData[attendanceIndex];
  const now = new Date().toISOString();

  const updatedStudents = payload.students
    ? updateStudentsFromRequest(currentAttendance.students, payload.students)
    : currentAttendance.students;

  const updatedAttendance: AttendanceDetailsDto = recalculateAttendanceSheet({
    ...currentAttendance,

    sessionStatus: payload.sessionStatus ?? currentAttendance.sessionStatus,

    students: updatedStudents,

    generalNotes:
      payload.generalNotes === undefined
        ? currentAttendance.generalNotes
        : payload.generalNotes,

    markedBy:
      payload.markedBy === undefined
        ? currentAttendance.markedBy
        : payload.markedBy,

    markedAt:
      payload.markedAt === undefined
        ? payload.markedBy
          ? now
          : currentAttendance.markedAt
        : payload.markedAt,

    lockedBy:
      payload.lockedBy === undefined
        ? currentAttendance.lockedBy
        : payload.lockedBy,

    lockedAt:
      payload.lockedAt === undefined
        ? payload.lockedBy
          ? now
          : currentAttendance.lockedAt
        : payload.lockedAt,

    updatedAt: now,
  });

  attendanceMockData = attendanceMockData.map((sheet) =>
    sheet.id === attendanceId ? updatedAttendance : sheet,
  );

  return updatedAttendance;
}

export async function markStudentAttendance(
  attendanceId: string,
  studentId: string,
  payload: Omit<MarkAttendanceStudentRequestDto, 'studentId'>,
): Promise<AttendanceDetailsDto | null> {
  await mockDelay();

  const attendance = attendanceMockData.find((sheet) => sheet.id === attendanceId);

  if (!attendance) {
    return null;
  }

  const now = new Date().toISOString();

  const updatedStudents = attendance.students.map((student) => {
    if (student.id !== studentId) {
      return student;
    }

    return {
      ...student,

      status: payload.status,

      checkInTime:
        payload.checkInTime === undefined
          ? student.checkInTime
          : payload.checkInTime,

      checkOutTime:
        payload.checkOutTime === undefined
          ? student.checkOutTime
          : payload.checkOutTime,

      lateMinutes:
        payload.lateMinutes === undefined
          ? student.lateMinutes
          : payload.lateMinutes,

      notes: payload.notes === undefined ? student.notes : payload.notes,
    };
  });

  const updatedAttendance = recalculateAttendanceSheet({
    ...attendance,
    students: updatedStudents,
    markedBy: attendance.markedBy ?? 'Admin User',
    markedAt: now,
    updatedAt: now,
  });

  attendanceMockData = attendanceMockData.map((sheet) =>
    sheet.id === attendanceId ? updatedAttendance : sheet,
  );

  return updatedAttendance;
}

export async function lockAttendanceSheet(
  attendanceId: string,
  lockedBy = 'Admin User',
): Promise<AttendanceDetailsDto | null> {
  await mockDelay();

  const attendance = attendanceMockData.find((sheet) => sheet.id === attendanceId);

  if (!attendance) {
    return null;
  }

  const now = new Date().toISOString();

  const updatedAttendance = recalculateAttendanceSheet({
    ...attendance,
    sessionStatus: 'locked',
    lockedBy,
    lockedAt: now,
    updatedAt: now,
  });

  attendanceMockData = attendanceMockData.map((sheet) =>
    sheet.id === attendanceId ? updatedAttendance : sheet,
  );

  return updatedAttendance;
}

export async function unlockAttendanceSheet(
  attendanceId: string,
): Promise<AttendanceDetailsDto | null> {
  await mockDelay();

  const attendance = attendanceMockData.find((sheet) => sheet.id === attendanceId);

  if (!attendance) {
    return null;
  }

  const updatedAttendance = recalculateAttendanceSheet({
    ...attendance,
    sessionStatus: 'completed',
    lockedBy: null,
    lockedAt: null,
    updatedAt: new Date().toISOString(),
  });

  attendanceMockData = attendanceMockData.map((sheet) =>
    sheet.id === attendanceId ? updatedAttendance : sheet,
  );

  return updatedAttendance;
}

export async function deleteAttendanceSheet(
  attendanceId: string,
): Promise<DeleteAttendanceSheetResponseDto> {
  await mockDelay();

  const exists = attendanceMockData.some((sheet) => sheet.id === attendanceId);

  attendanceMockData = attendanceMockData.filter(
    (sheet) => sheet.id !== attendanceId,
  );

  return {
    id: attendanceId,
    deleted: exists,
  };
}