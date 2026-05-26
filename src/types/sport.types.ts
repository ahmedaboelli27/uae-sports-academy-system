import type { BaseEntity } from '@/types/api.types';

export type SportStatus = 'active' | 'inactive';

export interface Sport extends BaseEntity {
  name: string;
  nameAr?: string | null;
  slug: string;
  description?: string | null;
  status: SportStatus;
}
