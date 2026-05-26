export type CoachStatus =
  | "active"
  | "inactive"
  | "on_leave"
  | "suspended"
  | "archived";

export type CoachEmploymentType =
  | "full_time"
  | "part_time"
  | "freelance"
  | "contract";

export type CoachAvailabilityStatus =
  | "available"
  | "busy"
  | "limited"
  | "unavailable";

export type CoachGender = "male" | "female";

export type CoachSkillLevel =
  | "junior"
  | "mid_level"
  | "senior"
  | "expert";

export type CoachSportSpecialty =
  | "football"
  | "swimming"
  | "basketball"
  | "multi_sport"
  | "fitness"
  | "martial_arts"
  | "tennis"
  | "other";

export interface CoachAssignedStudentDto {
  id: string;
  studentCode: string;
  fullName: string;
  age: number;
  programName: string;
  branchName: string;
  attendanceRate: number;
  subscriptionStatus: "active" | "expired" | "expiring_soon" | "not_started";
  paymentStatus: "paid" | "pending" | "overdue" | "refunded";
}

export interface CoachScheduleSessionDto {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  programName: string;
  branchName: string;
  locationName: string;
  studentsCount: number;
  sessionStatus: "scheduled" | "completed" | "cancelled" | "postponed";
}

export interface CoachCertificationDto {
  id: string;
  title: string;
  issuingOrganization: string;
  issuedAt: string;
  expiresAt: string | null;
  documentUrl: string | null;
}

export interface CoachPerformanceMetricDto {
  id: string;
  title: string;
  value: number;
  suffix: string;
  description: string;
}

export interface CoachListItemDto {
  id: string;

  coachCode: string;
  fullName: string;
  gender: CoachGender;

  phone: string;
  email: string;

  sportSpecialty: CoachSportSpecialty;
  skillLevel: CoachSkillLevel;
  employmentType: CoachEmploymentType;

  branchId: string;
  branchName: string;

  status: CoachStatus;
  availabilityStatus: CoachAvailabilityStatus;

  assignedStudentsCount: number;
  activeProgramsCount: number;
  weeklySessionsCount: number;

  rating: number;
  attendanceCompletionRate: number;

  joinedAt: string;
  lastSessionDate: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CoachDetailsDto extends CoachListItemDto {
  nationality: string | null;
  dateOfBirth: string | null;

  address: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;

  bio: string | null;
  experienceYears: number;

  languages: string[];
  specialties: string[];

  assignedStudents: CoachAssignedStudentDto[];
  upcomingSessions: CoachScheduleSessionDto[];
  recentSessions: CoachScheduleSessionDto[];
  certifications: CoachCertificationDto[];
  performanceMetrics: CoachPerformanceMetricDto[];

  notes: string | null;
}

export interface CoachesSummaryDto {
  totalCoaches: number;
  activeCoaches: number;
  availableCoaches: number;
  onLeaveCoaches: number;
  suspendedCoaches: number;
  totalAssignedStudents: number;
  averageRating: number;
  averageAttendanceCompletionRate: number;
}

export interface CoachesFiltersDto {
  search?: string;
  branchId?: string;
  sportSpecialty?: CoachSportSpecialty | "all";
  status?: CoachStatus | "all";
  availabilityStatus?: CoachAvailabilityStatus | "all";
  employmentType?: CoachEmploymentType | "all";
  skillLevel?: CoachSkillLevel | "all";
}

export interface FilterOptionDto {
  value: string;
  label: string;
}

export interface CoachesListResponseDto {
  summary: CoachesSummaryDto;
  coaches: CoachListItemDto[];
  filters: {
    branches: FilterOptionDto[];
  };
}

export interface CreateCoachRequestDto {
  fullName: string;
  gender: CoachGender;

  phone: string;
  email: string;

  sportSpecialty: CoachSportSpecialty;
  skillLevel: CoachSkillLevel;
  employmentType: CoachEmploymentType;

  branchId: string;

  status?: CoachStatus;
  availabilityStatus?: CoachAvailabilityStatus;

  nationality?: string;
  dateOfBirth?: string;

  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  bio?: string;
  experienceYears?: number;

  languages?: string[];
  specialties?: string[];

  notes?: string;
}

export interface UpdateCoachRequestDto extends Partial<CreateCoachRequestDto> {
  rating?: number;
  attendanceCompletionRate?: number;
}

export interface DeleteCoachResponseDto {
  id: string;
  deleted: boolean;
}