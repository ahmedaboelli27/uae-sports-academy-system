import type { BaseEntity } from '@/types/api.types';

export type StudentStatus = 'active' | 'inactive' | 'trial' | 'withdrawn';

export interface Student extends BaseEntity {
  parentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: 'male' | 'female' | 'other' | null;
  programId?: string | null;
  branchId?: string | null;
  status: StudentStatus;
  medicalNotesSummary?: string | null;
}
