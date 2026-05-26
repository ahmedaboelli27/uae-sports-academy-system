import type { BaseEntity } from '@/types/api.types';

export type ProgramStatus = 'active' | 'inactive' | 'draft';

export interface Program extends BaseEntity {
  sportId: string;
  branchId: string;
  name: string;
  nameAr?: string | null;
  slug: string;
  ageGroupMin: number;
  ageGroupMax: number;
  priceMonthly: number;
  currency: 'AED';
  capacity: number;
  description?: string | null;
  status: ProgramStatus;
}
