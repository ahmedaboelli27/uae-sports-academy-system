import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  FileText,
  Filter,
  MessageSquare,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  WalletCards,
  XCircle,
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

type SubscriptionStatus = 'active' | 'expiringSoon' | 'expired' | 'cancelled';
type BillingCycle = 'monthly' | 'term' | 'package';

interface SubscriptionItem {
  id: string;
  subscriptionCode: string;
  childName: string;
  childId: string;
  program: string;
  sport: string;
  branch: string;
  coach: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  totalSessions: number;
  usedSessions: number;
  remainingSessions: number;
  attendanceRate: number;
  amount: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  linkedInvoice: string;
  lastPaymentDate: string;
  nextRenewalDate: string;
  notes: string;
}

const chartColors = {
  blue: '#00129B',
  blueDark: '#000B73',
  yellow: '#FFD400',
  green: '#16A34A',
  red: '#DC2626',
  orange: '#F97316',
  slate: '#64748B',
};

const subscriptionsData: SubscriptionItem[] = [
  {
    id: 'sub-001',
    subscriptionCode: 'SUB-2026-001',
    childName: 'Omar Khaled',
    childId: 'child-001',
    program: 'Football Development',
    sport: 'Football',
    branch: 'Dubai Main Branch',
    coach: 'Coach Omar',
    status: 'active',
    billingCycle: 'monthly',
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    daysRemaining: 34,
    totalSessions: 28,
    usedSessions: 21,
    remainingSessions: 7,
    attendanceRate: 92,
    amount: 750,
    paidAmount: 750,
    outstandingAmount: 0,
    currency: 'AED',
    linkedInvoice: 'INV-2026-0001',
    lastPaymentDate: '2026-05-02',
    nextRenewalDate: '2026-06-25',
    notes: 'Active monthly football subscription with strong attendance.',
  },
  {
    id: 'sub-002',
    subscriptionCode: 'SUB-2026-002',
    childName: 'Mariam Khaled',
    childId: 'child-002',
    program: 'Swimming Academy',
    sport: 'Swimming',
    branch: 'Dubai Main Branch',
    coach: 'Coach Sara',
    status: 'expiringSoon',
    billingCycle: 'monthly',
    startDate: '2026-05-05',
    endDate: '2026-06-05',
    daysRemaining: 8,
    totalSessions: 16,
    usedSessions: 14,
    remainingSessions: 2,
    attendanceRate: 86,
    amount: 900,
    paidAmount: 0,
    outstandingAmount: 900,
    currency: 'AED',
    linkedInvoice: 'INV-2026-0002',
    lastPaymentDate: '—',
    nextRenewalDate: '2026-06-05',
    notes: 'Subscription is close to expiry and invoice is still pending.',
  },
  {
    id: 'sub-003',
    subscriptionCode: 'SUB-2026-003',
    childName: 'Yousef Khaled',
    childId: 'child-003',
    program: 'Basketball Skills',
    sport: 'Basketball',
    branch: 'Sharjah Branch',
    coach: 'Coach Kareem',
    status: 'active',
    billingCycle: 'term',
    startDate: '2026-05-10',
    endDate: '2026-07-12',
    daysRemaining: 46,
    totalSessions: 22,
    usedSessions: 18,
    remainingSessions: 4,
    attendanceRate: 74,
    amount: 1200,
    paidAmount: 1200,
    outstandingAmount: 0,
    currency: 'AED',
    linkedInvoice: 'INV-2026-0003',
    lastPaymentDate: '2026-05-11',
    nextRenewalDate: '2026-07-05',
    notes: 'Active term subscription. Attendance needs follow-up.',
  },
];

const monthlySpendTrend = [
  { month: 'Jan', amount: 600 },
  { month: 'Feb', amount: 650 },
  { month: 'Mar', amount: 700 },
  { month: 'Apr', amount: 950 },
  { month: 'May', amount: 1950 },
  { month: 'Jun', amount: 900 },
];

function formatCurrency(value: number, currency = 'AED') {
  return `${value.toLocaleString('en-AE')} ${currency}`;
}

function getStatusLabel(status: SubscriptionStatus) {
  const labels: Record<SubscriptionStatus, string> = {
    active: 'Active',
    expiringSoon: 'Expiring Soon',
    expired: 'Expired',
    cancelled: 'Cancelled',
  };

  return labels[status];
}

function getBillingCycleLabel(cycle: BillingCycle) {
  const labels: Record<BillingCycle, string> = {
    monthly: 'Monthly',
    term: 'Term',
    package: 'Package',
  };

  return labels[cycle];
}

export default function SubscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [childFilter, setChildFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | 'all'>(
    'all',
  );
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(
    subscriptionsData[0]?.id ?? '',
  );

  const children = useMemo(() => {
    return Array.from(new Set(subscriptionsData.map((item) => item.childName)));
  }, []);

  const programs = useMemo(() => {
    return Array.from(new Set(subscriptionsData.map((item) => item.program)));
  }, []);

  const filteredSubscriptions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return subscriptionsData.filter((subscription) => {
      const matchesSearch =
        !normalizedSearch ||
        subscription.subscriptionCode.toLowerCase().includes(normalizedSearch) ||
        subscription.childName.toLowerCase().includes(normalizedSearch) ||
        subscription.program.toLowerCase().includes(normalizedSearch) ||
        subscription.sport.toLowerCase().includes(normalizedSearch) ||
        subscription.branch.toLowerCase().includes(normalizedSearch) ||
        subscription.coach.toLowerCase().includes(normalizedSearch) ||
        subscription.linkedInvoice.toLowerCase().includes(normalizedSearch);

      const matchesChild =
        childFilter === 'all' || subscription.childName === childFilter;

      const matchesProgram =
        programFilter === 'all' || subscription.program === programFilter;

      const matchesStatus =
        statusFilter === 'all' || subscription.status === statusFilter;

      return matchesSearch && matchesChild && matchesProgram && matchesStatus;
    });
  }, [childFilter, programFilter, searchTerm, statusFilter]);

  const selectedSubscription =
    subscriptionsData.find((item) => item.id === selectedSubscriptionId) ??
    filteredSubscriptions[0] ??
    subscriptionsData[0];

  const summary = useMemo(() => {
    const activeCount = subscriptionsData.filter(
      (item) => item.status === 'active',
    ).length;

    const expiringSoonCount = subscriptionsData.filter(
      (item) => item.status === 'expiringSoon',
    ).length;

    const expiredCount = subscriptionsData.filter(
      (item) => item.status === 'expired',
    ).length;

    const totalRemainingSessions = subscriptionsData.reduce(
      (total, item) => total + item.remainingSessions,
      0,
    );

    const totalOutstanding = subscriptionsData.reduce(
      (total, item) => total + item.outstandingAmount,
      0,
    );

    const totalPaid = subscriptionsData.reduce(
      (total, item) => total + item.paidAmount,
      0,
    );

    const averageAttendance = Math.round(
      subscriptionsData.reduce((total, item) => total + item.attendanceRate, 0) /
      subscriptionsData.length,
    );

    return {
      activeCount,
      expiringSoonCount,
      expiredCount,
      totalRemainingSessions,
      totalOutstanding,
      totalPaid,
      averageAttendance,
    };
  }, []);

  const statusBreakdown = useMemo(() => {
    return [
      {
        name: 'Active',
        value: summary.activeCount,
        color: chartColors.green,
      },
      {
        name: 'Expiring Soon',
        value: summary.expiringSoonCount,
        color: chartColors.orange,
      },
      {
        name: 'Expired',
        value: summary.expiredCount,
        color: chartColors.red,
      },
    ].filter((item) => item.value > 0);
  }, [summary.activeCount, summary.expiringSoonCount, summary.expiredCount]);

  const sessionUsageData = useMemo(() => {
    return subscriptionsData.map((subscription) => ({
      name: subscription.childName.split(' ')[0],
      used: subscription.usedSessions,
      remaining: subscription.remainingSessions,
    }));
  }, []);

  const resetFilters = () => {
    setSearchTerm('');
    setChildFilter('all');
    setProgramFilter('all');
    setStatusFilter('all');
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <CreditCard className="h-4 w-4" />
              Family Subscriptions
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Subscriptions
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Track all active programs, renewal dates, remaining sessions,
              linked invoices, payment status, attendance impact, and renewal
              alerts for every child in your family account.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/parent/invoices"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Receipt className="h-4 w-4" />
                View Invoices
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
              icon={CheckCircle2}
              label="Active"
              value={`${summary.activeCount}`}
              caption="Current valid subscriptions"
              positive
            />

            <HeroMetricCard
              icon={Clock3}
              label="Expiring Soon"
              value={`${summary.expiringSoonCount}`}
              caption="Needs renewal attention"
              positive={summary.expiringSoonCount === 0}
            />

            <HeroMetricCard
              icon={WalletCards}
              label="Outstanding"
              value={formatCurrency(summary.totalOutstanding)}
              caption="Pending subscription invoices"
              positive={summary.totalOutstanding === 0}
            />

            <HeroMetricCard
              icon={CalendarCheck}
              label="Attendance"
              value={`${summary.averageAttendance}%`}
              caption="Average across subscriptions"
              positive={summary.averageAttendance >= 80}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={CreditCard}
          title="Total Subscriptions"
          value={`${subscriptionsData.length}`}
          description="All subscriptions linked to this family account."
          tone="blue"
        />

        <KpiCard
          icon={CheckCircle2}
          title="Active"
          value={`${summary.activeCount}`}
          description="Subscriptions currently available for training sessions."
          tone="success"
        />

        <KpiCard
          icon={Clock3}
          title="Remaining Sessions"
          value={`${summary.totalRemainingSessions}`}
          description="Total unused sessions across current subscriptions."
          tone="brand"
        />

        <KpiCard
          icon={AlertTriangle}
          title="Renewal Attention"
          value={`${summary.expiringSoonCount + summary.expiredCount}`}
          description="Subscriptions expiring soon or already expired."
          tone={
            summary.expiringSoonCount + summary.expiredCount > 0
              ? 'warning'
              : 'success'
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Subscription Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter subscriptions by child, program, status,
                  coach, branch, invoice, or subscription code.
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
                    placeholder="Search subscription, child, program, invoice..."
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
                label="Program"
                value={programFilter}
                options={[
                  { label: 'All programs', value: 'all' },
                  ...programs.map((program) => ({
                    label: program,
                    value: program,
                  })),
                ]}
                onChange={setProgramFilter}
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Expiring Soon', value: 'expiringSoon' },
                  { label: 'Expired', value: 'expired' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as SubscriptionStatus | 'all')
                }
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {filteredSubscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                active={selectedSubscription.id === subscription.id}
                onSelect={() => setSelectedSubscriptionId(subscription.id)}
              />
            ))}

            {filteredSubscriptions.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Monthly Subscription Spending"
              description="Monthly subscription-related payment movement."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySpendTrend}>
                    <defs>
                      <linearGradient
                        id="subscriptionSpendGradient"
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
                      dataKey="amount"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#subscriptionSpendGradient)"
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Activity}
              title="Subscription Status"
              description="Current subscription health by status."
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
                      total={subscriptionsData.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <ChartCard
            icon={Target}
            title="Session Usage"
            description="Used and remaining sessions for each child subscription."
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionUsageData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />

                  <Bar
                    dataKey="used"
                    fill={chartColors.blue}
                    radius={[10, 10, 0, 0]}
                  />

                  <Bar
                    dataKey="remaining"
                    fill={chartColors.yellow}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <aside className="space-y-6">
          <SelectedSubscriptionPanel subscription={selectedSubscription} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Renewal Alerts</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Subscriptions that may require parent action.
                </p>
              </div>

              <Bell className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {subscriptionsData
                .filter(
                  (item) =>
                    item.status === 'expiringSoon' ||
                    item.status === 'expired' ||
                    item.outstandingAmount > 0 ||
                    item.attendanceRate < 80,
                )
                .map((item) => (
                  <RenewalAlertRow key={item.id} subscription={item} />
                ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful subscription shortcuts.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={Receipt}
                title="View Invoices"
                description="Review pending and paid subscription invoices."
                href="/parent/invoices"
              />

              <QuickAction
                icon={CreditCard}
                title="Payment History"
                description="Open receipts and payment records."
                href="/parent/payments"
              />

              <QuickAction
                icon={CalendarCheck}
                title="Attendance"
                description="Review attendance for the selected child."
                href={`/parent/children/${selectedSubscription.childId}/attendance`}
              />

              <QuickAction
                icon={MessageSquare}
                title="Contact Academy"
                description="Ask about renewal or subscription changes."
                href="/parent/messages"
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
  tone: 'blue' | 'brand' | 'success' | 'warning' | 'danger';
}) {
  const toneClasses = {
    blue: 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue',
    brand: 'bg-brand-yellow text-brand-blue',
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

function SubscriptionCard({
  subscription,
  active,
  onSelect,
}: {
  subscription: SubscriptionItem;
  active: boolean;
  onSelect: () => void;
}) {
  const usagePercentage = Math.round(
    (subscription.usedSessions / subscription.totalSessions) * 100,
  );

  return (
    <article
      className={[
        'rounded-[2rem] border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
        active ? 'border-brand-yellow' : 'border-border',
      ].join(' ')}
    >
      <button type="button" onClick={onSelect} className="w-full text-start">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <CreditCard className="h-7 w-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-black">{subscription.childName}</h3>

                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {subscription.program}
                </p>

                <p className="mt-1 text-xs font-bold text-muted-foreground">
                  {subscription.subscriptionCode} ·{' '}
                  {getBillingCycleLabel(subscription.billingCycle)}
                </p>
              </div>

              <SubscriptionStatusBadge status={subscription.status} />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <MiniMetric
            icon={CalendarDays}
            label="End Date"
            value={subscription.endDate}
          />

          <MiniMetric
            icon={Clock3}
            label="Days Left"
            value={`${subscription.daysRemaining}`}
          />

          <MiniMetric
            icon={Target}
            label="Sessions Left"
            value={`${subscription.remainingSessions}/${subscription.totalSessions}`}
          />

          <MiniMetric
            icon={WalletCards}
            label="Outstanding"
            value={formatCurrency(
              subscription.outstandingAmount,
              subscription.currency,
            )}
          />
        </div>

        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between text-xs font-black">
            <span>Session Usage</span>
            <span>{usagePercentage}% used</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-brand-yellow"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        <p className="mt-4 text-sm font-semibold leading-6 text-muted-foreground">
          {subscription.notes}
        </p>
      </button>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Link
          to={`/parent/children/${subscription.childId}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-black transition hover:bg-secondary"
        >
          <Eye className="h-4 w-4" />
          Child
        </Link>

        <Link
          to="/parent/invoices"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-black transition hover:bg-secondary"
        >
          <Receipt className="h-4 w-4" />
          Invoice
        </Link>

        <Link
          to="/parent/payments"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
        >
          <CreditCard className="h-4 w-4" />
          Pay
        </Link>
      </div>
    </article>
  );
}

function SelectedSubscriptionPanel({
  subscription,
}: {
  subscription: SubscriptionItem;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Subscription
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {subscription.childName}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {subscription.program} · {subscription.coach} · {subscription.branch}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SubscriptionStatusBadge status={subscription.status} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {subscription.remainingSessions} sessions left
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={FileText}
          label="Subscription Code"
          value={subscription.subscriptionCode}
        />

        <DetailLine
          icon={Trophy}
          label="Program / Sport"
          value={`${subscription.program} · ${subscription.sport}`}
        />

        <DetailLine
          icon={UserRound}
          label="Coach"
          value={subscription.coach}
        />

        <DetailLine
          icon={CalendarDays}
          label="Period"
          value={`${subscription.startDate} → ${subscription.endDate}`}
        />

        <DetailLine
          icon={Clock3}
          label="Renewal Date"
          value={subscription.nextRenewalDate}
        />

        <DetailLine
          icon={CalendarCheck}
          label="Attendance"
          value={`${subscription.attendanceRate}%`}
        />

        <DetailLine
          icon={WalletCards}
          label="Payment"
          value={`${formatCurrency(
            subscription.paidAmount,
            subscription.currency,
          )} paid · ${formatCurrency(
            subscription.outstandingAmount,
            subscription.currency,
          )} outstanding`}
        />

        <DetailLine
          icon={Receipt}
          label="Linked Invoice"
          value={subscription.linkedInvoice}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/parent/invoices"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <Receipt className="h-4 w-4" />
            Invoice
          </Link>

          <Link
            to="/parent/payments"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <CreditCard className="h-4 w-4" />
            Pay
          </Link>
        </div>
      </div>
    </aside>
  );
}

function RenewalAlertRow({
  subscription,
}: {
  subscription: SubscriptionItem;
}) {
  const hasOutstanding = subscription.outstandingAmount > 0;
  const isExpiring = subscription.status === 'expiringSoon';
  const isExpired = subscription.status === 'expired';
  const lowAttendance = subscription.attendanceRate < 80;

  return (
    <article className="rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue dark:text-brand-yellow">
      <div className="flex items-start gap-3">
        {isExpired ? (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        )}

        <div>
          <p className="text-sm font-black">{subscription.childName}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {hasOutstanding
              ? `Pending invoice: ${formatCurrency(
                subscription.outstandingAmount,
                subscription.currency,
              )}.`
              : isExpired
                ? 'Subscription has expired and needs renewal.'
                : isExpiring
                  ? `Subscription ends on ${subscription.endDate}.`
                  : lowAttendance
                    ? `Attendance is ${subscription.attendanceRate}%, please follow up.`
                    : subscription.notes}
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

function MiniMetric({
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
        {percentage}% of subscriptions
      </p>
    </div>
  );
}

function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const className =
    status === 'active'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'expiringSoon'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : status === 'expired'
          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
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
        <CreditCard className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No subscriptions found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, child, program, or subscription status.
      </p>
    </div>
  );
}