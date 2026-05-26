import type { BaseEntity } from '@/types/api.types';

export type BranchStatus = 'active' | 'inactive' | 'coming_soon';

export interface Branch extends BaseEntity {
  name: string;
  nameAr?: string | null;
  code: string;
  city: string;
  emirate: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  status: BranchStatus;
}
