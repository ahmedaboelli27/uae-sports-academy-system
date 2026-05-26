import type {
  CreateProgramRequestDto,
  DeleteProgramResponseDto,
  ProgramDetailsDto,
  ProgramListItemDto,
  ProgramsFiltersDto,
  ProgramsListResponseDto,
  ProgramsSummaryDto,
  UpdateProgramRequestDto,
} from "../types/programs.dto";

function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

let programsMockData: ProgramDetailsDto[] = [
  {
    id: "program-001",
    programCode: "PRO-1001",
    name: "Football Academy",
    shortDescription:
      "Structured football development program for young players.",
    description:
      "A complete football academy program focused on technical skills, teamwork, match awareness, discipline, and physical development for young athletes.",

    sportType: "football",
    level: "beginner",
    ageGroup: "kids",

    status: "active",
    enrollmentStatus: "open",

    minAge: 6,
    maxAge: 14,

    branchesCount: 2,
    coachesCount: 2,
    enrolledStudentsCount: 68,
    capacity: 100,

    monthlyPrice: 950,
    currency: "AED",

    rating: 4.8,
    attendanceAverage: 94,

    createdAt: "2025-01-10T08:00:00.000Z",
    updatedAt: "2026-05-20T08:00:00.000Z",

    objectives: [
      "Develop ball control and passing accuracy",
      "Improve teamwork and tactical awareness",
      "Build discipline and confidence",
    ],
    requirements: [
      "Sports kit",
      "Football shoes",
      "Water bottle",
      "Parent approval",
    ],

    durationWeeks: 12,
    sessionsPerWeek: 3,
    sessionDurationMinutes: 90,

    branches: [
      {
        id: "branch-dubai",
        name: "Dubai Branch",
        city: "Dubai",
        capacity: 60,
        enrolledStudentsCount: 42,
      },
      {
        id: "branch-sharjah",
        name: "Sharjah Branch",
        city: "Sharjah",
        capacity: 40,
        enrolledStudentsCount: 26,
      },
    ],

    coaches: [
      {
        id: "coach-001",
        coachCode: "COA-1001",
        fullName: "Ahmed Al Mansoori",
        sportSpecialty: "football",
        rating: 4.8,
        status: "active",
      },
      {
        id: "coach-003",
        coachCode: "COA-1003",
        fullName: "Omar Hassan",
        sportSpecialty: "football",
        rating: 4.6,
        status: "active",
      },
    ],

    schedule: [
      {
        id: "slot-001",
        dayOfWeek: "sunday",
        startTime: "17:00",
        endTime: "18:30",
        branchId: "branch-dubai",
        branchName: "Dubai Branch",
        locationName: "Main Football Pitch",
        coachId: "coach-001",
        coachName: "Ahmed Al Mansoori",
      },
      {
        id: "slot-002",
        dayOfWeek: "tuesday",
        startTime: "17:00",
        endTime: "18:30",
        branchId: "branch-dubai",
        branchName: "Dubai Branch",
        locationName: "Main Football Pitch",
        coachId: "coach-001",
        coachName: "Ahmed Al Mansoori",
      },
      {
        id: "slot-003",
        dayOfWeek: "thursday",
        startTime: "17:00",
        endTime: "18:30",
        branchId: "branch-sharjah",
        branchName: "Sharjah Branch",
        locationName: "Outdoor Pitch",
        coachId: "coach-003",
        coachName: "Omar Hassan",
      },
    ],

    pricing: [
      {
        id: "price-001",
        cycle: "monthly",
        price: 950,
        currency: "AED",
        sessionsCount: null,
        isRecommended: true,
      },
      {
        id: "price-002",
        cycle: "quarterly",
        price: 2550,
        currency: "AED",
        sessionsCount: null,
        isRecommended: false,
      },
    ],

    performanceMetrics: [
      {
        id: "metric-001",
        title: "Attendance Average",
        value: 94,
        suffix: "%",
        description: "Average attendance across football academy sessions.",
      },
      {
        id: "metric-002",
        title: "Program Rating",
        value: 4.8,
        suffix: "/5",
        description: "Average internal rating for this program.",
      },
    ],

    coverImageUrl: null,
    notes: "Core academy program with strong demand from parents.",
  },
  {
    id: "program-002",
    programCode: "PRO-1002",
    name: "Swimming Program",
    shortDescription:
      "Swimming development program focused on safety and confidence.",
    description:
      "A structured swimming program designed to improve water confidence, safety awareness, breathing, floating, and basic to advanced swimming techniques.",

    sportType: "swimming",
    level: "all_levels",
    ageGroup: "kids",

    status: "active",
    enrollmentStatus: "limited",

    minAge: 5,
    maxAge: 13,

    branchesCount: 1,
    coachesCount: 1,
    enrolledStudentsCount: 36,
    capacity: 45,

    monthlyPrice: 1100,
    currency: "AED",

    rating: 4.9,
    attendanceAverage: 96,

    createdAt: "2025-02-01T08:00:00.000Z",
    updatedAt: "2026-05-21T08:00:00.000Z",

    objectives: [
      "Improve water confidence",
      "Teach safe swimming habits",
      "Develop breathing and floating techniques",
    ],
    requirements: [
      "Swimming suit",
      "Swimming cap",
      "Goggles",
      "Towel",
    ],

    durationWeeks: 10,
    sessionsPerWeek: 2,
    sessionDurationMinutes: 60,

    branches: [
      {
        id: "branch-abudhabi",
        name: "Abu Dhabi Branch",
        city: "Abu Dhabi",
        capacity: 45,
        enrolledStudentsCount: 36,
      },
    ],

    coaches: [
      {
        id: "coach-002",
        coachCode: "COA-1002",
        fullName: "Sara Khaled",
        sportSpecialty: "swimming",
        rating: 4.9,
        status: "active",
      },
    ],

    schedule: [
      {
        id: "slot-004",
        dayOfWeek: "monday",
        startTime: "16:00",
        endTime: "17:00",
        branchId: "branch-abudhabi",
        branchName: "Abu Dhabi Branch",
        locationName: "Indoor Pool",
        coachId: "coach-002",
        coachName: "Sara Khaled",
      },
      {
        id: "slot-005",
        dayOfWeek: "wednesday",
        startTime: "16:00",
        endTime: "17:00",
        branchId: "branch-abudhabi",
        branchName: "Abu Dhabi Branch",
        locationName: "Indoor Pool",
        coachId: "coach-002",
        coachName: "Sara Khaled",
      },
    ],

    pricing: [
      {
        id: "price-003",
        cycle: "monthly",
        price: 1100,
        currency: "AED",
        sessionsCount: null,
        isRecommended: true,
      },
      {
        id: "price-004",
        cycle: "per_session",
        price: 150,
        currency: "AED",
        sessionsCount: 1,
        isRecommended: false,
      },
    ],

    performanceMetrics: [
      {
        id: "metric-003",
        title: "Attendance Average",
        value: 96,
        suffix: "%",
        description: "Average attendance across swimming sessions.",
      },
      {
        id: "metric-004",
        title: "Program Rating",
        value: 4.9,
        suffix: "/5",
        description: "Average internal rating for this program.",
      },
    ],

    coverImageUrl: null,
    notes: "Limited capacity because of pool lane availability.",
  },
  {
    id: "program-003",
    programCode: "PRO-1003",
    name: "Basketball Training",
    shortDescription:
      "Basketball training focused on shooting, agility, and teamwork.",
    description:
      "A basketball training program designed to develop shooting mechanics, dribbling, agility, defensive awareness, teamwork, and game discipline.",

    sportType: "basketball",
    level: "intermediate",
    ageGroup: "juniors",

    status: "active",
    enrollmentStatus: "open",

    minAge: 9,
    maxAge: 16,

    branchesCount: 1,
    coachesCount: 1,
    enrolledStudentsCount: 24,
    capacity: 40,

    monthlyPrice: 900,
    currency: "AED",

    rating: 4.6,
    attendanceAverage: 91,

    createdAt: "2025-03-15T08:00:00.000Z",
    updatedAt: "2026-05-22T08:00:00.000Z",

    objectives: [
      "Improve shooting form",
      "Build agility and movement",
      "Develop teamwork and game awareness",
    ],
    requirements: [
      "Basketball shoes",
      "Sportswear",
      "Water bottle",
    ],

    durationWeeks: 12,
    sessionsPerWeek: 2,
    sessionDurationMinutes: 90,

    branches: [
      {
        id: "branch-sharjah",
        name: "Sharjah Branch",
        city: "Sharjah",
        capacity: 40,
        enrolledStudentsCount: 24,
      },
    ],

    coaches: [
      {
        id: "coach-003",
        coachCode: "COA-1003",
        fullName: "Omar Hassan",
        sportSpecialty: "basketball",
        rating: 4.6,
        status: "active",
      },
    ],

    schedule: [
      {
        id: "slot-006",
        dayOfWeek: "friday",
        startTime: "18:00",
        endTime: "19:30",
        branchId: "branch-sharjah",
        branchName: "Sharjah Branch",
        locationName: "Indoor Court",
        coachId: "coach-003",
        coachName: "Omar Hassan",
      },
      {
        id: "slot-007",
        dayOfWeek: "saturday",
        startTime: "18:00",
        endTime: "19:30",
        branchId: "branch-sharjah",
        branchName: "Sharjah Branch",
        locationName: "Indoor Court",
        coachId: "coach-003",
        coachName: "Omar Hassan",
      },
    ],

    pricing: [
      {
        id: "price-005",
        cycle: "monthly",
        price: 900,
        currency: "AED",
        sessionsCount: null,
        isRecommended: true,
      },
    ],

    performanceMetrics: [
      {
        id: "metric-005",
        title: "Attendance Average",
        value: 91,
        suffix: "%",
        description: "Average attendance across basketball sessions.",
      },
      {
        id: "metric-006",
        title: "Program Rating",
        value: 4.6,
        suffix: "/5",
        description: "Average internal rating for this program.",
      },
    ],

    coverImageUrl: null,
    notes: "Weekend-focused program with moderate capacity.",
  },
  {
    id: "program-004",
    programCode: "PRO-1004",
    name: "Multi-Sport Program",
    shortDescription:
      "Early-age multi-sport program for movement and coordination.",
    description:
      "A multi-sport program for younger children focused on movement skills, coordination, confidence, balance, basic fitness, and positive sport habits.",

    sportType: "multi_sport",
    level: "beginner",
    ageGroup: "kids",

    status: "seasonal",
    enrollmentStatus: "closed",

    minAge: 4,
    maxAge: 8,

    branchesCount: 1,
    coachesCount: 1,
    enrolledStudentsCount: 18,
    capacity: 20,

    monthlyPrice: 800,
    currency: "AED",

    rating: 4.4,
    attendanceAverage: 88,

    createdAt: "2025-05-01T08:00:00.000Z",
    updatedAt: "2026-05-15T08:00:00.000Z",

    objectives: [
      "Develop movement skills",
      "Build coordination and balance",
      "Encourage confidence and teamwork",
    ],
    requirements: [
      "Comfortable sportswear",
      "Water bottle",
      "Parent approval",
    ],

    durationWeeks: 8,
    sessionsPerWeek: 2,
    sessionDurationMinutes: 60,

    branches: [
      {
        id: "branch-dubai",
        name: "Dubai Branch",
        city: "Dubai",
        capacity: 20,
        enrolledStudentsCount: 18,
      },
    ],

    coaches: [
      {
        id: "coach-004",
        coachCode: "COA-1004",
        fullName: "Fatima Al Nuaimi",
        sportSpecialty: "multi_sport",
        rating: 4.4,
        status: "on_leave",
      },
    ],

    schedule: [
      {
        id: "slot-008",
        dayOfWeek: "saturday",
        startTime: "15:00",
        endTime: "16:00",
        branchId: "branch-dubai",
        branchName: "Dubai Branch",
        locationName: "Kids Training Zone",
        coachId: "coach-004",
        coachName: "Fatima Al Nuaimi",
      },
    ],

    pricing: [
      {
        id: "price-006",
        cycle: "monthly",
        price: 800,
        currency: "AED",
        sessionsCount: null,
        isRecommended: true,
      },
    ],

    performanceMetrics: [
      {
        id: "metric-007",
        title: "Attendance Average",
        value: 88,
        suffix: "%",
        description: "Average attendance across multi-sport sessions.",
      },
      {
        id: "metric-008",
        title: "Program Rating",
        value: 4.4,
        suffix: "/5",
        description: "Average internal rating for this program.",
      },
    ],

    coverImageUrl: null,
    notes: "Seasonal program. Enrollment currently closed.",
  },
];

function toListItem(program: ProgramDetailsDto): ProgramListItemDto {
  return {
    id: program.id,

    programCode: program.programCode,
    name: program.name,
    shortDescription: program.shortDescription,

    sportType: program.sportType,
    level: program.level,
    ageGroup: program.ageGroup,

    status: program.status,
    enrollmentStatus: program.enrollmentStatus,

    minAge: program.minAge,
    maxAge: program.maxAge,

    branchesCount: program.branchesCount,
    coachesCount: program.coachesCount,
    enrolledStudentsCount: program.enrolledStudentsCount,
    capacity: program.capacity,

    monthlyPrice: program.monthlyPrice,
    currency: program.currency,

    rating: program.rating,
    attendanceAverage: program.attendanceAverage,

    createdAt: program.createdAt,
    updatedAt: program.updatedAt,
  };
}

function getProgramsSummary(programs: ProgramDetailsDto[]): ProgramsSummaryDto {
  const totalPrograms = programs.length;

  const totalAttendance = programs.reduce(
    (total, program) => total + program.attendanceAverage,
    0,
  );

  const totalRating = programs.reduce(
    (total, program) => total + program.rating,
    0,
  );

  return {
    totalPrograms,
    activePrograms: programs.filter((program) => program.status === "active")
      .length,
    draftPrograms: programs.filter((program) => program.status === "draft")
      .length,
    seasonalPrograms: programs.filter((program) => program.status === "seasonal")
      .length,
    openEnrollmentPrograms: programs.filter(
      (program) => program.enrollmentStatus === "open",
    ).length,
    fullPrograms: programs.filter((program) => program.enrollmentStatus === "full")
      .length,
    totalEnrolledStudents: programs.reduce(
      (total, program) => total + program.enrolledStudentsCount,
      0,
    ),
    totalCapacity: programs.reduce(
      (total, program) => total + program.capacity,
      0,
    ),
    averageAttendance:
      totalPrograms > 0 ? Number((totalAttendance / totalPrograms).toFixed(1)) : 0,
    averageRating:
      totalPrograms > 0 ? Number((totalRating / totalPrograms).toFixed(1)) : 0,
  };
}

function filterPrograms(
  programs: ProgramDetailsDto[],
  filters?: ProgramsFiltersDto,
): ProgramDetailsDto[] {
  if (!filters) return programs;

  return programs.filter((program) => {
    const searchValue = filters.search?.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      program.name.toLowerCase().includes(searchValue) ||
      program.programCode.toLowerCase().includes(searchValue) ||
      program.shortDescription.toLowerCase().includes(searchValue) ||
      program.description.toLowerCase().includes(searchValue);

    const matchesSport =
      !filters.sportType ||
      filters.sportType === "all" ||
      program.sportType === filters.sportType;

    const matchesLevel =
      !filters.level ||
      filters.level === "all" ||
      program.level === filters.level;

    const matchesAgeGroup =
      !filters.ageGroup ||
      filters.ageGroup === "all" ||
      program.ageGroup === filters.ageGroup;

    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      program.status === filters.status;

    const matchesEnrollment =
      !filters.enrollmentStatus ||
      filters.enrollmentStatus === "all" ||
      program.enrollmentStatus === filters.enrollmentStatus;

    return (
      matchesSearch &&
      matchesSport &&
      matchesLevel &&
      matchesAgeGroup &&
      matchesStatus &&
      matchesEnrollment
    );
  });
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function createProgramCode(): string {
  const nextNumber = programsMockData.length + 1001;
  return `PRO-${nextNumber}`;
}

function createDefaultPricing(
  programId: string,
  monthlyPrice: number,
): ProgramDetailsDto["pricing"] {
  return [
    {
      id: `${programId}-price-monthly`,
      cycle: "monthly",
      price: monthlyPrice,
      currency: "AED",
      sessionsCount: null,
      isRecommended: true,
    },
  ];
}

function createDefaultPerformanceMetrics(
  programId: string,
): ProgramDetailsDto["performanceMetrics"] {
  return [
    {
      id: `${programId}-metric-attendance`,
      title: "Attendance Average",
      value: 0,
      suffix: "%",
      description: "Average attendance across this program sessions.",
    },
    {
      id: `${programId}-metric-rating`,
      title: "Program Rating",
      value: 0,
      suffix: "/5",
      description: "Average internal rating for this program.",
    },
  ];
}

export async function getProgramsList(
  filters?: ProgramsFiltersDto,
): Promise<ProgramsListResponseDto> {
  await mockDelay();

  const filteredPrograms = filterPrograms(programsMockData, filters);

  return {
    summary: getProgramsSummary(programsMockData),
    programs: filteredPrograms.map(toListItem),
  };
}

export async function getProgramById(
  programId: string,
): Promise<ProgramDetailsDto | null> {
  await mockDelay();

  return programsMockData.find((program) => program.id === programId) ?? null;
}

export async function createProgram(
  payload: CreateProgramRequestDto,
): Promise<ProgramDetailsDto> {
  await mockDelay();

  const now = new Date().toISOString();
  const programId = createId("program");

  const newProgram: ProgramDetailsDto = {
    id: programId,

    programCode: createProgramCode(),
    name: payload.name,
    shortDescription: payload.shortDescription,
    description: payload.description,

    sportType: payload.sportType,
    level: payload.level,
    ageGroup: payload.ageGroup,

    status: payload.status ?? "draft",
    enrollmentStatus: payload.enrollmentStatus ?? "closed",

    minAge: payload.minAge,
    maxAge: payload.maxAge,

    branchesCount: 0,
    coachesCount: 0,
    enrolledStudentsCount: 0,
    capacity: 0,

    monthlyPrice: payload.monthlyPrice,
    currency: payload.currency ?? "AED",

    rating: 0,
    attendanceAverage: 0,

    createdAt: now,
    updatedAt: now,

    objectives: payload.objectives ?? [],
    requirements: payload.requirements ?? [],

    durationWeeks: payload.durationWeeks,
    sessionsPerWeek: payload.sessionsPerWeek,
    sessionDurationMinutes: payload.sessionDurationMinutes,

    branches: [],
    coaches: [],
    schedule: [],
    pricing: createDefaultPricing(programId, payload.monthlyPrice),
    performanceMetrics: createDefaultPerformanceMetrics(programId),

    coverImageUrl: payload.coverImageUrl ?? null,
    notes: payload.notes ?? null,
  };

  programsMockData = [newProgram, ...programsMockData];

  return newProgram;
}

export async function updateProgram(
  programId: string,
  payload: UpdateProgramRequestDto,
): Promise<ProgramDetailsDto | null> {
  await mockDelay();

  const programIndex = programsMockData.findIndex(
    (program) => program.id === programId,
  );

  if (programIndex === -1) {
    return null;
  }

  const currentProgram = programsMockData[programIndex];
  const now = new Date().toISOString();

  const updatedProgram: ProgramDetailsDto = {
    ...currentProgram,

    name: payload.name ?? currentProgram.name,
    shortDescription: payload.shortDescription ?? currentProgram.shortDescription,
    description: payload.description ?? currentProgram.description,

    sportType: payload.sportType ?? currentProgram.sportType,
    level: payload.level ?? currentProgram.level,
    ageGroup: payload.ageGroup ?? currentProgram.ageGroup,

    status: payload.status ?? currentProgram.status,
    enrollmentStatus:
      payload.enrollmentStatus ?? currentProgram.enrollmentStatus,

    minAge: payload.minAge ?? currentProgram.minAge,
    maxAge: payload.maxAge ?? currentProgram.maxAge,

    durationWeeks: payload.durationWeeks ?? currentProgram.durationWeeks,
    sessionsPerWeek: payload.sessionsPerWeek ?? currentProgram.sessionsPerWeek,
    sessionDurationMinutes:
      payload.sessionDurationMinutes ?? currentProgram.sessionDurationMinutes,

    monthlyPrice: payload.monthlyPrice ?? currentProgram.monthlyPrice,
    currency: payload.currency ?? currentProgram.currency,

    objectives: payload.objectives ?? currentProgram.objectives,
    requirements: payload.requirements ?? currentProgram.requirements,

    rating: payload.rating ?? currentProgram.rating,
    attendanceAverage: payload.attendanceAverage ?? currentProgram.attendanceAverage,

    coverImageUrl:
      payload.coverImageUrl === undefined
        ? currentProgram.coverImageUrl
        : payload.coverImageUrl,

    notes: payload.notes ?? currentProgram.notes,

    updatedAt: now,
  };

  programsMockData = programsMockData.map((program) =>
    program.id === programId ? updatedProgram : program,
  );

  return updatedProgram;
}

export async function deleteProgram(
  programId: string,
): Promise<DeleteProgramResponseDto> {
  await mockDelay();

  const exists = programsMockData.some((program) => program.id === programId);

  programsMockData = programsMockData.filter(
    (program) => program.id !== programId,
  );

  return {
    id: programId,
    deleted: exists,
  };
}