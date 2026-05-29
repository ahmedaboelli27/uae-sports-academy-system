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
  Filter,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  Sparkles,
  Target,
  Users,
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

type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
type LevelFilter = 'all' | 'Beginner' | 'Intermediate' | 'Advanced';

interface CoachScheduleSessionView extends CoachSessionDto {
  day: WeekDay;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  assignedStudents: number;
  attendanceCompletion: number;
  focus: string;
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

function getScheduleMeta(session: CoachSessionDto): {
  day: WeekDay;
  date: string;
} {
  const meta: Record<string, { day: WeekDay; date: string }> = {
    'session-001': { day: 'Mon', date: '2026-06-01' },
    'session-002': { day: 'Tue', date: '2026-06-02' },
    'session-003': { day: 'Wed', date: '2026-06-03' },
    'session-004': { day: 'Thu', date: '2026-06-04' },
    'session-005': { day: 'Fri', date: '2026-06-05' },
  };

  return meta[session.id] ?? { day: 'Sat', date: '2026-06-06' };
}

function getSessionEndTime(session: CoachSessionDto) {
  if (session.id === 'session-001') return '05:30 PM';
  if (session.id === 'session-002') return '07:30 PM';
  if (session.id === 'session-003') return '08:30 PM';
  if (session.id === 'session-004') return '06:30 PM';
  if (session.id === 'session-005') return '08:00 PM';

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
    return 'Short passing, receiving angles, and ball circulation.';
  }

  if (normalizedTitle.includes('defensive')) {
    return 'Compact defending, recovery runs, and transition shape.';
  }

  return 'Coach-led development activities for the selected training group.';
}

function buildScheduleSessions(
  sessions: CoachSessionDto[],
  players: CoachAssignedPlayerDto[],
): CoachScheduleSessionView[] {
  return sessions.map((session) => {
    const linkedPlayers = getPlayersForSession(session, players);
    const meta = getScheduleMeta(session);

    const attendanceCompletion = session.assignedPlayers
      ? Math.round((session.attendanceMarked / session.assignedPlayers) * 100)
      : 0;

    return {
      ...session,
      day: meta.day,
      date: meta.date,
      startTime: session.time,
      endTime: getSessionEndTime(session),
      location: session.court,
      assignedStudents: session.assignedPlayers,
      attendanceCompletion,
      focus: getSessionFocus(session),
      linkedPlayers,
    };
  });
}

function mergeSessions(
  todaySessions: CoachSessionDto[],
  upcomingSessions: CoachSessionDto[],
) {
  return Array.from(
    new Map(
      [...todaySessions, ...upcomingSessions].map((session) => [
        session.id,
        session,
      ]),
    ).values(),
  );
}

export default function CoachSchedulePage() {
  const chartColors = useMemo(() => coachDataService.getChartColors(), []);
  const currentCoach = useMemo(() => coachDataService.getCurrentCoach(), []);
  const assignedPlayers = useMemo(
    () => coachDataService.getAssignedPlayers(),
    [],
  );
  const todaySessions = useMemo(() => coachDataService.getTodaySessions(), []);
  const upcomingSessions = useMemo(
    () => coachDataService.getUpcomingSessions(),
    [],
  );

  const coachSessions = useMemo(() => {
    return buildScheduleSessions(
      mergeSessions(todaySessions, upcomingSessions),
      assignedPlayers,
    );
  }, [assignedPlayers, todaySessions, upcomingSessions]);

  const [searchTerm, setSearchTerm] = useState('');
  const [dayFilter, setDayFilter] = useState<WeekDay | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<
    CoachSessionStatus | 'all'
  >('all');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [selectedSessionId, setSelectedSessionId] = useState(
    coachSessions[0]?.id ?? '',
  );

  const filteredSessions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return coachSessions.filter((session) => {
      const matchesSearch =
        !normalizedSearch ||
        session.title.toLowerCase().includes(normalizedSearch) ||
        session.program.toLowerCase().includes(normalizedSearch) ||
        session.branch.toLowerCase().includes(normalizedSearch) ||
        session.location.toLowerCase().includes(normalizedSearch) ||
        session.focus.toLowerCase().includes(normalizedSearch) ||
        session.level.toLowerCase().includes(normalizedSearch);

      const matchesDay = dayFilter === 'all' || session.day === dayFilter;

      const matchesStatus =
        statusFilter === 'all' || session.status === statusFilter;

      const matchesLevel =
        levelFilter === 'all' || session.level === levelFilter;

      return matchesSearch && matchesDay && matchesStatus && matchesLevel;
    });
  }, [coachSessions, dayFilter, levelFilter, searchTerm, statusFilter]);

  const selectedSession =
    coachSessions.find((session) => session.id === selectedSessionId) ??
    filteredSessions[0] ??
    coachSessions[0];

  const summary = useMemo(() => {
    const totalSessions = coachSessions.length;
    const todaySessionCount = todaySessions.length;

    const pendingAttendance = coachSessions.filter(
      (session) =>
        session.status === 'attendancePending' ||
        (session.status === 'inProgress' &&
          session.attendanceCompletion < 100),
    ).length;

    const assignedStudents = coachSessions.reduce(
      (total, session) => total + session.assignedStudents,
      0,
    );

    const totalCapacity = coachSessions.reduce(
      (total, session) => total + session.capacity,
      0,
    );

    const capacityUsage = totalCapacity
      ? Math.round((assignedStudents / totalCapacity) * 100)
      : 0;

    const averageAttendanceCompletion = totalSessions
      ? Math.round(
        coachSessions.reduce(
          (total, session) => total + session.attendanceCompletion,
          0,
        ) / totalSessions,
      )
      : 0;

    return {
      totalSessions,
      todaySessionCount,
      pendingAttendance,
      assignedStudents,
      uniqueStudents: assignedPlayers.length,
      capacityUsage,
      averageAttendanceCompletion,
    };
  }, [assignedPlayers.length, coachSessions, todaySessions.length]);

  const sessionsByDay = useMemo(() => {
    const days: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return days.map((day) => {
      const daySessions = coachSessions.filter((session) => session.day === day);

      return {
        day,
        sessions: daySessions.length,
        students: daySessions.reduce(
          (total, session) => total + session.assignedStudents,
          0,
        ),
      };
    });
  }, [coachSessions]);

  const capacityData = useMemo(() => {
    return coachSessions.map((session) => ({
      name: `${session.day} ${session.startTime}`,
      assigned: session.assignedStudents,
      remaining: Math.max(session.capacity - session.assignedStudents, 0),
    }));
  }, [coachSessions]);

  const statusBreakdown = useMemo(() => {
    return [
      {
        name: 'Scheduled',
        value: coachSessions.filter((session) => session.status === 'scheduled')
          .length,
        color: chartColors.slate,
      },
      {
        name: 'In Progress',
        value: coachSessions.filter((session) => session.status === 'inProgress')
          .length,
        color: chartColors.blue,
      },
      {
        name: 'Completed',
        value: coachSessions.filter((session) => session.status === 'completed')
          .length,
        color: chartColors.green,
      },
      {
        name: 'Attendance Pending',
        value: coachSessions.filter(
          (session) => session.status === 'attendancePending',
        ).length,
        color: chartColors.orange,
      },
      {
        name: 'Cancelled',
        value: coachSessions.filter((session) => session.status === 'cancelled')
          .length,
        color: chartColors.red,
      },
    ].filter((item) => item.value > 0);
  }, [chartColors, coachSessions]);

  const resetFilters = () => {
    setSearchTerm('');
    setDayFilter('all');
    setStatusFilter('all');
    setLevelFilter('all');
  };

  if (!selectedSession) {
    return (
      <main className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black">No assigned schedule</h1>
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
              <CalendarDays className="h-4 w-4" />
              Coach Weekly Schedule
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Coach Schedule
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              View your assigned sessions only, track weekly workload,
              attendance completion, student capacity, session locations, and
              quick coaching actions for {currentCoach.name}.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/coach/sessions"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <CalendarCheck className="h-4 w-4" />
                Today Sessions
              </Link>

              <Link
                to="/coach/attendance"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <ClipboardCheck className="h-4 w-4" />
                Take Attendance
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={CalendarDays}
              label="This Week"
              value={`${summary.totalSessions}`}
              caption="Sessions assigned to you"
              positive
            />

            <HeroMetricCard
              icon={CalendarCheck}
              label="Today"
              value={`${summary.todaySessionCount}`}
              caption="Today sessions from coach scope"
              positive
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Pending"
              value={`${summary.pendingAttendance}`}
              caption="Attendance needs attention"
              positive={summary.pendingAttendance === 0}
            />

            <HeroMetricCard
              icon={Users}
              label="Students"
              value={`${summary.uniqueStudents}`}
              caption="Unique assigned students"
              positive
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={CalendarDays}
          title="Sessions This Week"
          value={`${summary.totalSessions}`}
          description="Only sessions assigned to this coach."
          tone="blue"
        />

        <KpiCard
          icon={ClipboardCheck}
          title="Attendance Completion"
          value={`${summary.averageAttendanceCompletion}%`}
          description="Average attendance completion across sessions."
          tone={summary.averageAttendanceCompletion >= 80 ? 'success' : 'warning'}
        />

        <KpiCard
          icon={Target}
          title="Capacity Usage"
          value={`${summary.capacityUsage}%`}
          description="Assigned students versus available capacity."
          tone={summary.capacityUsage >= 90 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={AlertTriangle}
          title="Pending Attendance"
          value={`${summary.pendingAttendance}`}
          description="Sessions needing attendance follow-up."
          tone={summary.pendingAttendance > 0 ? 'warning' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Schedule Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter your schedule by session, branch, pitch,
                  focus, day, level, or status.
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
                    placeholder="Search session, location, program, focus..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Day"
                value={dayFilter}
                options={[
                  { label: 'All days', value: 'all' },
                  { label: 'Monday', value: 'Mon' },
                  { label: 'Tuesday', value: 'Tue' },
                  { label: 'Wednesday', value: 'Wed' },
                  { label: 'Thursday', value: 'Thu' },
                  { label: 'Friday', value: 'Fri' },
                  { label: 'Saturday', value: 'Sat' },
                  { label: 'Sunday', value: 'Sun' },
                ]}
                onChange={(value) => setDayFilter(value as WeekDay | 'all')}
              />

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

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="flex items-center gap-2 text-xl font-black">
                <CalendarDays className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                Weekly Schedule
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                A day-by-day view of your coach-scoped sessions.
              </p>
            </div>

            <div className="grid gap-4">
              {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as WeekDay[]).map(
                (day) => {
                  const daySessions = filteredSessions.filter(
                    (session) => session.day === day,
                  );

                  return (
                    <DayScheduleGroup
                      key={day}
                      day={day}
                      sessions={daySessions}
                      selectedSessionId={selectedSession.id}
                      onSelect={setSelectedSessionId}
                    />
                  );
                },
              )}
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
              title="Sessions by Day"
              description="Weekly session count and assigned students by day."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sessionsByDay}>
                    <defs>
                      <linearGradient
                        id="scheduleDayGradient"
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
                      dataKey="students"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#scheduleDayGradient)"
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
              description="Current distribution of your weekly sessions."
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
                      total={coachSessions.length}
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
            description="Assigned students versus remaining capacity per session."
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
                  Sessions that need attendance follow-up.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {coachSessions
                .filter(
                  (session) =>
                    session.status === 'attendancePending' ||
                    (session.status === 'inProgress' &&
                      session.attendanceCompletion < 100),
                )
                .map((session) => (
                  <AttentionRow key={session.id} session={session} />
                ))}

              {summary.pendingAttendance === 0 ? (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-bold text-green-700 dark:text-green-300">
                  No attendance follow-up is currently required.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful schedule shortcuts.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={Eye}
                title="Session Details"
                description="Open selected session details."
                href={`/coach/sessions/${selectedSession.id}`}
              />

              <QuickAction
                icon={ClipboardCheck}
                title="Take Attendance"
                description="Mark attendance for selected session."
                href={`/coach/attendance?sessionId=${selectedSession.id}`}
              />

              <QuickAction
                icon={Users}
                title="Assigned Students"
                description="Review your assigned students."
                href="/coach/players"
              />

              <QuickAction
                icon={FileText}
                title="Progress Notes"
                description="Add session-related progress notes."
                href={`/coach/progress-notes?sessionId=${selectedSession.id}`}
              />

              <QuickAction
                icon={MessageSquare}
                title="Messages"
                description="Contact admin or assigned parents."
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

function DayScheduleGroup({
  day,
  sessions,
  selectedSessionId,
  onSelect,
}: {
  day: WeekDay;
  sessions: CoachScheduleSessionView[];
  selectedSessionId: string;
  onSelect: (sessionId: string) => void;
}) {
  return (
    <section className="rounded-[1.5rem] border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <CalendarDays className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-base font-black">{day}</h3>
            <p className="text-xs font-bold text-muted-foreground">
              {sessions.length} session(s)
            </p>
          </div>
        </div>
      </div>

      {sessions.length > 0 ? (
        <div className="grid gap-3">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelect(session.id)}
              className={[
                'rounded-2xl border p-4 text-start transition hover:border-brand-yellow hover:bg-brand-yellow/10',
                selectedSessionId === session.id
                  ? 'border-brand-yellow bg-brand-yellow/10'
                  : 'border-border bg-card',
              ].join(' ')}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black">{session.title}</p>
                  <p className="mt-1 text-xs font-bold text-muted-foreground">
                    {session.startTime} - {session.endTime} · {session.location}
                  </p>
                </div>

                <SessionStatusBadge status={session.status} />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-border p-4 text-sm font-semibold text-muted-foreground">
          No assigned sessions for this day.
        </p>
      )}
    </section>
  );
}

function SessionCard({
  session,
  active,
  onSelect,
}: {
  session: CoachScheduleSessionView;
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
                {session.day} · {session.startTime} - {session.endTime}
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
          label="Students"
          value={`${session.assignedStudents}/${session.capacity}`}
        />
        <MiniInfo
          icon={ClipboardCheck}
          label="Attendance"
          value={`${session.attendanceCompletion}%`}
        />
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-muted-foreground">
        {session.focus}
      </p>

      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between text-xs font-black">
          <span>Attendance Completion</span>
          <span>{session.attendanceCompletion}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-brand-yellow"
            style={{ width: `${session.attendanceCompletion}%` }}
          />
        </div>
      </div>

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

function SelectedSessionPanel({
  session,
}: {
  session: CoachScheduleSessionView;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <CalendarCheck className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Session
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {session.title}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {session.program} · {getLevelLabel(session.level)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SessionStatusBadge status={session.status} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {session.assignedStudents}/{session.capacity} students
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={CalendarDays} label="Day" value={session.day} />
        <DetailLine icon={CalendarCheck} label="Date" value={session.date} />
        <DetailLine
          icon={Clock3}
          label="Time"
          value={`${session.startTime} - ${session.endTime}`}
        />
        <DetailLine icon={Clock3} label="Duration" value={session.duration} />
        <DetailLine icon={MapPin} label="Branch" value={session.branch} />
        <DetailLine icon={Target} label="Location" value={session.location} />
        <DetailLine
          icon={Users}
          label="Capacity"
          value={`${session.assignedStudents}/${session.capacity}`}
        />
        <DetailLine
          icon={ClipboardCheck}
          label="Attendance"
          value={`${session.attendanceCompletion}% complete`}
        />
        <DetailLine icon={FileText} label="Focus" value={session.focus} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/coach/sessions/${session.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <Eye className="h-4 w-4" />
            Details
          </Link>

          <Link
            to={`/coach/attendance?sessionId=${session.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <ClipboardCheck className="h-4 w-4" />
            Attendance
          </Link>
        </div>
      </div>
    </aside>
  );
}

function AttentionRow({ session }: { session: CoachScheduleSessionView }) {
  return (
    <Link
      to={`/coach/attendance?sessionId=${session.id}`}
      className="block rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue transition hover:-translate-y-0.5 hover:bg-brand-yellow/20 dark:text-brand-yellow"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-black">{session.title}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {getStatusLabel(session.status)} · {session.attendanceCompletion}%
            attendance completion.
          </p>
        </div>
      </div>
    </Link>
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
        <CalendarDays className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No schedule sessions found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, day, status, or level filter.
      </p>
    </div>
  );
}