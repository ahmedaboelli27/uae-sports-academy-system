export type UserRole = "parent" | "coach" | "accountant" | "admin";

export type Role = UserRole;

export interface RoleEntity {
  id: string;
  code: UserRole;
  name: string;
  label: string;
  description: string;
  permissions: string[];
  redirectPath: string;
  createdAt?: string;
  updatedAt?: string;
}

export const USER_ROLES: UserRole[] = [
  "parent",
  "coach",
  "accountant",
  "admin",
];

export const ROLE_LABELS: Record<UserRole, string> = {
  parent: "Parent",
  coach: "Coach",
  accountant: "Accountant",
  admin: "Admin",
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  parent: "Parent portal access",
  coach: "Coach training operations access",
  accountant: "Finance and invoices access",
  admin: "Full system access",
};

export const ROLE_REDIRECT_PATHS: Record<UserRole, string> = {
  parent: "/parent",
  coach: "/coach",
  accountant: "/admin/finance",
  admin: "/admin",
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  parent: [
    "parent:dashboard",
    "parent:children",
    "parent:payments",
    "parent:invoices",
    "parent:messages",
    "parent:documents",
  ],
  coach: [
    "coach:dashboard",
    "coach:sessions",
    "coach:attendance",
    "coach:students",
    "coach:assessments",
    "coach:progress-notes",
    "coach:incident-report",
  ],
  accountant: [
    "finance:dashboard",
    "finance:subscriptions",
    "finance:payments",
    "finance:invoices",
    "finance:reports",
  ],
  admin: ["*"],
};

export const ROLE_ENTITIES: RoleEntity[] = USER_ROLES.map((role) => ({
  id: `role-${role}`,
  code: role,
  name: role,
  label: ROLE_LABELS[role],
  description: ROLE_DESCRIPTIONS[role],
  permissions: ROLE_PERMISSIONS[role],
  redirectPath: ROLE_REDIRECT_PATHS[role],
}));

export function isAdmin(role?: UserRole | null) {
  return role === "admin";
}

export function hasPermission(
  role: UserRole | null | undefined,
  permission: string,
) {
  if (!role) return false;

  const permissions = ROLE_PERMISSIONS[role];

  return permissions.includes("*") || permissions.includes(permission);
}

export function getRoleRedirectPath(role: UserRole) {
  return ROLE_REDIRECT_PATHS[role];
}

export function getRoleEntity(role: UserRole) {
  return ROLE_ENTITIES.find((item) => item.code === role);
}