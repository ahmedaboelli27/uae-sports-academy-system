import type { UserRole } from '@/types/role.types';

export interface LoginCredentialsDto {
  email: string;
  password: string;
}

export interface AuthUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  role: UserRole;
  locale?: string;
  status?: string;
}

export interface LoginResponseDto {
  token?: string;
  user: AuthUserDto;
}

export interface RegisterPayloadDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'parent' | 'coach';
}
