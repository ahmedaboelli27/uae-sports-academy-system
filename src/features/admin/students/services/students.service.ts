import type {
  CreateStudentRequestDto,
  DeleteStudentResponseDto,
  FilterOptionDto,
  StudentDetailsDto,
  StudentListItemDto,
  StudentsFiltersDto,
  StudentsListResponseDto,
  StudentsSummaryDto,
  UpdateStudentRequestDto,
} from "../types/students.dto";

function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const programs: FilterOptionDto[] = [
  { value: "program-football", label: "Football Academy" },
  { value: "program-swimming", label: "Swimming Program" },
  { value: "program-basketball", label: "Basketball Training" },
  { value: "program-multisport", label: "Multi-Sport Program" },
];

const branches: FilterOptionDto[] = [
  { value: "branch-dubai", label: "Dubai Branch" },
  { value: "branch-abudhabi", label: "Abu Dhabi Branch" },
  { value: "branch-sharjah", label: "Sharjah Branch" },
];

const coaches: FilterOptionDto[] = [
  { value: "coach-ahmed", label: "Ahmed Al Mansoori" },
  { value: "coach-sara", label: "Sara Khaled" },
  { value: "coach-omar", label: "Omar Hassan" },
  { value: "coach-fatima", label: "Fatima Al Nuaimi" },
];

let studentsMockData: StudentDetailsDto[] = [
  {
    id: "student-001",
    studentCode: "ASP-1001",
    fullName: "Omar Khaled",
    age: 10,
    gender: "male",
    dateOfBirth: "2014-05-18",

    parentId: "parent-001",
    parentName: "Khaled Hassan",
    parentPhone: "+971 50 123 4567",
    parentEmail: "khaled@example.com",

    programId: "program-football",
    programName: "Football Academy",

    branchId: "branch-dubai",
    branchName: "Dubai Branch",

    coachId: "coach-ahmed",
    coachName: "Ahmed Al Mansoori",

    skillLevel: "intermediate",

    status: "active",
    paymentStatus: "paid",
    subscriptionStatus: "active",

    subscriptionStartDate: "2026-05-01",
    subscriptionEndDate: "2026-08-01",

    attendanceRate: 94,
    lastAttendanceDate: "2026-05-23",

    medicalNotes: "No medical restrictions.",
    emergencyContactName: "Khaled Hassan",
    emergencyContactPhone: "+971 50 123 4567",
    allergies: null,
    injuries: null,

    preferredTrainingDays: ["Sunday", "Tuesday"],
    preferredTrainingTime: "5:00 PM - 7:00 PM",

    documents: [],
    recentAttendance: [
      {
        id: "att-001",
        sessionDate: "2026-05-23",
        programName: "Football Academy",
        coachName: "Ahmed Al Mansoori",
        status: "present",
      },
    ],
    progressNotes: [
      {
        id: "note-001",
        coachName: "Ahmed Al Mansoori",
        title: "Strong teamwork improvement",
        note: "Omar is improving in passing accuracy and communication.",
        rating: 4,
        createdAt: "2026-05-20T10:00:00.000Z",
      },
    ],
    paymentHistory: [
      {
        id: "pay-001",
        invoiceNumber: "INV-1001",
        amount: 1250,
        currency: "AED",
        status: "paid",
        paidAt: "2026-05-01T12:00:00.000Z",
        dueDate: "2026-05-01",
      },
    ],

    createdAt: "2026-05-01T08:00:00.000Z",
    updatedAt: "2026-05-23T08:00:00.000Z",
  },
  {
    id: "student-002",
    studentCode: "ASP-1002",
    fullName: "Mariam Ali",
    age: 8,
    gender: "female",
    dateOfBirth: "2016-02-11",

    parentId: "parent-002",
    parentName: "Ali Mohamed",
    parentPhone: "+971 55 222 3344",
    parentEmail: "ali@example.com",

    programId: "program-swimming",
    programName: "Swimming Program",

    branchId: "branch-abudhabi",
    branchName: "Abu Dhabi Branch",

    coachId: "coach-sara",
    coachName: "Sara Khaled",

    skillLevel: "beginner",

    status: "active",
    paymentStatus: "pending",
    subscriptionStatus: "expiring_soon",

    subscriptionStartDate: "2026-04-01",
    subscriptionEndDate: "2026-06-01",

    attendanceRate: 88,
    lastAttendanceDate: "2026-05-22",

    medicalNotes: "Parent mentioned mild water anxiety at the beginning.",
    emergencyContactName: "Ali Mohamed",
    emergencyContactPhone: "+971 55 222 3344",
    allergies: null,
    injuries: null,

    preferredTrainingDays: ["Monday", "Wednesday"],
    preferredTrainingTime: "4:00 PM - 5:00 PM",

    documents: [],
    recentAttendance: [
      {
        id: "att-002",
        sessionDate: "2026-05-22",
        programName: "Swimming Program",
        coachName: "Sara Khaled",
        status: "present",
      },
    ],
    progressNotes: [
      {
        id: "note-002",
        coachName: "Sara Khaled",
        title: "Water confidence improved",
        note: "Mariam is more comfortable entering the pool and following instructions.",
        rating: 4,
        createdAt: "2026-05-21T10:00:00.000Z",
      },
    ],
    paymentHistory: [
      {
        id: "pay-002",
        invoiceNumber: "INV-1002",
        amount: 950,
        currency: "AED",
        status: "pending",
        paidAt: null,
        dueDate: "2026-05-28",
      },
    ],

    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-05-22T08:00:00.000Z",
  },
  {
    id: "student-003",
    studentCode: "ASP-1003",
    fullName: "Noah Smith",
    age: 12,
    gender: "male",
    dateOfBirth: "2012-09-04",

    parentId: "parent-003",
    parentName: "James Smith",
    parentPhone: "+971 52 778 9000",
    parentEmail: "james@example.com",

    programId: "program-basketball",
    programName: "Basketball Training",

    branchId: "branch-sharjah",
    branchName: "Sharjah Branch",

    coachId: "coach-omar",
    coachName: "Omar Hassan",

    skillLevel: "advanced",

    status: "active",
    paymentStatus: "overdue",
    subscriptionStatus: "expired",

    subscriptionStartDate: "2026-02-01",
    subscriptionEndDate: "2026-05-01",

    attendanceRate: 79,
    lastAttendanceDate: "2026-05-18",

    medicalNotes: "Previous ankle sprain. Avoid high-impact drills if pain appears.",
    emergencyContactName: "James Smith",
    emergencyContactPhone: "+971 52 778 9000",
    allergies: "Peanuts",
    injuries: "Previous ankle sprain",

    preferredTrainingDays: ["Friday", "Saturday"],
    preferredTrainingTime: "6:00 PM - 8:00 PM",

    documents: [],
    recentAttendance: [
      {
        id: "att-003",
        sessionDate: "2026-05-18",
        programName: "Basketball Training",
        coachName: "Omar Hassan",
        status: "late",
      },
    ],
    progressNotes: [
      {
        id: "note-003",
        coachName: "Omar Hassan",
        title: "Advanced shooting skills",
        note: "Noah performs well in shooting drills but needs better warm-up discipline.",
        rating: 5,
        createdAt: "2026-05-18T10:00:00.000Z",
      },
    ],
    paymentHistory: [
      {
        id: "pay-003",
        invoiceNumber: "INV-1003",
        amount: 1100,
        currency: "AED",
        status: "overdue",
        paidAt: null,
        dueDate: "2026-05-01",
      },
    ],

    createdAt: "2026-02-01T08:00:00.000Z",
    updatedAt: "2026-05-18T08:00:00.000Z",
  },
  {
    id: "student-004",
    studentCode: "ASP-1004",
    fullName: "Layla Hassan",
    age: 7,
    gender: "female",
    dateOfBirth: "2017-08-20",

    parentId: "parent-004",
    parentName: "Hassan Nabil",
    parentPhone: "+971 56 111 2233",
    parentEmail: "hassan@example.com",

    programId: "program-multisport",
    programName: "Multi-Sport Program",

    branchId: "branch-dubai",
    branchName: "Dubai Branch",

    coachId: "coach-fatima",
    coachName: "Fatima Al Nuaimi",

    skillLevel: "beginner",

    status: "inactive",
    paymentStatus: "refunded",
    subscriptionStatus: "not_started",

    subscriptionStartDate: "2026-06-01",
    subscriptionEndDate: "2026-09-01",

    attendanceRate: 0,
    lastAttendanceDate: null,

    medicalNotes: null,
    emergencyContactName: "Hassan Nabil",
    emergencyContactPhone: "+971 56 111 2233",
    allergies: null,
    injuries: null,

    preferredTrainingDays: ["Sunday"],
    preferredTrainingTime: "3:00 PM - 4:00 PM",

    documents: [],
    recentAttendance: [],
    progressNotes: [],
    paymentHistory: [
      {
        id: "pay-004",
        invoiceNumber: "INV-1004",
        amount: 800,
        currency: "AED",
        status: "refunded",
        paidAt: null,
        dueDate: "2026-06-01",
      },
    ],

    createdAt: "2026-05-15T08:00:00.000Z",
    updatedAt: "2026-05-20T08:00:00.000Z",
  },
];

function toListItem(student: StudentDetailsDto): StudentListItemDto {
  return {
    id: student.id,
    studentCode: student.studentCode,
    fullName: student.fullName,
    age: student.age,
    gender: student.gender,

    parentId: student.parentId,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
    parentEmail: student.parentEmail,

    programId: student.programId,
    programName: student.programName,

    branchId: student.branchId,
    branchName: student.branchName,

    coachId: student.coachId,
    coachName: student.coachName,

    skillLevel: student.skillLevel,

    status: student.status,
    paymentStatus: student.paymentStatus,
    subscriptionStatus: student.subscriptionStatus,

    subscriptionStartDate: student.subscriptionStartDate,
    subscriptionEndDate: student.subscriptionEndDate,

    attendanceRate: student.attendanceRate,
    lastAttendanceDate: student.lastAttendanceDate,

    medicalNotes: student.medicalNotes,

    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
  };
}

function getStudentsSummary(students: StudentDetailsDto[]): StudentsSummaryDto {
  return {
    totalStudents: students.length,
    activeStudents: students.filter((student) => student.status === "active").length,
    inactiveStudents: students.filter((student) => student.status === "inactive").length,
    pendingPayments: students.filter(
      (student) => student.paymentStatus === "pending",
    ).length,
    overduePayments: students.filter(
      (student) => student.paymentStatus === "overdue",
    ).length,
    expiredSubscriptions: students.filter(
      (student) => student.subscriptionStatus === "expired",
    ).length,
    expiringSoonSubscriptions: students.filter(
      (student) => student.subscriptionStatus === "expiring_soon",
    ).length,
  };
}

function filterStudents(
  students: StudentDetailsDto[],
  filters?: StudentsFiltersDto,
): StudentDetailsDto[] {
  if (!filters) return students;

  return students.filter((student) => {
    const searchValue = filters.search?.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      student.fullName.toLowerCase().includes(searchValue) ||
      student.studentCode.toLowerCase().includes(searchValue) ||
      student.parentName.toLowerCase().includes(searchValue) ||
      student.parentPhone.toLowerCase().includes(searchValue);

    const matchesProgram =
      !filters.programId ||
      filters.programId === "all" ||
      student.programId === filters.programId;

    const matchesBranch =
      !filters.branchId ||
      filters.branchId === "all" ||
      student.branchId === filters.branchId;

    const matchesCoach =
      !filters.coachId ||
      filters.coachId === "all" ||
      student.coachId === filters.coachId;

    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      student.status === filters.status;

    const matchesPayment =
      !filters.paymentStatus ||
      filters.paymentStatus === "all" ||
      student.paymentStatus === filters.paymentStatus;

    const matchesSubscription =
      !filters.subscriptionStatus ||
      filters.subscriptionStatus === "all" ||
      student.subscriptionStatus === filters.subscriptionStatus;

    const matchesSkillLevel =
      !filters.skillLevel ||
      filters.skillLevel === "all" ||
      student.skillLevel === filters.skillLevel;

    return (
      matchesSearch &&
      matchesProgram &&
      matchesBranch &&
      matchesCoach &&
      matchesStatus &&
      matchesPayment &&
      matchesSubscription &&
      matchesSkillLevel
    );
  });
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

export async function getStudentsList(
  filters?: StudentsFiltersDto,
): Promise<StudentsListResponseDto> {
  await mockDelay();

  const filteredStudents = filterStudents(studentsMockData, filters);

  return {
    summary: getStudentsSummary(studentsMockData),
    students: filteredStudents.map(toListItem),
    filters: {
      programs,
      branches,
      coaches,
    },
  };
}

export async function getStudentById(
  studentId: string,
): Promise<StudentDetailsDto | null> {
  await mockDelay();

  return studentsMockData.find((student) => student.id === studentId) ?? null;
}

export async function createStudent(
  payload: CreateStudentRequestDto,
): Promise<StudentDetailsDto> {
  await mockDelay();

  const now = new Date().toISOString();
  const newStudentNumber = studentsMockData.length + 1001;

  const selectedProgram = programs.find(
    (program) => program.value === payload.programId,
  );

  const selectedBranch = branches.find(
    (branch) => branch.value === payload.branchId,
  );

  const selectedCoach = coaches.find(
    (coach) => coach.value === payload.coachId,
  );

  const newStudent: StudentDetailsDto = {
    id: createId("student"),
    studentCode: `ASP-${newStudentNumber}`,
    fullName: payload.fullName,
    age: calculateAge(payload.dateOfBirth),
    gender: payload.gender,
    dateOfBirth: payload.dateOfBirth,

    parentId: payload.parentId ?? createId("parent"),
    parentName: payload.parentName,
    parentPhone: payload.parentPhone,
    parentEmail: payload.parentEmail,

    programId: payload.programId,
    programName: selectedProgram?.label ?? "Unknown Program",

    branchId: payload.branchId,
    branchName: selectedBranch?.label ?? "Unknown Branch",

    coachId: payload.coachId ?? "unassigned",
    coachName: selectedCoach?.label ?? "Unassigned Coach",

    skillLevel: payload.skillLevel,

    status: "active",
    paymentStatus: "pending",
    subscriptionStatus: "not_started",

    subscriptionStartDate: now.slice(0, 10),
    subscriptionEndDate: now.slice(0, 10),

    attendanceRate: 0,
    lastAttendanceDate: null,

    medicalNotes: payload.medicalNotes ?? null,
    emergencyContactName: payload.emergencyContactName ?? null,
    emergencyContactPhone: payload.emergencyContactPhone ?? null,
    allergies: payload.allergies ?? null,
    injuries: payload.injuries ?? null,

    preferredTrainingDays: payload.preferredTrainingDays ?? [],
    preferredTrainingTime: payload.preferredTrainingTime ?? null,

    documents: [],
    recentAttendance: [],
    progressNotes: [],
    paymentHistory: [],

    createdAt: now,
    updatedAt: now,
  };

  studentsMockData = [newStudent, ...studentsMockData];

  return newStudent;
}

export async function updateStudent(
  studentId: string,
  payload: UpdateStudentRequestDto,
): Promise<StudentDetailsDto | null> {
  await mockDelay();

  const studentIndex = studentsMockData.findIndex(
    (student) => student.id === studentId,
  );

  if (studentIndex === -1) {
    return null;
  }

  const currentStudent = studentsMockData[studentIndex];
  const now = new Date().toISOString();

  const selectedProgram = payload.programId
    ? programs.find((program) => program.value === payload.programId)
    : null;

  const selectedBranch = payload.branchId
    ? branches.find((branch) => branch.value === payload.branchId)
    : null;

  const selectedCoach = payload.coachId
    ? coaches.find((coach) => coach.value === payload.coachId)
    : null;

  const updatedStudent: StudentDetailsDto = {
    ...currentStudent,

    fullName: payload.fullName ?? currentStudent.fullName,
    dateOfBirth: payload.dateOfBirth ?? currentStudent.dateOfBirth,
    age: payload.dateOfBirth
      ? calculateAge(payload.dateOfBirth)
      : currentStudent.age,
    gender: payload.gender ?? currentStudent.gender,

    parentId: payload.parentId ?? currentStudent.parentId,
    parentName: payload.parentName ?? currentStudent.parentName,
    parentPhone: payload.parentPhone ?? currentStudent.parentPhone,
    parentEmail: payload.parentEmail ?? currentStudent.parentEmail,

    programId: payload.programId ?? currentStudent.programId,
    programName: selectedProgram?.label ?? currentStudent.programName,

    branchId: payload.branchId ?? currentStudent.branchId,
    branchName: selectedBranch?.label ?? currentStudent.branchName,

    coachId: payload.coachId ?? currentStudent.coachId,
    coachName: selectedCoach?.label ?? currentStudent.coachName,

    skillLevel: payload.skillLevel ?? currentStudent.skillLevel,

    status: payload.status ?? currentStudent.status,
    paymentStatus: payload.paymentStatus ?? currentStudent.paymentStatus,
    subscriptionStatus:
      payload.subscriptionStatus ?? currentStudent.subscriptionStatus,

    medicalNotes: payload.medicalNotes ?? currentStudent.medicalNotes,
    allergies: payload.allergies ?? currentStudent.allergies,
    injuries: payload.injuries ?? currentStudent.injuries,

    emergencyContactName:
      payload.emergencyContactName ?? currentStudent.emergencyContactName,
    emergencyContactPhone:
      payload.emergencyContactPhone ?? currentStudent.emergencyContactPhone,

    preferredTrainingDays:
      payload.preferredTrainingDays ?? currentStudent.preferredTrainingDays,
    preferredTrainingTime:
      payload.preferredTrainingTime ?? currentStudent.preferredTrainingTime,

    updatedAt: now,
  };

  studentsMockData = studentsMockData.map((student) =>
    student.id === studentId ? updatedStudent : student,
  );

  return updatedStudent;
}

export async function deleteStudent(
  studentId: string,
): Promise<DeleteStudentResponseDto> {
  await mockDelay();

  const exists = studentsMockData.some((student) => student.id === studentId);

  studentsMockData = studentsMockData.filter(
    (student) => student.id !== studentId,
  );

  return {
    id: studentId,
    deleted: exists,
  };
}