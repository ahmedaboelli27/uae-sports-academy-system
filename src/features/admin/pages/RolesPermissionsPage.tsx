import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Eye,
  FileText,
  KeyRound,
  Lock,
  Pencil,
  RefreshCcw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Trophy,
  UserCog,
  Users,
  WalletCards,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

type RoleKey = 'admin' | 'coach' | 'parent';

type PermissionKey =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'export'
  | 'approve';

type ModuleKey =
  | 'dashboard'
  | 'users'
  | 'students'
  | 'parents'
  | 'coaches'
  | 'programs'
  | 'branches'
  | 'schedule'
  | 'attendance'
  | 'finance'
  | 'reports'
  | 'notifications'
  | 'cms'
  | 'settings'
  | 'auditLogs';

interface RoleDefinition {
  key: RoleKey;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: 'admin' | 'coach' | 'parent';
}

interface ModuleDefinition {
  key: ModuleKey;
  title: string;
  description: string;
  icon: LucideIcon;
  group: 'Core' | 'People' | 'Operations' | 'Finance' | 'System';
  sensitive?: boolean;
}

interface PermissionDefinition {
  key: PermissionKey;
  label: string;
  description: string;
  icon: LucideIcon;
  dangerous?: boolean;
}

type RolePermissions = Record<
  RoleKey,
  Record<ModuleKey, Record<PermissionKey, boolean>>
>;

const roles: RoleDefinition[] = [
  {
    key: 'admin',
    title: 'Admin',
    description:
      'Full operational access to manage academy modules, users, finance, settings, and reports.',
    icon: ShieldCheck,
    tone: 'admin',
  },
  {
    key: 'coach',
    title: 'Coach',
    description:
      'Operational access to assigned sessions, attendance, students, and progress notes.',
    icon: Trophy,
    tone: 'coach',
  },
  {
    key: 'parent',
    title: 'Parent',
    description:
      'Family portal access to children, attendance, invoices, subscriptions, and messages.',
    icon: Users,
    tone: 'parent',
  },
];

const modules: ModuleDefinition[] = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    description: 'View summary cards, charts, activity, and operational alerts.',
    icon: BarChart3,
    group: 'Core',
  },
  {
    key: 'users',
    title: 'Users',
    description: 'Manage user accounts, login access, and account status.',
    icon: UserCog,
    group: 'System',
    sensitive: true,
  },
  {
    key: 'students',
    title: 'Students',
    description: 'Manage student profiles, enrollment details, and records.',
    icon: Users,
    group: 'People',
  },
  {
    key: 'parents',
    title: 'Parents',
    description: 'Manage parent accounts, family details, and child links.',
    icon: Users,
    group: 'People',
  },
  {
    key: 'coaches',
    title: 'Coaches',
    description: 'Manage coaches, assignments, availability, and profiles.',
    icon: Trophy,
    group: 'People',
  },
  {
    key: 'programs',
    title: 'Programs',
    description: 'Manage sports programs, pricing, capacity, and settings.',
    icon: ClipboardCheck,
    group: 'Operations',
  },
  {
    key: 'branches',
    title: 'Branches',
    description: 'Manage academy locations, capacities, and branch data.',
    icon: Building2,
    group: 'Operations',
  },
  {
    key: 'schedule',
    title: 'Schedule',
    description: 'Create and manage sessions, calendars, and timetable changes.',
    icon: CalendarDays,
    group: 'Operations',
  },
  {
    key: 'attendance',
    title: 'Attendance',
    description: 'Mark, edit, review, and export attendance records.',
    icon: ClipboardCheck,
    group: 'Operations',
  },
  {
    key: 'finance',
    title: 'Finance',
    description: 'Manage subscriptions, invoices, payments, offers, and coupons.',
    icon: WalletCards,
    group: 'Finance',
    sensitive: true,
  },
  {
    key: 'reports',
    title: 'Reports',
    description: 'View and export performance, finance, and operational reports.',
    icon: FileText,
    group: 'Finance',
  },
  {
    key: 'notifications',
    title: 'Notifications',
    description: 'Create and manage user notifications and communication alerts.',
    icon: Bell,
    group: 'Operations',
  },
  {
    key: 'cms',
    title: 'Website CMS',
    description: 'Manage homepage, gallery, public content, and website sections.',
    icon: FileText,
    group: 'System',
    sensitive: true,
  },
  {
    key: 'settings',
    title: 'System Settings',
    description: 'Configure academy-wide preferences and system behavior.',
    icon: Settings,
    group: 'System',
    sensitive: true,
  },
  {
    key: 'auditLogs',
    title: 'Audit Logs',
    description: 'Review system activity, sensitive actions, and admin changes.',
    icon: Database,
    group: 'System',
    sensitive: true,
  },
];

const permissions: PermissionDefinition[] = [
  {
    key: 'view',
    label: 'View',
    description: 'Can open and read module data.',
    icon: Eye,
  },
  {
    key: 'create',
    label: 'Create',
    description: 'Can add new records.',
    icon: KeyRound,
  },
  {
    key: 'edit',
    label: 'Edit',
    description: 'Can update existing records.',
    icon: Pencil,
  },
  {
    key: 'delete',
    label: 'Delete',
    description: 'Can remove or archive records.',
    icon: Trash2,
    dangerous: true,
  },
  {
    key: 'export',
    label: 'Export',
    description: 'Can download or export data.',
    icon: FileText,
  },
  {
    key: 'approve',
    label: 'Approve',
    description: 'Can approve requests and sensitive workflows.',
    icon: CheckCircle2,
  },
];

const emptyModulePermissions: Record<ModuleKey, Record<PermissionKey, boolean>> =
  modules.reduce(
    (acc, module) => {
      acc[module.key] = {
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
        approve: false,
      };

      return acc;
    },
    {} as Record<ModuleKey, Record<PermissionKey, boolean>>,
  );

const initialPermissions: RolePermissions = {
  admin: modules.reduce(
    (acc, module) => {
      acc[module.key] = {
        view: true,
        create: true,
        edit: true,
        delete: true,
        export: true,
        approve: true,
      };

      return acc;
    },
    {} as Record<ModuleKey, Record<PermissionKey, boolean>>,
  ),

  coach: {
    ...emptyModulePermissions,
    dashboard: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    students: {
      view: true,
      create: false,
      edit: true,
      delete: false,
      export: false,
      approve: false,
    },
    schedule: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    attendance: {
      view: true,
      create: true,
      edit: true,
      delete: false,
      export: false,
      approve: false,
    },
    reports: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    notifications: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
  },

  parent: {
    ...emptyModulePermissions,
    dashboard: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    students: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    attendance: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    finance: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    reports: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
    notifications: {
      view: true,
      create: false,
      edit: false,
      delete: false,
      export: false,
      approve: false,
    },
  },
};

const moduleGroups: ModuleDefinition['group'][] = [
  'Core',
  'People',
  'Operations',
  'Finance',
  'System',
];

export default function RolesPermissionsPage() {
  const [activeRole, setActiveRole] = useState<RoleKey>('admin');
  const [activeGroup, setActiveGroup] =
    useState<ModuleDefinition['group']>('Core');
  const [searchTerm, setSearchTerm] = useState('');
  const [rolePermissions, setRolePermissions] =
    useState<RolePermissions>(initialPermissions);
  const [savedMessage, setSavedMessage] = useState('');

  const activeRoleMeta = roles.find((role) => role.key === activeRole) ?? roles[0];

  const filteredModules = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return modules.filter((module) => {
      const matchesGroup = module.group === activeGroup;

      const matchesSearch =
        !normalizedSearch ||
        module.title.toLowerCase().includes(normalizedSearch) ||
        module.description.toLowerCase().includes(normalizedSearch) ||
        module.group.toLowerCase().includes(normalizedSearch);

      return matchesGroup && matchesSearch;
    });
  }, [activeGroup, searchTerm]);

  const enabledCount = useMemo(() => {
    return Object.values(rolePermissions[activeRole]).reduce(
      (total, modulePermission) =>
        total +
        Object.values(modulePermission).filter((permission) => permission).length,
      0,
    );
  }, [activeRole, rolePermissions]);

  const totalPermissionCount = modules.length * permissions.length;

  const togglePermission = (moduleKey: ModuleKey, permissionKey: PermissionKey) => {
    if (activeRole === 'admin' && moduleKey === 'settings' && permissionKey === 'view') {
      return;
    }

    setRolePermissions((current) => ({
      ...current,
      [activeRole]: {
        ...current[activeRole],
        [moduleKey]: {
          ...current[activeRole][moduleKey],
          [permissionKey]: !current[activeRole][moduleKey][permissionKey],
        },
      },
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const setModulePermissions = (moduleKey: ModuleKey, value: boolean) => {
    setRolePermissions((current) => ({
      ...current,
      [activeRole]: {
        ...current[activeRole],
        [moduleKey]: {
          view:
            activeRole === 'admin' && moduleKey === 'settings'
              ? true
              : value,
          create: value,
          edit: value,
          delete: value,
          export: value,
          approve: value,
        },
      },
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const handleResetRole = () => {
    setRolePermissions((current) => ({
      ...current,
      [activeRole]: initialPermissions[activeRole],
    }));

    setSavedMessage(`${activeRoleMeta.title} permissions restored to default.`);
  };

  const handleSave = () => {
    setSavedMessage(
      'Permissions saved locally. Backend persistence will be connected in the API phase.',
    );
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <ShieldCheck className="h-4 w-4" />
              Access Control Center
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Roles & Permissions
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Configure role-based access across the academy system. Control who
              can view, create, edit, delete, export, and approve actions inside
              every operational module.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroMetric
              icon={Lock}
              label="Public Register"
              value="No Admin Access"
            />
            <HeroMetric
              icon={UserCog}
              label="Managed Roles"
              value="Admin / Coach / Parent"
            />
            <HeroMetric
              icon={SlidersHorizontal}
              label="Current Mode"
              value="Frontend Mock"
            />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm font-bold leading-6 text-green-700 dark:text-green-300">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[22rem_1fr]">
        <aside className="space-y-4">
          <div className="rounded-[2rem] border border-border bg-card p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-3 px-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black">System Roles</p>
                <p className="text-xs font-bold text-muted-foreground">
                  Select a role to configure
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {roles.map((role) => {
                const Icon = role.icon;
                const isActive = activeRole === role.key;
                const roleEnabledCount = Object.values(
                  rolePermissions[role.key],
                ).reduce(
                  (total, modulePermission) =>
                    total +
                    Object.values(modulePermission).filter(Boolean).length,
                  0,
                );

                return (
                  <button
                    key={role.key}
                    type="button"
                    onClick={() => setActiveRole(role.key)}
                    className={[
                      'w-full rounded-2xl border p-4 text-start transition',
                      isActive
                        ? 'border-brand-yellow bg-brand-yellow text-brand-blue shadow-[0_16px_35px_rgba(255,212,0,0.18)]'
                        : 'border-transparent text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground',
                    ].join(' ')}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={[
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                          isActive
                            ? 'bg-brand-blue/10 text-brand-blue'
                            : 'bg-background text-muted-foreground',
                        ].join(' ')}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black">
                          {role.title}
                        </span>

                        <span
                          className={[
                            'mt-1 block text-xs font-semibold leading-5',
                            isActive
                              ? 'text-brand-blue/70'
                              : 'text-muted-foreground',
                          ].join(' ')}
                        >
                          {role.description}
                        </span>

                        <span
                          className={[
                            'mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-black',
                            isActive
                              ? 'bg-brand-blue/10 text-brand-blue'
                              : 'bg-brand-yellow/15 text-brand-blue dark:text-brand-yellow',
                          ].join(' ')}
                        >
                          {roleEnabledCount} enabled permissions
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-brand-yellow/30 bg-brand-yellow/10 p-5 text-brand-blue shadow-sm dark:text-brand-yellow">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
              <AlertTriangle className="h-5 w-5" />
            </div>

            <p className="text-sm font-black">Security Note</p>
            <p className="mt-2 text-xs font-bold leading-6 text-muted-foreground">
              Admin access should never be available through public
              registration. Keep sensitive modules restricted to trusted admin
              users only.
            </p>
          </div>
        </aside>

        <main className="space-y-6">
          <PermissionsPanel
            icon={activeRoleMeta.icon}
            title={`${activeRoleMeta.title} Permissions`}
            description={activeRoleMeta.description}
            actions={
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleResetRole}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reset Role
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Save className="h-4 w-4" />
                  Save Permissions
                </button>
              </div>
            }
          >
            <div className="mb-6 grid gap-4 lg:grid-cols-3">
              <StatusCard
                icon={CheckCircle2}
                title={`${enabledCount} / ${totalPermissionCount}`}
                description="Enabled permissions for the selected role."
                tone="success"
              />

              <StatusCard
                icon={ShieldCheck}
                title="Role Guarded"
                description="Permissions are configured at UI level and ready for backend persistence."
                tone="info"
              />

              <StatusCard
                icon={AlertTriangle}
                title="Sensitive Modules"
                description="Finance, users, settings, CMS, and audit logs require special care."
                tone="warning"
              />
            </div>

            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search modules..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {moduleGroups.map((group) => {
                  const isActive = activeGroup === group;

                  return (
                    <button
                      key={group}
                      type="button"
                      onClick={() => setActiveGroup(group)}
                      className={[
                        'rounded-full px-4 py-2 text-xs font-black transition',
                        isActive
                          ? 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue'
                          : 'bg-secondary text-muted-foreground hover:bg-brand-blue/10 hover:text-brand-blue dark:hover:text-brand-yellow',
                      ].join(' ')}
                    >
                      {group}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-background/70 dark:bg-white/[0.03]">
              <div className="hidden border-b border-border bg-secondary/80 px-5 py-4 lg:grid lg:grid-cols-[1.4fr_repeat(6,6rem)_8rem] lg:items-center lg:gap-3">
                <div className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                  Module
                </div>

                {permissions.map((permission) => (
                  <div
                    key={permission.key}
                    className="text-center text-xs font-black uppercase tracking-[0.12em] text-muted-foreground"
                  >
                    {permission.label}
                  </div>
                ))}

                <div className="text-center text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
                  All
                </div>
              </div>

              <div className="divide-y divide-border">
                {filteredModules.length > 0 ? (
                  filteredModules.map((module) => (
                    <PermissionModuleRow
                      key={module.key}
                      module={module}
                      roleKey={activeRole}
                      modulePermissions={rolePermissions[activeRole][module.key]}
                      onTogglePermission={(permissionKey) =>
                        togglePermission(module.key, permissionKey)
                      }
                      onSetAll={(value) =>
                        setModulePermissions(module.key, value)
                      }
                    />
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                      <Search className="h-7 w-7" />
                    </div>

                    <h3 className="text-lg font-black">No modules found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try another search term or choose a different module group.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </PermissionsPanel>
        </main>
      </section>
    </div>
  );
}

function PermissionModuleRow({
  module,
  roleKey,
  modulePermissions,
  onTogglePermission,
  onSetAll,
}: {
  module: ModuleDefinition;
  roleKey: RoleKey;
  modulePermissions: Record<PermissionKey, boolean>;
  onTogglePermission: (permissionKey: PermissionKey) => void;
  onSetAll: (value: boolean) => void;
}) {
  const Icon = module.icon;
  const enabledInModule = Object.values(modulePermissions).filter(Boolean).length;
  const isAllEnabled = enabledInModule === permissions.length;

  return (
    <div className="grid gap-4 p-4 lg:grid-cols-[1.4fr_repeat(6,6rem)_8rem] lg:items-center lg:gap-3 lg:px-5">
      <div className="flex items-start gap-3">
        <div
          className={[
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
            module.sensitive
              ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
              : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
          ].join(' ')}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black">{module.title}</h3>

            {module.sensitive ? (
              <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-black text-red-600 dark:text-red-300">
                Sensitive
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
            {module.description}
          </p>

          <p className="mt-2 text-[11px] font-black text-brand-blue dark:text-brand-yellow">
            {enabledInModule} permissions enabled
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:contents">
        {permissions.map((permission) => {
          const isChecked = modulePermissions[permission.key];
          const isLocked =
            roleKey === 'admin' &&
            module.key === 'settings' &&
            permission.key === 'view';

          return (
            <PermissionButton
              key={permission.key}
              permission={permission}
              checked={isChecked}
              locked={isLocked}
              onClick={() => onTogglePermission(permission.key)}
            />
          );
        })}

        <button
          type="button"
          onClick={() => onSetAll(!isAllEnabled)}
          className={[
            'inline-flex h-11 items-center justify-center rounded-full border px-4 text-xs font-black transition lg:h-10',
            isAllEnabled
              ? 'border-brand-yellow bg-brand-yellow text-brand-blue'
              : 'border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground',
          ].join(' ')}
        >
          {isAllEnabled ? 'Enabled' : 'Enable All'}
        </button>
      </div>
    </div>
  );
}

function PermissionButton({
  permission,
  checked,
  locked,
  onClick,
}: {
  permission: PermissionDefinition;
  checked: boolean;
  locked?: boolean;
  onClick: () => void;
}) {
  const Icon = permission.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={locked}
      title={locked ? 'Required permission' : permission.description}
      className={[
        'inline-flex h-11 items-center justify-center gap-2 rounded-full border px-3 text-xs font-black transition lg:h-10',
        checked
          ? permission.dangerous
            ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-300'
            : 'border-brand-yellow bg-brand-yellow text-brand-blue'
          : 'border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground',
        locked ? 'cursor-not-allowed opacity-80' : '',
      ].join(' ')}
    >
      <Icon className="h-4 w-4" />
      <span className="lg:hidden xl:inline">{permission.label}</span>
      {locked ? <Lock className="h-3.5 w-3.5" /> : null}
    </button>
  );
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function PermissionsPanel({
  icon: Icon,
  title,
  description,
  actions,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-5 border-b border-border bg-gradient-to-r from-brand-blue/[0.06] via-card to-brand-yellow/10 p-5 dark:from-white/[0.04] dark:via-card dark:to-brand-yellow/10 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <Icon className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">{title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {actions}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function StatusCard({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: 'info' | 'warning' | 'success';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
      : tone === 'warning'
        ? 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-blue dark:text-brand-yellow'
        : 'border-brand-blue/20 bg-brand-blue/10 text-brand-blue dark:text-blue-300';

  return (
    <article className={`rounded-[2rem] border p-5 ${toneClass}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-current dark:bg-white/10">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="text-sm font-black">{title}</h3>
      <p className="mt-2 text-xs font-bold leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}