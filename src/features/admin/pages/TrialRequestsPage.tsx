import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Eye,
  FileText,
  Filter,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

type TrialStatus =
  | 'new'
  | 'contacted'
  | 'scheduled'
  | 'approved'
  | 'rejected';

type TrialPriority = 'low' | 'normal' | 'high' | 'urgent';

interface TrialRequest {
  id: string;
  childName: string;
  childAge: number;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  preferredProgram: string;
  preferredBranch: string;
  preferredDate: string;
  preferredTime: string;
  source: 'Website' | 'WhatsApp' | 'Instagram' | 'Facebook' | 'Referral';
  status: TrialStatus;
  priority: TrialPriority;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  notes: string;
}

const initialTrialRequests: TrialRequest[] = [
  {
    id: 'TR-1001',
    childName: 'Omar Khaled',
    childAge: 9,
    parentName: 'Khaled Hassan',
    parentPhone: '+971 50 123 4567',
    parentEmail: 'khaled.parent@example.com',
    preferredProgram: 'Football Development',
    preferredBranch: 'Dubai Main Branch',
    preferredDate: '2026-05-28',
    preferredTime: '05:00 PM',
    source: 'Website',
    status: 'new',
    priority: 'urgent',
    assignedTo: 'Unassigned',
    createdAt: '2026-05-26 08:35 PM',
    lastContact: 'Not contacted yet',
    notes:
      'Parent requested a weekend trial if possible. Child has previous football experience.',
  },
  {
    id: 'TR-1002',
    childName: 'Mariam Ali',
    childAge: 7,
    parentName: 'Ali Mansour',
    parentPhone: '+971 55 222 8844',
    parentEmail: 'ali.mansour@example.com',
    preferredProgram: 'Swimming Academy',
    preferredBranch: 'Abu Dhabi Branch',
    preferredDate: '2026-05-29',
    preferredTime: '04:30 PM',
    source: 'Instagram',
    status: 'contacted',
    priority: 'high',
    assignedTo: 'Admissions Team',
    createdAt: '2026-05-26 06:12 PM',
    lastContact: '2026-05-26 07:20 PM',
    notes:
      'Parent asked about beginner swimming level and coach availability for girls group.',
  },
  {
    id: 'TR-1003',
    childName: 'Yousef Ahmed',
    childAge: 12,
    parentName: 'Ahmed Nasser',
    parentPhone: '+971 52 987 1100',
    parentEmail: 'ahmed.nasser@example.com',
    preferredProgram: 'Basketball Skills',
    preferredBranch: 'Sharjah Branch',
    preferredDate: '2026-05-30',
    preferredTime: '06:00 PM',
    source: 'WhatsApp',
    status: 'scheduled',
    priority: 'normal',
    assignedTo: 'Coach Omar',
    createdAt: '2026-05-26 04:50 PM',
    lastContact: '2026-05-26 05:25 PM',
    notes:
      'Trial confirmed with coach. Parent needs location pin and reminder before session.',
  },
  {
    id: 'TR-1004',
    childName: 'Sara Mohamed',
    childAge: 6,
    parentName: 'Mohamed Sami',
    parentPhone: '+971 58 300 9090',
    parentEmail: 'm.sami@example.com',
    preferredProgram: 'Fitness & Movement',
    preferredBranch: 'Dubai Main Branch',
    preferredDate: '2026-06-01',
    preferredTime: '03:30 PM',
    source: 'Facebook',
    status: 'approved',
    priority: 'normal',
    assignedTo: 'Admissions Team',
    createdAt: '2026-05-25 03:15 PM',
    lastContact: '2026-05-25 04:45 PM',
    notes:
      'Trial completed successfully. Parent is interested in monthly subscription.',
  },
  {
    id: 'TR-1005',
    childName: 'Hamdan Saeed',
    childAge: 15,
    parentName: 'Saeed Al Nuaimi',
    parentPhone: '+971 56 777 3131',
    parentEmail: 'saeed@example.com',
    preferredProgram: 'Football Development',
    preferredBranch: 'Al Ain Branch',
    preferredDate: '2026-06-02',
    preferredTime: '07:00 PM',
    source: 'Referral',
    status: 'new',
    priority: 'high',
    assignedTo: 'Unassigned',
    createdAt: '2026-05-25 01:30 PM',
    lastContact: 'Not contacted yet',
    notes:
      'Older player. Parent asked whether academy has advanced group and competitive pathway.',
  },
  {
    id: 'TR-1006',
    childName: 'Lina Kareem',
    childAge: 8,
    parentName: 'Kareem Fawzy',
    parentPhone: '+971 54 111 6677',
    parentEmail: 'kareem@example.com',
    preferredProgram: 'Swimming Academy',
    preferredBranch: 'Dubai Main Branch',
    preferredDate: '2026-06-03',
    preferredTime: '05:30 PM',
    source: 'Website',
    status: 'rejected',
    priority: 'low',
    assignedTo: 'Admissions Team',
    createdAt: '2026-05-24 10:20 AM',
    lastContact: '2026-05-24 12:10 PM',
    notes:
      'Parent requested time slot that is not available. Asked to be contacted next month.',
  },
];

const statusOptions: Array<{ label: string; value: TrialStatus | 'all' }> = [
  { label: 'All statuses', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const priorityOptions: Array<{ label: string; value: TrialPriority | 'all' }> = [
  { label: 'All priorities', value: 'all' },
  { label: 'Low', value: 'low' },
  { label: 'Normal', value: 'normal' },
  { label: 'High', value: 'high' },
  { label: 'Urgent', value: 'urgent' },
];

export default function TrialRequestsPage() {
  const [requests, setRequests] = useState<TrialRequest[]>(initialTrialRequests);
  const [selectedRequestId, setSelectedRequestId] = useState(
    initialTrialRequests[0]?.id ?? '',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TrialStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] =
    useState<TrialPriority | 'all'>('all');
  const [savedMessage, setSavedMessage] = useState('');

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !normalizedSearch ||
        request.id.toLowerCase().includes(normalizedSearch) ||
        request.childName.toLowerCase().includes(normalizedSearch) ||
        request.parentName.toLowerCase().includes(normalizedSearch) ||
        request.parentPhone.toLowerCase().includes(normalizedSearch) ||
        request.parentEmail.toLowerCase().includes(normalizedSearch) ||
        request.preferredProgram.toLowerCase().includes(normalizedSearch) ||
        request.preferredBranch.toLowerCase().includes(normalizedSearch) ||
        request.source.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || request.status === statusFilter;

      const matchesPriority =
        priorityFilter === 'all' || request.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [priorityFilter, requests, searchTerm, statusFilter]);

  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ??
    filteredRequests[0] ??
    requests[0];

  const newCount = requests.filter((request) => request.status === 'new').length;
  const scheduledCount = requests.filter(
    (request) => request.status === 'scheduled',
  ).length;
  const approvedCount = requests.filter(
    (request) => request.status === 'approved',
  ).length;
  const urgentCount = requests.filter(
    (request) => request.priority === 'urgent' || request.priority === 'high',
  ).length;

  const updateRequestStatus = (id: string, status: TrialStatus) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
            ...request,
            status,
            lastContact:
              status === 'contacted' || status === 'scheduled'
                ? new Date().toLocaleString()
                : request.lastContact,
          }
          : request,
      ),
    );

    setSavedMessage(`Request ${id} updated to "${status}".`);
  };

  const assignRequest = (id: string, assignedTo: string) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
            ...request,
            assignedTo,
          }
          : request,
      ),
    );

    setSavedMessage(`Request ${id} assigned to ${assignedTo}.`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSavedMessage('');
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <Sparkles className="h-4 w-4" />
              Enrollment Pipeline
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Trial Requests
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Review trial session requests from the website and social channels.
              Contact parents, assign requests to admissions or coaches, schedule
              sessions, and convert successful trials into active enrollments.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-1">
            <HeroMetric icon={Sparkles} label="New Requests" value={`${newCount}`} />
            <HeroMetric
              icon={CalendarDays}
              label="Scheduled"
              value={`${scheduledCount}`}
            />
            <HeroMetric
              icon={CheckCircle2}
              label="Approved"
              value={`${approvedCount}`}
            />
            <HeroMetric
              icon={AlertTriangle}
              label="High Priority"
              value={`${urgentCount}`}
            />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-4">
        <StatusCard
          icon={Sparkles}
          title={`${requests.length} Total`}
          description="Trial requests currently available in frontend mock mode."
          tone="info"
        />
        <StatusCard
          icon={Clock3}
          title={`${newCount} New`}
          description="New requests that still need first contact."
          tone="warning"
        />
        <StatusCard
          icon={CalendarDays}
          title={`${scheduledCount} Scheduled`}
          description="Trial sessions already scheduled for follow-up."
          tone="info"
        />
        <StatusCard
          icon={CheckCircle2}
          title={`${approvedCount} Approved`}
          description="Successful trial requests ready for enrollment."
          tone="success"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <main className="space-y-6">
          <Panel
            icon={ClipboardCheck}
            title="Trial Request Queue"
            description="Search, filter, inspect, and process trial requests before enrollment."
            actions={
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset Filters
              </button>
            }
          >
            <div className="mb-5 grid gap-3 xl:grid-cols-[1fr_14rem_14rem]">
              <div className="relative">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search child, parent, phone, email, program, branch..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </div>

              <FilterSelect
                icon={Filter}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as TrialStatus | 'all')}
                options={statusOptions}
              />

              <FilterSelect
                icon={AlertTriangle}
                value={priorityFilter}
                onChange={(value) =>
                  setPriorityFilter(value as TrialPriority | 'all')
                }
                options={priorityOptions}
              />
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-border bg-background/70 dark:bg-white/[0.03]">
              <div className="hidden border-b border-border bg-secondary/80 px-5 py-4 xl:grid xl:grid-cols-[1.2fr_9rem_10rem_8rem_8rem] xl:items-center xl:gap-4">
                <TableHead>Request</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Preferred Slot</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </div>

              <div className="divide-y divide-border">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <TrialRequestRow
                      key={request.id}
                      request={request}
                      active={selectedRequest?.id === request.id}
                      onSelect={() => {
                        setSelectedRequestId(request.id);
                        setSavedMessage('');
                      }}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                      <Search className="h-7 w-7" />
                    </div>

                    <h3 className="text-lg font-black">No trial requests found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Try another search term, status filter, or priority filter.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </main>

        <aside className="space-y-6">
          {selectedRequest ? (
            <RequestDetailsPanel
              request={selectedRequest}
              onMarkContacted={() =>
                updateRequestStatus(selectedRequest.id, 'contacted')
              }
              onSchedule={() =>
                updateRequestStatus(selectedRequest.id, 'scheduled')
              }
              onApprove={() =>
                updateRequestStatus(selectedRequest.id, 'approved')
              }
              onReject={() =>
                updateRequestStatus(selectedRequest.id, 'rejected')
              }
              onAssignAdmissions={() =>
                assignRequest(selectedRequest.id, 'Admissions Team')
              }
              onAssignCoach={() => assignRequest(selectedRequest.id, 'Coach Omar')}
            />
          ) : null}

          <StatusCard
            icon={ShieldCheck}
            title="Admin Workflow"
            description="This page is ready for frontend review. Backend persistence comes later."
            tone="success"
          />
        </aside>
      </section>
    </div>
  );
}

function TrialRequestRow({
  request,
  active,
  onSelect,
}: {
  request: TrialRequest;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={[
        'grid gap-4 p-4 transition xl:grid-cols-[1.2fr_9rem_10rem_8rem_8rem] xl:items-center xl:gap-4 xl:px-5',
        active ? 'bg-brand-yellow/10' : 'hover:bg-secondary/60',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
            request.priority === 'urgent'
              ? 'bg-red-500/10 text-red-600 dark:text-red-300'
              : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
          ].join(' ')}
        >
          <Users className="h-6 w-6" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-black">{request.childName}</h3>
            <PriorityBadge priority={request.priority} />
          </div>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {request.id} • {request.parentName} • age {request.childAge}
          </p>

          <p className="mt-2 text-xs font-bold text-muted-foreground">
            Source: {request.source}
          </p>
        </div>
      </div>

      <div>
        <MobileLabel>Program</MobileLabel>
        <p className="text-sm font-black">{request.preferredProgram}</p>
        <p className="mt-1 text-xs font-bold text-muted-foreground">
          {request.preferredBranch}
        </p>
      </div>

      <div>
        <MobileLabel>Preferred Slot</MobileLabel>
        <p className="text-sm font-black">{request.preferredDate}</p>
        <p className="mt-1 text-xs font-bold text-muted-foreground">
          {request.preferredTime}
        </p>
      </div>

      <div>
        <MobileLabel>Status</MobileLabel>
        <StatusBadge status={request.status} />
      </div>

      <div className="flex items-center justify-between gap-3 xl:block">
        <button
          type="button"
          onClick={onSelect}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-black text-foreground transition hover:bg-brand-blue hover:text-white dark:hover:bg-brand-yellow dark:hover:text-brand-blue"
        >
          <Eye className="h-4 w-4" />
          Inspect
        </button>
      </div>
    </article>
  );
}

function RequestDetailsPanel({
  request,
  onMarkContacted,
  onSchedule,
  onApprove,
  onReject,
  onAssignAdmissions,
  onAssignCoach,
}: {
  request: TrialRequest;
  onMarkContacted: () => void;
  onSchedule: () => void;
  onApprove: () => void;
  onReject: () => void;
  onAssignAdmissions: () => void;
  onAssignCoach: () => void;
}) {
  return (
    <Panel
      icon={Eye}
      title="Request Details"
      description="Review parent information, preferred trial slot, notes, and workflow actions."
    >
      <div className="space-y-5">
        <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background dark:bg-white/[0.03]">
          <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-5 text-white">
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusBadge status={request.status} />
              <PriorityBadge priority={request.priority} />
            </div>

            <h3 className="text-2xl font-black">{request.childName}</h3>
            <p className="mt-2 text-sm font-semibold text-white/70">
              {request.preferredProgram} • {request.preferredBranch}
            </p>
          </div>

          <div className="space-y-3 p-5">
            <DetailItem
              icon={Users}
              label="Parent"
              value={`${request.parentName} — child age ${request.childAge}`}
            />
            <DetailItem icon={Phone} label="Phone" value={request.parentPhone} />
            <DetailItem icon={Mail} label="Email" value={request.parentEmail} />
            <DetailItem
              icon={CalendarDays}
              label="Preferred date"
              value={`${request.preferredDate} at ${request.preferredTime}`}
            />
            <DetailItem
              icon={MapPin}
              label="Branch"
              value={request.preferredBranch}
            />
            <DetailItem
              icon={UserCheck}
              label="Assigned to"
              value={request.assignedTo}
            />
            <DetailItem
              icon={Clock3}
              label="Created / last contact"
              value={`${request.createdAt} / ${request.lastContact}`}
            />

            <div className="rounded-2xl border border-border bg-card p-4 dark:bg-white/[0.04]">
              <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                <FileText className="h-4 w-4" />
                Notes
              </div>
              <p className="text-sm font-semibold leading-7 text-muted-foreground">
                {request.notes}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <button
            type="button"
            onClick={onMarkContacted}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-blue/20 bg-card px-5 text-sm font-black text-brand-blue transition hover:bg-brand-blue/10 dark:border-brand-yellow/20 dark:text-brand-yellow dark:hover:bg-brand-yellow/10"
          >
            <MessageCircle className="h-4 w-4" />
            Mark as Contacted
          </button>

          <button
            type="button"
            onClick={onSchedule}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
          >
            <CalendarDays className="h-4 w-4" />
            Mark as Scheduled
          </button>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onAssignAdmissions}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
            >
              <Send className="h-4 w-4" />
              Assign Admissions
            </button>

            <button
              type="button"
              onClick={onAssignCoach}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
            >
              <Trophy className="h-4 w-4" />
              Assign Coach
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onApprove}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </button>

            <button
              type="button"
              onClick={onReject}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 text-sm font-black text-red-600 transition hover:bg-red-500 hover:text-white dark:text-red-300"
            >
              <XCircle className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  actions,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: ReactNode;
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

function FilterSelect<T extends string>({
  icon: Icon,
  value,
  onChange,
  options,
}: {
  icon: LucideIcon;
  value: T | 'all';
  onChange: (value: T | 'all') => void;
  options: Array<{ label: string; value: T | 'all' }>;
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
    <div className="rounded-2xl border border-border bg-card p-4 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="break-words text-sm font-black">{value}</p>
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

function StatusBadge({ status }: { status: TrialStatus }) {
  const className =
    status === 'approved'
      ? 'bg-green-500/10 text-green-700 dark:text-green-300'
      : status === 'rejected'
        ? 'bg-red-500/10 text-red-700 dark:text-red-300'
        : status === 'scheduled'
          ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
          : status === 'contacted'
            ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300'
            : 'bg-orange-500/15 text-orange-700 dark:text-orange-300';

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-black capitalize ${className}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: TrialPriority }) {
  const className =
    priority === 'urgent'
      ? 'bg-red-500 text-white'
      : priority === 'high'
        ? 'bg-orange-500/15 text-orange-700 dark:text-orange-300'
        : priority === 'normal'
          ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
          : 'bg-green-500/10 text-green-700 dark:text-green-300';

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-black capitalize ${className}`}
    >
      {priority}
    </span>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
      {children}
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