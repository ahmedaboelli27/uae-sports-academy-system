import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CalendarCheck,
  CalendarDays,
  Clock3,
  Dumbbell,
  Eye,
  FileText,
  Medal,
  MessageSquare,
  Plus,
  Search,
  Star,
  Target,
  Trophy,
  UserRound,
  Users,
  WalletCards
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

type SubscriptionStatus = 'active' | 'expiringSoon' | 'expired';
type ChildLevel = 'beginner' | 'intermediate' | 'advanced';
type ChildRisk = 'low' | 'medium' | 'high';

interface ChildItem {
  id: string;
  name: string;
  age: number;
  gender: string;
  program: string;
  branch: string;
  coach: string;
  level: ChildLevel;
  attendanceRate: number;
  progressScore: number;
  skillScore: number;
  remainingSessions: number;
  completedSessions: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate: string;
  nextSessionDate: string;
  nextSessionTime: string;
  nextSessionLocation: string;
  riskLevel: ChildRisk;
  latestNote: string;
  outstandingAmount: number;
  currency: string;
}

interface AttendanceMonth {
  month: string;
  Omar: number;
  Mariam: number;
}

interface ProgressPoint {
  name: string;
  progress: number;
  skill: number;
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

const childrenData: ChildItem[] = [
  {
    id: 'child-001',
    name: 'Omar Khaled',
    age: 9,
    gender: 'Boy',
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    coach: 'Coach Omar',
    level: 'intermediate',
    attendanceRate: 92,
    progressScore: 84,
    skillScore: 88,
    remainingSessions: 7,
    completedSessions: 21,
    subscriptionStatus: 'active',
    subscriptionEndDate: '2026-06-30',
    nextSessionDate: 'Today',
    nextSessionTime: '6:00 PM - 7:30 PM',
    nextSessionLocation: 'Pitch A',
    riskLevel: 'low',
    latestNote: 'Strong improvement in passing, stamina, and positioning.',
    outstandingAmount: 0,
    currency: 'AED',
  },
  {
    id: 'child-002',
    name: 'Mariam Khaled',
    age: 7,
    gender: 'Girl',
    program: 'Swimming Academy',
    branch: 'Dubai Main Branch',
    coach: 'Coach Sara',
    level: 'beginner',
    attendanceRate: 86,
    progressScore: 78,
    skillScore: 74,
    remainingSessions: 2,
    completedSessions: 14,
    subscriptionStatus: 'expiringSoon',
    subscriptionEndDate: '2026-06-05',
    nextSessionDate: 'Tomorrow',
    nextSessionTime: '5:30 PM - 6:30 PM',
    nextSessionLocation: 'Pool 2',
    riskLevel: 'medium',
    latestNote: 'Needs more confidence with breathing rhythm and floating control.',
    outstandingAmount: 900,
    currency: 'AED',
  },
  {
    id: 'child-003',
    name: 'Yousef Khaled',
    age: 11,
    gender: 'Boy',
    program: 'Basketball Skills',
    branch: 'Sharjah Branch',
    coach: 'Coach Kareem',
    level: 'advanced',
    attendanceRate: 74,
    progressScore: 81,
    skillScore: 86,
    remainingSessions: 4,
    completedSessions: 18,
    subscriptionStatus: 'active',
    subscriptionEndDate: '2026-07-12',
    nextSessionDate: 'Saturday',
    nextSessionTime: '10:00 AM - 11:30 AM',
    nextSessionLocation: 'Court 1',
    riskLevel: 'medium',
    latestNote: 'Excellent ball handling, but attendance needs consistency.',
    outstandingAmount: 0,
    currency: 'AED',
  },
];

const attendanceTrend: AttendanceMonth[] = [
  { month: 'Jan', Omar: 82, Mariam: 76 },
  { month: 'Feb', Omar: 86, Mariam: 79 },
  { month: 'Mar', Omar: 88, Mariam: 82 },
  { month: 'Apr', Omar: 90, Mariam: 84 },
  { month: 'May', Omar: 92, Mariam: 86 },
  { month: 'Jun', Omar: 94, Mariam: 88 },
];

const progressData: ProgressPoint[] = [
  { name: 'Football', progress: 84, skill: 88 },
  { name: 'Swimming', progress: 78, skill: 74 },
  { name: 'Basketball', progress: 81, skill: 86 },
];

function formatCurrency(value: number, currency = 'AED') {
  return `${value.toLocaleString('en-AE')} ${currency}`;
}

function formatLabel(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
}

function getSubscriptionLabel(status: SubscriptionStatus) {
  const labels: Record<SubscriptionStatus, string> = {
    active: 'Active',
    expiringSoon: 'Expiring Soon',
    expired: 'Expired',
  };

  return labels[status];
}

function getRiskLabel(risk: ChildRisk) {
  const labels: Record<ChildRisk, string> = {
    low: 'Stable',
    medium: 'Needs Follow-up',
    high: 'High Attention',
  };

  return labels[risk];
}

export default function MyChildrenPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [subscriptionFilter, setSubscriptionFilter] = useState<
    SubscriptionStatus | 'all'
  >('all');
  const [selectedChildId, setSelectedChildId] = useState(
    childrenData[0]?.id ?? '',
  );

  const programs = useMemo(() => {
    return Array.from(new Set(childrenData.map((child) => child.program)));
  }, []);

  const filteredChildren = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return childrenData.filter((child) => {
      const matchesSearch =
        !normalizedSearch ||
        child.name.toLowerCase().includes(normalizedSearch) ||
        child.program.toLowerCase().includes(normalizedSearch) ||
        child.branch.toLowerCase().includes(normalizedSearch) ||
        child.coach.toLowerCase().includes(normalizedSearch);

      const matchesProgram =
        programFilter === 'all' || child.program === programFilter;

      const matchesSubscription =
        subscriptionFilter === 'all' ||
        child.subscriptionStatus === subscriptionFilter;

      return matchesSearch && matchesProgram && matchesSubscription;
    });
  }, [programFilter, searchTerm, subscriptionFilter]);

  const selectedChild =
    childrenData.find((child) => child.id === selectedChildId) ??
    filteredChildren[0] ??
    childrenData[0];

  const summary = useMemo(() => {
    const averageAttendance = Math.round(
      childrenData.reduce((total, child) => total + child.attendanceRate, 0) /
      childrenData.length,
    );

    const averageProgress = Math.round(
      childrenData.reduce((total, child) => total + child.progressScore, 0) /
      childrenData.length,
    );

    const totalRemainingSessions = childrenData.reduce(
      (total, child) => total + child.remainingSessions,
      0,
    );

    const totalOutstanding = childrenData.reduce(
      (total, child) => total + child.outstandingAmount,
      0,
    );

    const expiringCount = childrenData.filter(
      (child) => child.subscriptionStatus === 'expiringSoon',
    ).length;

    const needsFollowUpCount = childrenData.filter(
      (child) => child.riskLevel !== 'low',
    ).length;

    return {
      averageAttendance,
      averageProgress,
      totalRemainingSessions,
      totalOutstanding,
      expiringCount,
      needsFollowUpCount,
    };
  }, []);

  const subscriptionChart = useMemo(() => {
    return [
      {
        name: 'Active',
        value: childrenData.filter((child) => child.subscriptionStatus === 'active')
          .length,
        color: chartColors.green,
      },
      {
        name: 'Expiring Soon',
        value: childrenData.filter(
          (child) => child.subscriptionStatus === 'expiringSoon',
        ).length,
        color: chartColors.orange,
      },
      {
        name: 'Expired',
        value: childrenData.filter((child) => child.subscriptionStatus === 'expired')
          .length,
        color: chartColors.red,
      },
    ].filter((item) => item.value > 0);
  }, []);

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <Users className="h-4 w-4" />
              Family Profiles
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              My Children
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Review every enrolled child, track attendance and progress,
              monitor subscriptions, check upcoming sessions, and follow coach
              notes from one organized parent workspace.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/parent/make-up-request"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                Request Make-up Session
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
              icon={Users}
              label="Children"
              value={`${childrenData.length}`}
              caption="Linked to this family account"
              positive
            />

            <HeroMetricCard
              icon={CalendarCheck}
              label="Attendance"
              value={`${summary.averageAttendance}%`}
              caption="Average attendance rate"
              positive={summary.averageAttendance >= 80}
            />

            <HeroMetricCard
              icon={Target}
              label="Progress"
              value={`${summary.averageProgress}%`}
              caption="Average training progress"
              positive={summary.averageProgress >= 75}
            />

            <HeroMetricCard
              icon={WalletCards}
              label="Outstanding"
              value={formatCurrency(summary.totalOutstanding)}
              caption="Pending amount across children"
              positive={summary.totalOutstanding === 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Users}
          title="Enrolled Children"
          value={`${childrenData.length}`}
          description="Total children linked to your parent account."
          tone="blue"
        />

        <KpiCard
          icon={Dumbbell}
          title="Remaining Sessions"
          value={`${summary.totalRemainingSessions}`}
          description="Available sessions across all current subscriptions."
          tone="brand"
        />

        <KpiCard
          icon={AlertTriangle}
          title="Needs Follow-up"
          value={`${summary.needsFollowUpCount}`}
          description="Children with attendance, progress, or subscription attention."
          tone={summary.needsFollowUpCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={Clock3}
          title="Expiring Soon"
          value={`${summary.expiringCount}`}
          description="Subscriptions close to renewal date."
          tone={summary.expiringCount > 0 ? 'warning' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Search className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Children Directory
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter your children by name, program, coach,
                  branch, and subscription status.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setProgramFilter('all');
                  setSubscriptionFilter('all');
                }}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                <Activity className="h-4 w-4" />
                Reset Filters
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr_1fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Search</span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search child, program, coach, branch..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

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
                label="Subscription"
                value={subscriptionFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Expiring Soon', value: 'expiringSoon' },
                  { label: 'Expired', value: 'expired' },
                ]}
                onChange={(value) =>
                  setSubscriptionFilter(value as SubscriptionStatus | 'all')
                }
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {filteredChildren.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                active={selectedChild.id === child.id}
                onSelect={() => setSelectedChildId(child.id)}
              />
            ))}

            {filteredChildren.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <ChartCard
              icon={CalendarCheck}
              title="Attendance Trend"
              description="Monthly attendance view for the family account."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTrend}>
                    <defs>
                      <linearGradient
                        id="childrenAttendanceGradient"
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
                      dataKey="Omar"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#childrenAttendanceGradient)"
                      activeDot={{ r: 7 }}
                    />

                    <Area
                      type="monotone"
                      dataKey="Mariam"
                      stroke={chartColors.yellow}
                      strokeWidth={4}
                      fill="transparent"
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Trophy}
              title="Progress & Skills"
              description="Progress and skill score by active program."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Bar
                      dataKey="progress"
                      fill={chartColors.blue}
                      radius={[12, 12, 0, 0]}
                    />

                    <Bar
                      dataKey="skill"
                      fill={chartColors.yellow}
                      radius={[12, 12, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
            <ChartCard
              icon={WalletCards}
              title="Subscription Status"
              description="Current subscription health across your children."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subscriptionChart}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={62}
                        outerRadius={96}
                        paddingAngle={5}
                      >
                        {subscriptionChart.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {subscriptionChart.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      color={item.color}
                      total={childrenData.length}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>

            <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">Upcoming Sessions</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The next scheduled session for every child.
                  </p>
                </div>

                <CalendarDays className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
              </div>

              <div className="space-y-3">
                {childrenData.map((child) => (
                  <UpcomingSessionRow key={child.id} child={child} />
                ))}
              </div>
            </section>
          </section>
        </div>

        <aside className="space-y-6">
          <SelectedChildPanel child={selectedChild} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Common shortcuts for selected child.
                </p>
              </div>

              <SparklesIcon />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={Eye}
                title="View Profile"
                description="Open full child profile and academy details."
                href={`/parent/children/${selectedChild.id}`}
              />

              <QuickAction
                icon={CalendarCheck}
                title="Attendance Report"
                description="Review attendance history and absence records."
                href={`/parent/children/${selectedChild.id}/attendance`}
              />

              <QuickAction
                icon={Target}
                title="Progress Report"
                description="Check progress, skills, and coach feedback."
                href={`/parent/children/${selectedChild.id}/progress`}
              />

              <QuickAction
                icon={FileText}
                title="Documents"
                description="View documents linked to your family account."
                href="/parent/documents"
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Parent Attention</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Important items that may need action.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {childrenData
                .filter(
                  (child) =>
                    child.riskLevel !== 'low' ||
                    child.subscriptionStatus === 'expiringSoon' ||
                    child.outstandingAmount > 0,
                )
                .map((child) => (
                  <AttentionRow key={child.id} child={child} />
                ))}
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function SparklesIcon() {
  return <Star className="h-6 w-6 text-brand-yellow" />;
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

      <h3 className="mt-2 text-xl font-black text-white">{value}</h3>

      <p className="mt-2 text-xs font-bold leading-5 text-white/60">
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

function ChildCard({
  child,
  active,
  onSelect,
}: {
  child: ChildItem;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={[
        'rounded-[2rem] border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg',
        active ? 'border-brand-yellow' : 'border-border',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={onSelect}
        className="w-full text-start"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <UserRound className="h-7 w-7" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-black">{child.name}</h3>

                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {child.age} years · {child.gender} · {formatLabel(child.level)}
                </p>

                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {child.program}
                </p>
              </div>

              <RiskBadge risk={child.riskLevel} />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <MiniMetric
            icon={CalendarCheck}
            label="Attendance"
            value={`${child.attendanceRate}%`}
          />

          <MiniMetric
            icon={Target}
            label="Progress"
            value={`${child.progressScore}%`}
          />

          <MiniMetric
            icon={Medal}
            label="Skill"
            value={`${child.skillScore}%`}
          />

          <MiniMetric
            icon={Dumbbell}
            label="Sessions Left"
            value={`${child.remainingSessions}`}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <SubscriptionBadge status={child.subscriptionStatus} />

          <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
            {child.coach}
          </span>

          <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
            {child.branch}
          </span>
        </div>
      </button>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Link
          to={`/parent/children/${child.id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-black transition hover:bg-secondary"
        >
          <Eye className="h-4 w-4" />
          Profile
        </Link>

        <Link
          to={`/parent/children/${child.id}/attendance`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-black transition hover:bg-secondary"
        >
          <CalendarCheck className="h-4 w-4" />
          Attendance
        </Link>

        <Link
          to={`/parent/children/${child.id}/progress`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
        >
          <Target className="h-4 w-4" />
          Progress
        </Link>
      </div>
    </article>
  );
}

function SelectedChildPanel({ child }: { child: ChildItem }) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Star className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Child
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">{child.name}</h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {child.program} · {child.coach} · {child.branch}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SubscriptionBadge status={child.subscriptionStatus} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {child.remainingSessions} sessions left
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={CalendarCheck}
          label="Attendance Rate"
          value={`${child.attendanceRate}%`}
        />

        <DetailLine
          icon={Target}
          label="Progress Score"
          value={`${child.progressScore}%`}
        />

        <DetailLine
          icon={Trophy}
          label="Skill Score"
          value={`${child.skillScore}%`}
        />

        <DetailLine
          icon={Clock3}
          label="Next Session"
          value={`${child.nextSessionDate} · ${child.nextSessionTime}`}
        />

        <DetailLine
          icon={WalletCards}
          label="Subscription"
          value={`${getSubscriptionLabel(child.subscriptionStatus)} · Ends ${child.subscriptionEndDate}`}
        />

        <DetailLine
          icon={MessageSquare}
          label="Latest Coach Note"
          value={child.latestNote}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/parent/children/${child.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <Eye className="h-4 w-4" />
            Profile
          </Link>

          <Link
            to={`/parent/children/${child.id}/attendance`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <CalendarCheck className="h-4 w-4" />
            Attendance
          </Link>
        </div>
      </div>
    </aside>
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

function UpcomingSessionRow({ child }: { child: ChildItem }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 transition hover:border-brand-yellow hover:bg-brand-yellow/5 dark:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <CalendarDays className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-black">{child.name}</h3>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-950 dark:text-green-300">
              Scheduled
            </span>
          </div>

          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {child.program} · {child.coach}
          </p>

          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {child.nextSessionDate} · {child.nextSessionTime} ·{' '}
            {child.nextSessionLocation}
          </p>
        </div>
      </div>
    </article>
  );
}

function AttentionRow({ child }: { child: ChildItem }) {
  const hasOutstanding = child.outstandingAmount > 0;
  const isExpiring = child.subscriptionStatus === 'expiringSoon';

  return (
    <article className="rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue dark:text-brand-yellow">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-black">{child.name}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {hasOutstanding
              ? `Pending amount: ${formatCurrency(child.outstandingAmount, child.currency)}.`
              : isExpiring
                ? `Subscription ends on ${child.subscriptionEndDate}.`
                : getRiskLabel(child.riskLevel)}
          </p>
        </div>
      </div>
    </article>
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
  color,
  total,
}: {
  label: string;
  value: number;
  color: string;
  total: number;
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
        {percentage}% of children
      </p>
    </div>
  );
}

function SubscriptionBadge({ status }: { status: SubscriptionStatus }) {
  const className =
    status === 'active'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'expiringSoon'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {getSubscriptionLabel(status)}
    </span>
  );
}

function RiskBadge({ risk }: { risk: ChildRisk }) {
  const className =
    risk === 'low'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : risk === 'medium'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {getRiskLabel(risk)}
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
        <Users className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No children found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, program filter, or subscription status.
      </p>
    </div>
  );
}