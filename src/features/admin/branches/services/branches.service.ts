import type {
  BranchDetailsDto,
  BranchListItemDto,
  BranchesFiltersDto,
  BranchesListResponseDto,
  BranchesSummaryDto,
  CreateBranchRequestDto,
  DeleteBranchResponseDto,
  UpdateBranchRequestDto,
} from "../types/branches.dto";

function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

let branchesMockData: BranchDetailsDto[] = [
  {
    id: "branch-dubai",
    branchCode: "BR-1001",
    name: "Dubai Branch",
    type: "main",

    city: "dubai",
    area: "Nad Al Sheba",
    address: "Nad Al Sheba Sports Complex, Dubai",

    phone: "+971 4 111 2233",
    email: "dubai.branch@example.com",

    status: "active",

    managerName: "Khaled Al Mansoori",
    managerPhone: "+971 50 111 2233",

    programsCount: 3,
    coachesCount: 4,
    studentsCount: 128,

    capacity: 180,
    utilizationRate: 71,

    facilitiesCount: 7,
    weeklySessionsCount: 42,

    rating: 4.8,

    createdAt: "2024-09-01T08:00:00.000Z",
    updatedAt: "2026-05-24T08:00:00.000Z",

    latitude: 25.1602,
    longitude: 55.3304,

    description:
      "Main academy branch in Dubai with football pitch, kids zone, fitness area, reception, and multi-purpose training spaces.",

    facilities: [
      {
        id: "facility-dubai-001",
        type: "football_pitch",
        name: "Main Football Pitch",
        capacity: 60,
        isAvailable: true,
      },
      {
        id: "facility-dubai-002",
        type: "kids_zone",
        name: "Kids Training Zone",
        capacity: 25,
        isAvailable: true,
      },
      {
        id: "facility-dubai-003",
        type: "fitness_area",
        name: "Fitness Area",
        capacity: 20,
        isAvailable: true,
      },
      {
        id: "facility-dubai-004",
        type: "reception",
        name: "Main Reception",
        capacity: 15,
        isAvailable: true,
      },
      {
        id: "facility-dubai-005",
        type: "parking",
        name: "Visitor Parking",
        capacity: 80,
        isAvailable: true,
      },
      {
        id: "facility-dubai-006",
        type: "changing_rooms",
        name: "Changing Rooms",
        capacity: 30,
        isAvailable: true,
      },
      {
        id: "facility-dubai-007",
        type: "medical_room",
        name: "First Aid Room",
        capacity: 4,
        isAvailable: true,
      },
    ],

    operatingHours: [
      {
        id: "hours-dubai-001",
        dayOfWeek: "sunday",
        opensAt: "09:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-dubai-002",
        dayOfWeek: "monday",
        opensAt: "09:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-dubai-003",
        dayOfWeek: "tuesday",
        opensAt: "09:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-dubai-004",
        dayOfWeek: "wednesday",
        opensAt: "09:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-dubai-005",
        dayOfWeek: "thursday",
        opensAt: "09:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-dubai-006",
        dayOfWeek: "friday",
        opensAt: "15:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-dubai-007",
        dayOfWeek: "saturday",
        opensAt: "10:00",
        closesAt: "22:00",
        isClosed: false,
      },
    ],

    programs: [
      {
        id: "program-001",
        programCode: "PRO-1001",
        name: "Football Academy",
        sportType: "football",
        status: "active",
        enrolledStudentsCount: 68,
        capacity: 100,
      },
      {
        id: "program-004",
        programCode: "PRO-1004",
        name: "Multi-Sport Program",
        sportType: "multi_sport",
        status: "seasonal",
        enrolledStudentsCount: 18,
        capacity: 20,
      },
    ],

    coaches: [
      {
        id: "coach-001",
        coachCode: "COA-1001",
        fullName: "Ahmed Al Mansoori",
        sportSpecialty: "football",
        status: "active",
        weeklySessionsCount: 14,
        rating: 4.8,
      },
      {
        id: "coach-004",
        coachCode: "COA-1004",
        fullName: "Fatima Al Nuaimi",
        sportSpecialty: "multi_sport",
        status: "on_leave",
        weeklySessionsCount: 6,
        rating: 4.4,
      },
    ],

    schedule: [
      {
        id: "branch-slot-001",
        dayOfWeek: "sunday",
        startTime: "17:00",
        endTime: "18:30",
        programId: "program-001",
        programName: "Football Academy",
        coachId: "coach-001",
        coachName: "Ahmed Al Mansoori",
        facilityId: "facility-dubai-001",
        facilityName: "Main Football Pitch",
        studentsCount: 18,
      },
      {
        id: "branch-slot-002",
        dayOfWeek: "tuesday",
        startTime: "17:00",
        endTime: "18:30",
        programId: "program-001",
        programName: "Football Academy",
        coachId: "coach-001",
        coachName: "Ahmed Al Mansoori",
        facilityId: "facility-dubai-001",
        facilityName: "Main Football Pitch",
        studentsCount: 20,
      },
      {
        id: "branch-slot-003",
        dayOfWeek: "saturday",
        startTime: "15:00",
        endTime: "16:00",
        programId: "program-004",
        programName: "Multi-Sport Program",
        coachId: "coach-004",
        coachName: "Fatima Al Nuaimi",
        facilityId: "facility-dubai-002",
        facilityName: "Kids Training Zone",
        studentsCount: 8,
      },
    ],

    performanceMetrics: [
      {
        id: "branch-metric-001",
        title: "Utilization Rate",
        value: 71,
        suffix: "%",
        description: "Current student utilization compared to total branch capacity.",
      },
      {
        id: "branch-metric-002",
        title: "Branch Rating",
        value: 4.8,
        suffix: "/5",
        description: "Average internal rating for this branch.",
      },
    ],

    notes: "Main operational branch. High demand for football and multi-sport sessions.",
  },
  {
    id: "branch-abudhabi",
    branchCode: "BR-1002",
    name: "Abu Dhabi Branch",
    type: "satellite",

    city: "abu_dhabi",
    area: "Khalifa City",
    address: "Khalifa City Sports Center, Abu Dhabi",

    phone: "+971 2 333 4455",
    email: "abudhabi.branch@example.com",

    status: "active",

    managerName: "Mona Khaled",
    managerPhone: "+971 55 333 4455",

    programsCount: 1,
    coachesCount: 2,
    studentsCount: 64,

    capacity: 90,
    utilizationRate: 71,

    facilitiesCount: 5,
    weeklySessionsCount: 28,

    rating: 4.7,

    createdAt: "2024-10-10T08:00:00.000Z",
    updatedAt: "2026-05-23T08:00:00.000Z",

    latitude: 24.425,
    longitude: 54.586,

    description:
      "Satellite branch in Abu Dhabi focused on swimming and indoor training programs.",

    facilities: [
      {
        id: "facility-abudhabi-001",
        type: "swimming_pool",
        name: "Indoor Pool",
        capacity: 45,
        isAvailable: true,
      },
      {
        id: "facility-abudhabi-002",
        type: "reception",
        name: "Reception Desk",
        capacity: 10,
        isAvailable: true,
      },
      {
        id: "facility-abudhabi-003",
        type: "changing_rooms",
        name: "Changing Rooms",
        capacity: 25,
        isAvailable: true,
      },
      {
        id: "facility-abudhabi-004",
        type: "parking",
        name: "Parking Area",
        capacity: 45,
        isAvailable: true,
      },
      {
        id: "facility-abudhabi-005",
        type: "medical_room",
        name: "Medical Room",
        capacity: 3,
        isAvailable: true,
      },
    ],

    operatingHours: [
      {
        id: "hours-abudhabi-001",
        dayOfWeek: "sunday",
        opensAt: "10:00",
        closesAt: "20:00",
        isClosed: false,
      },
      {
        id: "hours-abudhabi-002",
        dayOfWeek: "monday",
        opensAt: "10:00",
        closesAt: "20:00",
        isClosed: false,
      },
      {
        id: "hours-abudhabi-003",
        dayOfWeek: "tuesday",
        opensAt: "10:00",
        closesAt: "20:00",
        isClosed: false,
      },
      {
        id: "hours-abudhabi-004",
        dayOfWeek: "wednesday",
        opensAt: "10:00",
        closesAt: "20:00",
        isClosed: false,
      },
      {
        id: "hours-abudhabi-005",
        dayOfWeek: "thursday",
        opensAt: "10:00",
        closesAt: "20:00",
        isClosed: false,
      },
      {
        id: "hours-abudhabi-006",
        dayOfWeek: "friday",
        opensAt: "00:00",
        closesAt: "00:00",
        isClosed: true,
      },
      {
        id: "hours-abudhabi-007",
        dayOfWeek: "saturday",
        opensAt: "10:00",
        closesAt: "20:00",
        isClosed: false,
      },
    ],

    programs: [
      {
        id: "program-002",
        programCode: "PRO-1002",
        name: "Swimming Program",
        sportType: "swimming",
        status: "active",
        enrolledStudentsCount: 36,
        capacity: 45,
      },
    ],

    coaches: [
      {
        id: "coach-002",
        coachCode: "COA-1002",
        fullName: "Sara Khaled",
        sportSpecialty: "swimming",
        status: "active",
        weeklySessionsCount: 16,
        rating: 4.9,
      },
    ],

    schedule: [
      {
        id: "branch-slot-004",
        dayOfWeek: "monday",
        startTime: "16:00",
        endTime: "17:00",
        programId: "program-002",
        programName: "Swimming Program",
        coachId: "coach-002",
        coachName: "Sara Khaled",
        facilityId: "facility-abudhabi-001",
        facilityName: "Indoor Pool",
        studentsCount: 10,
      },
      {
        id: "branch-slot-005",
        dayOfWeek: "wednesday",
        startTime: "16:00",
        endTime: "17:00",
        programId: "program-002",
        programName: "Swimming Program",
        coachId: "coach-002",
        coachName: "Sara Khaled",
        facilityId: "facility-abudhabi-001",
        facilityName: "Indoor Pool",
        studentsCount: 9,
      },
    ],

    performanceMetrics: [
      {
        id: "branch-metric-003",
        title: "Utilization Rate",
        value: 71,
        suffix: "%",
        description: "Current student utilization compared to total branch capacity.",
      },
      {
        id: "branch-metric-004",
        title: "Branch Rating",
        value: 4.7,
        suffix: "/5",
        description: "Average internal rating for this branch.",
      },
    ],

    notes: "Swimming-focused branch with limited pool capacity.",
  },
  {
    id: "branch-sharjah",
    branchCode: "BR-1003",
    name: "Sharjah Branch",
    type: "satellite",

    city: "sharjah",
    area: "University City",
    address: "University City Indoor Sports Hall, Sharjah",

    phone: "+971 6 777 8899",
    email: "sharjah.branch@example.com",

    status: "active",

    managerName: "Omar Hassan",
    managerPhone: "+971 52 777 8899",

    programsCount: 2,
    coachesCount: 2,
    studentsCount: 86,

    capacity: 120,
    utilizationRate: 72,

    facilitiesCount: 4,
    weeklySessionsCount: 24,

    rating: 4.5,

    createdAt: "2025-01-15T08:00:00.000Z",
    updatedAt: "2026-05-22T08:00:00.000Z",

    latitude: 25.3109,
    longitude: 55.492,

    description:
      "Sharjah branch with indoor court and outdoor pitch for basketball and football programs.",

    facilities: [
      {
        id: "facility-sharjah-001",
        type: "indoor_court",
        name: "Indoor Court",
        capacity: 40,
        isAvailable: true,
      },
      {
        id: "facility-sharjah-002",
        type: "football_pitch",
        name: "Outdoor Pitch",
        capacity: 50,
        isAvailable: true,
      },
      {
        id: "facility-sharjah-003",
        type: "reception",
        name: "Reception Area",
        capacity: 8,
        isAvailable: true,
      },
      {
        id: "facility-sharjah-004",
        type: "changing_rooms",
        name: "Changing Rooms",
        capacity: 20,
        isAvailable: true,
      },
    ],

    operatingHours: [
      {
        id: "hours-sharjah-001",
        dayOfWeek: "sunday",
        opensAt: "12:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-sharjah-002",
        dayOfWeek: "monday",
        opensAt: "12:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-sharjah-003",
        dayOfWeek: "tuesday",
        opensAt: "12:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-sharjah-004",
        dayOfWeek: "wednesday",
        opensAt: "12:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-sharjah-005",
        dayOfWeek: "thursday",
        opensAt: "12:00",
        closesAt: "21:00",
        isClosed: false,
      },
      {
        id: "hours-sharjah-006",
        dayOfWeek: "friday",
        opensAt: "14:00",
        closesAt: "22:00",
        isClosed: false,
      },
      {
        id: "hours-sharjah-007",
        dayOfWeek: "saturday",
        opensAt: "10:00",
        closesAt: "22:00",
        isClosed: false,
      },
    ],

    programs: [
      {
        id: "program-001",
        programCode: "PRO-1001",
        name: "Football Academy",
        sportType: "football",
        status: "active",
        enrolledStudentsCount: 26,
        capacity: 40,
      },
      {
        id: "program-003",
        programCode: "PRO-1003",
        name: "Basketball Training",
        sportType: "basketball",
        status: "active",
        enrolledStudentsCount: 24,
        capacity: 40,
      },
    ],

    coaches: [
      {
        id: "coach-003",
        coachCode: "COA-1003",
        fullName: "Omar Hassan",
        sportSpecialty: "basketball",
        status: "active",
        weeklySessionsCount: 8,
        rating: 4.6,
      },
    ],

    schedule: [
      {
        id: "branch-slot-006",
        dayOfWeek: "friday",
        startTime: "18:00",
        endTime: "19:30",
        programId: "program-003",
        programName: "Basketball Training",
        coachId: "coach-003",
        coachName: "Omar Hassan",
        facilityId: "facility-sharjah-001",
        facilityName: "Indoor Court",
        studentsCount: 12,
      },
      {
        id: "branch-slot-007",
        dayOfWeek: "saturday",
        startTime: "18:00",
        endTime: "19:30",
        programId: "program-003",
        programName: "Basketball Training",
        coachId: "coach-003",
        coachName: "Omar Hassan",
        facilityId: "facility-sharjah-001",
        facilityName: "Indoor Court",
        studentsCount: 11,
      },
    ],

    performanceMetrics: [
      {
        id: "branch-metric-005",
        title: "Utilization Rate",
        value: 72,
        suffix: "%",
        description: "Current student utilization compared to total branch capacity.",
      },
      {
        id: "branch-metric-006",
        title: "Branch Rating",
        value: 4.5,
        suffix: "/5",
        description: "Average internal rating for this branch.",
      },
    ],

    notes: "Strong weekend activity. Indoor court is heavily booked.",
  },
  {
    id: "branch-ajman",
    branchCode: "BR-1004",
    name: "Ajman Branch",
    type: "temporary",

    city: "ajman",
    area: "Al Jurf",
    address: "Al Jurf Temporary Training Center, Ajman",

    phone: "+971 6 555 6677",
    email: "ajman.branch@example.com",

    status: "under_maintenance",

    managerName: "Fatima Al Nuaimi",
    managerPhone: "+971 56 555 6677",

    programsCount: 0,
    coachesCount: 0,
    studentsCount: 0,

    capacity: 60,
    utilizationRate: 0,

    facilitiesCount: 2,
    weeklySessionsCount: 0,

    rating: 0,

    createdAt: "2026-02-01T08:00:00.000Z",
    updatedAt: "2026-05-10T08:00:00.000Z",

    latitude: 25.4052,
    longitude: 55.5136,

    description:
      "Temporary Ajman training location currently under maintenance before opening for operations.",

    facilities: [
      {
        id: "facility-ajman-001",
        type: "multi_purpose_hall",
        name: "Multi-Purpose Hall",
        capacity: 40,
        isAvailable: false,
      },
      {
        id: "facility-ajman-002",
        type: "storage",
        name: "Equipment Storage",
        capacity: 10,
        isAvailable: false,
      },
    ],

    operatingHours: [
      {
        id: "hours-ajman-001",
        dayOfWeek: "sunday",
        opensAt: "00:00",
        closesAt: "00:00",
        isClosed: true,
      },
      {
        id: "hours-ajman-002",
        dayOfWeek: "monday",
        opensAt: "00:00",
        closesAt: "00:00",
        isClosed: true,
      },
      {
        id: "hours-ajman-003",
        dayOfWeek: "tuesday",
        opensAt: "00:00",
        closesAt: "00:00",
        isClosed: true,
      },
      {
        id: "hours-ajman-004",
        dayOfWeek: "wednesday",
        opensAt: "00:00",
        closesAt: "00:00",
        isClosed: true,
      },
      {
        id: "hours-ajman-005",
        dayOfWeek: "thursday",
        opensAt: "00:00",
        closesAt: "00:00",
        isClosed: true,
      },
      {
        id: "hours-ajman-006",
        dayOfWeek: "friday",
        opensAt: "00:00",
        closesAt: "00:00",
        isClosed: true,
      },
      {
        id: "hours-ajman-007",
        dayOfWeek: "saturday",
        opensAt: "00:00",
        closesAt: "00:00",
        isClosed: true,
      },
    ],

    programs: [],
    coaches: [],
    schedule: [],

    performanceMetrics: [
      {
        id: "branch-metric-007",
        title: "Utilization Rate",
        value: 0,
        suffix: "%",
        description: "Current student utilization compared to total branch capacity.",
      },
      {
        id: "branch-metric-008",
        title: "Branch Rating",
        value: 0,
        suffix: "/5",
        description: "Average internal rating for this branch.",
      },
    ],

    notes: "Do not schedule sessions here until maintenance is completed.",
  },
];

function toListItem(branch: BranchDetailsDto): BranchListItemDto {
  return {
    id: branch.id,

    branchCode: branch.branchCode,
    name: branch.name,
    type: branch.type,

    city: branch.city,
    area: branch.area,
    address: branch.address,

    phone: branch.phone,
    email: branch.email,

    status: branch.status,

    managerName: branch.managerName,
    managerPhone: branch.managerPhone,

    programsCount: branch.programsCount,
    coachesCount: branch.coachesCount,
    studentsCount: branch.studentsCount,

    capacity: branch.capacity,
    utilizationRate: branch.utilizationRate,

    facilitiesCount: branch.facilitiesCount,
    weeklySessionsCount: branch.weeklySessionsCount,

    rating: branch.rating,

    createdAt: branch.createdAt,
    updatedAt: branch.updatedAt,
  };
}

function getBranchesSummary(branches: BranchDetailsDto[]): BranchesSummaryDto {
  const totalBranches = branches.length;

  const totalUtilizationRate = branches.reduce(
    (total, branch) => total + branch.utilizationRate,
    0,
  );

  const totalRating = branches.reduce(
    (total, branch) => total + branch.rating,
    0,
  );

  return {
    totalBranches,
    activeBranches: branches.filter((branch) => branch.status === "active")
      .length,
    inactiveBranches: branches.filter((branch) => branch.status === "inactive")
      .length,
    maintenanceBranches: branches.filter(
      (branch) => branch.status === "under_maintenance",
    ).length,

    totalStudents: branches.reduce(
      (total, branch) => total + branch.studentsCount,
      0,
    ),
    totalCoaches: branches.reduce(
      (total, branch) => total + branch.coachesCount,
      0,
    ),
    totalPrograms: branches.reduce(
      (total, branch) => total + branch.programsCount,
      0,
    ),

    totalCapacity: branches.reduce(
      (total, branch) => total + branch.capacity,
      0,
    ),

    averageUtilizationRate:
      totalBranches > 0
        ? Number((totalUtilizationRate / totalBranches).toFixed(1))
        : 0,

    averageRating:
      totalBranches > 0 ? Number((totalRating / totalBranches).toFixed(1)) : 0,
  };
}

function filterBranches(
  branches: BranchDetailsDto[],
  filters?: BranchesFiltersDto,
): BranchDetailsDto[] {
  if (!filters) return branches;

  return branches.filter((branch) => {
    const searchValue = filters.search?.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      branch.name.toLowerCase().includes(searchValue) ||
      branch.branchCode.toLowerCase().includes(searchValue) ||
      branch.area.toLowerCase().includes(searchValue) ||
      branch.address.toLowerCase().includes(searchValue) ||
      branch.phone.toLowerCase().includes(searchValue) ||
      branch.email.toLowerCase().includes(searchValue) ||
      branch.managerName.toLowerCase().includes(searchValue);

    const matchesCity =
      !filters.city || filters.city === "all" || branch.city === filters.city;

    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      branch.status === filters.status;

    const matchesType =
      !filters.type || filters.type === "all" || branch.type === filters.type;

    return matchesSearch && matchesCity && matchesStatus && matchesType;
  });
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function createBranchCode(): string {
  const nextNumber = branchesMockData.length + 1001;
  return `BR-${nextNumber}`;
}

export async function getBranchesList(
  filters?: BranchesFiltersDto,
): Promise<BranchesListResponseDto> {
  await mockDelay();

  const filteredBranches = filterBranches(branchesMockData, filters);

  return {
    summary: getBranchesSummary(branchesMockData),
    branches: filteredBranches.map(toListItem),
  };
}

export async function getBranchById(
  branchId: string,
): Promise<BranchDetailsDto | null> {
  await mockDelay();

  return branchesMockData.find((branch) => branch.id === branchId) ?? null;
}

export async function createBranch(
  payload: CreateBranchRequestDto,
): Promise<BranchDetailsDto> {
  await mockDelay();

  const now = new Date().toISOString();

  const newBranch: BranchDetailsDto = {
    id: createId("branch"),

    branchCode: createBranchCode(),
    name: payload.name,
    type: payload.type,

    city: payload.city,
    area: payload.area,
    address: payload.address,

    phone: payload.phone,
    email: payload.email,

    status: payload.status ?? "active",

    managerName: payload.managerName,
    managerPhone: payload.managerPhone,

    programsCount: 0,
    coachesCount: 0,
    studentsCount: 0,

    capacity: payload.capacity,
    utilizationRate: 0,

    facilitiesCount: 0,
    weeklySessionsCount: 0,

    rating: 0,

    createdAt: now,
    updatedAt: now,

    latitude: payload.latitude ?? null,
    longitude: payload.longitude ?? null,

    description: payload.description ?? null,

    facilities: [],
    operatingHours: [],
    programs: [],
    coaches: [],
    schedule: [],

    performanceMetrics: [
      {
        id: `${createId("branch-metric")}-utilization`,
        title: "Utilization Rate",
        value: 0,
        suffix: "%",
        description: "Current student utilization compared to total branch capacity.",
      },
      {
        id: `${createId("branch-metric")}-rating`,
        title: "Branch Rating",
        value: 0,
        suffix: "/5",
        description: "Average internal rating for this branch.",
      },
    ],

    notes: payload.notes ?? null,
  };

  branchesMockData = [newBranch, ...branchesMockData];

  return newBranch;
}

export async function updateBranch(
  branchId: string,
  payload: UpdateBranchRequestDto,
): Promise<BranchDetailsDto | null> {
  await mockDelay();

  const branchIndex = branchesMockData.findIndex(
    (branch) => branch.id === branchId,
  );

  if (branchIndex === -1) {
    return null;
  }

  const currentBranch = branchesMockData[branchIndex];
  const now = new Date().toISOString();

  const updatedBranch: BranchDetailsDto = {
    ...currentBranch,

    name: payload.name ?? currentBranch.name,
    type: payload.type ?? currentBranch.type,

    city: payload.city ?? currentBranch.city,
    area: payload.area ?? currentBranch.area,
    address: payload.address ?? currentBranch.address,

    phone: payload.phone ?? currentBranch.phone,
    email: payload.email ?? currentBranch.email,

    status: payload.status ?? currentBranch.status,

    managerName: payload.managerName ?? currentBranch.managerName,
    managerPhone: payload.managerPhone ?? currentBranch.managerPhone,

    capacity: payload.capacity ?? currentBranch.capacity,

    latitude:
      payload.latitude === undefined ? currentBranch.latitude : payload.latitude,

    longitude:
      payload.longitude === undefined
        ? currentBranch.longitude
        : payload.longitude,

    description: payload.description ?? currentBranch.description,

    rating: payload.rating ?? currentBranch.rating,
    utilizationRate: payload.utilizationRate ?? currentBranch.utilizationRate,

    notes: payload.notes ?? currentBranch.notes,

    updatedAt: now,
  };

  branchesMockData = branchesMockData.map((branch) =>
    branch.id === branchId ? updatedBranch : branch,
  );

  return updatedBranch;
}

export async function deleteBranch(
  branchId: string,
): Promise<DeleteBranchResponseDto> {
  await mockDelay();

  const exists = branchesMockData.some((branch) => branch.id === branchId);

  branchesMockData = branchesMockData.filter((branch) => branch.id !== branchId);

  return {
    id: branchId,
    deleted: exists,
  };
}