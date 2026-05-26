import type { BaseEntity } from '@/types/api.types';

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled';
export type EnrollmentStatus = 'active' | 'withdrawn' | 'completed' | 'pending';

export interface TrainingSession extends BaseEntity {
  programId: string;
  coachId: string;
  branchId: string;
  startAt: string;
  endAt: string;
  capacity: number;
  status: SessionStatus;
  notes?: string | null;
}

/** @deprecated Use TrainingSession */
export type Session = TrainingSession;

export interface Enrollment extends BaseEntity {
  studentId: string;
  programId: string;
  branchId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  withdrawnAt?: string | null;
}
