import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Dumbbell,
  Eye,
  MessageSquare,
  Plus,
  Receipt,
  Sparkles,
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
type InvoiceStatus = 'paid' | 'pending' | 'overdue';
type MessageStatus = 'unread' | 'read';

interface ChildSummary {
  id: string;
  name: string;
  age: number;
  program: string;
  branch: string;
  coach: string;
  attendanceRate: number;
  progressScore: number;
  nextSession: string;
  subscriptionStatus: SubscriptionStatus;
  remainingSessions: number;
}

interface UpcomingSession {
  id: string;
  childName: string;
  program: string;
  coach: string;
  date: string;
  time: string;
  branch: string;
  status: string;
}

interface InvoiceItem {
  id: string;
  invoiceNo: string;
  childName: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: InvoiceStatus;
}

interface PaymentItem {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  date: string;
  method: string;
  status: string;
}

interface MessageItem {
  id: string;
  from: string;
  subject: string;
  date: string;
  status: MessageStatus;
}

interface AttendancePoint {
  month: string;
  attendance: number;
}

interface ProgramProgressPoint {
  name: string;
  progress: number;
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

const childrenData: ChildSummary[] = [
  {
    id: 'child-001',
    name: 'Omar Khaled',
    age: 9,
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    coach: 'Coach Omar',
    attendanceRate: 92,
    progressScore: 84,
    nextSession: 'Today · 6:00 PM',
    subscriptionStatus: 'active',
    remainingSessions: 7,
  },
  {
    id: 'child-002',
    name: 'Mariam Khaled',
    age: 7,
    program: 'Swimming Academy',
    branch: 'Dubai Main Branch',
    coach: 'Coach Sara',
    attendanceRate: 86,
    progressScore: 78,
    nextSession: 'Tomorrow · 5:30 PM',
    subscriptionStatus: 'expiringSoon',
    remainingSessions: 2,
  },
];

const upcomingSessions: UpcomingSession[] = [
  {
    id: 'session-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    coach: 'Coach Omar',
    date: 'Today',
    time: '6:00 PM - 7:30 PM',
    branch: 'Dubai Main Branch',
    status: 'Confirmed',
  },
  {
    id: 'session-002',
    childName: 'Mariam Khaled',
    program: 'Swimming Academy',
    coach: 'Coach Sara',
    date: 'Tomorrow',
    time: '5:30 PM - 6:30 PM',
    branch: 'Dubai Main Branch',
    status: 'Confirmed',
  },
  {
    id: 'session-003',
    childName: 'Omar Khaled',
    program: 'Football Development',
    coach: 'Coach Omar',
    date: 'Saturday',
    time: '10:00 AM - 11:30 AM',
    branch: 'Dubai Main Branch',
    status: 'Scheduled',
  },
];

const invoicesData: InvoiceItem[] = [
  {
    id: 'inv-001',
    invoiceNo: 'INV-2026-0001',
    childName: 'Omar Khaled',
    amount: 750,
    currency: 'AED',
    dueDate: 'Paid May 02',
    status: 'paid',
  },
  {
    id: 'inv-002',
    invoiceNo: 'INV-2026-0002',
    childName: 'Mariam Khaled',
    amount: 900,
    currency: 'AED',
    dueDate: 'Due Jun 05',
    status: 'pending',
  },
];

const paymentsData: PaymentItem[] = [
  {
    id: 'pay-001',
    reference: 'PAY-2026-0001',
    amount: 750,
    currency: 'AED',
    date: 'May 02, 2026',
    method: 'Card',
    status: 'Successful',
  },
  {
    id: 'pay-002',
    reference: 'PAY-2026-0002',
    amount: 300,
    currency: 'AED',
    date: 'Apr 15, 2026',
    method: 'Cash',
    status: 'Successful',
  },
];

const messagesData: MessageItem[] = [
  {
    id: 'msg-001',
    from: 'Coach Omar',
    subject: 'Omar showed strong improvement in passing drills.',
    date: 'Today',
    status: 'unread',
  },
  {
    id: 'msg-002',
    from: 'Finance Team',
    subject: 'Swimming subscription renewal reminder.',
    date: 'Yesterday',
    status: 'read',
  },
];

const attendanceTrend: AttendancePoint[] = [
  { month: 'Jan', attendance: 82 },
  { month: 'Feb', attendance: 86 },
  { month: 'Mar', attendance: 88 },
  { month: 'Apr', attendance: 84 },
  { month: 'May', attendance: 90 },
  { month: 'Jun', attendance: 92 },
];

const progressData: ProgramProgressPoint[] = [
  { name: 'Football', progress: 84 },
  { name: 'Swimming', progress: 78 },
];

const attendanceBreakdown = [
  { name: 'Present', value: 34, color: chartColors.green },
  { name: 'Absent', value: 3, color: chartColors.red },
  { name: 'Late', value: 2, color: chartColors.orange },
  { name: 'Excused', value: 1, color: chartColors.blue },
];

function formatCurrency(value: number, currency = 'AED') {
  return `${value.toLocaleString('en-AE')} ${currency}`;
}

function getSubscriptionLabel(status: SubscriptionStatus) {
  const labels: Record<SubscriptionStatus, string> = {
    active: 'Active',
    expiringSoon: 'Expiring Soon',
    expired: 'Expired',
  };

  return labels[status];
}

function getInvoiceLabel(status: InvoiceStatus) {
  const labels: Record<InvoiceStatus, string> = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
  };

  return labels[status];
}

export default function ParentDashboardPage() {
  const [selectedChildId, setSelectedChildId] = useState(childrenData[0]?.id ?? '');

  const selectedChild =
    childrenData.find((child) => child.id === selectedChildId) ?? childrenData[0];

  const summary = useMemo(() => {
    const averageAttendance = Math.round(
      childrenData.reduce((total, child) => total + child.attendanceRate, 0) /
      childrenData.length,
    );

    const averageProgress = Math.round(
      childrenData.reduce((total, child) => total + child.progressScore, 0) /
      childrenData.length,
    );

    const pendingInvoices = invoicesData.filter(
      (invoice) => invoice.status === 'pending' || invoice.status === 'overdue',
    );

    const pendingAmount = pendingInvoices.reduce(
      (total, invoice) => total + invoice.amount,
      0,
    );

    const unreadMessages = messagesData.filter(
      (message) => message.status === 'unread',
    ).length;

    const expiringSubscriptions = childrenData.filter(
      (child) => child.subscriptionStatus === 'expiringSoon',
    ).length;

    return {
      averageAttendance,
      averageProgress,
      pendingInvoicesCount: pendingInvoices.length,
      pendingAmount,
      unreadMessages,
      expiringSubscriptions,
    };
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
              Family Account
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Parent Dashboard
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Follow your children’s training progress, attendance, upcoming
              sessions, subscriptions, invoices, payments, messages, and academy
              updates from one simple family dashboard.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/parent/children"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Eye className="h-4 w-4" />
                View Children
              </Link>

              <Link
                to="/parent/make-up-request"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Plus className="h-4 w-4" />
                Request Make-up Session
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={CalendarCheck}
              label="Family Attendance"
              value={`${summary.averageAttendance}%`}
              caption="Average across all children"
              positive={summary.averageAttendance >= 80}
            />

            <HeroMetricCard
              icon={Target}
              label="Progress Score"
              value={`${summary.averageProgress}%`}
              caption="Training development average"
              positive={summary.averageProgress >= 75}
            />

            <HeroMetricCard
              icon={WalletCards}
              label="Pending Amount"
              value={formatCurrency(summary.pendingAmount)}
              caption={`${summary.pendingInvoicesCount} invoice(s) pending`}
              positive={summary.pendingAmount === 0}
            />

            <HeroMetricCard
              icon={MessageSquare}
              label="Unread Messages"
              value={`${summary.unreadMessages}`}
              caption="Coach and admin communication"
              positive={summary.unreadMessages === 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Users}
          title="Children"
          value={`${childrenData.length}`}
          description="Linked children in your family account."
          tone="blue"
        />

        <KpiCard
          icon={CheckCircle2}
          title="Attendance"
          value={`${summary.averageAttendance}%`}
          description="Average attendance rate across all children."
          tone="success"
        />

        <KpiCard
          icon={Receipt}
          title="Pending Invoices"
          value={`${summary.pendingInvoicesCount}`}
          description={`${formatCurrency(summary.pendingAmount)} currently pending.`}
          tone={summary.pendingInvoicesCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={Bell}
          title="Notifications"
          value={`${summary.unreadMessages + summary.expiringSubscriptions}`}
          description="Unread messages and subscription reminders."
          tone={
            summary.unreadMessages + summary.expiringSubscriptions > 0
              ? 'warning'
              : 'success'
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <UserRound className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Children Overview
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Select a child to review progress, attendance, subscription,
                  and upcoming sessions.
                </p>
              </div>

              <Link
                to="/parent/children"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                <Eye className="h-4 w-4" />
                View All
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {childrenData.map((child) => (
                <ChildCard
                  key={child.id}
                  child={child}
                  active={selectedChildId === child.id}
                  onSelect={() => setSelectedChildId(child.id)}
                />
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <ChartCard
              icon={CalendarCheck}
              title="Attendance Trend"
              description="Monthly attendance rate for your family account."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTrend}>
                    <defs>
                      <linearGradient
                        id="parentAttendanceGradient"
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
                      dataKey="attendance"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#parentAttendanceGradient)"
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Trophy}
              title="Progress by Program"
              description="Latest development score for each active program."
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
                      fill={chartColors.yellow}
                      radius={[14, 14, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <ChartCard
              icon={Activity}
              title="Attendance Breakdown"
              description="Present, absent, late, and excused records."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={62}
                        outerRadius={96}
                        paddingAngle={5}
                      >
                        {attendanceBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {attendanceBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      color={item.color}
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
                    Next training sessions for your children.
                  </p>
                </div>

                <CalendarDays className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
              </div>

              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
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
                  Common parent portal shortcuts.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={Users}
                title="My Children"
                description="View child profiles and training details."
                href="/parent/children"
              />

              <QuickAction
                icon={Receipt}
                title="Invoices"
                description="Review pending and paid invoices."
                href="/parent/invoices"
              />

              <QuickAction
                icon={CreditCard}
                title="Payments"
                description="View receipts and payment history."
                href="/parent/payments"
              />

              <QuickAction
                icon={MessageSquare}
                title="Messages"
                description="Read coach and academy messages."
                href="/parent/messages"
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Finance Snapshot</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Latest invoices and payments.
                </p>
              </div>

              <WalletCards className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {invoicesData.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
              ))}
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <p className="mb-3 text-sm font-black">Recent Payments</p>

              <div className="space-y-3">
                {paymentsData.map((payment) => (
                  <PaymentRow key={payment.id} payment={payment} />
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Messages</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recent updates from the academy.
                </p>
              </div>

              <MessageSquare className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {messagesData.map((message) => (
                <MessageRow key={message.id} message={message} />
              ))}
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

      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
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
  child: ChildSummary;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'rounded-[2rem] border p-5 text-start transition',
        active
          ? 'border-brand-yellow bg-brand-yellow/10 shadow-sm'
          : 'border-border bg-background hover:border-brand-yellow hover:bg-brand-yellow/5',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <UserRound className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-black">{child.name}</h3>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {child.age} years · {child.program}
          </p>
          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {child.branch}
          </p>
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
          icon={Clock3}
          label="Next"
          value={child.nextSession}
        />

        <MiniMetric
          icon={Dumbbell}
          label="Sessions Left"
          value={`${child.remainingSessions}`}
        />
      </div>
    </button>
  );
}

function SelectedChildPanel({ child }: { child: ChildSummary }) {
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
          icon={Clock3}
          label="Next Session"
          value={child.nextSession}
        />

        <DetailLine
          icon={Trophy}
          label="Program"
          value={child.program}
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

function SessionCard({ session }: { session: UpcomingSession }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 transition hover:border-brand-yellow hover:bg-brand-yellow/5 dark:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <CalendarDays className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-black">{session.childName}</h3>

            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-950 dark:text-green-300">
              {session.status}
            </span>
          </div>

          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {session.program} · {session.coach}
          </p>

          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {session.date} · {session.time} · {session.branch}
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
    <div className="rounded-2xl border border-border bg-card p-3 dark:bg-white/[0.04]">
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
}: {
  label: string;
  value: number;
  color: string;
}) {
  const total = attendanceBreakdown.reduce((sum, item) => sum + item.value, 0);
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
        {percentage}% of records
      </p>
    </div>
  );
}

function InvoiceRow({ invoice }: { invoice: InvoiceItem }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">{invoice.invoiceNo}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {invoice.childName} · {invoice.dueDate}
          </p>
        </div>

        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <p className="mt-3 text-sm font-black text-brand-blue dark:text-brand-yellow">
        {formatCurrency(invoice.amount, invoice.currency)}
      </p>
    </div>
  );
}

function PaymentRow({ payment }: { payment: PaymentItem }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">{payment.reference}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {payment.date} · {payment.method}
          </p>
        </div>

        <CheckCircle2 className="h-5 w-5 text-green-600" />
      </div>

      <p className="mt-3 text-sm font-black text-brand-blue dark:text-brand-yellow">
        {formatCurrency(payment.amount, payment.currency)}
      </p>
    </div>
  );
}

function MessageRow({ message }: { message: MessageItem }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div
          className={[
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
            message.status === 'unread'
              ? 'bg-brand-yellow text-brand-blue'
              : 'bg-secondary text-muted-foreground',
          ].join(' ')}
        >
          <MessageSquare className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{message.from}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
            {message.subject}
          </p>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {message.date}
          </p>
        </div>
      </div>
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

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const className =
    status === 'paid'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'pending'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {getInvoiceLabel(status)}
    </span>
  );
}