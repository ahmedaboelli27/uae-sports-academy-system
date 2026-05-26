export type BranchStatus =
  | "active"
  | "inactive"
  | "under_maintenance"
  | "archived";

export type BranchType =
  | "main"
  | "satellite"
  | "partner"
  | "temporary";

export type BranchCity =
  | "dubai"
  | "abu_dhabi"
  | "sharjah"
  | "ajman"
  | "ras_al_khaimah"
  | "fujairah"
  | "umm_al_quwain"
  | "al_ain";

export type BranchFacilityType =
  | "football_pitch"
  | "swimming_pool"
  | "indoor_court"
  | "fitness_area"
  | "multi_purpose_hall"
  | "kids_zone"
  | "reception"
  | "parking"
  | "changing_rooms"
  | "medical_room"
  | "storage";

export type BranchOperatingDay =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface BranchFacilityDto {
  id: string;
  type: BranchFacilityType;
  name: string;
  capacity: number;
  isAvailable: boolean;
}

export interface BranchOperatingHourDto {
  id: string;
  dayOfWeek: BranchOperatingDay;
  opensAt: string;
  closesAt: string;
  isClosed: boolean;
}

export interface BranchProgramSummaryDto {
  id: string;
  programCode: string;
  name: string;
  sportType:
  | "football"
  | "swimming"
  | "basketball"
  | "multi_sport"
  | "fitness"
  | "martial_arts"
  | "tennis"
  | "other";
  status: "active" | "inactive" | "draft" | "archived" | "seasonal";
  enrolledStudentsCount: number;
  capacity: number;
}

export interface BranchCoachSummaryDto {
  id: string;
  coachCode: string;
  fullName: string;
  sportSpecialty:
  | "football"
  | "swimming"
  | "basketball"
  | "multi_sport"
  | "fitness"
  | "martial_arts"
  | "tennis"
  | "other";
  status:
  | "active"
  | "inactive"
  | "on_leave"
  | "suspended"
  | "archived";
  weeklySessionsCount: number;
  rating: number;
}

export interface BranchScheduleSlotDto {
  id: string;
  dayOfWeek: BranchOperatingDay;
  startTime: string;
  endTime: string;
  programId: string;
  programName: string;
  coachId: string;
  coachName: string;
  facilityId: string;
  facilityName: string;
  studentsCount: number;
}

export interface BranchPerformanceMetricDto {
  id: string;
  title: string;
  value: number;
  suffix: string;
  description: string;
}

export interface BranchListItemDto {
  id: string;

  branchCode: string;
  name: string;
  type: BranchType;

  city: BranchCity;
  area: string;
  address: string;

  phone: string;
  email: string;

  status: BranchStatus;

  managerName: string;
  managerPhone: string;

  programsCount: number;
  coachesCount: number;
  studentsCount: number;

  capacity: number;
  utilizationRate: number;

  facilitiesCount: number;
  weeklySessionsCount: number;

  rating: number;

  createdAt: string;
  updatedAt: string;
}

export interface BranchDetailsDto extends BranchListItemDto {
  latitude: number | null;
  longitude: number | null;

  description: string | null;

  facilities: BranchFacilityDto[];
  operatingHours: BranchOperatingHourDto[];

  programs: BranchProgramSummaryDto[];
  coaches: BranchCoachSummaryDto[];
  schedule: BranchScheduleSlotDto[];

  performanceMetrics: BranchPerformanceMetricDto[];

  notes: string | null;
}

export interface BranchesSummaryDto {
  totalBranches: number;
  activeBranches: number;
  inactiveBranches: number;
  maintenanceBranches: number;

  totalStudents: number;
  totalCoaches: number;
  totalPrograms: number;

  totalCapacity: number;
  averageUtilizationRate: number;
  averageRating: number;
}

export interface BranchesFiltersDto {
  search?: string;
  city?: BranchCity | "all";
  status?: BranchStatus | "all";
  type?: BranchType | "all";
}

export interface BranchesListResponseDto {
  summary: BranchesSummaryDto;
  branches: BranchListItemDto[];
}

export interface CreateBranchRequestDto {
  name: string;
  type: BranchType;

  city: BranchCity;
  area: string;
  address: string;

  phone: string;
  email: string;

  status?: BranchStatus;

  managerName: string;
  managerPhone: string;

  capacity: number;

  latitude?: number | null;
  longitude?: number | null;

  description?: string;
  notes?: string;
}

export interface UpdateBranchRequestDto
  extends Partial<CreateBranchRequestDto> {
  rating?: number;
  utilizationRate?: number;
}

export interface DeleteBranchResponseDto {
  id: string;
  deleted: boolean;
}