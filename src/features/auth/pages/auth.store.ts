import { USE_MOCK_API } from "@/config/api-mode";
import { ENDPOINTS } from "@/services/api/endpoints";
import { axiosClient } from "@/services/api/axios-client";
import type { UserRole } from "@/types/role.types";
import { create } from "zustand";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthState {
    currentUser: AuthUser | null;
    role: UserRole | null;
    isAuthenticated: boolean;
    loginMock: (role: Exclude<UserRole, 'guest'>) => void;
    logout: () => void;
}

const mockUsers: Record<Exclude<UserRole, 'guest'>, AuthUser> = {
    parent: {
        id: "parent-demo-user",
        name: "Parent Demo",
        email: "parent@aspirex.com",
        role: "parent",
    },
    coach: {
        id: "coach-demo-user",
        name: "Coach Demo",
        email: "coach@aspirex.com",
        role: "coach",
    },
    accountant: {
        id: "accountant-demo-user",
        name: "Accountant Demo",
        email: "accountant@aspirex.com",
        role: "accountant",
    },
    admin: {
        id: "admin-demo-user",
        name: "Admin Demo",
        email: "admin@aspirex.com",
        role: "admin",
    },
};

export const useAuthStore = create<AuthState>((set) => ({
    currentUser: null,
    role: null,
    isAuthenticated: false,

    loginMock: (role) => {
        const user = mockUsers[role];

        set({
            currentUser: user,
            role,
            isAuthenticated: true,
        });

        if (!USE_MOCK_API && (role === "admin" || role === "accountant")) {
            const email =
                role === "accountant" ? "finance@academy.ae" : "admin@academy.ae";

            void axiosClient
                .post(ENDPOINTS.auth.login, {
                    email,
                    password: "Admin@123",
                })
                .then((response) => {
                    const token = response.data?.data?.token as string | undefined;
                    if (token) {
                        localStorage.setItem("access_token", token);
                    }
                })
                .catch(() => {
                    localStorage.removeItem("access_token");
                });
        }
    },

    logout: () => {
        localStorage.removeItem("access_token");
        set({
            currentUser: null,
            role: null,
            isAuthenticated: false,
        });
    },
}));