import { USE_MOCK_API } from '@/config/api-mode';
import type { UserRole } from '@/types/role.types';
import { getMe, login as apiLogin, register as apiRegister } from './auth-api.service';
import type { LoginCredentialsDto, LoginResponseDto, RegisterPayloadDto } from '../types/auth.dto';

const MOCK_USERS: Record<'admin' | 'coach' | 'parent', LoginResponseDto['user']> = {
  admin: {
    id: 'admin-demo-user',
    email: 'admin@aspirex.com',
    firstName: 'Admin',
    lastName: 'Demo',
    role: 'admin',
  },
  coach: {
    id: 'coach-demo-user',
    email: 'coach@aspirex.com',
    firstName: 'Coach',
    lastName: 'Demo',
    role: 'coach',
  },
  parent: {
    id: 'parent-demo-user',
    email: 'parent@aspirex.com',
    firstName: 'Parent',
    lastName: 'Demo',
    role: 'parent',
  },
};

export async function login(credentials: LoginCredentialsDto, mockRole?: UserRole): Promise<LoginResponseDto> {
  if (USE_MOCK_API) {
    const role = mockRole === 'admin' || mockRole === 'coach' || mockRole === 'parent' ? mockRole : 'parent';
    return { token: 'mock-token', user: MOCK_USERS[role] };
  }
  return apiLogin(credentials);
}

export async function register(payload: RegisterPayloadDto) {
  if (USE_MOCK_API) {
    return { success: true, user: { ...MOCK_USERS.parent, email: payload.email.toLowerCase() } };
  }
  return apiRegister(payload);
}

export async function loadCurrentUser() {
  if (USE_MOCK_API) return null;
  try {
    return await getMe();
  } catch {
    return null;
  }
}
