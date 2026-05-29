import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  Dumbbell,
  Eye,
  FileText,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
  Zap,
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
import { coachDataService } from '@/features/coach/services/coach-data.service';
import type {
  CoachAssignedPlayerDto,
  CoachSessionDto,
  CoachSessionStatus,
  CoachTaskDto,
  CoachTaskPriority,
  CoachPlayerStatus,
} from '@/features/coach/types/coach.dto';

function getSessionStatusLabel(status: CoachSessionStatus) {
  const labels: Record<CoachSessionStatus, string> = {
    scheduled: 'Scheduled',
    inProgress: 'In Progress',
    completed: 'Completed',
    attendancePending: 'Attendance Pending',
    cancelled: 'Cancelled',
  };

  return labels[status];
}

function getPlayerStatusLabel(status: CoachPlayerStatus) {
  const labels: Record<CoachPlayerStatus, string> = {
    active: 'Active',
    needsFollowUp: 'Needs Follow-up',
    excellent: 'Excellent',
    inactive: 'Inactive',
  };

  return labels[status];
}

function getPriorityLabel(priority: CoachTaskPriority) {
  const labels: Record<CoachTaskPriority, string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return labels[priority];
}

export default function CoachDashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const coach = useMemo(() => coachDataService.getCurrentCoach(), []);
  const chartColors = useMemo(() => coachDataService.getChartColors(), []);
  const todaySessions = useMemo(() => coachDataService.getTodaySessions(), []);
  const upcomingSessions = useMemo(
    () => coachDataService.getUpcomingSessions(),
    [],
  );
  const assignedPlayers = useMemo(
    () => coachDataService.getAssignedPlayers(),
    [],
  );
  const coachTasks = useMemo(() => coachDataService.getCoachTasks(), []);
  const attendanceTrend = useMemo(
    () => coachDataService.getAttendanceTrend(),
    [],
  );
  const capacityData = useMemo(() => coachDataService.getCapacityData(), []);
  const summary = useMemo(() => coachDataService.getDashboardSummary(), []);
  const playerStatusBreakdown = useMemo(
    () => coachDataService.getPlayerStatusBreakdown(),
    [],
  );

  const filteredPlayers = useMemo(() => {
    return coachDataService.searchAssignedPlayers(assignedPlayers, searchTerm);
  }, [assignedPlayers, searchTerm]);

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <Dumbbell className="h-4 w-4" />
              Coach Workspace
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Coach Dashboard
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Your daily coaching overview for assigned sessions, attendance
              completion, player progress, pending notes, incidents, and quick
              operational actions.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/coach/attendance"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <ClipboardCheck className="h-4 w-4" />
                Take Attendance
              </Link>

              <Link
                to="/coach/schedule"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <CalendarDays className="h-4 w-4" />
                View Schedule
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={CalendarCheck}
              label="Today Sessions"
              value={`${summary.totalSessions}`}
              caption="Sessions assigned today"
              positive
            />

            <HeroMetricCard
              icon={Users}
              label="Assigned Players"
              value={`${summary.totalAssignedPlayers}`}
              caption="Players under your coaching scope"
              positive
            />

            <HeroMetricCard
              icon={ClipboardCheck}
              label="Attendance Completion"
              value={`${summary.attendanceCompletion}%`}
              caption={`${summary.attendancePending} session(s) pending`}
              positive={summary.attendancePending === 0}
            />

            <HeroMetricCard
              icon={FileText}
              label="Pending Notes"
              value={`${summary.pendingNotes}`}
              caption="Players needing follow-up notes"
              positive={summary.pendingNotes === 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={CalendarCheck}
          title="Today Sessions"
          value={`${summary.totalSessions}`}
          description="Training sessions assigned to you today."
          tone="blue"
        />

        <KpiCard
          icon={Users}
          title="Assigned Players"
          value={`${summary.totalAssignedPlayers}`}
          description="Players linked to your active sessions."
          tone="success"
        />

        <KpiCard
          icon={TrendingUp}
          title="Average Attendance"
          value={`${summary.averageAttendance}%`}
          description="Average attendance rate for assigned players."
          tone="brand"
        />

        <KpiCard
          icon={AlertTriangle}
          title="Follow-up Needed"
          value={`${summary.pendingNotes}`}
          description="Players or tasks requiring coach action."
          tone={summary.pendingNotes > 0 ? 'warning' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <CalendarCheck className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Today&apos;s Sessions
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Review your assigned sessions for today and continue attendance
                  or session follow-up actions.
                </p>
              </div>

              <Link
                to="/coach/sessions"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                <Eye className="h-4 w-4" />
                View All Sessions
              </Link>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {todaySessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Attendance Trend"
              description="Attendance rate and completion movement for recent coaching days."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceTrend}>
                    <defs>
                      <linearGradient
                        id="coachAttendanceGradient"
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
                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#coachAttendanceGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="completion"
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
              title="Player Status"
              description="Distribution of assigned players by coaching status."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={playerStatusBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {playerStatusBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {playerStatusBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={assignedPlayers.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <ChartCard
            icon={Target}
            title="Session Capacity Overview"
            description="Assigned players versus remaining session capacity."
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={capacityData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />

                  <Bar
                    dataKey="assigned"
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

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Users className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Assigned Players
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and review your assigned players, attendance rate,
                  progress score, and latest coach note.
                </p>
              </div>

              <Link
                to="/coach/players"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                <Eye className="h-4 w-4" />
                View Players
              </Link>
            </div>

            <div className="relative mb-5 max-w-xl">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search player, program, level, or note..."
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>

            {filteredPlayers.length === 0 ? <EmptyState /> : null}
          </section>
        </div>

        <aside className="space-y-6">
          <CoachSummaryPanel coach={coach} playersCount={assignedPlayers.length} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Pending Tasks</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Coaching actions that need follow-up.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {coachTasks.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Upcoming Sessions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Next sessions assigned to you.
                </p>
              </div>

              <CalendarDays className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <UpcomingSessionRow key={session.id} session={session} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful coach shortcuts.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={ClipboardCheck}
                title="Take Attendance"
                description="Mark attendance for assigned sessions."
                href="/coach/attendance"
              />

              <QuickAction
                icon={FileText}
                title="Progress Notes"
                description="Add player development notes."
                href="/coach/progress-notes"
              />

              <QuickAction
                icon={ShieldCheck}
                title="Incident Report"
                description="Submit safety or behavior incident."
                href="/coach/incidents"
              />

              <QuickAction
                icon={MessageSquare}
                title="Messages"
                description="Communicate with admin or assigned parents."
                href="/coach/messages"
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

function SessionCard({ session }: { session: CoachSessionDto }) {
  const attendancePercentage =
    session.assignedPlayers > 0
      ? Math.round((session.attendanceMarked / session.assignedPlayers) * 100)
      : 0;

  return (
    <article className="rounded-[2rem] border border-border bg-background p-5 transition hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg dark:bg-white/[0.04]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Dumbbell className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black">{session.title}</h3>

              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {session.program} · {session.level}
              </p>

              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {session.time} · {session.duration}
              </p>
            </div>

            <SessionStatusBadge status={session.status} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniInfo icon={MapPin} label="Branch" value={session.branch} />
        <MiniInfo icon={Target} label="Location" value={session.court} />
        <MiniInfo
          icon={Users}
          label="Players"
          value={`${session.assignedPlayers}/${session.capacity}`}
        />
        <MiniInfo
          icon={ClipboardCheck}
          label="Attendance"
          value={`${attendancePercentage}%`}
        />
      </div>

      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between text-xs font-black">
          <span>Attendance Completion</span>
          <span>{attendancePercentage}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-brand-yellow"
            style={{ width: `${attendancePercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/coach/sessions/${session.id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-black transition hover:bg-secondary"
        >
          <Eye className="h-4 w-4" />
          Details
        </Link>

        <Link
          to={`/coach/attendance?sessionId=${session.id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
        >
          <ClipboardCheck className="h-4 w-4" />
          Attendance
        </Link>
      </div>
    </article>
  );
}

function PlayerCard({ player }: { player: CoachAssignedPlayerDto }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 transition hover:border-brand-yellow hover:bg-brand-yellow/5 dark:bg-white/[0.04]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <UserRound className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-sm font-black">{player.name}</h3>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Age {player.age} · {player.level}
            </p>
          </div>
        </div>

        <PlayerStatusBadge status={player.status} />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <MiniScore label="Attendance" value={`${player.attendanceRate}%`} />
        <MiniScore label="Progress" value={`${player.progressScore}%`} />
      </div>

      <p className="mt-3 text-xs font-semibold leading-5 text-muted-foreground">
        {player.latestNote}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/coach/players/${player.id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-black transition hover:bg-secondary"
        >
          <Eye className="h-4 w-4" />
          Profile
        </Link>

        <Link
          to={`/coach/progress-notes?playerId=${player.id}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
        >
          <FileText className="h-4 w-4" />
          Add Note
        </Link>
      </div>
    </article>
  );
}

function CoachSummaryPanel({
  coach,
  playersCount,
}: {
  coach: ReturnType<typeof coachDataService.getCurrentCoach>;
  playersCount: number;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Trophy className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Coach Summary
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">{coach.name}</h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {coach.specialization} · {coach.branch} · {coach.levels.join(' / ')}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
            Coach Scope
          </span>

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {playersCount} Assigned Players
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={Dumbbell} label="Specialization" value={coach.specialization} />
        <DetailLine icon={MapPin} label="Main Branch" value={coach.branch} />
        <DetailLine icon={Users} label="Assigned Players" value={`${playersCount} Players`} />
        <DetailLine icon={Star} label="Coach Rating" value={`${coach.rating} / 5`} />
        <DetailLine icon={Clock3} label="Next Session" value="Today · 04:00 PM" />
      </div>
    </aside>
  );
}

function TaskRow({ task }: { task: CoachTaskDto }) {
  return (
    <Link
      to={task.href}
      className="group block rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10 dark:bg-white/[0.04]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <Zap className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <p className="text-sm font-black">{task.title}</p>
            <PriorityBadge priority={task.priority} />
          </div>

          <p className="text-xs font-semibold leading-5 text-muted-foreground">
            {task.description}
          </p>

          <p className="mt-2 text-xs font-black text-brand-blue dark:text-brand-yellow">
            Due: {task.due}
          </p>
        </div>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-brand-blue dark:group-hover:text-brand-yellow" />
      </div>
    </Link>
  );
}

function UpcomingSessionRow({ session }: { session: CoachSessionDto }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <CalendarDays className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{session.title}</p>

          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {session.time} · {session.branch}
          </p>

          <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
            {session.assignedPlayers} players · {session.level}
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
    <div className="rounded-2xl border border-border bg-card p-3 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-xs font-black text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="text-sm font-black">{value}</p>
    </div>
  );
}

function MiniScore({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center dark:bg-white/[0.04]">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black text-brand-blue dark:text-brand-yellow">
        {value}
      </p>
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
        {percentage}% of players
      </p>
    </div>
  );
}

function SessionStatusBadge({ status }: { status: CoachSessionStatus }) {
  const className =
    status === 'completed'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'inProgress'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : status === 'attendancePending'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
          : status === 'cancelled'
            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getSessionStatusLabel(status)}
    </span>
  );
}

function PlayerStatusBadge({ status }: { status: CoachPlayerStatus }) {
  const className =
    status === 'excellent'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'needsFollowUp'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : status === 'inactive'
          ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getPlayerStatusLabel(status)}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: CoachTaskPriority }) {
  const className =
    priority === 'high'
      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
      : priority === 'medium'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getPriorityLabel(priority)}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm md:col-span-2">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <Users className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No players found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term or review your assigned players list.
      </p>
    </div>
  );
}