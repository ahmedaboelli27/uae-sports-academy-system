import { adminApi } from '@/services/api/admin-api';
import type { User } from '@/types/user.types';
import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2,
  Clock3,
  Eye,
  Filter,
  Lock,
  Mail,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  UserRound,
  Users,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type UserFilterValue = 'all' | string;

function getUserFullName(user: User) {
  const firstName = user.firstName ?? '';
  const lastName = user.lastName ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || user.email || 'Unknown User';
}

function normalizeValue(value: unknown) {
  return String(value ?? '').trim();
}

function formatLabel(value: unknown) {
  const text = normalizeValue(value);

  if (!text) {
    return 'Not available';
  }

  return text
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserFilterValue>('all');
  const [statusFilter, setStatusFilter] = useState<UserFilterValue>('all');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;

    setLoading(true);

    void adminApi
      .getUsers({ search, page: 1, pageSize: 50 })
      .then((result) => {
        if (!mounted) {
          return;
        }

        setItems(result.data);

        setSelectedUserId((currentId) => {
          if (currentId) {
            return currentId;
          }

          return result.data[0]?.id ?? '';
        });
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [search, refreshKey]);

  const roleOptions = useMemo(() => {
    const roles = Array.from(
      new Set(items.map((user) => normalizeValue(user.role)).filter(Boolean)),
    );

    return roles;
  }, [items]);

  const statusOptions = useMemo(() => {
    const statuses = Array.from(
      new Set(items.map((user) => normalizeValue(user.status)).filter(Boolean)),
    );

    return statuses;
  }, [items]);

  const filteredUsers = useMemo(() => {
    return items.filter((user) => {
      const matchesRole =
        roleFilter === 'all' || normalizeValue(user.role) === roleFilter;

      const matchesStatus =
        statusFilter === 'all' || normalizeValue(user.status) === statusFilter;

      return matchesRole && matchesStatus;
    });
  }, [items, roleFilter, statusFilter]);

  const selectedUser = useMemo(() => {
    if (!filteredUsers.length && !items.length) {
      return null;
    }

    return (
      filteredUsers.find((user) => user.id === selectedUserId) ??
      filteredUsers[0] ??
      items[0] ??
      null
    );
  }, [filteredUsers, items, selectedUserId]);

  const activeUsersCount = useMemo(() => {
    return items.filter((user) => {
      const status = normalizeValue(user.status).toLowerCase();

      return status === 'active' || status === 'enabled';
    }).length;
  }, [items]);

  const inactiveUsersCount = useMemo(() => {
    return items.filter((user) => {
      const status = normalizeValue(user.status).toLowerCase();

      return (
        status === 'inactive' ||
        status === 'disabled' ||
        status === 'suspended' ||
        status === 'blocked'
      );
    }).length;
  }, [items]);

  const adminUsersCount = useMemo(() => {
    return items.filter((user) =>
      normalizeValue(user.role).toLowerCase().includes('admin'),
    ).length;
  }, [items]);

  const resetFilters = () => {
    setSearch('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  const refreshUsers = () => {
    setRefreshKey((value) => value + 1);
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <UserCog className="h-4 w-4" />
              Access Control
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Users & Staff Management
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Manage system users, roles, account status, access visibility, and
              operational staff accounts across admin, finance, coaches, and
              parent-facing workflows.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refreshUsers}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <Link
                to="/admin/users/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                New User
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric icon={Users} label="Total Users" value={`${items.length}`} />
            <HeroMetric
              icon={CheckCircle2}
              label="Active Users"
              value={`${activeUsersCount}`}
            />
            <HeroMetric
              icon={ShieldCheck}
              label="Admin Users"
              value={`${adminUsersCount}`}
            />
            <HeroMetric
              icon={Lock}
              label="Inactive / Suspended"
              value={`${inactiveUsersCount}`}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Users}
          label="Total Users"
          value={items.length}
          tone="blue"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Active Users"
          value={activeUsersCount}
          tone="green"
        />

        <SummaryCard
          icon={ShieldCheck}
          label="Admin Users"
          value={adminUsersCount}
          tone="yellow"
        />

        <SummaryCard
          icon={XCircle}
          label="Inactive / Suspended"
          value={inactiveUsersCount}
          tone="red"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <SlidersHorizontal className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  User Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter users by name, email, role, and account
                  status.
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
              >
                <Filter className="h-4 w-4" />
                Reset Filters
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_repeat(2,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Search</span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by name, email, or phone"
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Role"
                value={roleFilter}
                allLabel="All roles"
                options={roleOptions.map((role) => ({
                  value: role,
                  label: formatLabel(role),
                }))}
                onChange={setRoleFilter}
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                allLabel="All statuses"
                options={statusOptions.map((status) => ({
                  value: status,
                  label: formatLabel(status),
                }))}
                onChange={setStatusFilter}
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black">Users List</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Review user accounts, assigned roles, and account activation
                  status.
                </p>
              </div>

              <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
                {loading ? 'Loading...' : `${filteredUsers.length} results`}
              </div>
            </div>

            {loading ? (
              <UsersLoadingState />
            ) : filteredUsers.length > 0 ? (
              <>
                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full min-w-[980px] border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-secondary/60 text-start">
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Access Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          onClick={() => setSelectedUserId(user.id)}
                          className={[
                            'cursor-pointer border-b border-border last:border-b-0 hover:bg-secondary/35',
                            selectedUser?.id === user.id
                              ? 'bg-brand-yellow/10'
                              : '',
                          ].join(' ')}
                        >
                          <TableCell>
                            <UserIdentity user={user} />
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-brand-blue dark:text-brand-yellow" />
                              <span className="font-bold">{user.email}</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <RoleBadge value={normalizeValue(user.role)} />
                          </TableCell>

                          <TableCell>
                            <StatusBadge value={normalizeValue(user.status)} />
                          </TableCell>

                          <TableCell>
                            <p className="max-w-xs text-sm font-semibold leading-6 text-muted-foreground">
                              {getAccessNote(user)}
                            </p>
                          </TableCell>

                          <TableCell>
                            <UserActions userId={user.id} />
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 p-5 xl:hidden">
                  {filteredUsers.map((user) => (
                    <UserMobileCard
                      key={user.id}
                      user={user}
                      active={selectedUser?.id === user.id}
                      onSelect={() => setSelectedUserId(user.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <UserDetailsPanel user={selectedUser} />

          <StatusCard
            icon={ShieldCheck}
            title="Access Control Ready"
            description="This page is connected to the admin users API and is ready for role assignment, password reset, and account activation endpoints."
            tone="success"
          />

          <StatusCard
            icon={Clock3}
            title="Backend Next"
            description="Later we can connect enable/disable account, reset password, and assign role actions to real API endpoints."
            tone="warning"
          />
        </aside>
      </section>
    </main>
  );
}

function UserIdentity({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <UserRound className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{getUserFullName(user)}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          ID: {user.id}
        </p>
      </div>
    </div>
  );
}

function UserMobileCard({
  user,
  active,
  onSelect,
}: {
  user: User;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      onClick={onSelect}
      className={[
        'cursor-pointer rounded-[2rem] border p-5 transition',
        active
          ? 'border-brand-yellow bg-brand-yellow/10'
          : 'border-border bg-background hover:bg-secondary/60',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <UserIdentity user={user} />
        <UserActions userId={user.id} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine label="Email" value={user.email} />
        <InfoLine label="Role" value={formatLabel(user.role)} />
        <InfoLine label="Status" value={formatLabel(user.status)} />
        <InfoLine label="Access" value={getAccessNote(user)} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <RoleBadge value={normalizeValue(user.role)} />
        <StatusBadge value={normalizeValue(user.status)} />
      </div>
    </article>
  );
}

function UserDetailsPanel({ user }: { user: User | null }) {
  if (!user) {
    return (
      <aside className="rounded-[2rem] border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
          <Users className="h-8 w-8" />
        </div>

        <h3 className="text-lg font-black">No user selected</h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Select a user from the list to preview account and access details.
        </p>
      </aside>
    );
  }

  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <UserRound className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          User Account
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {getUserFullName(user)}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {user.email}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <RoleBadge value={normalizeValue(user.role)} />
          <StatusBadge value={normalizeValue(user.status)} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={UserRound} label="Full Name" value={getUserFullName(user)} />

        <DetailLine icon={Mail} label="Email" value={user.email} />

        <DetailLine icon={ShieldCheck} label="Role" value={formatLabel(user.role)} />

        <DetailLine icon={Lock} label="Status" value={formatLabel(user.status)} />

        <DetailLine icon={UserCog} label="Access Note" value={getAccessNote(user)} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/admin/users/${user.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>

          <Link
            to={`/admin/users/${user.id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </div>
      </div>
    </aside>
  );
}

function getAccessNote(user: User) {
  const role = normalizeValue(user.role).toLowerCase();

  if (role.includes('admin')) {
    return 'Full system access according to admin permissions.';
  }

  if (role.includes('coach')) {
    return 'Coach access for schedules, students, and attendance workflows.';
  }

  if (role.includes('finance')) {
    return 'Finance access for subscriptions, invoices, and payments.';
  }

  if (role.includes('parent')) {
    return 'Parent account access for linked students and subscriptions.';
  }

  return 'Standard user access controlled by assigned role.';
}

function UserActions({ userId }: { userId: string }) {
  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Link
        to={`/admin/users/${userId}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="View"
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/users/${userId}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

function RoleBadge({ value }: { value: string }) {
  const role = value.toLowerCase();

  const className = role.includes('admin')
    ? 'bg-brand-yellow text-brand-blue'
    : role.includes('coach')
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
      : role.includes('finance')
        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
        : role.includes('parent')
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {formatLabel(value)}
    </span>
  );
}

function StatusBadge({ value }: { value: string }) {
  const status = value.toLowerCase();

  const className =
    status === 'active' || status === 'enabled'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'pending'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : status === 'suspended' ||
          status === 'blocked' ||
          status === 'disabled' ||
          status === 'inactive'
          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {formatLabel(value)}
    </span>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  allLabel: string;
  options: Array<{
    value: string;
    label: string;
  }>;
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      >
        <option value="all">{allLabel}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: 'blue' | 'green' | 'yellow' | 'red';
}) {
  const toneClasses = {
    blue: 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue',
    green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    yellow:
      'bg-brand-yellow text-brand-blue dark:bg-brand-yellow dark:text-brand-blue',
    red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  };

  return (
    <article className="rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <p className="mt-5 text-sm font-bold text-muted-foreground">{label}</p>

      <p className="mt-2 text-3xl font-black text-brand-blue dark:text-white">
        {value}
      </p>
    </article>
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

function DetailLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="break-words text-sm font-black">{value}</p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-black">{value}</p>
    </div>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="px-5 py-4 text-start text-xs font-black uppercase tracking-wide text-muted-foreground">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="px-5 py-4 align-middle text-sm">{children}</td>;
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
  tone: 'success' | 'warning';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
      : 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-blue dark:text-brand-yellow';

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

function UsersLoadingState() {
  return (
    <div className="space-y-4 p-5 sm:p-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-2xl bg-secondary"
        />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <Users className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No users found</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Try another search term, role filter, or status filter.
      </p>
    </div>
  );
}