export type ProgramStatus =
  | "active"
  | "inactive"
  | "draft"
  | "archived"
  | "seasonal";

export type ProgramSportType =
  | "football"
  | "swimming"
  | "basketball"
  | "multi_sport"
  | "fitness"
  | "martial_arts"
  | "tennis"
  | "other";

export type ProgramLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "elite"
  | "all_levels";

export type ProgramAgeGroup =
  | "kids"
  | "juniors"
  | "teens"
  | "adults"
  | "all_ages";

export type ProgramPricingCycle =
  | "monthly"
  | "quarterly"
  | "semi_annual"
  | "annual"
  | "per_session";

export type ProgramEnrollmentStatus =
  | "open"
  | "limited"
  | "full"
  | "closed";

export interface ProgramBranchSummaryDto {
  id: string;
  name: string;
  city: string;
  capacity: number;
  enrolledStudentsCount: number;
}

export interface ProgramCoachSummaryDto {
  id: string;
  coachCode: string;
  fullName: string;
  sportSpecialty: ProgramSportType;
  rating: number;
  status: "active" | "inactive" | "on_leave" | "suspended" | "archived";
}

export interface ProgramScheduleSlotDto {
  id: string;
  dayOfWeek:
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";
  startTime: string;
  endTime: string;
  branchId: string;
  branchName: string;
  locationName: string;
  coachId: string;
  coachName: string;
}

export interface ProgramPricingDto {
  id: string;
  cycle: ProgramPricingCycle;
  price: number;
  currency: "AED";
  sessionsCount: number | null;
  isRecommended: boolean;
}

export interface ProgramPerformanceMetricDto {
  id: string;
  title: string;
  value: number;
  suffix: string;
  description: string;
}

export interface ProgramListItemDto {
  id: string;

  programCode: string;
  name: string;
  shortDescription: string;

  sportType: ProgramSportType;
  level: ProgramLevel;
  ageGroup: ProgramAgeGroup;

  status: ProgramStatus;
  enrollmentStatus: ProgramEnrollmentStatus;

  minAge: number;
  maxAge: number;

  branchesCount: number;
  coachesCount: number;
  enrolledStudentsCount: number;
  capacity: number;

  monthlyPrice: number;
  currency: "AED";

  rating: number;
  attendanceAverage: number;

  createdAt: string;
  updatedAt: string;
}

export interface ProgramDetailsDto extends ProgramListItemDto {
  description: string;
  objectives: string[];
  requirements: string[];

  durationWeeks: number;
  sessionsPerWeek: number;
  sessionDurationMinutes: number;

  branches: ProgramBranchSummaryDto[];
  coaches: ProgramCoachSummaryDto[];
  schedule: ProgramScheduleSlotDto[];
  pricing: ProgramPricingDto[];
  performanceMetrics: ProgramPerformanceMetricDto[];

  coverImageUrl: string | null;
  notes: string | null;
}

export interface ProgramsSummaryDto {
  totalPrograms: number;
  activePrograms: number;
  draftPrograms: number;
  seasonalPrograms: number;
  openEnrollmentPrograms: number;
  fullPrograms: number;
  totalEnrolledStudents: number;
  totalCapacity: number;
  averageAttendance: number;
  averageRating: number;
}

export interface ProgramsFiltersDto {
  search?: string;
  sportType?: ProgramSportType | "all";
  level?: ProgramLevel | "all";
  ageGroup?: ProgramAgeGroup | "all";
  status?: ProgramStatus | "all";
  enrollmentStatus?: ProgramEnrollmentStatus | "all";
}

export interface FilterOptionDto {
  value: string;
  label: string;
}

export interface ProgramsListResponseDto {
  summary: ProgramsSummaryDto;
  programs: ProgramListItemDto[];
}

export interface CreateProgramRequestDto {
  name: string;
  shortDescription: string;
  description: string;

  sportType: ProgramSportType;
  level: ProgramLevel;
  ageGroup: ProgramAgeGroup;

  status?: ProgramStatus;
  enrollmentStatus?: ProgramEnrollmentStatus;

  minAge: number;
  maxAge: number;

  durationWeeks: number;
  sessionsPerWeek: number;
  sessionDurationMinutes: number;

  monthlyPrice: number;
  currency?: "AED";

  objectives?: string[];
  requirements?: string[];

  notes?: string;
  coverImageUrl?: string | null;
}

export interface UpdateProgramRequestDto
  extends Partial<CreateProgramRequestDto> {
  rating?: number;
  attendanceAverage?: number;
}

export interface DeleteProgramResponseDto {
  id: string;
  deleted: boolean;
}