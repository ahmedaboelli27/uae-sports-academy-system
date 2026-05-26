import { seedTimestamps } from '@/data/seed/seed-utils';
import type { RoleEntity } from "@/types/role.types";



export const rolesSeed: RoleEntity[] = [
  {
    id: "role-parent",
    code: "parent",
    name: "parent",
    label: "Parent",
    description: "Parent portal access",
    permissions: [
      "parent:dashboard",
      "parent:children",
      "parent:payments",
      "parent:invoices",
      "parent:messages",
      "parent:documents",
    ],
    redirectPath: "/parent",
    ...seedTimestamps,
  },
  {
    id: "role-coach",
    code: "coach",
    name: "coach",
    label: "Coach",
    description: "Coach training operations access",
    permissions: [
      "coach:dashboard",
      "coach:sessions",
      "coach:attendance",
      "coach:students",
      "coach:assessments",
      "coach:progress-notes",
      "coach:incident-report",
    ],
    redirectPath: "/coach",
    ...seedTimestamps,
  },
  {
    id: "role-accountant",
    code: "accountant",
    name: "accountant",
    label: "Accountant",
    description: "Finance and invoices access",
    permissions: [
      "finance:dashboard",
      "finance:subscriptions",
      "finance:payments",
      "finance:invoices",
      "finance:reports",
    ],
    redirectPath: "/admin/finance",
    ...seedTimestamps,
  },
  {
    id: "role-admin",
    code: "admin",
    name: "admin",
    label: "Admin",
    description: "Full system access",
    permissions: ["*"],
    redirectPath: "/admin",
    ...seedTimestamps,
  },
];