import type { BaseEntity } from '@/types/api.types';
import type { RoleCode } from '@/types/role.types';

export type UserLocale = 'en' | 'ar';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  roleId: string;
  role: RoleCode;
  avatarUrl?: string | null;
  locale: UserLocale;
  status: UserStatus;
}
