import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Dumbbell,
  Eye,
  FileText,
  MapPin,
  MessageSquare,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Users,
  XCircle,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
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

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'notMarked';

interface AttendanceRecord {
  status: AttendanceStatus;
  note: string;
}

interface AttendanceSessionView extends CoachSessionDto {
  players: CoachAssignedPlayerDto[];
  location: string;
  focus: string;
}

function getStatusLabel(status: AttendanceStatus) {
  const labels: Record<AttendanceStatus, string> = {
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    excused: 'Excused',
    notMarked: 'Not Marked',
  };

  return labels[status];
}

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

function getSessionFocus(session: CoachSessionDto) {
  const normalizedTitle = session.title.toLowerCase();

  if (normalizedTitle.includes('technical')) {
    return 'Passing accuracy, first touch control, and short possession drills.';
  }

  if (normalizedTitle.includes('match')) {
    return 'Tactical positioning, defensive shape, and transition play.';
  }

  if (normalizedTitle.includes('fundamentals')) {
    return 'Basic ball control, balance, coordination, and confidence.';
  }

  return 'Coach-led development activities for the selected training group.';
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

function buildAttendanceSessions(
  sessions: CoachSessionDto[],
  players: CoachAssignedPlayerDto[],
): AttendanceSessionView[] {
  return sessions.map((session) => ({
    ...session,
    location: session.court,
    focus: getSessionFocus(session),
    players: getPlayersForSession(session, players),
  }));
}

function getDefaultAttendanceStatus(
  session: AttendanceSessionView,
  player: CoachAssignedPlayerDto,
): AttendanceStatus {
  if (session.status === 'completed') return 'present';

  if (session.status === 'inProgress') {
    if (player.attendanceRate >= 85) return 'present';
    if (player.attendanceRate < 78) return 'late';

    return 'notMarked';
  }

  return 'notMarked';
}

function getDefaultAttendanceNote(
  session: AttendanceSessionView,
  player: CoachAssignedPlayerDto,
) {
  const defaultStatus = getDefaultAttendanceStatus(session, player);

  if (defaultStatus === 'present') {
    return 'Joined the session and participated in coach-visible activities.';
  }

  if (defaultStatus === 'late') {
    return 'Arrived late. Coach should confirm arrival time before saving.';
  }

  return '';
}

function createInitialRecords(sessions: AttendanceSessionView[]) {
  return sessions.reduce<Record<string, AttendanceRecord>>((records, session) => {
    session.players.forEach((player) => {
      records[`${session.id}:${player.id}`] = {
        status: getDefaultAttendanceStatus(session, player),
        note: getDefaultAttendanceNote(session, player),
      };
    });

    return records;
  }, {});
}

function getRecordKey(sessionId: string, playerId: string) {
  return `${sessionId}:${playerId}`;
}

export default function AttendancePage() {
  const [searchParams] = useSearchParams();
  const sessionIdFromUrl = searchParams.get('sessionId');
  const playerIdFromUrl = searchParams.get('playerId');

  const chartColors = useMemo(() => coachDataService.getChartColors(), []);
  const coach = useMemo(() => coachDataService.getCurrentCoach(), []);
  const coachSessions = useMemo(() => coachDataService.getTodaySessions(), []);
  const assignedPlayers = useMemo(() => coachDataService.getAssignedPlayers(), []);

  const sessions = useMemo(() => {
    return buildAttendanceSessions(coachSessions, assignedPlayers);
  }, [assignedPlayers, coachSessions]);

  const initialSessionId = useMemo(() => {
    if (sessionIdFromUrl && sessions.some((session) => session.id === sessionIdFromUrl)) {
      return sessionIdFromUrl;
    }

    if (playerIdFromUrl) {
      const playerSession = sessions.find((session) =>
        session.players.some((player) => player.id === playerIdFromUrl),
      );

      if (playerSession) return playerSession.id;
    }

    return sessions[0]?.id ?? '';
  }, [playerIdFromUrl, sessionIdFromUrl, sessions]);

  const [selectedSessionId, setSelectedSessionId] = useState(initialSessionId);
  const [searchTerm, setSearchTerm] = useState(playerIdFromUrl ?? '');
  const [records, setRecords] = useState<Record<string, AttendanceRecord>>(() =>
    createInitialRecords(sessions),
  );
  const [savedMessage, setSavedMessage] = useState('');

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ?? sessions[0];

  const filteredPlayers = useMemo(() => {
    if (!selectedSession) return [];

    const normalizedSearch = searchTerm.trim().toLowerCase();

    return selectedSession.players.filter((player) => {
      if (!normalizedSearch) return true;

      return (
        player.id.toLowerCase().includes(normalizedSearch) ||
        player.name.toLowerCase().includes(normalizedSearch) ||
        player.parentName.toLowerCase().includes(normalizedSearch) ||
        player.level.toLowerCase().includes(normalizedSearch) ||
        player.group.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchTerm, selectedSession]);

  const summary = useMemo(() => {
    if (!selectedSession) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        notMarked: 0,
        marked: 0,
        completion: 0,
        capacityUsage: 0,
      };
    }

    const players = selectedSession.players;

    const countByStatus = (status: AttendanceStatus) =>
      players.filter((player) => {
        const recordKey = getRecordKey(selectedSession.id, player.id);

        return records[recordKey]?.status === status;
      }).length;

    const present = countByStatus('present');
    const absent = countByStatus('absent');
    const late = countByStatus('late');
    const excused = countByStatus('excused');
    const notMarked = countByStatus('notMarked');

    const total = players.length;
    const marked = total - notMarked;
    const completion = total ? Math.round((marked / total) * 100) : 0;
    const capacityUsage = selectedSession.capacity
      ? Math.round((total / selectedSession.capacity) * 100)
      : 0;

    return {
      total,
      present,
      absent,
      late,
      excused,
      notMarked,
      marked,
      completion,
      capacityUsage,
    };
  }, [records, selectedSession]);

  const attendanceBreakdown = useMemo(() => {
    return [
      { name: 'Present', value: summary.present, color: chartColors.green },
      { name: 'Absent', value: summary.absent, color: chartColors.red },
      { name: 'Late', value: summary.late, color: chartColors.orange },
      { name: 'Excused', value: summary.excused, color: chartColors.blue },
      { name: 'Not Marked', value: summary.notMarked, color: chartColors.slate },
    ].filter((item) => item.value > 0);
  }, [
    chartColors,
    summary.absent,
    summary.excused,
    summary.late,
    summary.notMarked,
    summary.present,
  ]);

  const playerPerformanceData = useMemo(() => {
    if (!selectedSession) return [];

    return selectedSession.players.map((player) => ({
      name: player.name.split(' ')[0],
      attendance: player.attendanceRate,
      progress: player.progressScore,
      skill: player.skillScore,
    }));
  }, [selectedSession]);

  const updatePlayerStatus = (playerId: string, status: AttendanceStatus) => {
    if (!selectedSession) return;

    const recordKey = getRecordKey(selectedSession.id, playerId);

    setRecords((current) => ({
      ...current,
      [recordKey]: {
        status,
        note: current[recordKey]?.note ?? '',
      },
    }));

    setSavedMessage('');
  };

  const updatePlayerNote = (playerId: string, note: string) => {
    if (!selectedSession) return;

    const recordKey = getRecordKey(selectedSession.id, playerId);

    setRecords((current) => ({
      ...current,
      [recordKey]: {
        status: current[recordKey]?.status ?? 'notMarked',
        note,
      },
    }));

    setSavedMessage('');
  };

  const markAllPresent = () => {
    if (!selectedSession) return;

    setRecords((current) => {
      const updated = { ...current };

      selectedSession.players.forEach((player) => {
        const recordKey = getRecordKey(selectedSession.id, player.id);

        updated[recordKey] = {
          status: 'present',
          note: updated[recordKey]?.note ?? '',
        };
      });

      return updated;
    });

    setSavedMessage('');
  };

  const resetSessionAttendance = () => {
    if (!selectedSession) return;

    setRecords((current) => {
      const updated = { ...current };

      selectedSession.players.forEach((player) => {
        const recordKey = getRecordKey(selectedSession.id, player.id);

        updated[recordKey] = {
          status: getDefaultAttendanceStatus(selectedSession, player),
          note: getDefaultAttendanceNote(selectedSession, player),
        };
      });

      return updated;
    });

    setSavedMessage('');
  };

  const saveAttendance = () => {
    setSavedMessage(
      'Attendance saved locally. Backend attendance endpoint will be connected later.',
    );
  };

  if (!selectedSession) {
    return (
      <main className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black">No assigned sessions</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No attendance sessions are currently assigned to this coach account.
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
              <ClipboardCheck className="h-4 w-4" />
              Coach Attendance
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Attendance
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Mark and review session attendance for players assigned to your
              coach scope only. Update each player as present, absent, late, or
              excused, add notes, and save attendance when complete.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveAttendance}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Attendance
              </button>

              <Link
                to={`/coach/sessions/${selectedSession.id}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Eye className="h-4 w-4" />
                Session Details
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={Users}
              label="Players"
              value={`${summary.total}`}
              caption="Players in selected session"
              positive
            />

            <HeroMetricCard
              icon={ClipboardCheck}
              label="Completion"
              value={`${summary.completion}%`}
              caption={`${summary.notMarked} still not marked`}
              positive={summary.notMarked === 0}
            />

            <HeroMetricCard
              icon={CheckCircle2}
              label="Present"
              value={`${summary.present}`}
              caption="Players marked present"
              positive
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Needs Action"
              value={`${summary.notMarked}`}
              caption="Attendance records pending"
              positive={summary.notMarked === 0}
            />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard
          icon={CheckCircle2}
          title="Present"
          value={`${summary.present}`}
          description="Players attended the session."
          tone="success"
        />

        <KpiCard
          icon={XCircle}
          title="Absent"
          value={`${summary.absent}`}
          description="Players absent from session."
          tone={summary.absent > 0 ? 'danger' : 'success'}
        />

        <KpiCard
          icon={Clock3}
          title="Late"
          value={`${summary.late}`}
          description="Players arrived late."
          tone={summary.late > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={ShieldCheck}
          title="Excused"
          value={`${summary.excused}`}
          description="Absence or delay was excused."
          tone="blue"
        />

        <KpiCard
          icon={AlertTriangle}
          title="Not Marked"
          value={`${summary.notMarked}`}
          description="Attendance still needs update."
          tone={summary.notMarked > 0 ? 'warning' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <CalendarCheck className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Select Session
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Choose one of your assigned sessions and update attendance for
                  its linked players.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={markAllPresent}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-sm font-black text-brand-blue transition hover:bg-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark All Present
                </button>

                <button
                  type="button"
                  onClick={resetSessionAttendance}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1fr_1.25fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Session</span>

                <select
                  value={selectedSessionId}
                  onChange={(event) => {
                    setSelectedSessionId(event.target.value);
                    setSearchTerm('');
                    setSavedMessage('');
                  }}
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                >
                  {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                      {session.title} · {session.time}
                    </option>
                  ))}
                </select>
              </label>

              <div className="relative">
                <span className="mb-2 block text-sm font-black">
                  Search Players
                </span>

                <Search className="pointer-events-none absolute start-4 top-[2.65rem] h-5 w-5 text-muted-foreground" />

                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search player, parent, group, level, or player ID..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-4">
            {filteredPlayers.map((player) => {
              const recordKey = getRecordKey(selectedSession.id, player.id);
              const record = records[recordKey] ?? {
                status: 'notMarked',
                note: '',
              };

              return (
                <AttendancePlayerCard
                  key={player.id}
                  player={player}
                  record={record}
                  onStatusChange={(status) => updatePlayerStatus(player.id, status)}
                  onNoteChange={(note) => updatePlayerNote(player.id, note)}
                />
              );
            })}

            {filteredPlayers.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <ChartCard
              icon={BarChart3}
              title="Attendance Breakdown"
              description="Current attendance distribution for selected session."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
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
                      total={summary.total}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard
              icon={Target}
              title="Player Readiness"
              description="Attendance rate, progress score, and skill score for players in this session."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={playerPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Bar
                      dataKey="attendance"
                      fill={chartColors.blue}
                      radius={[10, 10, 0, 0]}
                    />

                    <Bar
                      dataKey="progress"
                      fill={chartColors.yellow}
                      radius={[10, 10, 0, 0]}
                    />

                    <Bar
                      dataKey="skill"
                      fill={chartColors.green}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>
        </div>

        <aside className="space-y-6">
          <SelectedSessionPanel
            session={selectedSession}
            coachName={coach.name}
            completion={summary.completion}
            notMarked={summary.notMarked}
            capacityUsage={summary.capacityUsage}
            onSave={saveAttendance}
          />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Attendance Attention</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Players who still need attendance status.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {selectedSession.players
                .filter((player) => {
                  const recordKey = getRecordKey(selectedSession.id, player.id);

                  return records[recordKey]?.status === 'notMarked';
                })
                .map((player) => (
                  <AttentionRow key={player.id} player={player} />
                ))}

              {summary.notMarked === 0 ? (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-bold text-green-700 dark:text-green-300">
                  All players have been marked for this session.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful attendance shortcuts.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={Eye}
                title="Session Details"
                description="Open full details for selected session."
                href={`/coach/sessions/${selectedSession.id}`}
              />

              <QuickAction
                icon={Users}
                title="Assigned Players"
                description="Review all assigned players."
                href="/coach/players"
              />

              <QuickAction
                icon={FileText}
                title="Progress Notes"
                description="Add player progress notes."
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

function AttendancePlayerCard({
  player,
  record,
  onStatusChange,
  onNoteChange,
}: {
  player: CoachAssignedPlayerDto;
  record: AttendanceRecord;
  onStatusChange: (status: AttendanceStatus) => void;
  onNoteChange: (note: string) => void;
}) {
  return (
    <article className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <UserRound className="h-7 w-7" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black">{player.name}</h3>
              <AttendanceBadge status={record.status} />
            </div>

            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Age {player.age} · {player.level}
            </p>

            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Parent: {player.parentName}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 xl:w-[25rem]">
          <MiniScore label="Attendance" value={`${player.attendanceRate}%`} />
          <MiniScore label="Progress" value={`${player.progressScore}%`} />
          <MiniScore label="Skill" value={`${player.skillScore}%`} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatusButton
          label="Present"
          active={record.status === 'present'}
          tone="success"
          onClick={() => onStatusChange('present')}
        />

        <StatusButton
          label="Absent"
          active={record.status === 'absent'}
          tone="danger"
          onClick={() => onStatusChange('absent')}
        />

        <StatusButton
          label="Late"
          active={record.status === 'late'}
          tone="warning"
          onClick={() => onStatusChange('late')}
        />

        <StatusButton
          label="Excused"
          active={record.status === 'excused'}
          tone="blue"
          onClick={() => onStatusChange('excused')}
        />

        <StatusButton
          label="Not Marked"
          active={record.status === 'notMarked'}
          tone="neutral"
          onClick={() => onStatusChange('notMarked')}
        />
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-black">Coach Note</span>

        <textarea
          value={record.note}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Add attendance note for this player..."
          rows={3}
          className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
        />
      </label>
    </article>
  );
}

function SelectedSessionPanel({
  session,
  coachName,
  completion,
  notMarked,
  capacityUsage,
  onSave,
}: {
  session: AttendanceSessionView;
  coachName: string;
  completion: number;
  notMarked: number;
  capacityUsage: number;
  onSave: () => void;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Dumbbell className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Session
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {session.title}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {session.program} · {session.level} · {session.location}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
            {getSessionStatusLabel(session.status)}
          </span>

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {session.players.length}/{session.capacity} players
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={CalendarCheck} label="Time" value={session.time} />
        <DetailLine icon={Clock3} label="Duration" value={session.duration} />
        <DetailLine icon={MapPin} label="Branch" value={session.branch} />
        <DetailLine icon={Target} label="Location" value={session.location} />
        <DetailLine icon={UserRound} label="Coach" value={coachName} />
        <DetailLine icon={Users} label="Capacity Usage" value={`${capacityUsage}%`} />
        <DetailLine
          icon={ClipboardCheck}
          label="Attendance Completion"
          value={`${completion}% complete · ${notMarked} not marked`}
        />
        <DetailLine icon={ShieldCheck} label="Focus" value={session.focus} />

        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
        >
          <Save className="h-4 w-4" />
          Save Attendance
        </button>
      </div>
    </aside>
  );
}

function AttentionRow({ player }: { player: CoachAssignedPlayerDto }) {
  return (
    <article className="rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue dark:text-brand-yellow">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-black">{player.name}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            Attendance status is still not marked for this player.
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

function MiniScore({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 text-center dark:bg-white/[0.04]">
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

function StatusButton({
  label,
  active,
  tone,
  onClick,
}: {
  label: string;
  active: boolean;
  tone: 'success' | 'danger' | 'warning' | 'blue' | 'neutral';
  onClick: () => void;
}) {
  const activeClasses = {
    success: 'border-green-500 bg-green-500 text-white',
    danger: 'border-red-500 bg-red-500 text-white',
    warning: 'border-yellow-500 bg-yellow-500 text-brand-blue',
    blue: 'border-blue-500 bg-blue-500 text-white',
    neutral: 'border-slate-500 bg-slate-500 text-white',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'h-11 rounded-full border px-4 text-xs font-black transition',
        active
          ? activeClasses[tone]
          : 'border-border bg-background hover:border-brand-yellow hover:bg-brand-yellow/10',
      ].join(' ')}
    >
      {label}
    </button>
  );
}

function AttendanceBadge({ status }: { status: AttendanceStatus }) {
  const className =
    status === 'present'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'absent'
        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
        : status === 'late'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
          : status === 'excused'
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

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <Users className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No players found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term or selecting another session.
      </p>
    </div>
  );
}