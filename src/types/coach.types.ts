import type { BaseEntity } from '@/types/api.types';

export type CoachStatus = 'active' | 'inactive' | 'on_leave';

export interface Coach extends BaseEntity {
  userId: string;
  status: CoachStatus;
  bio?: string | null;
  specialties: string[];
  licenseNumber?: string | null;
}

export interface CoachSportAssignment extends BaseEntity {
  coachId: string;
  sportId: string;
}

export interface CoachBranchAssignment extends BaseEntity {
  coachId: string;
  branchId: string;
}
