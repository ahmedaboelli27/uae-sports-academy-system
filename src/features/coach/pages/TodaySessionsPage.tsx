import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Dumbbell,
  Eye,
  Filter,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
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
} from '@/features/coach/types/coach.dto';

type LevelFilter = 'all' | 'Beginner' | 'Intermediate' | 'Advanced';

interface TodaySessionView extends CoachSessionDto {
  startTime: string;
  endTime: string;
  location: string;
  coachName: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  focus: string;
  equipment: string;
  notes: string;
  linkedPlayers: CoachAssignedPlayerDto[];
}

function getStatusLabel(status: CoachSessionStatus) {
  const labels: Record<CoachSessionStatus, string> = {
    scheduled: 'Scheduled',
    inProgress: 'In Progress',
    completed: 'Completed',
    attendancePending: 'Attendance Pending',
    cancelled: 'Cancelled',
  };

  return labels[status];
}

function getLevelLabel(level: string) {
  return level || 'Not specified';
}

function getSessionGroupKeyword(session: CoachSessionDto) {
  const match = session.title.match(/U\d+/i);

  return match?.[0].toUpperCase() ?? '';
}

function getPlayersForSession(
  session: CoachSessionDto,
  players: CoachAssignedPlayerDto[],
) {
  const groupKeyword = getSessionGroupKeyword(session);

  if (groupKeyword) {
    const groupPlayers = players.filter((player) =>
      player.group.toUpperCase().includes(groupKeyword),
    );

    if (groupPlayers.length > 0) return groupPlayers;
  }

  const levelPlayers = players.filter(
    (player) => player.level.toLowerCase() === session.level.toLowerCase(),
  );

  if (levelPlayers.length > 0) return levelPlayers;

  return players.slice(0, Math.min(session.assignedPlayers, players.length));
}

function getSessionEndTime(session: CoachSessionDto) {
  if (session.id === 'session-001') return '05:30 PM';
  if (session.id === 'session-002') return '07:30 PM';
  if (session.id === 'session-003') return '08:30 PM';

  return session.time;
}

function getSessionFocus(session: CoachSessionDto) {
  const normalizedTitle = session.title.toLowerCase();

  if (normalizedTitle.includes('technical')) {
    return 'Passing accuracy, first touch, and short possession drills.';
  }

  if (normalizedTitle.includes('match')) {
    return 'Tactical positioning, defensive shape, and transition play.';
  }

  if (normalizedTitle.includes('fundamentals')) {
    return 'Basic ball control, balance, coordination, and confidence.';
  }

  if (normalizedTitle.includes('passing')) {
    return 'Passing accuracy, scanning before receiving, and quick decisions.';
  }

  if (normalizedTitle.includes('defensive')) {
    return 'Defensive shape, recovery runs, and transition awareness.';
  }

  return 'Coach-led development activities for the selected training group.';
}

function getSessionEquipment(session: CoachSessionDto) {
  const normalizedTitle = session.title.toLowerCase();

  if (normalizedTitle.includes('match')) {
    return 'Balls, cones, tactical board, bibs';
  }

  if (normalizedTitle.includes('fundamentals')) {
    return 'Soft balls, cones, ladders';
  }

  return 'Balls, cones, bibs, mini goals';
}

function getSessionNotes(session: CoachSessionDto) {
  if (session.status === 'attendancePending') {
    return 'Attendance still needs to be marked for this session.';
  }

  if (session.status === 'inProgress') {
    return 'Session is currently active. Complete late attendance updates.';
  }

  if (session.status === 'completed') {
    return 'Session completed. Add progress notes for top performers.';
  }

  if (session.status === 'cancelled') {
    return 'Session has been cancelled. Check admin updates.';
  }

  return 'Prepare session setup and review assigned players before start time.';
}

function buildTodaySessions(
  sessions: CoachSessionDto[],
  players: CoachAssignedPlayerDto[],
  coachName: string,
): TodaySessionView[] {
  return sessions.map((session) => {
    const linkedPlayers = getPlayersForSession(session, players);
    const attendanceMarked = session.attendanceMarked;

    return {
      ...session,
      startTime: session.time,
      endTime: getSessionEndTime(session),
      location: session.court,
      coachName,
      linkedPlayers,
      present:
        session.status === 'completed' || session.status === 'inProgress'
          ? Math.max(attendanceMarked - 2, 0)
          : 0,
      absent:
        session.status === 'completed' || session.status === 'inProgress'
          ? attendanceMarked > 0
            ? 1
            : 0
          : 0,
      late:
        session.status === 'completed' || session.status === 'inProgress'
          ? attendanceMarked > 1
            ? 1
            : 0
          : 0,
      excused: 0,
      focus: getSessionFocus(session),
      equipment: getSessionEquipment(session),
      notes: getSessionNotes(session),
    };
  });
}

function getHourlyLabel(time: string) {
  return time.replace(':00 ', ' ');
}

export default function TodaySessionsPage() {
  const chartColors = useMemo(() => coachDataService.getChartColors(), []);
  const currentCoach = useMemo(() => coachDataService.getCurrentCoach(), []);
  const assignedPlayers = useMemo(
    () => coachDataService.getAssignedPlayers(),
    [],
  );
  const coachSessions = useMemo(() => coachDataService.getTodaySessions(), []);

  const todaySessions = useMemo(() => {
    return buildTodaySessions(coachSessions, assignedPlayers, currentCoach.name);
  }, [assignedPlayers, coachSessions, currentCoach.name]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CoachSessionStatus | 'all'>(
    'all',
  );
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [selectedSessionId, setSelectedSessionId] = useState(
    todaySessions[0]?.id ?? '',
  );

  const filteredSessions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return todaySessions.filter((session) => {
      const matchesSearch =
        !normalizedSearch ||
        session.title.toLowerCase().includes(normalizedSearch) ||
        session.program.toLowerCase().includes(normalizedSearch) ||
        session.branch.toLowerCase().includes(normalizedSearch) ||
        session.location.toLowerCase().includes(normalizedSearch) ||
        session.focus.toLowerCase().includes(normalizedSearch) ||
        session.notes.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || session.status === statusFilter;

      const matchesLevel =
        levelFilter === 'all' || session.level === levelFilter;

      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [levelFilter, searchTerm, statusFilter, todaySessions]);

  const selectedSession =
    todaySessions.find((session) => session.id === selectedSessionId) ??
    filteredSessions[0] ??
    todaySessions[0];

  const summary = useMemo(() => {
    const totalSessions = todaySessions.length;

    const completedCount = todaySessions.filter(
      (session) => session.status === 'completed',
    ).length;

    const inProgressCount = todaySessions.filter(
      (session) => session.status === 'inProgress',
    ).length;

    const pendingAttendanceCount = todaySessions.filter(
      (session) => session.status === 'attendancePending',
    ).length;

    const totalPlayers = assignedPlayers.length;

    const totalCapacity = todaySessions.reduce(
      (total, session) => total + session.capacity,
      0,
    );

    const attendanceMarked = todaySessions.reduce(
      (total, session) => total + session.attendanceMarked,
      0,
    );

    const assignedAcrossSessions = todaySessions.reduce(
      (total, session) => total + session.assignedPlayers,
      0,
    );

    const attendanceCompletion = assignedAcrossSessions
      ? Math.round((attendanceMarked / assignedAcrossSessions) * 100)
      : 0;

    const capacityUsage = totalCapacity
      ? Math.round((assignedAcrossSessions / totalCapacity) * 100)
      : 0;

    return {
      totalSessions,
      completedCount,
      inProgressCount,
      pendingAttendanceCount,
      totalPlayers,
      attendanceCompletion,
      capacityUsage,
    };
  }, [assignedPlayers.length, todaySessions]);

  const statusBreakdown = useMemo(() => {
    return [
      {
        name: 'Scheduled',
        value: todaySessions.filter((session) => session.status === 'scheduled')
          .length,
        color: chartColors.slate,
      },
      {
        name: 'In Progress',
        value: todaySessions.filter((session) => session.status === 'inProgress')
          .length,
        color: chartColors.blue,
      },
      {
        name: 'Completed',
        value: todaySessions.filter((session) => session.status === 'completed')
          .length,
        color: chartColors.green,
      },
      {
        name: 'Attendance Pending',
        value: todaySessions.filter(
          (session) => session.status === 'attendancePending',
        ).length,
        color: chartColors.orange,
      },
      {
        name: 'Cancelled',
        value: todaySessions.filter((session) => session.status === 'cancelled')
          .length,
        color: chartColors.red,
      },
    ].filter((item) => item.value > 0);
  }, [chartColors, todaySessions]);

  const hourlyLoadData = useMemo(() => {
    return todaySessions.map((session) => ({
      time: getHourlyLabel(session.startTime),
      sessions: 1,
      players: session.assignedPlayers,
    }));
  }, [todaySessions]);

  const capacityData = useMemo(() => {
    return todaySessions.map((session) => ({
      name: getHourlyLabel(session.startTime),
      assigned: session.assignedPlayers,
      remaining: Math.max(session.capacity - session.assignedPlayers, 0),
    }));
  }, [todaySessions]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setLevelFilter('all');
  };

  if (!selectedSession) {
    return (
      <main className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black">No assigned sessions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No sessions are currently assigned to this coach account.
        </p>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <CalendarCheck className="h-4 w-4" />
              Today&apos;s Coaching Schedule
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Today Sessions
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Review sessions assigned to your coach account only, track
              attendance status, session capacity, timing, focus areas, and next
              coaching actions.
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
                Full Schedule
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={CalendarCheck}
              label="Sessions Today"
              value={`${summary.totalSessions}`}
              caption="Assigned to your coach account"
              positive
            />

            <HeroMetricCard
              icon={Users}
              label="Players"
              value={`${summary.totalPlayers}`}
              caption="Unique assigned players"
              positive
            />

            <HeroMetricCard
              icon={ClipboardCheck}
              label="Attendance"
              value={`${summary.attendanceCompletion}%`}
              caption="Attendance completion today"
              positive={summary.attendanceCompletion >= 80}
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Pending"
              value={`${summary.pendingAttendanceCount}`}
              caption="Sessions need attendance action"
              positive={summary.pendingAttendanceCount === 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={CalendarCheck}
          title="Total Sessions"
          value={`${summary.totalSessions}`}
          description="All sessions assigned to you today."
          tone="blue"
        />

        <KpiCard
          icon={Clock3}
          title="In Progress"
          value={`${summary.inProgressCount}`}
          description="Sessions currently active."
          tone="brand"
        />

        <KpiCard
          icon={CheckCircle2}
          title="Completed"
          value={`${summary.completedCount}`}
          description="Sessions completed today."
          tone="success"
        />

        <KpiCard
          icon={Target}
          title="Capacity Usage"
          value={`${summary.capacityUsage}%`}
          description="Assigned players versus total capacity."
          tone={summary.capacityUsage >= 90 ? 'warning' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Session Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter today&apos;s sessions by title, program,
                  branch, level, status, location, focus, or notes.
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

            <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(2,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Search</span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search session, program, location, focus..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Scheduled', value: 'scheduled' },
                  { label: 'In Progress', value: 'inProgress' },
                  { label: 'Completed', value: 'completed' },
                  { label: 'Attendance Pending', value: 'attendancePending' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as CoachSessionStatus | 'all')
                }
              />

              <FilterSelect
                label="Level"
                value={levelFilter}
                options={[
                  { label: 'All levels', value: 'all' },
                  { label: 'Beginner', value: 'Beginner' },
                  { label: 'Intermediate', value: 'Intermediate' },
                  { label: 'Advanced', value: 'Advanced' },
                ]}
                onChange={(value) => setLevelFilter(value as LevelFilter)}
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                active={selectedSession.id === session.id}
                onSelect={() => setSelectedSessionId(session.id)}
              />
            ))}

            {filteredSessions.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Hourly Coaching Load"
              description="Number of sessions and assigned players by session time."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyLoadData}>
                    <defs>
                      <linearGradient
                        id="todaySessionsGradient"
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
                    <XAxis dataKey="time" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="players"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#todaySessionsGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="sessions"
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
              title="Session Status"
              description="Distribution of today&apos;s sessions by current status."
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
                      total={todaySessions.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <ChartCard
            icon={Target}
            title="Session Capacity"
            description="Assigned players and remaining capacity for each session."
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
        </div>

        <aside className="space-y-6">
          <SelectedSessionPanel session={selectedSession} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Attendance Attention</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sessions that may require attendance action.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {todaySessions
                .filter(
                  (session) =>
                    session.status === 'attendancePending' ||
                    session.status === 'inProgress',
                )
                .map((session) => (
                  <AttentionRow key={session.id} session={session} />
                ))}

              {todaySessions.filter(
                (session) =>
                  session.status === 'attendancePending' ||
                  session.status === 'inProgress',
              ).length === 0 ? (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-bold text-green-700 dark:text-green-300">
                  No attendance action is currently required.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful actions for today&apos;s coaching work.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={ClipboardCheck}
                title="Take Attendance"
                description="Mark attendance for selected session."
                href={`/coach/attendance?sessionId=${selectedSession.id}`}
              />

              <QuickAction
                icon={Users}
                title="Assigned Players"
                description="Review players linked to your sessions."
                href="/coach/players"
              />

              <QuickAction
                icon={MessageSquare}
                title="Messages"
                description="Contact admin or assigned parents."
                href="/coach/messages"
              />

              <QuickAction
                icon={CalendarDays}
                title="Full Schedule"
                description="Open your weekly coaching schedule."
                href="/coach/schedule"
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

function SessionCard({
  session,
  active,
  onSelect,
}: {
  session: TodaySessionView;
  active: boolean;
  onSelect: () => void;
}) {
  const attendancePercentage = session.assignedPlayers
    ? Math.round((session.attendanceMarked / session.assignedPlayers) * 100)
    : 0;

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
          <Dumbbell className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black">{session.title}</h3>

              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {session.program} · {getLevelLabel(session.level)}
              </p>

              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {session.startTime} - {session.endTime} · {session.duration}
              </p>
            </div>

            <SessionStatusBadge status={session.status} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniInfo icon={MapPin} label="Branch" value={session.branch} />
        <MiniInfo icon={Target} label="Location" value={session.location} />
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

      <p className="mt-4 text-sm font-semibold leading-6 text-muted-foreground">
        {session.focus}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/coach/sessions/${session.id}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-black transition hover:bg-secondary"
        >
          <Eye className="h-4 w-4" />
          Details
        </Link>

        <Link
          to={`/coach/attendance?sessionId=${session.id}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
        >
          <ClipboardCheck className="h-4 w-4" />
          Attendance
        </Link>
      </div>
    </article>
  );
}

function SelectedSessionPanel({ session }: { session: TodaySessionView }) {
  const attendancePercentage = session.assignedPlayers
    ? Math.round((session.attendanceMarked / session.assignedPlayers) * 100)
    : 0;

  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Trophy className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Session
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {session.title}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {session.program} · {getLevelLabel(session.level)} · {session.location}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SessionStatusBadge status={session.status} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {session.assignedPlayers} players
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={CalendarDays}
          label="Time"
          value={`${session.startTime} - ${session.endTime}`}
        />
        <DetailLine icon={Clock3} label="Duration" value={session.duration} />
        <DetailLine icon={MapPin} label="Branch" value={session.branch} />
        <DetailLine icon={Target} label="Location" value={session.location} />
        <DetailLine icon={UserRound} label="Coach" value={session.coachName} />
        <DetailLine
          icon={Users}
          label="Capacity"
          value={`${session.assignedPlayers}/${session.capacity}`}
        />
        <DetailLine
          icon={ClipboardCheck}
          label="Attendance"
          value={`${attendancePercentage}% marked · Present ${session.present}, Absent ${session.absent}, Late ${session.late}, Excused ${session.excused}`}
        />
        <DetailLine icon={Zap} label="Focus" value={session.focus} />
        <DetailLine icon={ShieldCheck} label="Equipment" value={session.equipment} />
        <DetailLine icon={MessageSquare} label="Notes" value={session.notes} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/coach/attendance?sessionId=${session.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <ClipboardCheck className="h-4 w-4" />
            Attendance
          </Link>

          <Link
            to={`/coach/sessions/${session.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <Eye className="h-4 w-4" />
            Details
          </Link>
        </div>
      </div>
    </aside>
  );
}

function AttentionRow({ session }: { session: TodaySessionView }) {
  return (
    <article className="rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue dark:text-brand-yellow">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-black">{session.title}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {getStatusLabel(session.status)} · {session.startTime} ·{' '}
            {session.notes}
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
        {percentage}% of sessions
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
        <CalendarCheck className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No sessions found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, session status, or level filter.
      </p>
    </div>
  );
}