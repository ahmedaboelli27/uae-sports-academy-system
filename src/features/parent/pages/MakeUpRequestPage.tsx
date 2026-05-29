import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Filter,
  MapPin,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  Users,
  XCircle
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type RequestStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
type RequestReason =
  | 'illness'
  | 'travel'
  | 'school'
  | 'family'
  | 'transportation'
  | 'other';
type PreferredSlot = 'morning' | 'afternoon' | 'evening';

interface ChildOption {
  id: string;
  name: string;
  program: string;
  branch: string;
  coach: string;
}

interface MakeUpRequest {
  id: string;
  requestNo: string;
  childId: string;
  childName: string;
  program: string;
  branch: string;
  coach: string;
  missedSessionDate: string;
  missedSessionTime: string;
  reason: RequestReason;
  preferredDate: string;
  preferredSlot: PreferredSlot;
  status: RequestStatus;
  createdAt: string;
  responseDate: string;
  requestedBy: string;
  eligibility: string;
  parentNote: string;
  academyNote: string;
}

const chartColors = {
  blue: '#00129B',
  yellow: '#FFD400',
  green: '#16A34A',
  red: '#DC2626',
  orange: '#F97316',
  purple: '#7C3AED',
  slate: '#64748B',
};

const childOptions: ChildOption[] = [
  {
    id: 'child-001',
    name: 'Omar Khaled',
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    coach: 'Coach Omar',
  },
  {
    id: 'child-002',
    name: 'Mariam Khaled',
    program: 'Swimming Academy',
    branch: 'Dubai Main Branch',
    coach: 'Coach Sara',
  },
  {
    id: 'child-003',
    name: 'Yousef Khaled',
    program: 'Basketball Skills',
    branch: 'Sharjah Branch',
    coach: 'Coach Kareem',
  },
];

const requestsData: MakeUpRequest[] = [
  {
    id: 'mur-001',
    requestNo: 'MUR-2026-0001',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    coach: 'Coach Omar',
    missedSessionDate: '2026-05-06',
    missedSessionTime: '6:00 PM - 7:30 PM',
    reason: 'illness',
    preferredDate: '2026-06-08',
    preferredSlot: 'evening',
    status: 'approved',
    createdAt: '2026-05-07',
    responseDate: '2026-05-08',
    requestedBy: 'Parent Account',
    eligibility: 'Eligible',
    parentNote: 'Omar was sick and could not attend the football session.',
    academyNote: 'Approved. Replacement session scheduled with Coach Omar.',
  },
  {
    id: 'mur-002',
    requestNo: 'MUR-2026-0002',
    childId: 'child-002',
    childName: 'Mariam Khaled',
    program: 'Swimming Academy',
    branch: 'Dubai Main Branch',
    coach: 'Coach Sara',
    missedSessionDate: '2026-05-11',
    missedSessionTime: '5:30 PM - 6:30 PM',
    reason: 'family',
    preferredDate: '2026-06-04',
    preferredSlot: 'afternoon',
    status: 'pending',
    createdAt: '2026-05-12',
    responseDate: 'Pending',
    requestedBy: 'Parent Account',
    eligibility: 'Under Review',
    parentNote: 'Family emergency prevented attendance.',
    academyNote: 'Pending coach availability confirmation.',
  },
  {
    id: 'mur-003',
    requestNo: 'MUR-2026-0003',
    childId: 'child-003',
    childName: 'Yousef Khaled',
    program: 'Basketball Skills',
    branch: 'Sharjah Branch',
    coach: 'Coach Kareem',
    missedSessionDate: '2026-05-20',
    missedSessionTime: '10:00 AM - 11:30 AM',
    reason: 'school',
    preferredDate: '2026-06-10',
    preferredSlot: 'morning',
    status: 'rejected',
    createdAt: '2026-05-21',
    responseDate: '2026-05-22',
    requestedBy: 'Parent Account',
    eligibility: 'Not Eligible',
    parentNote: 'School exam conflicted with the basketball session.',
    academyNote: 'Rejected because the request was submitted after the allowed window.',
  },
  {
    id: 'mur-004',
    requestNo: 'MUR-2026-0004',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    coach: 'Coach Omar',
    missedSessionDate: '2026-04-28',
    missedSessionTime: '6:00 PM - 7:30 PM',
    reason: 'travel',
    preferredDate: '2026-05-05',
    preferredSlot: 'evening',
    status: 'completed',
    createdAt: '2026-04-29',
    responseDate: '2026-04-30',
    requestedBy: 'Parent Account',
    eligibility: 'Eligible',
    parentNote: 'Family travel caused the missed session.',
    academyNote: 'Completed. Make-up session attended successfully.',
  },
];

const monthlyRequestsTrend = [
  { month: 'Jan', submitted: 1, approved: 1 },
  { month: 'Feb', submitted: 2, approved: 1 },
  { month: 'Mar', submitted: 1, approved: 1 },
  { month: 'Apr', submitted: 3, approved: 2 },
  { month: 'May', submitted: 4, approved: 2 },
  { month: 'Jun', submitted: 2, approved: 1 },
];

function getStatusLabel(status: RequestStatus) {
  const labels: Record<RequestStatus, string> = {
    draft: 'Draft',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    completed: 'Completed',
  };

  return labels[status];
}

function getReasonLabel(reason: RequestReason) {
  const labels: Record<RequestReason, string> = {
    illness: 'Illness',
    travel: 'Travel',
    school: 'School Commitment',
    family: 'Family Emergency',
    transportation: 'Transportation Issue',
    other: 'Other',
  };

  return labels[reason];
}

function getSlotLabel(slot: PreferredSlot) {
  const labels: Record<PreferredSlot, string> = {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
  };

  return labels[slot];
}

export default function MakeUpRequestPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [childFilter, setChildFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');
  const [reasonFilter, setReasonFilter] = useState<RequestReason | 'all'>('all');
  const [selectedRequestId, setSelectedRequestId] = useState(
    requestsData[0]?.id ?? '',
  );

  const [formChildId, setFormChildId] = useState(childOptions[0]?.id ?? '');
  const [formReason, setFormReason] = useState<RequestReason>('illness');
  const [formMissedDate, setFormMissedDate] = useState('');
  const [formPreferredDate, setFormPreferredDate] = useState('');
  const [formPreferredSlot, setFormPreferredSlot] =
    useState<PreferredSlot>('evening');
  const [formNote, setFormNote] = useState('');

  const selectedChild =
    childOptions.find((child) => child.id === formChildId) ?? childOptions[0]!;

  const filteredRequests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return requestsData.filter((request) => {
      const matchesSearch =
        !normalizedSearch ||
        request.requestNo.toLowerCase().includes(normalizedSearch) ||
        request.childName.toLowerCase().includes(normalizedSearch) ||
        request.program.toLowerCase().includes(normalizedSearch) ||
        request.branch.toLowerCase().includes(normalizedSearch) ||
        request.coach.toLowerCase().includes(normalizedSearch) ||
        request.parentNote.toLowerCase().includes(normalizedSearch) ||
        request.academyNote.toLowerCase().includes(normalizedSearch);

      const matchesChild =
        childFilter === 'all' || request.childName === childFilter;

      const matchesStatus =
        statusFilter === 'all' || request.status === statusFilter;

      const matchesReason =
        reasonFilter === 'all' || request.reason === reasonFilter;

      return matchesSearch && matchesChild && matchesStatus && matchesReason;
    });
  }, [childFilter, reasonFilter, searchTerm, statusFilter]);

  const selectedRequest =
    requestsData.find((request) => request.id === selectedRequestId) ??
    filteredRequests[0] ??
    requestsData[0]!;

  const children = useMemo(() => {
    return Array.from(new Set(requestsData.map((request) => request.childName)));
  }, []);

  const summary = useMemo(() => {
    const pendingCount = requestsData.filter(
      (request) => request.status === 'pending',
    ).length;

    const approvedCount = requestsData.filter(
      (request) => request.status === 'approved',
    ).length;

    const rejectedCount = requestsData.filter(
      (request) => request.status === 'rejected',
    ).length;

    const completedCount = requestsData.filter(
      (request) => request.status === 'completed',
    ).length;

    return {
      pendingCount,
      approvedCount,
      rejectedCount,
      completedCount,
    };
  }, []);

  const statusBreakdown = useMemo(() => {
    return [
      {
        name: 'Pending',
        value: summary.pendingCount,
        color: chartColors.orange,
      },
      {
        name: 'Approved',
        value: summary.approvedCount,
        color: chartColors.green,
      },
      {
        name: 'Rejected',
        value: summary.rejectedCount,
        color: chartColors.red,
      },
      {
        name: 'Completed',
        value: summary.completedCount,
        color: chartColors.blue,
      },
    ].filter((item) => item.value > 0);
  }, [
    summary.approvedCount,
    summary.completedCount,
    summary.pendingCount,
    summary.rejectedCount,
  ]);

  const reasonBreakdown = useMemo(() => {
    const reasons: RequestReason[] = [
      'illness',
      'travel',
      'school',
      'family',
      'transportation',
      'other',
    ];

    return reasons
      .map((reason) => ({
        name: getReasonLabel(reason),
        value: requestsData.filter((request) => request.reason === reason).length,
        color:
          reason === 'illness'
            ? chartColors.blue
            : reason === 'travel'
              ? chartColors.green
              : reason === 'school'
                ? chartColors.purple
                : reason === 'family'
                  ? chartColors.orange
                  : chartColors.slate,
      }))
      .filter((item) => item.value > 0);
  }, []);

  const childRequestData = useMemo(() => {
    return childOptions.map((child) => {
      const childRequests = requestsData.filter(
        (request) => request.childId === child.id,
      );

      return {
        name: child.name.split(' ')[0],
        approved: childRequests.filter((request) => request.status === 'approved')
          .length,
        pending: childRequests.filter((request) => request.status === 'pending')
          .length,
        rejected: childRequests.filter((request) => request.status === 'rejected')
          .length,
      };
    });
  }, []);

  const resetFilters = () => {
    setSearchTerm('');
    setChildFilter('all');
    setStatusFilter('all');
    setReasonFilter('all');
  };

  const clearForm = () => {
    setFormChildId(childOptions[0]?.id ?? '');
    setFormReason('illness');
    setFormMissedDate('');
    setFormPreferredDate('');
    setFormPreferredSlot('evening');
    setFormNote('');
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <RefreshCw className="h-4 w-4" />
              Make-up Sessions
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Make-up Session Request
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Request a replacement session for missed training, track request
              status, review coach availability, and follow academy approval
              notes from one parent service page.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/parent/children"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Users className="h-4 w-4" />
                My Children
              </Link>

              <Link
                to="/parent/messages"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <MessageSquare className="h-4 w-4" />
                Contact Academy
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={Clock3}
              label="Pending"
              value={`${summary.pendingCount}`}
              caption="Waiting for academy review"
              positive={summary.pendingCount === 0}
            />

            <HeroMetricCard
              icon={CheckCircle2}
              label="Approved"
              value={`${summary.approvedCount}`}
              caption="Approved replacement sessions"
              positive
            />

            <HeroMetricCard
              icon={ShieldCheck}
              label="Completed"
              value={`${summary.completedCount}`}
              caption="Make-up sessions attended"
              positive
            />

            <HeroMetricCard
              icon={XCircle}
              label="Rejected"
              value={`${summary.rejectedCount}`}
              caption="Requests not approved"
              positive={summary.rejectedCount === 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={FileText}
          title="Total Requests"
          value={`${requestsData.length}`}
          description="All make-up requests submitted by this parent account."
          tone="blue"
        />

        <KpiCard
          icon={Clock3}
          title="Pending Review"
          value={`${summary.pendingCount}`}
          description="Requests waiting for coach or admin confirmation."
          tone={summary.pendingCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={CheckCircle2}
          title="Approved"
          value={`${summary.approvedCount}`}
          description="Requests approved and ready to schedule."
          tone="success"
        />

        <KpiCard
          icon={XCircle}
          title="Rejected"
          value={`${summary.rejectedCount}`}
          description="Requests declined by academy rules or timing."
          tone={summary.rejectedCount > 0 ? 'danger' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <PlusCircle className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  New Make-up Request
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Fill in the missed session details and your preferred
                  replacement date. This is a frontend form until API submission
                  is connected.
                </p>
              </div>

              <button
                type="button"
                onClick={clearForm}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                <RefreshCw className="h-4 w-4" />
                Clear Form
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <FilterSelect
                label="Child"
                value={formChildId}
                options={childOptions.map((child) => ({
                  label: child.name,
                  value: child.id,
                }))}
                onChange={setFormChildId}
              />

              <FilterSelect
                label="Reason"
                value={formReason}
                options={[
                  { label: 'Illness', value: 'illness' },
                  { label: 'Travel', value: 'travel' },
                  { label: 'School Commitment', value: 'school' },
                  { label: 'Family Emergency', value: 'family' },
                  { label: 'Transportation Issue', value: 'transportation' },
                  { label: 'Other', value: 'other' },
                ]}
                onChange={(value) => setFormReason(value as RequestReason)}
              />

              <FilterSelect
                label="Preferred Slot"
                value={formPreferredSlot}
                options={[
                  { label: 'Morning', value: 'morning' },
                  { label: 'Afternoon', value: 'afternoon' },
                  { label: 'Evening', value: 'evening' },
                ]}
                onChange={(value) =>
                  setFormPreferredSlot(value as PreferredSlot)
                }
              />

              <label className="block">
                <span className="mb-2 block text-sm font-black">
                  Missed Session Date
                </span>

                <input
                  type="date"
                  value={formMissedDate}
                  onChange={(event) => setFormMissedDate(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-black">
                  Preferred Make-up Date
                </span>

                <input
                  type="date"
                  value={formPreferredDate}
                  onChange={(event) => setFormPreferredDate(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </label>

              <div className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                  Selected Program
                </p>

                <p className="mt-2 text-sm font-black">{selectedChild.program}</p>

                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {selectedChild.coach} · {selectedChild.branch}
                </p>
              </div>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">
                Parent Note
              </span>

              <textarea
                value={formNote}
                onChange={(event) => setFormNote(event.target.value)}
                placeholder="Write a short note explaining the missed session..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:max-w-xl">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
              >
                <Send className="h-4 w-4" />
                Submit Request
              </button>

              <button
                type="button"
                onClick={clearForm}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Request Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter make-up requests by child, status, reason,
                  program, coach, parent note, or academy response.
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Filters
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(3,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Search</span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search request, child, program, notes..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Child"
                value={childFilter}
                options={[
                  { label: 'All children', value: 'all' },
                  ...children.map((child) => ({
                    label: child,
                    value: child,
                  })),
                ]}
                onChange={setChildFilter}
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Approved', value: 'approved' },
                  { label: 'Rejected', value: 'rejected' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Draft', value: 'draft' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as RequestStatus | 'all')
                }
              />

              <FilterSelect
                label="Reason"
                value={reasonFilter}
                options={[
                  { label: 'All reasons', value: 'all' },
                  { label: 'Illness', value: 'illness' },
                  { label: 'Travel', value: 'travel' },
                  { label: 'School Commitment', value: 'school' },
                  { label: 'Family Emergency', value: 'family' },
                  { label: 'Transportation Issue', value: 'transportation' },
                  { label: 'Other', value: 'other' },
                ]}
                onChange={(value) =>
                  setReasonFilter(value as RequestReason | 'all')
                }
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                active={selectedRequest.id === request.id}
                onSelect={() => setSelectedRequestId(request.id)}
              />
            ))}

            {filteredRequests.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Monthly Request Trend"
              description="Submitted and approved make-up requests by month."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRequestsTrend}>
                    <defs>
                      <linearGradient
                        id="makeUpTrendGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartColors.blue}
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartColors.blue}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="submitted"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#makeUpTrendGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="approved"
                      stroke={chartColors.green}
                      strokeWidth={4}
                      fill="transparent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Activity}
              title="Request Status"
              description="Pending, approved, rejected, and completed requests."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {statusBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {statusBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={requestsData.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <ChartCard
              icon={Target}
              title="Request Reasons"
              description="Common reasons selected for make-up requests."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reasonBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {reasonBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {reasonBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={requestsData.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard
              icon={Users}
              title="Requests by Child"
              description="Approved, pending, and rejected requests by child."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={childRequestData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Bar
                      dataKey="approved"
                      fill={chartColors.green}
                      radius={[10, 10, 0, 0]}
                    />

                    <Bar
                      dataKey="pending"
                      fill={chartColors.yellow}
                      radius={[10, 10, 0, 0]}
                    />

                    <Bar
                      dataKey="rejected"
                      fill={chartColors.red}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>
        </div>

        <aside className="space-y-6">
          <SelectedRequestPanel request={selectedRequest} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Parent Attention</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Requests that may need follow-up.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {requestsData
                .filter(
                  (request) =>
                    request.status === 'pending' ||
                    request.status === 'rejected',
                )
                .map((request) => (
                  <AttentionRow key={request.id} request={request} />
                ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful shortcuts for make-up session follow-up.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={UserRound}
                title="Child Profile"
                description="Open child details linked to selected request."
                href={`/parent/children/${selectedRequest.childId}`}
              />

              <QuickAction
                icon={CalendarCheck}
                title="Attendance"
                description="Review missed sessions and attendance history."
                href={`/parent/children/${selectedRequest.childId}/attendance`}
              />

              <QuickAction
                icon={MessageSquare}
                title="Message Academy"
                description="Ask staff about this make-up request."
                href="/parent/messages"
              />

              <QuickAction
                icon={FileText}
                title="Documents"
                description="Review consent and required documents."
                href="/parent/documents"
              />
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function HeroMetricCard({
  icon: Icon,
  label,
  value,
  caption,
  positive,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  positive: boolean;
}) {
  return (
    <article className="rounded-[1.75rem] bg-white/10 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={[
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black',
            positive
              ? 'bg-green-400/15 text-green-200'
              : 'bg-red-400/15 text-red-200',
          ].join(' ')}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Live
        </span>
      </div>

      <p className="text-xs font-black uppercase tracking-[0.15em] text-white/55">
        {label}
      </p>

      <h3 className="mt-2 line-clamp-1 text-xl font-black text-white">
        {value}
      </h3>

      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-white/60">
        {caption}
      </p>
    </article>
  );
}

function KpiCard({
  icon: Icon,
  title,
  value,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  tone: 'blue' | 'success' | 'warning' | 'danger';
}) {
  const toneClasses = {
    blue: 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue',
    success:
      'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  };

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute -end-10 -top-10 h-24 w-24 rounded-full bg-brand-yellow/10 blur-2xl" />

      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <p className="relative mt-5 text-sm font-bold text-muted-foreground">
        {title}
      </p>

      <p className="relative mt-2 text-3xl font-black text-brand-blue dark:text-white">
        {value}
      </p>

      <p className="relative mt-2 text-xs font-semibold leading-5 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

function RequestCard({
  request,
  active,
  onSelect,
}: {
  request: MakeUpRequest;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      onClick={onSelect}
      className={[
        'cursor-pointer rounded-[2rem] border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
        active ? 'border-brand-yellow' : 'border-border',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <RefreshCw className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black">{request.requestNo}</h3>

              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {request.childName} · {request.program}
              </p>

              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {getReasonLabel(request.reason)} · {request.eligibility}
              </p>
            </div>

            <RequestStatusBadge status={request.status} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniInfo
          icon={CalendarDays}
          label="Missed Session"
          value={request.missedSessionDate}
        />

        <MiniInfo
          icon={Clock3}
          label="Time"
          value={request.missedSessionTime}
        />

        <MiniInfo
          icon={Target}
          label="Preferred Date"
          value={request.preferredDate}
        />

        <MiniInfo
          icon={CalendarCheck}
          label="Preferred Slot"
          value={getSlotLabel(request.preferredSlot)}
        />
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-muted-foreground">
        {request.academyNote}
      </p>
    </article>
  );
}

function SelectedRequestPanel({ request }: { request: MakeUpRequest }) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Request
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {request.requestNo}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {request.childName} · {request.program}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <RequestStatusBadge status={request.status} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {getReasonLabel(request.reason)}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={UserRound} label="Child" value={request.childName} />
        <DetailLine icon={Trophy} label="Program" value={request.program} />
        <DetailLine icon={MapPin} label="Branch" value={request.branch} />
        <DetailLine icon={Users} label="Coach" value={request.coach} />
        <DetailLine
          icon={CalendarDays}
          label="Missed Session"
          value={`${request.missedSessionDate} · ${request.missedSessionTime}`}
        />
        <DetailLine
          icon={Target}
          label="Preferred Make-up"
          value={`${request.preferredDate} · ${getSlotLabel(request.preferredSlot)}`}
        />
        <DetailLine
          icon={Clock3}
          label="Submitted / Response"
          value={`${request.createdAt} → ${request.responseDate}`}
        />
        <DetailLine icon={ShieldCheck} label="Eligibility" value={request.eligibility} />
        <DetailLine icon={MessageSquare} label="Parent Note" value={request.parentNote} />
        <DetailLine icon={FileText} label="Academy Note" value={request.academyNote} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/parent/children/${request.childId}/attendance`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <CalendarCheck className="h-4 w-4" />
            Attendance
          </Link>

          <Link
            to="/parent/messages"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <MessageSquare className="h-4 w-4" />
            Message
          </Link>
        </div>
      </div>
    </aside>
  );
}

function AttentionRow({ request }: { request: MakeUpRequest }) {
  return (
    <article className="rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue dark:text-brand-yellow">
      <div className="flex items-start gap-3">
        {request.status === 'rejected' ? (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        )}

        <div>
          <p className="text-sm font-black">{request.requestNo}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {request.childName} · {getStatusLabel(request.status)} ·{' '}
            {request.academyNote}
          </p>
        </div>
      </div>
    </article>
  );
}

function ChartCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="absolute -end-12 -top-12 h-32 w-32 rounded-full bg-brand-yellow/10 blur-3xl" />

      <div className="relative mb-5 flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="relative">{children}</div>
    </section>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10 hover:shadow-sm dark:bg-white/[0.04]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue text-white transition group-hover:scale-105 dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

function MiniInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-xs font-black text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="text-sm font-black">{value}</p>
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

function DistributionRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-background p-3 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />

          <span className="truncate text-sm font-black">{label}</span>
        </div>

        <span className="text-xs font-black text-muted-foreground">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>

      <p className="mt-1 text-xs font-bold text-muted-foreground">
        {percentage}% of requests
      </p>
    </div>
  );
}

function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const className =
    status === 'approved'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'pending'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : status === 'rejected'
          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
          : status === 'completed'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm lg:col-span-2">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <RefreshCw className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No make-up requests found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, child, request status, or request reason.
      </p>
    </div>
  );
}