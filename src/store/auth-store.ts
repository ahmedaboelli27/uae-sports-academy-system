import { create } from 'zustand';
import { usersSeed } from '@/data/seed/users.seed';
import type { Role, User } from '@/types';

interface AuthState {
  currentUser: User | null;
  role: Role;
  isAuthenticated: boolean;
  loginMock: (role: Exclude<Role, 'guest'>) => void;
  logout: () => void;
}

const findUserByRole = (role: Exclude<Role, 'guest'>): User | null =>
  usersSeed.find((u) => u.role === role) ?? null;

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  role: 'guest',
  isAuthenticated: false,
  loginMock: (role) => {
    const user = findUserByRole(role);
    set({
      currentUser: user,
      role: user?.role ?? 'guest',
      isAuthenticated: Boolean(user),
    });
  },
  logout: () =>
    set({
      currentUser: null,
      role: 'guest',
      isAuthenticated: false,
    }),
}));
