import type { BaseEntity } from '@/types/api.types';

export type ParentStatus = 'active' | 'inactive';

export interface Parent extends BaseEntity {
  userId: string;
  status: ParentStatus;
  emergencyContact?: string | null;
  address?: string | null;
  city?: string | null;
  emirate?: string | null;
}
