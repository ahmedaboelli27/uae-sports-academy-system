import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  CalendarCheck,
  CalendarDays,
  Clock3,
  Dumbbell,
  Eye,
  FileText,
  HeartPulse,
  MapPin,
  Medal,
  MessageSquare,
  Receipt,
  ShieldCheck,
  Star,
  Target,
  Trophy,
  UserRound,
  Users,
  WalletCards
} from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
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
type RiskLevel = 'low' | 'medium' | 'high';
type SessionStatus = 'confirmed' | 'scheduled' | 'completed';
type InvoiceStatus = 'paid' | 'pending' | 'overdue';

interface ChildSkill {
  name: string;
  score: number;
  note: string;
}

interface AttendancePoint {
  month: string;
  attendance: number;
}

interface ProgressPoint {
  month: string;
  progress: number;
}

interface UpcomingSession {
  id: string;
  date: string;
  time: string;
  title: string;
  coach: string;
  location: string;
  status: SessionStatus;
}

interface CoachNote {
  id: string;
  date: string;
  coach: string;
  title: string;
  note: string;
}

interface DocumentItem {
  id: string;
  title: string;
  type: string;
  date: string;
}

interface InvoiceItem {
  id: string;
  invoiceNo: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: InvoiceStatus;
}

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  studentCode: string;
  program: string;
  sport: string;
  branch: string;
  location: string;
  coach: string;
  coachPhone: string;
  level: ChildLevel;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate: string;
  remainingSessions: number;
  completedSessions: number;
  attendanceRate: number;
  progressScore: number;
  skillScore: number;
  riskLevel: RiskLevel;
  outstandingAmount: number;
  currency: string;
  parentNote: string;
  latestCoachNote: string;
  attendanceTrend: AttendancePoint[];
  progressTrend: ProgressPoint[];
  skills: ChildSkill[];
  upcomingSessions: UpcomingSession[];
  coachNotes: CoachNote[];
  documents: DocumentItem[];
  invoices: InvoiceItem[];
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

const childrenProfiles: ChildProfile[] = [
  {
    id: 'child-001',
    name: 'Omar Khaled',
    age: 9,
    gender: 'Boy',
    dateOfBirth: '2017-02-14',
    studentCode: 'STU-1001',
    program: 'Football Development',
    sport: 'Football',
    branch: 'Dubai Main Branch',
    location: 'Pitch A',
    coach: 'Coach Omar',
    coachPhone: '+971 50 111 2233',
    level: 'intermediate',
    subscriptionStatus: 'active',
    subscriptionEndDate: '2026-06-30',
    remainingSessions: 7,
    completedSessions: 21,
    attendanceRate: 92,
    progressScore: 84,
    skillScore: 88,
    riskLevel: 'low',
    outstandingAmount: 0,
    currency: 'AED',
    parentNote: 'Prefers evening sessions and responds well to structured drills.',
    latestCoachNote:
      'Strong improvement in passing accuracy, stamina, and field positioning.',
    attendanceTrend: [
      { month: 'Jan', attendance: 82 },
      { month: 'Feb', attendance: 86 },
      { month: 'Mar', attendance: 88 },
      { month: 'Apr', attendance: 90 },
      { month: 'May', attendance: 92 },
      { month: 'Jun', attendance: 94 },
    ],
    progressTrend: [
      { month: 'Jan', progress: 68 },
      { month: 'Feb', progress: 72 },
      { month: 'Mar', progress: 76 },
      { month: 'Apr', progress: 79 },
      { month: 'May', progress: 82 },
      { month: 'Jun', progress: 84 },
    ],
    skills: [
      {
        name: 'Passing',
        score: 88,
        note: 'Good accuracy under pressure.',
      },
      {
        name: 'Stamina',
        score: 84,
        note: 'Improved endurance across full sessions.',
      },
      {
        name: 'Positioning',
        score: 81,
        note: 'Needs continued tactical awareness.',
      },
      {
        name: 'Teamwork',
        score: 90,
        note: 'Very cooperative with teammates.',
      },
    ],
    upcomingSessions: [
      {
        id: 'session-001',
        date: 'Today',
        time: '6:00 PM - 7:30 PM',
        title: 'Ball Control & Passing',
        coach: 'Coach Omar',
        location: 'Pitch A',
        status: 'confirmed',
      },
      {
        id: 'session-002',
        date: 'Saturday',
        time: '10:00 AM - 11:30 AM',
        title: 'Match Simulation',
        coach: 'Coach Omar',
        location: 'Pitch B',
        status: 'scheduled',
      },
    ],
    coachNotes: [
      {
        id: 'note-001',
        date: 'May 26, 2026',
        coach: 'Coach Omar',
        title: 'Passing improvement',
        note: 'Omar showed strong passing accuracy and better timing during drills.',
      },
      {
        id: 'note-002',
        date: 'May 20, 2026',
        coach: 'Coach Omar',
        title: 'Fitness update',
        note: 'Stamina improved, but warm-up discipline should remain consistent.',
      },
    ],
    documents: [
      {
        id: 'doc-001',
        title: 'Medical Clearance',
        type: 'PDF',
        date: 'May 01, 2026',
      },
      {
        id: 'doc-002',
        title: 'Enrollment Agreement',
        type: 'PDF',
        date: 'Apr 25, 2026',
      },
    ],
    invoices: [
      {
        id: 'inv-001',
        invoiceNo: 'INV-2026-0001',
        amount: 750,
        currency: 'AED',
        dueDate: 'Paid May 02',
        status: 'paid',
      },
    ],
  },
  {
    id: 'child-002',
    name: 'Mariam Khaled',
    age: 7,
    gender: 'Girl',
    dateOfBirth: '2019-08-09',
    studentCode: 'STU-1002',
    program: 'Swimming Academy',
    sport: 'Swimming',
    branch: 'Dubai Main Branch',
    location: 'Pool 2',
    coach: 'Coach Sara',
    coachPhone: '+971 55 222 3344',
    level: 'beginner',
    subscriptionStatus: 'expiringSoon',
    subscriptionEndDate: '2026-06-05',
    remainingSessions: 2,
    completedSessions: 14,
    attendanceRate: 86,
    progressScore: 78,
    skillScore: 74,
    riskLevel: 'medium',
    outstandingAmount: 900,
    currency: 'AED',
    parentNote: 'Needs confidence-building exercises during water activities.',
    latestCoachNote:
      'Needs more confidence with breathing rhythm and floating control.',
    attendanceTrend: [
      { month: 'Jan', attendance: 76 },
      { month: 'Feb', attendance: 79 },
      { month: 'Mar', attendance: 82 },
      { month: 'Apr', attendance: 84 },
      { month: 'May', attendance: 86 },
      { month: 'Jun', attendance: 88 },
    ],
    progressTrend: [
      { month: 'Jan', progress: 58 },
      { month: 'Feb', progress: 63 },
      { month: 'Mar', progress: 68 },
      { month: 'Apr', progress: 72 },
      { month: 'May', progress: 76 },
      { month: 'Jun', progress: 78 },
    ],
    skills: [
      {
        name: 'Breathing',
        score: 70,
        note: 'Needs more rhythm consistency.',
      },
      {
        name: 'Floating',
        score: 74,
        note: 'Improving but needs confidence.',
      },
      {
        name: 'Kick Technique',
        score: 80,
        note: 'Good progress in leg movement.',
      },
      {
        name: 'Water Confidence',
        score: 72,
        note: 'Requires positive reinforcement.',
      },
    ],
    upcomingSessions: [
      {
        id: 'session-003',
        date: 'Tomorrow',
        time: '5:30 PM - 6:30 PM',
        title: 'Breathing & Floating Control',
        coach: 'Coach Sara',
        location: 'Pool 2',
        status: 'confirmed',
      },
    ],
    coachNotes: [
      {
        id: 'note-003',
        date: 'May 25, 2026',
        coach: 'Coach Sara',
        title: 'Confidence building',
        note: 'Mariam is improving slowly and needs calm repetition.',
      },
    ],
    documents: [
      {
        id: 'doc-003',
        title: 'Swimming Consent Form',
        type: 'PDF',
        date: 'May 05, 2026',
      },
    ],
    invoices: [
      {
        id: 'inv-002',
        invoiceNo: 'INV-2026-0002',
        amount: 900,
        currency: 'AED',
        dueDate: 'Due Jun 05',
        status: 'pending',
      },
    ],
  },
];

function formatCurrency(value: number, currency = 'AED') {
  return `${value.toLocaleString('en-AE')} ${currency}`;
}

function formatLevel(level: ChildLevel) {
  const labels: Record<ChildLevel, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
  };

  return labels[level];
}

function getSubscriptionLabel(status: SubscriptionStatus) {
  const labels: Record<SubscriptionStatus, string> = {
    active: 'Active',
    expiringSoon: 'Expiring Soon',
    expired: 'Expired',
  };

  return labels[status];
}

function getRiskLabel(risk: RiskLevel) {
  const labels: Record<RiskLevel, string> = {
    low: 'Stable',
    medium: 'Needs Follow-up',
    high: 'High Attention',
  };

  return labels[risk];
}

function getInvoiceLabel(status: InvoiceStatus) {
  const labels: Record<InvoiceStatus, string> = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
  };

  return labels[status];
}

export default function ChildProfilePage() {
  const { childId } = useParams();

  const child = useMemo(() => {
    return (
      childrenProfiles.find((profile) => profile.id === childId) ??
      childrenProfiles[0]
    );
  }, [childId]);

  const attendanceBreakdown = useMemo(() => {
    const present = Math.round((child.completedSessions * child.attendanceRate) / 100);
    const absent = Math.max(child.completedSessions - present - 1, 0);
    const late = 1;

    return [
      { name: 'Present', value: present, color: chartColors.green },
      { name: 'Absent', value: absent, color: chartColors.red },
      { name: 'Late', value: late, color: chartColors.orange },
    ].filter((item) => item.value > 0);
  }, [child]);

  const totalAttendanceRecords = attendanceBreakdown.reduce(
    (total, item) => total + item.value,
    0,
  );

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <UserRound className="h-4 w-4" />
              Child Profile
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {child.name}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              {child.program} · {child.branch} · {child.coach}. Review this
              child’s attendance, training progress, subscription, sessions,
              documents, invoices, and coach feedback from one detailed profile.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/parent/children/${child.id}/attendance`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <CalendarCheck className="h-4 w-4" />
                Attendance Report
              </Link>

              <Link
                to={`/parent/children/${child.id}/progress`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Target className="h-4 w-4" />
                Progress Report
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={CalendarCheck}
              label="Attendance"
              value={`${child.attendanceRate}%`}
              caption="Overall attendance rate"
              positive={child.attendanceRate >= 80}
            />

            <HeroMetricCard
              icon={Target}
              label="Progress"
              value={`${child.progressScore}%`}
              caption="Training development score"
              positive={child.progressScore >= 75}
            />

            <HeroMetricCard
              icon={Medal}
              label="Skill Score"
              value={`${child.skillScore}%`}
              caption={`${formatLevel(child.level)} level`}
              positive={child.skillScore >= 75}
            />

            <HeroMetricCard
              icon={WalletCards}
              label="Outstanding"
              value={formatCurrency(child.outstandingAmount, child.currency)}
              caption="Pending financial amount"
              positive={child.outstandingAmount === 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={UserRound}
          title="Student Code"
          value={child.studentCode}
          description={`${child.age} years · ${child.gender}`}
          tone="blue"
        />

        <KpiCard
          icon={Dumbbell}
          title="Sessions"
          value={`${child.remainingSessions}`}
          description={`${child.completedSessions} completed sessions so far.`}
          tone="brand"
        />

        <KpiCard
          icon={ShieldCheck}
          title="Subscription"
          value={getSubscriptionLabel(child.subscriptionStatus)}
          description={`Ends on ${child.subscriptionEndDate}.`}
          tone={child.subscriptionStatus === 'active' ? 'success' : 'warning'}
        />

        <KpiCard
          icon={AlertTriangle}
          title="Risk Status"
          value={getRiskLabel(child.riskLevel)}
          description="Operational attention level based on attendance and progress."
          tone={child.riskLevel === 'low' ? 'success' : 'warning'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="grid gap-6 xl:grid-cols-2">
            <ProfileInfoCard child={child} />

            <ProgramInfoCard child={child} />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <ChartCard
              icon={CalendarCheck}
              title="Attendance Trend"
              description="Monthly attendance rate for this child."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={child.attendanceTrend}>
                    <defs>
                      <linearGradient
                        id="childAttendanceGradient"
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
                      fill="url(#childAttendanceGradient)"
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Target}
              title="Progress Trend"
              description="Training development over recent months."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={child.progressTrend}>
                    <defs>
                      <linearGradient
                        id="childProgressGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartColors.yellow}
                          stopOpacity={0.45}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartColors.yellow}
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
                      dataKey="progress"
                      stroke={chartColors.yellow}
                      strokeWidth={4}
                      fill="url(#childProgressGradient)"
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <ChartCard
              icon={Activity}
              title="Attendance Breakdown"
              description="Present, absent, and late attendance records."
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
                      total={totalAttendanceRecords}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard
              icon={Medal}
              title="Skill Assessment"
              description="Latest coach assessment across key skills."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={child.skills}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Bar
                      dataKey="score"
                      fill={chartColors.blue}
                      radius={[14, 14, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black">Detailed Skills</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Skill-by-skill view with coach notes.
                </p>
              </div>

              <Award className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {child.skills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <ChildSummaryPanel child={child} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Upcoming Sessions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Next scheduled training sessions.
                </p>
              </div>

              <CalendarDays className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {child.upcomingSessions.map((session) => (
                <SessionRow key={session.id} session={session} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Coach Notes</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Latest coach feedback.
                </p>
              </div>

              <MessageSquare className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {child.coachNotes.map((note) => (
                <CoachNoteRow key={note.id} note={note} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Documents</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Documents related to this child.
                </p>
              </div>

              <FileText className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {child.documents.map((document) => (
                <DocumentRow key={document.id} document={document} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Invoices</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Financial items linked to this child.
                </p>
              </div>

              <Receipt className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {child.invoices.map((invoice) => (
                <InvoiceRow key={invoice.id} invoice={invoice} />
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

function ProfileInfoCard({ child }: { child: ChildProfile }) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">Basic Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Child identity and family profile details.
          </p>
        </div>

        <UserRound className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailLine icon={UserRound} label="Name" value={child.name} />
        <DetailLine icon={Users} label="Student Code" value={child.studentCode} />
        <DetailLine icon={HeartPulse} label="Age / Gender" value={`${child.age} · ${child.gender}`} />
        <DetailLine icon={CalendarDays} label="Date of Birth" value={child.dateOfBirth} />
      </div>
    </section>
  );
}

function ProgramInfoCard({ child }: { child: ChildProfile }) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black">Program Enrollment</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Current program, coach, branch, and training level.
          </p>
        </div>

        <Trophy className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailLine icon={Trophy} label="Program" value={child.program} />
        <DetailLine icon={Dumbbell} label="Sport" value={child.sport} />
        <DetailLine icon={UserRound} label="Coach" value={child.coach} />
        <DetailLine icon={MapPin} label="Branch / Location" value={`${child.branch} · ${child.location}`} />
      </div>
    </section>
  );
}

function ChildSummaryPanel({ child }: { child: ChildProfile }) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Star className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Profile Summary
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">{child.name}</h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {child.program} · {formatLevel(child.level)} · {child.coach}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SubscriptionBadge status={child.subscriptionStatus} />
          <RiskBadge risk={child.riskLevel} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={CalendarCheck}
          label="Attendance"
          value={`${child.attendanceRate}%`}
        />

        <DetailLine
          icon={Target}
          label="Progress"
          value={`${child.progressScore}%`}
        />

        <DetailLine
          icon={Medal}
          label="Skill Score"
          value={`${child.skillScore}%`}
        />

        <DetailLine
          icon={Clock3}
          label="Sessions"
          value={`${child.remainingSessions} remaining · ${child.completedSessions} completed`}
        />

        <DetailLine
          icon={WalletCards}
          label="Outstanding Amount"
          value={formatCurrency(child.outstandingAmount, child.currency)}
        />

        <DetailLine
          icon={MessageSquare}
          label="Latest Coach Note"
          value={child.latestCoachNote}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/parent/children/${child.id}/attendance`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <CalendarCheck className="h-4 w-4" />
            Attendance
          </Link>

          <Link
            to={`/parent/children/${child.id}/progress`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <Target className="h-4 w-4" />
            Progress
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

function SkillCard({ skill }: { skill: ChildSkill }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black">{skill.name}</h3>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {skill.note}
          </p>
        </div>

        <span className="text-lg font-black text-brand-blue dark:text-brand-yellow">
          {skill.score}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-brand-yellow"
          style={{ width: `${skill.score}%` }}
        />
      </div>
    </article>
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
        {percentage}% of records
      </p>
    </div>
  );
}

function SessionRow({ session }: { session: UpcomingSession }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 transition hover:border-brand-yellow hover:bg-brand-yellow/5 dark:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <CalendarDays className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-black">{session.title}</h3>
            <SessionStatusBadge status={session.status} />
          </div>

          <p className="mt-1 text-sm font-semibold text-muted-foreground">
            {session.coach} · {session.location}
          </p>

          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {session.date} · {session.time}
          </p>
        </div>
      </div>
    </article>
  );
}

function CoachNoteRow({ note }: { note: CoachNote }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <MessageSquare className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{note.title}</p>

          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {note.coach} · {note.date}
          </p>

          <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
            {note.note}
          </p>
        </div>
      </div>
    </article>
  );
}

function DocumentRow({ document }: { document: DocumentItem }) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <FileText className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{document.title}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {document.type} · {document.date}
          </p>
        </div>
      </div>

      <Link
        to="/parent/documents"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition hover:border-brand-yellow"
      >
        <Eye className="h-4 w-4" />
      </Link>
    </article>
  );
}

function InvoiceRow({ invoice }: { invoice: InvoiceItem }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">{invoice.invoiceNo}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {invoice.dueDate}
          </p>
        </div>

        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <p className="mt-3 text-sm font-black text-brand-blue dark:text-brand-yellow">
        {formatCurrency(invoice.amount, invoice.currency)}
      </p>
    </article>
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

function RiskBadge({ risk }: { risk: RiskLevel }) {
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

function SessionStatusBadge({ status }: { status: SessionStatus }) {
  const labels: Record<SessionStatus, string> = {
    confirmed: 'Confirmed',
    scheduled: 'Scheduled',
    completed: 'Completed',
  };

  const className =
    status === 'confirmed'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'scheduled'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {labels[status]}
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