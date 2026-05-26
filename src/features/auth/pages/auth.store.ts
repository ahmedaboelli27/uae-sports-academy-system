import type { UserRole } from '@/types/role.types';
import { create } from 'zustand';
import { login as loginData, loadCurrentUser } from '@/features/auth/services/auth-data.service';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
}

interface AuthState {
  currentUser: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  loginMock: (role: Exclude<UserRole, 'guest' | 'accountant'>) => Promise<void>;
  loginWithCredentials: (email: string, password: string, mockRole?: Exclude<UserRole, 'guest' | 'accountant'>) => Promise<void>;
  hydrateMe: () => Promise<void>;
  logout: () => void;
}

function setAuthFromUser(set: (updater: Partial<AuthState>) => void, user: AuthUser | null) {
  set({
    currentUser: user,
    role: user?.role ?? 'guest',
    isAuthenticated: Boolean(user),
  });
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  role: 'guest',
  isAuthenticated: false,

  loginMock: async (role) => {
    const result = await loginData({ email: '', password: '' }, role);
    if (result.token) localStorage.setItem('access_token', result.token);
    setAuthFromUser(set, result.user);
  },

  loginWithCredentials: async (email, password, mockRole) => {
    const result = await loginData({ email, password }, mockRole);
    if (result.token) localStorage.setItem('access_token', result.token);
    setAuthFromUser(set, result.user);
  },

  hydrateMe: async () => {
    const user = await loadCurrentUser();
    setAuthFromUser(set, user);
  },

  logout: () => {
    localStorage.removeItem('access_token');
    setAuthFromUser(set, null);
  },
}));