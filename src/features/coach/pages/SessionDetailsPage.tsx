import type { LucideIcon } from 'lucide-react';
import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    ArrowUpRight,
    BarChart3,
    CalendarCheck,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    Clock3,
    Dumbbell,
    Eye,
    FileText,
    MapPin,
    MessageSquare,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
    Trophy,
    UserRound,
    Users,
    Zap,
} from 'lucide-react';
import { useMemo, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
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
    CoachPlayerStatus,
    CoachSessionDto,
    CoachSessionStatus,
} from '@/features/coach/types/coach.dto';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'notMarked';
type PlayerRisk = 'normal' | 'followUp' | 'excellent';

interface SessionPlayerView {
    id: string;
    name: string;
    age: number;
    level: string;
    attendanceStatus: AttendanceStatus;
    attendanceRate: number;
    progressScore: number;
    skillScore: number;
    risk: PlayerRisk;
    parentName: string;
    latestCoachNote: string;
}

interface CoachSessionDetailsView extends CoachSessionDto {
    location: string;
    startTime: string;
    endTime: string;
    coachName: string;
    assistantCoach: string;
    focusAreas: string[];
    equipment: string[];
    safetyNotes: string[];
    coachNotes: string;
    players: SessionPlayerView[];
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

function getLevelLabel(level: string) {
    return level || 'Not specified';
}

function getAttendanceLabel(status: AttendanceStatus) {
    const labels: Record<AttendanceStatus, string> = {
        present: 'Present',
        absent: 'Absent',
        late: 'Late',
        excused: 'Excused',
        notMarked: 'Not Marked',
    };

    return labels[status];
}

function getRiskLabel(risk: PlayerRisk) {
    const labels: Record<PlayerRisk, string> = {
        normal: 'Normal',
        followUp: 'Follow-up',
        excellent: 'Excellent',
    };

    return labels[risk];
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

function getFocusAreas(session: CoachSessionDto) {
    const normalizedTitle = session.title.toLowerCase();

    if (normalizedTitle.includes('technical')) {
        return [
            'Passing accuracy',
            'First touch control',
            'Short possession drills',
            'Team communication',
        ];
    }

    if (normalizedTitle.includes('match')) {
        return [
            'Defensive shape',
            'Transition play',
            'Tactical positioning',
            'Match decision-making',
        ];
    }

    if (normalizedTitle.includes('fundamentals')) {
        return [
            'Basic ball control',
            'Balance',
            'Coordination',
            'Confidence with the ball',
        ];
    }

    return [
        'Technical development',
        'Decision-making',
        'Movement quality',
        'Coach-led feedback',
    ];
}

function getEquipment(session: CoachSessionDto) {
    const normalizedTitle = session.title.toLowerCase();

    if (normalizedTitle.includes('match')) {
        return ['Balls', 'Cones', 'Bibs', 'Tactical board'];
    }

    if (normalizedTitle.includes('fundamentals')) {
        return ['Soft balls', 'Cones', 'Ladders', 'Mini goals'];
    }

    return ['Balls', 'Cones', 'Bibs', 'Mini goals', 'Agility ladder'];
}

function getSafetyNotes(session: CoachSessionDto) {
    const normalizedTitle = session.title.toLowerCase();

    if (normalizedTitle.includes('match')) {
        return [
            'Monitor contact intensity during match simulation.',
            'Warm-up should include mobility and hamstring activation.',
            'Pause play immediately if any safety concern appears.',
        ];
    }

    if (normalizedTitle.includes('fundamentals')) {
        return [
            'Keep drills short and fun.',
            'Use soft balls for beginner control exercises.',
            'Give clear visual instructions before each activity.',
        ];
    }

    return [
        'Check hydration breaks every 20 minutes.',
        'Avoid intense sprinting during warm weather.',
        'Review footwear before warm-up.',
    ];
}

function getCoachNotes(session: CoachSessionDto) {
    const normalizedTitle = session.title.toLowerCase();

    if (normalizedTitle.includes('technical')) {
        return 'Focus on short passing rhythm and body positioning before receiving the ball. Players needing extra support should be grouped in small-sided drills.';
    }

    if (normalizedTitle.includes('match')) {
        return 'Use two short match blocks with feedback breaks. Focus on compact defensive shape and quick transition after ball recovery.';
    }

    if (normalizedTitle.includes('fundamentals')) {
        return 'Keep high energy and use simple instructions. Complete late attendance updates before closing the session.';
    }

    return 'Review assigned players, apply the session focus, and add progress notes after the session where needed.';
}

function getAssistantCoach(session: CoachSessionDto) {
    if (session.id === 'session-001') return 'Assistant Ahmed';
    if (session.id === 'session-002') return 'Assistant Yasser';
    if (session.id === 'session-003') return 'Assistant Kareem';

    return 'Assistant Coach';
}

function getPlayerRisk(status: CoachPlayerStatus): PlayerRisk {
    if (status === 'excellent') return 'excellent';
    if (status === 'needsFollowUp') return 'followUp';

    return 'normal';
}

function getAttendanceStatus(
    session: CoachSessionDto,
    player: CoachAssignedPlayerDto,
): AttendanceStatus {
    if (session.status === 'completed') {
        return player.attendanceRate >= 75 ? 'present' : 'absent';
    }

    if (session.status === 'inProgress') {
        if (player.attendanceRate >= 85) return 'present';
        if (player.attendanceRate < 78) return 'late';

        return 'notMarked';
    }

    return 'notMarked';
}

function buildSessionDetails(
    session: CoachSessionDto,
    assignedPlayers: CoachAssignedPlayerDto[],
    coachName: string,
): CoachSessionDetailsView {
    const linkedPlayers = getPlayersForSession(session, assignedPlayers);

    return {
        ...session,
        location: session.court,
        startTime: session.time,
        endTime: getSessionEndTime(session),
        coachName,
        assistantCoach: getAssistantCoach(session),
        focusAreas: getFocusAreas(session),
        equipment: getEquipment(session),
        safetyNotes: getSafetyNotes(session),
        coachNotes: getCoachNotes(session),
        players: linkedPlayers.map((player) => ({
            id: player.id,
            name: player.name,
            age: player.age,
            level: player.level,
            attendanceStatus: getAttendanceStatus(session, player),
            attendanceRate: player.attendanceRate,
            progressScore: player.progressScore,
            skillScore: player.skillScore,
            risk: getPlayerRisk(player.status),
            parentName: player.parentName,
            latestCoachNote: player.latestNote,
        })),
    };
}

export default function SessionDetailsPage() {
    const { sessionId } = useParams();

    const chartColors = useMemo(() => coachDataService.getChartColors(), []);
    const currentCoach = useMemo(() => coachDataService.getCurrentCoach(), []);
    const assignedPlayers = useMemo(
        () => coachDataService.getAssignedPlayers(),
        [],
    );
    const coachSessions = useMemo(() => coachDataService.getTodaySessions(), []);

    const sessions = useMemo(() => {
        return coachSessions.map((session) =>
            buildSessionDetails(session, assignedPlayers, currentCoach.name),
        );
    }, [assignedPlayers, coachSessions, currentCoach.name]);

    const requestedSessionId = sessionId ?? sessions[0]?.id;
    const session = sessions.find((item) => item.id === requestedSessionId);

    const summary = useMemo(() => {
        if (!session) {
            return {
                totalPlayers: 0,
                presentCount: 0,
                absentCount: 0,
                lateCount: 0,
                excusedCount: 0,
                notMarkedCount: 0,
                attendanceCompletion: 0,
                capacityUsage: 0,
                averageProgress: 0,
                averageSkill: 0,
            };
        }

        const totalPlayers = session.players.length;

        const presentCount = session.players.filter(
            (player) => player.attendanceStatus === 'present',
        ).length;

        const absentCount = session.players.filter(
            (player) => player.attendanceStatus === 'absent',
        ).length;

        const lateCount = session.players.filter(
            (player) => player.attendanceStatus === 'late',
        ).length;

        const excusedCount = session.players.filter(
            (player) => player.attendanceStatus === 'excused',
        ).length;

        const notMarkedCount = session.players.filter(
            (player) => player.attendanceStatus === 'notMarked',
        ).length;

        const markedCount = totalPlayers - notMarkedCount;

        const attendanceCompletion = totalPlayers
            ? Math.round((markedCount / totalPlayers) * 100)
            : 0;

        const capacityUsage = session.capacity
            ? Math.round((totalPlayers / session.capacity) * 100)
            : 0;

        const averageProgress = totalPlayers
            ? Math.round(
                session.players.reduce(
                    (total, player) => total + player.progressScore,
                    0,
                ) / totalPlayers,
            )
            : 0;

        const averageSkill = totalPlayers
            ? Math.round(
                session.players.reduce(
                    (total, player) => total + player.skillScore,
                    0,
                ) / totalPlayers,
            )
            : 0;

        return {
            totalPlayers,
            presentCount,
            absentCount,
            lateCount,
            excusedCount,
            notMarkedCount,
            attendanceCompletion,
            capacityUsage,
            averageProgress,
            averageSkill,
        };
    }, [session]);

    const attendanceBreakdown = useMemo(() => {
        return [
            {
                name: 'Present',
                value: summary.presentCount,
                color: chartColors.green,
            },
            {
                name: 'Absent',
                value: summary.absentCount,
                color: chartColors.red,
            },
            {
                name: 'Late',
                value: summary.lateCount,
                color: chartColors.orange,
            },
            {
                name: 'Excused',
                value: summary.excusedCount,
                color: chartColors.blue,
            },
            {
                name: 'Not Marked',
                value: summary.notMarkedCount,
                color: chartColors.slate,
            },
        ].filter((item) => item.value > 0);
    }, [
        chartColors,
        summary.absentCount,
        summary.excusedCount,
        summary.lateCount,
        summary.notMarkedCount,
        summary.presentCount,
    ]);

    const playerPerformanceData = useMemo(() => {
        if (!session) return [];

        return session.players.map((player) => ({
            name: player.name.split(' ')[0],
            attendance: player.attendanceRate,
            progress: player.progressScore,
            skill: player.skillScore,
        }));
    }, [session]);

    if (!session) {
        return <AccessDeniedPage />;
    }

    return (
        <main className="space-y-8">
            <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

                <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
                    <div>
                        <Link
                            to="/coach/sessions"
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur transition hover:bg-white/20"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sessions
                        </Link>

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
                            <Trophy className="h-4 w-4" />
                            Session Details
                        </div>

                        <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                            {session.title}
                        </h1>

                        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                            Review session timing, branch, training focus, equipment, safety
                            notes, player list, attendance status, and coaching actions within
                            your assigned coach scope.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to={`/coach/attendance?sessionId=${session.id}`}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
                            >
                                <ClipboardCheck className="h-4 w-4" />
                                Take Attendance
                            </Link>

                            <Link
                                to={`/coach/progress-notes?sessionId=${session.id}`}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                            >
                                <FileText className="h-4 w-4" />
                                Add Progress Notes
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <HeroMetricCard
                            icon={Users}
                            label="Players"
                            value={`${summary.totalPlayers}/${session.capacity}`}
                            caption="Assigned players / capacity"
                            positive={summary.capacityUsage < 95}
                        />

                        <HeroMetricCard
                            icon={ClipboardCheck}
                            label="Attendance"
                            value={`${summary.attendanceCompletion}%`}
                            caption="Attendance marking completion"
                            positive={summary.attendanceCompletion >= 80}
                        />

                        <HeroMetricCard
                            icon={TrendingUp}
                            label="Progress"
                            value={`${summary.averageProgress}%`}
                            caption="Average player progress score"
                            positive={summary.averageProgress >= 75}
                        />

                        <HeroMetricCard
                            icon={AlertTriangle}
                            label="Not Marked"
                            value={`${summary.notMarkedCount}`}
                            caption="Players still need attendance"
                            positive={summary.notMarkedCount === 0}
                        />
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    icon={CalendarDays}
                    title="Session Time"
                    value={session.startTime}
                    description={`${session.endTime} · ${session.duration}`}
                    tone="blue"
                />

                <KpiCard
                    icon={MapPin}
                    title="Location"
                    value={session.location}
                    description={`${session.branch} · ${session.program}`}
                    tone="brand"
                />

                <KpiCard
                    icon={CheckCircle2}
                    title="Present"
                    value={`${summary.presentCount}`}
                    description="Players marked as present."
                    tone="success"
                />

                <KpiCard
                    icon={AlertTriangle}
                    title="Needs Action"
                    value={`${summary.notMarkedCount}`}
                    description="Attendance records not marked yet."
                    tone={summary.notMarkedCount > 0 ? 'warning' : 'success'}
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
                <div className="space-y-6">
                    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-black">
                                    <Users className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                                    Players in This Session
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Review assigned players, attendance status, progress score,
                                    parent name, and latest coach notes.
                                </p>
                            </div>

                            <Link
                                to={`/coach/attendance?sessionId=${session.id}`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-sm font-black text-brand-blue transition hover:bg-white"
                            >
                                <ClipboardCheck className="h-4 w-4" />
                                Update Attendance
                            </Link>
                        </div>

                        <div className="hidden overflow-x-auto xl:block">
                            <table className="w-full min-w-[980px] border-collapse">
                                <thead>
                                    <tr className="border-b border-border bg-secondary/60 text-start">
                                        <TableHead>Player</TableHead>
                                        <TableHead>Attendance</TableHead>
                                        <TableHead>Attendance Rate</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Skill</TableHead>
                                        <TableHead>Parent</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </tr>
                                </thead>

                                <tbody>
                                    {session.players.map((player) => (
                                        <tr
                                            key={player.id}
                                            className="border-b border-border last:border-b-0 hover:bg-secondary/35"
                                        >
                                            <TableCell>
                                                <PlayerIdentity player={player} />
                                            </TableCell>

                                            <TableCell>
                                                <AttendanceBadge status={player.attendanceStatus} />
                                            </TableCell>

                                            <TableCell>
                                                <ScorePill value={player.attendanceRate} />
                                            </TableCell>

                                            <TableCell>
                                                <ScorePill value={player.progressScore} />
                                            </TableCell>

                                            <TableCell>
                                                <ScorePill value={player.skillScore} />
                                            </TableCell>

                                            <TableCell>{player.parentName}</TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/coach/players/${player.id}`}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
                                                        title="View player profile"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>

                                                    <Link
                                                        to={`/coach/progress-notes?playerId=${player.id}&sessionId=${session.id}`}
                                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
                                                        title="Add progress note"
                                                    >
                                                        <FileText className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </TableCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="grid gap-4 xl:hidden">
                            {session.players.map((player) => (
                                <PlayerMobileCard
                                    key={player.id}
                                    player={player}
                                    sessionId={session.id}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                        <ChartCard
                            icon={Activity}
                            title="Attendance Breakdown"
                            description="Current attendance distribution for this session."
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
                                            total={summary.totalPlayers}
                                            color={item.color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </ChartCard>

                        <ChartCard
                            icon={BarChart3}
                            title="Player Performance"
                            description="Attendance rate, progress score, and skill score by player."
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
                    <SessionSummaryPanel session={session} />

                    <InfoPanel icon={Zap} title="Training Focus" items={session.focusAreas} />

                    <InfoPanel
                        icon={ShieldCheck}
                        title="Safety Notes"
                        items={session.safetyNotes}
                        warning
                    />

                    <InfoPanel icon={Dumbbell} title="Equipment" items={session.equipment} />

                    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black">Quick Actions</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Useful shortcuts for this session.
                                </p>
                            </div>

                            <Sparkles className="h-6 w-6 text-brand-yellow" />
                        </div>

                        <div className="grid gap-3">
                            <QuickAction
                                icon={ClipboardCheck}
                                title="Take Attendance"
                                description="Mark attendance for this session."
                                href={`/coach/attendance?sessionId=${session.id}`}
                            />

                            <QuickAction
                                icon={FileText}
                                title="Progress Notes"
                                description="Add development notes for players."
                                href={`/coach/progress-notes?sessionId=${session.id}`}
                            />

                            <QuickAction
                                icon={ShieldCheck}
                                title="Report Incident"
                                description="Submit a safety or behavior report."
                                href={`/coach/incidents?sessionId=${session.id}`}
                            />

                            <QuickAction
                                icon={MessageSquare}
                                title="Message Admin"
                                description="Contact academy administration."
                                href="/coach/messages"
                            />
                        </div>
                    </section>
                </aside>
            </section>
        </main>
    );
}

function AccessDeniedPage() {
    return (
        <main className="flex min-h-[65vh] items-center justify-center">
            <section className="max-w-2xl rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                    <ShieldCheck className="h-8 w-8" />
                </div>

                <h1 className="text-2xl font-black">Access denied</h1>

                <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">
                    This session is not assigned to your coach account, so it cannot be
                    displayed in the Coach Portal.
                </p>

                <Link
                    to="/coach/sessions"
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sessions
                </Link>
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

function PlayerIdentity({ player }: { player: SessionPlayerView }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
                <UserRound className="h-6 w-6" />
            </div>

            <div>
                <p className="font-black">{player.name}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    Age {player.age} · {getLevelLabel(player.level)}
                </p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    {getRiskLabel(player.risk)}
                </p>
            </div>
        </div>
    );
}

function PlayerMobileCard({
    player,
    sessionId,
}: {
    player: SessionPlayerView;
    sessionId: string;
}) {
    return (
        <article className="rounded-[2rem] border border-border bg-background p-5 dark:bg-white/[0.04]">
            <div className="mb-4 flex items-start justify-between gap-3">
                <PlayerIdentity player={player} />
                <AttendanceBadge status={player.attendanceStatus} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <MiniInfo label="Attendance Rate" value={`${player.attendanceRate}%`} />
                <MiniInfo label="Progress" value={`${player.progressScore}%`} />
                <MiniInfo label="Skill" value={`${player.skillScore}%`} />
                <MiniInfo label="Parent" value={player.parentName} />
            </div>

            <p className="mt-4 text-sm font-semibold leading-6 text-muted-foreground">
                {player.latestCoachNote}
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                    to={`/coach/players/${player.id}`}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-black transition hover:bg-secondary"
                >
                    <Eye className="h-4 w-4" />
                    Profile
                </Link>

                <Link
                    to={`/coach/progress-notes?playerId=${player.id}&sessionId=${sessionId}`}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
                >
                    <FileText className="h-4 w-4" />
                    Add Note
                </Link>
            </div>
        </article>
    );
}

function SessionSummaryPanel({
    session,
}: {
    session: CoachSessionDetailsView;
}) {
    return (
        <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                    <CalendarCheck className="h-7 w-7" />
                </div>

                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
                    Session Summary
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
                        {session.players.length}/{session.capacity} players
                    </span>
                </div>
            </div>

            <div className="space-y-4 p-5">
                <DetailLine
                    icon={Clock3}
                    label="Time"
                    value={`${session.startTime} - ${session.endTime}`}
                />
                <DetailLine icon={CalendarDays} label="Duration" value={session.duration} />
                <DetailLine icon={MapPin} label="Branch" value={session.branch} />
                <DetailLine icon={Target} label="Location" value={session.location} />
                <DetailLine icon={UserRound} label="Coach" value={session.coachName} />
                <DetailLine icon={Users} label="Assistant" value={session.assistantCoach} />
                <DetailLine icon={MessageSquare} label="Coach Notes" value={session.coachNotes} />
            </div>
        </aside>
    );
}

function InfoPanel({
    icon: Icon,
    title,
    items,
    warning = false,
}: {
    icon: LucideIcon;
    title: string;
    items: string[];
    warning?: boolean;
}) {
    return (
        <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-3">
                <div
                    className={[
                        'flex h-11 w-11 items-center justify-center rounded-2xl',
                        warning
                            ? 'bg-brand-yellow text-brand-blue'
                            : 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue',
                    ].join(' ')}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <h2 className="text-xl font-black">{title}</h2>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-border bg-background p-3 dark:bg-white/[0.04]"
                    >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue dark:text-brand-yellow" />
                        <p className="text-sm font-semibold leading-6 text-muted-foreground">
                            {item}
                        </p>
                    </div>
                ))}
            </div>
        </section>
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

function MiniInfo({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-3 dark:bg-white/[0.04]">
            <p className="text-xs font-bold text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-black">{value}</p>
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

function ScorePill({ value }: { value: number }) {
    return (
        <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
            {value}%
        </span>
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
            {getAttendanceLabel(status)}
        </span>
    );
}

function TableHead({ children }: { children: ReactNode }) {
    return (
        <th className="px-5 py-4 text-start text-xs font-black uppercase tracking-wide text-muted-foreground">
            {children}
        </th>
    );
}

function TableCell({ children }: { children: ReactNode }) {
    return <td className="px-5 py-4 align-middle text-sm">{children}</td>;
}