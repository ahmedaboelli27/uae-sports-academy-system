import type {
  CoachDetailsDto,
  CoachListItemDto,
  CoachesFiltersDto,
  CoachesListResponseDto,
  CoachesSummaryDto,
  CreateCoachRequestDto,
  DeleteCoachResponseDto,
  FilterOptionDto,
  UpdateCoachRequestDto,
} from "../types/coaches.dto";

function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const branches: FilterOptionDto[] = [
  { value: "branch-dubai", label: "Dubai Branch" },
  { value: "branch-abudhabi", label: "Abu Dhabi Branch" },
  { value: "branch-sharjah", label: "Sharjah Branch" },
  { value: "branch-ajman", label: "Ajman Branch" },
];

let coachesMockData: CoachDetailsDto[] = [
  {
    id: "coach-001",
    coachCode: "COA-1001",
    fullName: "Ahmed Al Mansoori",
    gender: "male",

    phone: "+971 50 111 2233",
    email: "ahmed.coach@example.com",

    sportSpecialty: "football",
    skillLevel: "senior",
    employmentType: "full_time",

    branchId: "branch-dubai",
    branchName: "Dubai Branch",

    status: "active",
    availabilityStatus: "available",

    assignedStudentsCount: 42,
    activeProgramsCount: 3,
    weeklySessionsCount: 14,

    rating: 4.8,
    attendanceCompletionRate: 96,

    joinedAt: "2024-09-01",
    lastSessionDate: "2026-05-24",

    createdAt: "2024-09-01T08:00:00.000Z",
    updatedAt: "2026-05-24T08:00:00.000Z",

    nationality: "Emirati",
    dateOfBirth: "1988-04-12",

    address: "Dubai, Nad Al Sheba",
    emergencyContactName: "Saeed Al Mansoori",
    emergencyContactPhone: "+971 50 222 3344",

    bio: "Senior football coach with strong experience in youth development, technical drills, and academy-level training programs.",
    experienceYears: 12,

    languages: ["Arabic", "English"],
    specialties: ["Youth Football", "Ball Control", "Team Tactics"],

    assignedStudents: [
      {
        id: "student-001",
        studentCode: "ASP-1001",
        fullName: "Omar Khaled",
        age: 10,
        programName: "Football Academy",
        branchName: "Dubai Branch",
        attendanceRate: 94,
        subscriptionStatus: "active",
        paymentStatus: "paid",
      },
      {
        id: "student-005",
        studentCode: "ASP-1005",
        fullName: "Yousef Hassan",
        age: 11,
        programName: "Football Academy",
        branchName: "Dubai Branch",
        attendanceRate: 89,
        subscriptionStatus: "active",
        paymentStatus: "pending",
      },
    ],

    upcomingSessions: [
      {
        id: "session-001",
        sessionDate: "2026-05-26",
        startTime: "17:00",
        endTime: "19:00",
        programName: "Football Academy",
        branchName: "Dubai Branch",
        locationName: "Main Football Pitch",
        studentsCount: 18,
        sessionStatus: "scheduled",
      },
      {
        id: "session-002",
        sessionDate: "2026-05-28",
        startTime: "17:00",
        endTime: "19:00",
        programName: "Football Academy",
        branchName: "Dubai Branch",
        locationName: "Main Football Pitch",
        studentsCount: 20,
        sessionStatus: "scheduled",
      },
    ],

    recentSessions: [
      {
        id: "session-003",
        sessionDate: "2026-05-24",
        startTime: "17:00",
        endTime: "19:00",
        programName: "Football Academy",
        branchName: "Dubai Branch",
        locationName: "Main Football Pitch",
        studentsCount: 19,
        sessionStatus: "completed",
      },
    ],

    certifications: [
      {
        id: "cert-001",
        title: "AFC Youth Coaching Certificate",
        issuingOrganization: "Asian Football Confederation",
        issuedAt: "2022-03-15",
        expiresAt: "2027-03-15",
        documentUrl: null,
      },
    ],

    performanceMetrics: [
      {
        id: "metric-001",
        title: "Attendance Completion",
        value: 96,
        suffix: "%",
        description: "Completed attendance records across recent sessions.",
      },
      {
        id: "metric-002",
        title: "Average Rating",
        value: 4.8,
        suffix: "/5",
        description: "Average internal performance rating.",
      },
    ],

    notes: "Strong leadership skills and excellent communication with parents.",
  },
  {
    id: "coach-002",
    coachCode: "COA-1002",
    fullName: "Sara Khaled",
    gender: "female",

    phone: "+971 55 333 4455",
    email: "sara.coach@example.com",

    sportSpecialty: "swimming",
    skillLevel: "expert",
    employmentType: "full_time",

    branchId: "branch-abudhabi",
    branchName: "Abu Dhabi Branch",

    status: "active",
    availabilityStatus: "busy",

    assignedStudentsCount: 36,
    activeProgramsCount: 2,
    weeklySessionsCount: 16,

    rating: 4.9,
    attendanceCompletionRate: 98,

    joinedAt: "2023-01-10",
    lastSessionDate: "2026-05-23",

    createdAt: "2023-01-10T08:00:00.000Z",
    updatedAt: "2026-05-23T08:00:00.000Z",

    nationality: "Egyptian",
    dateOfBirth: "1990-06-21",

    address: "Abu Dhabi, Khalifa City",
    emergencyContactName: "Mona Khaled",
    emergencyContactPhone: "+971 55 444 5566",

    bio: "Expert swimming coach specialized in beginner confidence, water safety, and structured progress plans for children.",
    experienceYears: 10,

    languages: ["Arabic", "English"],
    specialties: ["Swimming Basics", "Water Safety", "Kids Confidence"],

    assignedStudents: [
      {
        id: "student-002",
        studentCode: "ASP-1002",
        fullName: "Mariam Ali",
        age: 8,
        programName: "Swimming Program",
        branchName: "Abu Dhabi Branch",
        attendanceRate: 88,
        subscriptionStatus: "expiring_soon",
        paymentStatus: "pending",
      },
    ],

    upcomingSessions: [
      {
        id: "session-004",
        sessionDate: "2026-05-27",
        startTime: "16:00",
        endTime: "17:00",
        programName: "Swimming Program",
        branchName: "Abu Dhabi Branch",
        locationName: "Indoor Pool",
        studentsCount: 10,
        sessionStatus: "scheduled",
      },
    ],

    recentSessions: [
      {
        id: "session-005",
        sessionDate: "2026-05-23",
        startTime: "16:00",
        endTime: "17:00",
        programName: "Swimming Program",
        branchName: "Abu Dhabi Branch",
        locationName: "Indoor Pool",
        studentsCount: 9,
        sessionStatus: "completed",
      },
    ],

    certifications: [
      {
        id: "cert-002",
        title: "Lifeguard & Water Safety Instructor",
        issuingOrganization: "International Swimming Federation",
        issuedAt: "2021-02-01",
        expiresAt: "2026-02-01",
        documentUrl: null,
      },
    ],

    performanceMetrics: [
      {
        id: "metric-003",
        title: "Attendance Completion",
        value: 98,
        suffix: "%",
        description: "Completed attendance records across swimming sessions.",
      },
      {
        id: "metric-004",
        title: "Average Rating",
        value: 4.9,
        suffix: "/5",
        description: "Average internal performance rating.",
      },
    ],

    notes: "Excellent with beginner students and safety-focused training.",
  },
  {
    id: "coach-003",
    coachCode: "COA-1003",
    fullName: "Omar Hassan",
    gender: "male",

    phone: "+971 52 777 8899",
    email: "omar.coach@example.com",

    sportSpecialty: "basketball",
    skillLevel: "senior",
    employmentType: "part_time",

    branchId: "branch-sharjah",
    branchName: "Sharjah Branch",

    status: "active",
    availabilityStatus: "limited",

    assignedStudentsCount: 24,
    activeProgramsCount: 1,
    weeklySessionsCount: 8,

    rating: 4.6,
    attendanceCompletionRate: 91,

    joinedAt: "2024-02-15",
    lastSessionDate: "2026-05-22",

    createdAt: "2024-02-15T08:00:00.000Z",
    updatedAt: "2026-05-22T08:00:00.000Z",

    nationality: "Jordanian",
    dateOfBirth: "1987-11-04",

    address: "Sharjah, University City",
    emergencyContactName: "Hassan Omar",
    emergencyContactPhone: "+971 52 111 4422",

    bio: "Basketball coach focused on shooting mechanics, agility, warm-up discipline, and teamwork.",
    experienceYears: 9,

    languages: ["Arabic", "English"],
    specialties: ["Shooting Drills", "Agility", "Teamwork"],

    assignedStudents: [
      {
        id: "student-003",
        studentCode: "ASP-1003",
        fullName: "Noah Smith",
        age: 12,
        programName: "Basketball Training",
        branchName: "Sharjah Branch",
        attendanceRate: 79,
        subscriptionStatus: "expired",
        paymentStatus: "overdue",
      },
    ],

    upcomingSessions: [
      {
        id: "session-006",
        sessionDate: "2026-05-29",
        startTime: "18:00",
        endTime: "20:00",
        programName: "Basketball Training",
        branchName: "Sharjah Branch",
        locationName: "Indoor Court",
        studentsCount: 12,
        sessionStatus: "scheduled",
      },
    ],

    recentSessions: [
      {
        id: "session-007",
        sessionDate: "2026-05-22",
        startTime: "18:00",
        endTime: "20:00",
        programName: "Basketball Training",
        branchName: "Sharjah Branch",
        locationName: "Indoor Court",
        studentsCount: 11,
        sessionStatus: "completed",
      },
    ],

    certifications: [
      {
        id: "cert-003",
        title: "Youth Basketball Coaching License",
        issuingOrganization: "UAE Basketball Association",
        issuedAt: "2023-05-10",
        expiresAt: "2028-05-10",
        documentUrl: null,
      },
    ],

    performanceMetrics: [
      {
        id: "metric-005",
        title: "Attendance Completion",
        value: 91,
        suffix: "%",
        description: "Completed attendance records across basketball sessions.",
      },
      {
        id: "metric-006",
        title: "Average Rating",
        value: 4.6,
        suffix: "/5",
        description: "Average internal performance rating.",
      },
    ],

    notes: "Part-time availability. Best scheduled on weekends.",
  },
  {
    id: "coach-004",
    coachCode: "COA-1004",
    fullName: "Fatima Al Nuaimi",
    gender: "female",

    phone: "+971 56 555 6677",
    email: "fatima.coach@example.com",

    sportSpecialty: "multi_sport",
    skillLevel: "mid_level",
    employmentType: "contract",

    branchId: "branch-dubai",
    branchName: "Dubai Branch",

    status: "on_leave",
    availabilityStatus: "unavailable",

    assignedStudentsCount: 18,
    activeProgramsCount: 1,
    weeklySessionsCount: 6,

    rating: 4.4,
    attendanceCompletionRate: 88,

    joinedAt: "2025-03-01",
    lastSessionDate: "2026-05-15",

    createdAt: "2025-03-01T08:00:00.000Z",
    updatedAt: "2026-05-15T08:00:00.000Z",

    nationality: "Emirati",
    dateOfBirth: "1994-08-19",

    address: "Dubai, Mirdif",
    emergencyContactName: "Maryam Al Nuaimi",
    emergencyContactPhone: "+971 56 999 1122",

    bio: "Multi-sport coach focused on early-age movement development, coordination, and confidence building.",
    experienceYears: 5,

    languages: ["Arabic", "English"],
    specialties: ["Movement Skills", "Coordination", "Kids Fitness"],

    assignedStudents: [
      {
        id: "student-004",
        studentCode: "ASP-1004",
        fullName: "Layla Hassan",
        age: 7,
        programName: "Multi-Sport Program",
        branchName: "Dubai Branch",
        attendanceRate: 0,
        subscriptionStatus: "not_started",
        paymentStatus: "refunded",
      },
    ],

    upcomingSessions: [],

    recentSessions: [
      {
        id: "session-008",
        sessionDate: "2026-05-15",
        startTime: "15:00",
        endTime: "16:00",
        programName: "Multi-Sport Program",
        branchName: "Dubai Branch",
        locationName: "Kids Training Zone",
        studentsCount: 8,
        sessionStatus: "completed",
      },
    ],

    certifications: [
      {
        id: "cert-004",
        title: "Kids Fitness Coaching Certificate",
        issuingOrganization: "International Fitness Academy",
        issuedAt: "2024-07-12",
        expiresAt: null,
        documentUrl: null,
      },
    ],

    performanceMetrics: [
      {
        id: "metric-007",
        title: "Attendance Completion",
        value: 88,
        suffix: "%",
        description: "Completed attendance records across multi-sport sessions.",
      },
      {
        id: "metric-008",
        title: "Average Rating",
        value: 4.4,
        suffix: "/5",
        description: "Average internal performance rating.",
      },
    ],

    notes: "Currently on leave. Do not assign new sessions until availability changes.",
  },
];

function toListItem(coach: CoachDetailsDto): CoachListItemDto {
  return {
    id: coach.id,

    coachCode: coach.coachCode,
    fullName: coach.fullName,
    gender: coach.gender,

    phone: coach.phone,
    email: coach.email,

    sportSpecialty: coach.sportSpecialty,
    skillLevel: coach.skillLevel,
    employmentType: coach.employmentType,

    branchId: coach.branchId,
    branchName: coach.branchName,

    status: coach.status,
    availabilityStatus: coach.availabilityStatus,

    assignedStudentsCount: coach.assignedStudentsCount,
    activeProgramsCount: coach.activeProgramsCount,
    weeklySessionsCount: coach.weeklySessionsCount,

    rating: coach.rating,
    attendanceCompletionRate: coach.attendanceCompletionRate,

    joinedAt: coach.joinedAt,
    lastSessionDate: coach.lastSessionDate,

    createdAt: coach.createdAt,
    updatedAt: coach.updatedAt,
  };
}

function getCoachesSummary(coaches: CoachDetailsDto[]): CoachesSummaryDto {
  const totalCoaches = coaches.length;

  const totalRating = coaches.reduce((total, coach) => total + coach.rating, 0);

  const totalAttendanceCompletion = coaches.reduce(
    (total, coach) => total + coach.attendanceCompletionRate,
    0,
  );

  return {
    totalCoaches,
    activeCoaches: coaches.filter((coach) => coach.status === "active").length,
    availableCoaches: coaches.filter(
      (coach) => coach.availabilityStatus === "available",
    ).length,
    onLeaveCoaches: coaches.filter((coach) => coach.status === "on_leave")
      .length,
    suspendedCoaches: coaches.filter((coach) => coach.status === "suspended")
      .length,
    totalAssignedStudents: coaches.reduce(
      (total, coach) => total + coach.assignedStudentsCount,
      0,
    ),
    averageRating: totalCoaches > 0 ? Number((totalRating / totalCoaches).toFixed(1)) : 0,
    averageAttendanceCompletionRate:
      totalCoaches > 0
        ? Number((totalAttendanceCompletion / totalCoaches).toFixed(1))
        : 0,
  };
}

function filterCoaches(
  coaches: CoachDetailsDto[],
  filters?: CoachesFiltersDto,
): CoachDetailsDto[] {
  if (!filters) return coaches;

  return coaches.filter((coach) => {
    const searchValue = filters.search?.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      coach.fullName.toLowerCase().includes(searchValue) ||
      coach.coachCode.toLowerCase().includes(searchValue) ||
      coach.phone.toLowerCase().includes(searchValue) ||
      coach.email.toLowerCase().includes(searchValue) ||
      coach.branchName.toLowerCase().includes(searchValue);

    const matchesBranch =
      !filters.branchId ||
      filters.branchId === "all" ||
      coach.branchId === filters.branchId;

    const matchesSport =
      !filters.sportSpecialty ||
      filters.sportSpecialty === "all" ||
      coach.sportSpecialty === filters.sportSpecialty;

    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      coach.status === filters.status;

    const matchesAvailability =
      !filters.availabilityStatus ||
      filters.availabilityStatus === "all" ||
      coach.availabilityStatus === filters.availabilityStatus;

    const matchesEmployment =
      !filters.employmentType ||
      filters.employmentType === "all" ||
      coach.employmentType === filters.employmentType;

    const matchesSkillLevel =
      !filters.skillLevel ||
      filters.skillLevel === "all" ||
      coach.skillLevel === filters.skillLevel;

    return (
      matchesSearch &&
      matchesBranch &&
      matchesSport &&
      matchesStatus &&
      matchesAvailability &&
      matchesEmployment &&
      matchesSkillLevel
    );
  });
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function getBranchName(branchId: string): string {
  return (
    branches.find((branch) => branch.value === branchId)?.label ??
    "Unknown Branch"
  );
}

function createCoachCode(): string {
  const nextNumber = coachesMockData.length + 1001;
  return `COA-${nextNumber}`;
}

export async function getCoachesList(
  filters?: CoachesFiltersDto,
): Promise<CoachesListResponseDto> {
  await mockDelay();

  const filteredCoaches = filterCoaches(coachesMockData, filters);

  return {
    summary: getCoachesSummary(coachesMockData),
    coaches: filteredCoaches.map(toListItem),
    filters: {
      branches,
    },
  };
}

export async function getCoachById(
  coachId: string,
): Promise<CoachDetailsDto | null> {
  await mockDelay();

  return coachesMockData.find((coach) => coach.id === coachId) ?? null;
}

export async function createCoach(
  payload: CreateCoachRequestDto,
): Promise<CoachDetailsDto> {
  await mockDelay();

  const now = new Date().toISOString();

  const newCoach: CoachDetailsDto = {
    id: createId("coach"),

    coachCode: createCoachCode(),
    fullName: payload.fullName,
    gender: payload.gender,

    phone: payload.phone,
    email: payload.email,

    sportSpecialty: payload.sportSpecialty,
    skillLevel: payload.skillLevel,
    employmentType: payload.employmentType,

    branchId: payload.branchId,
    branchName: getBranchName(payload.branchId),

    status: payload.status ?? "active",
    availabilityStatus: payload.availabilityStatus ?? "available",

    assignedStudentsCount: 0,
    activeProgramsCount: 0,
    weeklySessionsCount: 0,

    rating: 0,
    attendanceCompletionRate: 0,

    joinedAt: now.slice(0, 10),
    lastSessionDate: null,

    createdAt: now,
    updatedAt: now,

    nationality: payload.nationality ?? null,
    dateOfBirth: payload.dateOfBirth ?? null,

    address: payload.address ?? null,
    emergencyContactName: payload.emergencyContactName ?? null,
    emergencyContactPhone: payload.emergencyContactPhone ?? null,

    bio: payload.bio ?? null,
    experienceYears: payload.experienceYears ?? 0,

    languages: payload.languages ?? [],
    specialties: payload.specialties ?? [],

    assignedStudents: [],
    upcomingSessions: [],
    recentSessions: [],
    certifications: [],
    performanceMetrics: [],

    notes: payload.notes ?? null,
  };

  coachesMockData = [newCoach, ...coachesMockData];

  return newCoach;
}

export async function updateCoach(
  coachId: string,
  payload: UpdateCoachRequestDto,
): Promise<CoachDetailsDto | null> {
  await mockDelay();

  const coachIndex = coachesMockData.findIndex((coach) => coach.id === coachId);

  if (coachIndex === -1) {
    return null;
  }

  const currentCoach = coachesMockData[coachIndex];
  const now = new Date().toISOString();

  const updatedCoach: CoachDetailsDto = {
    ...currentCoach,

    fullName: payload.fullName ?? currentCoach.fullName,
    gender: payload.gender ?? currentCoach.gender,

    phone: payload.phone ?? currentCoach.phone,
    email: payload.email ?? currentCoach.email,

    sportSpecialty: payload.sportSpecialty ?? currentCoach.sportSpecialty,
    skillLevel: payload.skillLevel ?? currentCoach.skillLevel,
    employmentType: payload.employmentType ?? currentCoach.employmentType,

    branchId: payload.branchId ?? currentCoach.branchId,
    branchName: payload.branchId
      ? getBranchName(payload.branchId)
      : currentCoach.branchName,

    status: payload.status ?? currentCoach.status,
    availabilityStatus:
      payload.availabilityStatus ?? currentCoach.availabilityStatus,

    nationality: payload.nationality ?? currentCoach.nationality,
    dateOfBirth: payload.dateOfBirth ?? currentCoach.dateOfBirth,

    address: payload.address ?? currentCoach.address,
    emergencyContactName:
      payload.emergencyContactName ?? currentCoach.emergencyContactName,
    emergencyContactPhone:
      payload.emergencyContactPhone ?? currentCoach.emergencyContactPhone,

    bio: payload.bio ?? currentCoach.bio,
    experienceYears: payload.experienceYears ?? currentCoach.experienceYears,

    languages: payload.languages ?? currentCoach.languages,
    specialties: payload.specialties ?? currentCoach.specialties,

    rating: payload.rating ?? currentCoach.rating,
    attendanceCompletionRate:
      payload.attendanceCompletionRate ??
      currentCoach.attendanceCompletionRate,

    notes: payload.notes ?? currentCoach.notes,

    updatedAt: now,
  };

  coachesMockData = coachesMockData.map((coach) =>
    coach.id === coachId ? updatedCoach : coach,
  );

  return updatedCoach;
}

export async function deleteCoach(
  coachId: string,
): Promise<DeleteCoachResponseDto> {
  await mockDelay();

  const exists = coachesMockData.some((coach) => coach.id === coachId);

  coachesMockData = coachesMockData.filter((coach) => coach.id !== coachId);

  return {
    id: coachId,
    deleted: exists,
  };
}