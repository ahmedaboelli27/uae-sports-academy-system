import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Database,
  Download,
  Eye,
  FileText,
  Filter,
  Fingerprint,
  Globe2,
  KeyRound,
  Lock,
  Monitor,
  RefreshCcw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
  UserCog,
  XCircle
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

type AuditRisk = 'low' | 'medium' | 'high' | 'critical';

type AuditAction =
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'export'
  | 'approve'
  | 'security'
  | 'settings';

type AuditModule =
  | 'Auth'
  | 'Users'
  | 'Students'
  | 'Finance'
  | 'Settings'
  | 'Roles'
  | 'Attendance'
  | 'Reports'
  | 'CMS';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorEmail: string;
  actorRole: 'Admin' | 'Coach' | 'Parent' | 'System';
  action: AuditAction;
  module: AuditModule;
  target: string;
  description: string;
  risk: AuditRisk;
  ipAddress: string;
  device: 'desktop' | 'mobile' | 'system';
  location: string;
  status: 'success' | 'warning' | 'failed';
}

interface FilterOption<T extends string> {
  label: string;
  value: T | 'all';
}

const auditLogs: AuditLogEntry[] = [
  {
    id: 'AUD-1001',
    timestamp: '2026-05-26 20:42',
    actorName: 'Admin User',
    actorEmail: 'admin@academy.ae',
    actorRole: 'Admin',
    action: 'settings',
    module: 'Settings',
    target: 'System Settings',
    description: 'Updated academy public website and notification settings.',
    risk: 'high',
    ipAddress: '192.168.1.24',
    device: 'desktop',
    location: 'Dubai, UAE',
    status: 'success',
  },
  {
    id: 'AUD-1002',
    timestamp: '2026-05-26 20:36',
    actorName: 'Admin User',
    actorEmail: 'admin@academy.ae',
    actorRole: 'Admin',
    action: 'update',
    module: 'Roles',
    target: 'Coach Permissions',
    description: 'Changed attendance edit permissions for coach role.',
    risk: 'critical',
    ipAddress: '192.168.1.24',
    device: 'desktop',
    location: 'Dubai, UAE',
    status: 'success',
  },
  {
    id: 'AUD-1003',
    timestamp: '2026-05-26 19:58',
    actorName: 'System',
    actorEmail: 'system@academy.local',
    actorRole: 'System',
    action: 'security',
    module: 'Auth',
    target: 'Login Protection',
    description: 'Blocked repeated failed login attempts for one account.',
    risk: 'critical',
    ipAddress: '10.0.0.18',
    device: 'system',
    location: 'System rule',
    status: 'warning',
  },
  {
    id: 'AUD-1004',
    timestamp: '2026-05-26 18:20',
    actorName: 'Admin User',
    actorEmail: 'admin@academy.ae',
    actorRole: 'Admin',
    action: 'create',
    module: 'Users',
    target: 'Coach Account',
    description: 'Created a new inactive coach account pending approval.',
    risk: 'medium',
    ipAddress: '192.168.1.24',
    device: 'desktop',
    location: 'Dubai, UAE',
    status: 'success',
  },
  {
    id: 'AUD-1005',
    timestamp: '2026-05-26 17:45',
    actorName: 'Finance Admin',
    actorEmail: 'finance@academy.ae',
    actorRole: 'Admin',
    action: 'export',
    module: 'Finance',
    target: 'Invoices Report',
    description: 'Exported invoice summary report for May 2026.',
    risk: 'high',
    ipAddress: '192.168.1.31',
    device: 'desktop',
    location: 'Abu Dhabi, UAE',
    status: 'success',
  },
  {
    id: 'AUD-1006',
    timestamp: '2026-05-26 16:11',
    actorName: 'Coach Omar',
    actorEmail: 'coach.omar@academy.ae',
    actorRole: 'Coach',
    action: 'update',
    module: 'Attendance',
    target: 'Session ATT-421',
    description: 'Updated attendance records for assigned football session.',
    risk: 'low',
    ipAddress: '172.16.0.44',
    device: 'mobile',
    location: 'Dubai Branch',
    status: 'success',
  },
  {
    id: 'AUD-1007',
    timestamp: '2026-05-26 15:22',
    actorName: 'Parent Account',
    actorEmail: 'parent@example.com',
    actorRole: 'Parent',
    action: 'login',
    module: 'Auth',
    target: 'Parent Portal',
    description: 'Parent signed in successfully from a mobile device.',
    risk: 'low',
    ipAddress: '185.44.20.11',
    device: 'mobile',
    location: 'Sharjah, UAE',
    status: 'success',
  },
  {
    id: 'AUD-1008',
    timestamp: '2026-05-26 14:05',
    actorName: 'Admin User',
    actorEmail: 'admin@academy.ae',
    actorRole: 'Admin',
    action: 'delete',
    module: 'Students',
    target: 'Student STU-118',
    description: 'Archived a student record using soft delete.',
    risk: 'high',
    ipAddress: '192.168.1.24',
    device: 'desktop',
    location: 'Dubai, UAE',
    status: 'success',
  },
  {
    id: 'AUD-1009',
    timestamp: '2026-05-26 13:37',
    actorName: 'Admin User',
    actorEmail: 'admin@academy.ae',
    actorRole: 'Admin',
    action: 'approve',
    module: 'Users',
    target: 'Coach Request',
    description: 'Approved coach access request after review.',
    risk: 'medium',
    ipAddress: '192.168.1.24',
    device: 'desktop',
    location: 'Dubai, UAE',
    status: 'success',
  },
  {
    id: 'AUD-1010',
    timestamp: '2026-05-26 12:10',
    actorName: 'Unknown',
    actorEmail: 'unknown',
    actorRole: 'System',
    action: 'login',
    module: 'Auth',
    target: 'Admin Portal',
    description: 'Failed login attempt using an unknown email address.',
    risk: 'critical',
    ipAddress: '45.91.22.10',
    device: 'desktop',
    location: 'Unknown',
    status: 'failed',
  },
  {
    id: 'AUD-1011',
    timestamp: '2026-05-25 21:48',
    actorName: 'Content Admin',
    actorEmail: 'content@academy.ae',
    actorRole: 'Admin',
    action: 'update',
    module: 'CMS',
    target: 'Homepage Hero',
    description: 'Updated public homepage hero content and gallery cards.',
    risk: 'medium',
    ipAddress: '192.168.1.27',
    device: 'desktop',
    location: 'Dubai, UAE',
    status: 'success',
  },
  {
    id: 'AUD-1012',
    timestamp: '2026-05-25 18:12',
    actorName: 'Admin User',
    actorEmail: 'admin@academy.ae',
    actorRole: 'Admin',
    action: 'export',
    module: 'Reports',
    target: 'Attendance Analytics',
    description: 'Exported academy-wide attendance analytics report.',
    risk: 'medium',
    ipAddress: '192.168.1.24',
    device: 'desktop',
    location: 'Dubai, UAE',
    status: 'success',
  },
];

const actionFilters: FilterOption<AuditAction>[] = [
  { label: 'All actions', value: 'all' },
  { label: 'Login', value: 'login' },
  { label: 'Create', value: 'create' },
  { label: 'Update', value: 'update' },
  { label: 'Delete', value: 'delete' },
  { label: 'Export', value: 'export' },
  { label: 'Approve', value: 'approve' },
  { label: 'Security', value: 'security' },
  { label: 'Settings', value: 'settings' },
];

const moduleFilters: FilterOption<AuditModule>[] = [
  { label: 'All modules', value: 'all' },
  { label: 'Auth', value: 'Auth' },
  { label: 'Users', value: 'Users' },
  { label: 'Students', value: 'Students' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Settings', value: 'Settings' },
  { label: 'Roles', value: 'Roles' },
  { label: 'Attendance', value: 'Attendance' },
  { label: 'Reports', value: 'Reports' },
  { label: 'CMS', value: 'CMS' },
];

const riskFilters: FilterOption<AuditRisk>[] = [
  { label: 'All risk levels', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<AuditAction | 'all'>(
    'all',
  );
  const [selectedModule, setSelectedModule] = useState<AuditModule | 'all'>(
    'all',
  );
  const [selectedRisk, setSelectedRisk] = useState<AuditRisk | 'all'>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [savedMessage, setSavedMessage] = useState('');

  const filteredLogs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return auditLogs.filter((log) => {
      const matchesSearch =
        !normalizedSearch ||
        log.id.toLowerCase().includes(normalizedSearch) ||
        log.actorName.toLowerCase().includes(normalizedSearch) ||
        log.actorEmail.toLowerCase().includes(normalizedSearch) ||
        log.module.toLowerCase().includes(normalizedSearch) ||
        log.target.toLowerCase().includes(normalizedSearch) ||
        log.description.toLowerCase().includes(normalizedSearch) ||
        log.ipAddress.toLowerCase().includes(normalizedSearch);

      const matchesAction =
        selectedAction === 'all' || log.action === selectedAction;

      const matchesModule =
        selectedModule === 'all' || log.module === selectedModule;

      const matchesRisk = selectedRisk === 'all' || log.risk === selectedRisk;

      return matchesSearch && matchesAction && matchesModule && matchesRisk;
    });
  }, [searchTerm, selectedAction, selectedModule, selectedRisk]);

  const criticalCount = auditLogs.filter((log) => log.risk === 'critical').length;
  const failedCount = auditLogs.filter((log) => log.status === 'failed').length;
  const highRiskCount = auditLogs.filter(
    (log) => log.risk === 'high' || log.risk === 'critical',
  ).length;

  const exportCsv = () => {
    const header = [
      'ID',
      'Timestamp',
      'Actor',
      'Email',
      'Role',
      'Action',
      'Module',
      'Target',
      'Risk',
      'IP',
      'Device',
      'Location',
      'Status',
      'Description',
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      log.timestamp,
      log.actorName,
      log.actorEmail,
      log.actorRole,
      log.action,
      log.module,
      log.target,
      log.risk,
      log.ipAddress,
      log.device,
      log.location,
      log.status,
      log.description,
    ]);

    const csvContent = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','),
      )
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'audit-logs.csv';
    link.click();
    URL.revokeObjectURL(link.href);

    setSavedMessage('Filtered audit logs exported locally as CSV.');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedAction('all');
    setSelectedModule('all');
    setSelectedRisk('all');
    setSavedMessage('');
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <Fingerprint className="h-4 w-4" />
              System Traceability
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Audit Logs
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Monitor every sensitive action across the academy platform:
              logins, user management, finance exports, settings changes,
              permissions updates, and security events.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroMetric icon={Activity} label="Total Events" value={`${auditLogs.length}`} />
            <HeroMetric icon={ShieldAlert} label="High Risk" value={`${highRiskCount}`} />
            <HeroMetric icon={XCircle} label="Failed Events" value={`${failedCount}`} />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm font-bold leading-6 text-green-700 dark:text-green-300">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-4">
        <StatusCard
          icon={Database}
          title={`${auditLogs.length} Logs`}
          description="Total events currently available in the frontend audit stream."
          tone="info"
        />
        <StatusCard
          icon={AlertTriangle}
          title={`${criticalCount} Critical`}
          description="Critical security or permission-related activities."
          tone="danger"
        />
        <StatusCard
          icon={ShieldCheck}
          title="Admin Only"
          description="This page should remain restricted to admin users."
          tone="success"
        />
        <StatusCard
          icon={Clock3}
          title="Mock Mode"
          description="Ready for backend persistence in the next phase."
          tone="warning"
        />
      </section>

      <section className="rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-5 border-b border-border bg-gradient-to-r from-brand-blue/[0.06] via-card to-brand-yellow/10 p-5 dark:from-white/[0.04] dark:via-card dark:to-brand-yellow/10 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
              <Filter className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Activity Stream
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Search, filter, inspect, and export audit events. Sensitive
                records are visually highlighted for fast admin review.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
            >
              <RefreshCcw className="h-4 w-4" />
              Reset
            </button>

            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-3 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by actor, email, module, target, IP..."
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </div>

            <FilterSelect
              icon={Activity}
              value={selectedAction}
              onChange={(value) =>
                setSelectedAction(value as AuditAction | 'all')
              }
              options={actionFilters}
            />

            <FilterSelect
              icon={Database}
              value={selectedModule}
              onChange={(value) =>
                setSelectedModule(value as AuditModule | 'all')
              }
              options={moduleFilters}
            />

            <FilterSelect
              icon={ShieldAlert}
              value={selectedRisk}
              onChange={(value) => setSelectedRisk(value as AuditRisk | 'all')}
              options={riskFilters}
            />
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-background/70 dark:bg-white/[0.03]">
            <div className="hidden border-b border-border bg-secondary/80 px-5 py-4 xl:grid xl:grid-cols-[10rem_1.1fr_8rem_9rem_8rem_7rem] xl:items-center xl:gap-4">
              <TableHead label="Time" />
              <TableHead label="Event" />
              <TableHead label="Module" />
              <TableHead label="Actor" />
              <TableHead label="Risk" />
              <TableHead label="Status" />
            </div>

            <div className="divide-y divide-border">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <AuditLogRow
                    key={log.id}
                    log={log}
                    onInspect={() => setSelectedLog(log)}
                  />
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                    <Search className="h-7 w-7" />
                  </div>

                  <h3 className="text-lg font-black">No audit logs found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try another search term or reset the current filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {selectedLog ? (
        <AuditDetailsModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      ) : null}
    </div>
  );
}

function AuditLogRow({
  log,
  onInspect,
}: {
  log: AuditLogEntry;
  onInspect: () => void;
}) {
  const ActionIcon = getActionIcon(log.action);
  const DeviceIcon = getDeviceIcon(log.device);

  return (
    <article className="grid gap-4 p-4 transition hover:bg-secondary/60 xl:grid-cols-[10rem_1.1fr_8rem_9rem_8rem_7rem] xl:items-center xl:gap-4 xl:px-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
          {log.id}
        </p>
        <p className="mt-1 text-sm font-black">{log.timestamp}</p>
      </div>

      <div className="flex items-start gap-3">
        <div
          className={[
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
            log.status === 'failed'
              ? 'bg-red-500/10 text-red-600 dark:text-red-300'
              : log.risk === 'critical'
                ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
                : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
          ].join(' ')}
        >
          <ActionIcon className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black capitalize">
              {log.action} — {log.target}
            </h3>
            <RiskBadge risk={log.risk} />
          </div>

          <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
            {log.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-bold text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <DeviceIcon className="h-3.5 w-3.5" />
              {log.device}
            </span>
            <span className="inline-flex items-center gap-1">
              <Globe2 className="h-3.5 w-3.5" />
              {log.ipAddress}
            </span>
          </div>
        </div>
      </div>

      <div>
        <MobileLabel>Module</MobileLabel>
        <p className="text-sm font-black">{log.module}</p>
      </div>

      <div>
        <MobileLabel>Actor</MobileLabel>
        <p className="truncate text-sm font-black">{log.actorName}</p>
        <p className="truncate text-xs font-bold text-muted-foreground">
          {log.actorRole}
        </p>
      </div>

      <div>
        <MobileLabel>Risk</MobileLabel>
        <RiskBadge risk={log.risk} />
      </div>

      <div className="flex items-center justify-between gap-3 xl:block">
        <div>
          <MobileLabel>Status</MobileLabel>
          <StatusBadge status={log.status} />
        </div>

        <button
          type="button"
          onClick={onInspect}
          className="mt-0 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-black text-foreground transition hover:bg-brand-blue hover:text-white dark:hover:bg-brand-yellow dark:hover:text-brand-blue xl:mt-3"
        >
          <Eye className="h-4 w-4" />
          Inspect
        </button>
      </div>
    </article>
  );
}

function AuditDetailsModal({
  log,
  onClose,
}: {
  log: AuditLogEntry;
  onClose: () => void;
}) {
  const ActionIcon = getActionIcon(log.action);
  const DeviceIcon = getDeviceIcon(log.device);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-brand-dark/65 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-border bg-gradient-to-r from-brand-blue/[0.08] via-card to-brand-yellow/10 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
              <ActionIcon className="h-7 w-7" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                {log.id}
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">
                Audit Event Details
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {log.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition hover:bg-brand-blue hover:text-white dark:hover:bg-brand-yellow dark:hover:text-brand-blue"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
          <DetailItem icon={CalendarDays} label="Timestamp" value={log.timestamp} />
          <DetailItem icon={UserCog} label="Actor" value={log.actorName} />
          <DetailItem icon={MailIcon} label="Actor Email" value={log.actorEmail} />
          <DetailItem icon={ShieldCheck} label="Actor Role" value={log.actorRole} />
          <DetailItem icon={Activity} label="Action" value={log.action} />
          <DetailItem icon={Database} label="Module" value={log.module} />
          <DetailItem icon={FileText} label="Target" value={log.target} />
          <DetailItem icon={ShieldAlert} label="Risk" value={log.risk} />
          <DetailItem icon={Globe2} label="IP Address" value={log.ipAddress} />
          <DetailItem icon={DeviceIcon} label="Device" value={log.device} />
          <DetailItem icon={MapPinIcon} label="Location" value={log.location} />
          <DetailItem icon={CheckCircle2} label="Status" value={log.status} />
        </div>
      </div>
    </div>
  );
}

function FilterSelect<T extends string>({
  icon: Icon,
  value,
  onChange,
  options,
}: {
  icon: LucideIcon;
  value: T | 'all';
  onChange: (value: T | 'all') => void;
  options: FilterOption<T>[];
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T | 'all')}
        className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
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

function StatusCard({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: 'info' | 'warning' | 'success' | 'danger';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
      : tone === 'danger'
        ? 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300'
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

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/80 p-4 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="break-words text-sm font-black">{value}</p>
    </div>
  );
}

function RiskBadge({ risk }: { risk: AuditRisk }) {
  const className =
    risk === 'critical'
      ? 'bg-red-500 text-white'
      : risk === 'high'
        ? 'bg-orange-500/15 text-orange-700 dark:text-orange-300'
        : risk === 'medium'
          ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
          : 'bg-green-500/10 text-green-700 dark:text-green-300';

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-black capitalize ${className}`}>
      {risk}
    </span>
  );
}

function StatusBadge({ status }: { status: AuditLogEntry['status'] }) {
  const className =
    status === 'success'
      ? 'bg-green-500/10 text-green-700 dark:text-green-300'
      : status === 'warning'
        ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
        : 'bg-red-500/10 text-red-700 dark:text-red-300';

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-black capitalize ${className}`}>
      {status}
    </span>
  );
}

function TableHead({ label }: { label: string }) {
  return (
    <div className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
      {label}
    </div>
  );
}

function MobileLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-1 text-[11px] font-black uppercase tracking-[0.14em] text-muted-foreground xl:hidden">
      {children}
    </p>
  );
}

function getActionIcon(action: AuditAction): LucideIcon {
  const icons: Record<AuditAction, LucideIcon> = {
    login: KeyRound,
    logout: Lock,
    create: CheckCircle2,
    update: FileText,
    delete: Trash2,
    export: Download,
    approve: ShieldCheck,
    security: ShieldAlert,
    settings: Settings,
  };

  return icons[action];
}

function getDeviceIcon(device: AuditLogEntry['device']): LucideIcon {
  const icons: Record<AuditLogEntry['device'], LucideIcon> = {
    desktop: Monitor,
    mobile: Smartphone,
    system: Database,
  };

  return icons[device];
}

const MailIcon = Globe2;
const MapPinIcon = Globe2;