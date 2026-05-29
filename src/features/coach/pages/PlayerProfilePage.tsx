import type { LucideIcon } from 'lucide-react';
import {
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
    Star,
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
    CoachPlayerStatus,
    CoachSkillStatus,
} from '@/features/coach/types/coach.dto';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface SkillAssessmentView {
    name: string;
    category: string;
    score: number;
    target: number;
    status: CoachSkillStatus;
    note: string;
}

interface AttendanceRecordView {
    id: string;
    date: string;
    sessionTitle: string;
    status: AttendanceStatus;
    note: string;
}

interface ProgressNoteView {
    id: string;
    date: string;
    title: string;
    note: string;
    recommendation: string;
}

function getStatusLabel(status: CoachPlayerStatus) {
    const labels: Record<CoachPlayerStatus, string> = {
        active: 'Active',
        excellent: 'Excellent',
        needsFollowUp: 'Needs Follow-up',
        inactive: 'Inactive',
    };

    return labels[status];
}

function getSkillStatusLabel(status: CoachSkillStatus) {
    const labels: Record<CoachSkillStatus, string> = {
        excellent: 'Excellent',
        good: 'Good',
        needsWork: 'Needs Work',
    };

    return labels[status];
}

function getAttendanceLabel(status: AttendanceStatus) {
    const labels: Record<AttendanceStatus, string> = {
        present: 'Present',
        absent: 'Absent',
        late: 'Late',
        excused: 'Excused',
    };

    return labels[status];
}

function getSkillCategory(skillName: string) {
    const technical = ['passing', 'ball', 'shooting', 'finishing'];
    const tactical = ['positioning', 'decision', 'awareness', 'scanning'];
    const physical = ['fitness', 'balance', 'coordination', 'defending'];
    const mental = ['confidence', 'communication', 'composure'];

    const normalized = skillName.toLowerCase();

    if (technical.some((keyword) => normalized.includes(keyword))) {
        return 'Technical';
    }

    if (tactical.some((keyword) => normalized.includes(keyword))) {
        return 'Tactical';
    }

    if (physical.some((keyword) => normalized.includes(keyword))) {
        return 'Physical';
    }

    if (mental.some((keyword) => normalized.includes(keyword))) {
        return 'Mental';
    }

    return 'General';
}

function getSkillNote(skill: CoachAssignedPlayerDto['skills'][number]) {
    if (skill.status === 'excellent') {
        return `${skill.name} is currently a strong area and can be used as a leadership point during drills.`;
    }

    if (skill.status === 'needsWork') {
        return `${skill.name} needs focused repetition, close feedback, and short measurable targets.`;
    }

    return `${skill.name} is developing well and should continue through structured practice.`;
}

function buildSkillAssessments(
    player: CoachAssignedPlayerDto,
): SkillAssessmentView[] {
    return player.skills.map((skill) => ({
        name: skill.name,
        category: getSkillCategory(skill.name),
        score: skill.score,
        target: Math.min(100, skill.score + 6),
        status: skill.status,
        note: getSkillNote(skill),
    }));
}

function buildAttendanceHistory(
    player: CoachAssignedPlayerDto,
): AttendanceRecordView[] {
    const absentSessions = Math.max(player.totalSessions - player.sessionsAttended, 0);

    return [
        {
            id: `${player.id}-att-001`,
            date: player.lastSession,
            sessionTitle: `${player.group} Training Session`,
            status: 'present',
            note: 'Completed the latest recorded session within coach scope.',
        },
        {
            id: `${player.id}-att-002`,
            date: '2026-05-29',
            sessionTitle: `${player.program} Development Session`,
            status: player.attendanceRate >= 85 ? 'present' : 'late',
            note:
                player.attendanceRate >= 85
                    ? 'Good attendance consistency recorded.'
                    : 'Attendance consistency needs coach follow-up.',
        },
        {
            id: `${player.id}-att-003`,
            date: '2026-05-22',
            sessionTitle: `${player.group} Skills Session`,
            status: absentSessions > 0 ? 'absent' : 'present',
            note:
                absentSessions > 0
                    ? 'One or more missed sessions are reflected in the attendance summary.'
                    : 'No major attendance concern recorded for this period.',
        },
        {
            id: `${player.id}-att-004`,
            date: '2026-05-18',
            sessionTitle: `${player.program} Practice Session`,
            status: 'excused',
            note: 'Coach-visible historical attendance note.',
        },
    ];
}

function buildProgressNotes(player: CoachAssignedPlayerDto): ProgressNoteView[] {
    return [
        {
            id: `${player.id}-note-001`,
            date: player.lastSession,
            title: 'Latest Coach Observation',
            note: player.latestNote,
            recommendation: player.coachRecommendation,
        },
        {
            id: `${player.id}-note-002`,
            date: '2026-05-25',
            title: 'Development Focus',
            note: `Main improvement areas: ${player.improvementAreas.join(', ') || 'No specific areas recorded.'}`,
            recommendation:
                player.improvementAreas.length > 0
                    ? 'Use targeted drills and review the same focus areas in the next session.'
                    : 'Continue current training plan and monitor progress.',
        },
    ];
}

function buildTrend(player: CoachAssignedPlayerDto) {
    const attendance = player.attendanceRate;
    const progress = player.progressScore;
    const skill = player.skillScore;

    return [
        {
            month: 'Jan',
            attendance: Math.max(attendance - 8, 0),
            progress: Math.max(progress - 10, 0),
            skill: Math.max(skill - 10, 0),
        },
        {
            month: 'Feb',
            attendance: Math.max(attendance - 6, 0),
            progress: Math.max(progress - 8, 0),
            skill: Math.max(skill - 8, 0),
        },
        {
            month: 'Mar',
            attendance: Math.max(attendance - 4, 0),
            progress: Math.max(progress - 6, 0),
            skill: Math.max(skill - 6, 0),
        },
        {
            month: 'Apr',
            attendance: Math.max(attendance - 3, 0),
            progress: Math.max(progress - 4, 0),
            skill: Math.max(skill - 4, 0),
        },
        {
            month: 'May',
            attendance: Math.max(attendance - 1, 0),
            progress: Math.max(progress - 2, 0),
            skill: Math.max(skill - 2, 0),
        },
        {
            month: 'Jun',
            attendance,
            progress,
            skill,
        },
    ];
}

function buildSafetyNotes(player: CoachAssignedPlayerDto) {
    if (player.status === 'needsFollowUp') {
        return [
            'Follow up on consistency and coach recommendations.',
            'Monitor training load and behavior during sessions.',
            'Escalate to admin if the follow-up concern continues.',
        ];
    }

    return [
        'No current injury notes recorded in coach scope.',
        'Normal training load is allowed.',
        'Hydration reminder during outdoor sessions.',
    ];
}

export default function PlayerProfilePage() {
    const { playerId } = useParams();

    const chartColors = useMemo(() => coachDataService.getChartColors(), []);

    const assignedStudentsOnly = useMemo(
        () => coachDataService.getAssignedPlayers(),
        [],
    );

    const player = assignedStudentsOnly.find((student) => student.id === playerId);

    const skills = useMemo(() => {
        return player ? buildSkillAssessments(player) : [];
    }, [player]);

    const attendanceHistory = useMemo(() => {
        return player ? buildAttendanceHistory(player) : [];
    }, [player]);

    const progressNotes = useMemo(() => {
        return player ? buildProgressNotes(player) : [];
    }, [player]);

    const trend = useMemo(() => {
        return player ? buildTrend(player) : [];
    }, [player]);

    const safetyNotes = useMemo(() => {
        return player ? buildSafetyNotes(player) : [];
    }, [player]);

    if (!player) {
        return <AccessDeniedPage />;
    }

    const attendanceBreakdown = [
        {
            name: 'Present',
            value: attendanceHistory.filter((record) => record.status === 'present')
                .length,
            color: chartColors.green,
        },
        {
            name: 'Absent',
            value: attendanceHistory.filter((record) => record.status === 'absent')
                .length,
            color: chartColors.red,
        },
        {
            name: 'Late',
            value: attendanceHistory.filter((record) => record.status === 'late')
                .length,
            color: chartColors.orange,
        },
        {
            name: 'Excused',
            value: attendanceHistory.filter((record) => record.status === 'excused')
                .length,
            color: chartColors.blue,
        },
    ].filter((item) => item.value > 0);

    const skillChartData = skills.map((skill) => ({
        name: skill.name,
        score: skill.score,
        target: skill.target,
    }));

    return (
        <main className="space-y-8">
            <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

                <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
                    <div>
                        <Link
                            to="/coach/players"
                            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white backdrop-blur transition hover:bg-white/20"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Assigned Students
                        </Link>

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
                            <UserRound className="h-4 w-4" />
                            Coach-Scoped Student Profile
                        </div>

                        <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                            {player.name}
                        </h1>

                        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                            View only the training, attendance, progress, skill, safety, and
                            coaching information available within your assigned coach scope.
                            Finance and admin-only data are not displayed here.
                        </p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <Link
                                to={`/coach/progress-notes?playerId=${player.id}`}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
                            >
                                <FileText className="h-4 w-4" />
                                Add Progress Note
                            </Link>

                            <Link
                                to={`/coach/attendance?playerId=${player.id}`}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
                            >
                                <ClipboardCheck className="h-4 w-4" />
                                Attendance
                            </Link>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <HeroMetricCard
                            icon={ClipboardCheck}
                            label="Attendance"
                            value={`${player.attendanceRate}%`}
                            caption={`${player.sessionsAttended}/${player.totalSessions} sessions`}
                            positive={player.attendanceRate >= 80}
                        />

                        <HeroMetricCard
                            icon={TrendingUp}
                            label="Progress"
                            value={`${player.progressScore}%`}
                            caption="Current progress score"
                            positive={player.progressScore >= 75}
                        />

                        <HeroMetricCard
                            icon={Trophy}
                            label="Skill Score"
                            value={`${player.skillScore}%`}
                            caption="Average skill assessment"
                            positive={player.skillScore >= 75}
                        />

                        <HeroMetricCard
                            icon={AlertTriangle}
                            label="Status"
                            value={getStatusLabel(player.status)}
                            caption="Coach follow-up status"
                            positive={player.status !== 'needsFollowUp'}
                        />
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    icon={UserRound}
                    title="Age / Level"
                    value={`${player.age}`}
                    description={`${player.level}`}
                    tone="blue"
                />

                <KpiCard
                    icon={Dumbbell}
                    title="Program"
                    value={player.program}
                    description={player.group}
                    tone="brand"
                />

                <KpiCard
                    icon={CalendarDays}
                    title="Next Session"
                    value={player.nextSession}
                    description={`Last session: ${player.lastSession}`}
                    tone="success"
                />

                <KpiCard
                    icon={ShieldCheck}
                    title="Access Scope"
                    value="Coach Only"
                    description="No finance or admin-only data visible."
                    tone="warning"
                />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
                <div className="space-y-6">
                    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                        <ChartCard
                            icon={BarChart3}
                            title="Progress Trend"
                            description="Attendance, progress, and skill movement over recent months."
                        >
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trend}>
                                        <defs>
                                            <linearGradient
                                                id="playerTrendGradient"
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
                                            fill="url(#playerTrendGradient)"
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="progress"
                                            stroke={chartColors.green}
                                            strokeWidth={4}
                                            fill="transparent"
                                        />

                                        <Area
                                            type="monotone"
                                            dataKey="skill"
                                            stroke={chartColors.yellow}
                                            strokeWidth={4}
                                            fill="transparent"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartCard>

                        <ChartCard
                            icon={CalendarCheck}
                            title="Attendance Breakdown"
                            description="Recent attendance distribution for this student."
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
                                            total={attendanceHistory.length}
                                            color={item.color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </ChartCard>
                    </section>

                    <ChartCard
                        icon={Target}
                        title="Skill Assessment"
                        description="Current score compared with target score for each skill."
                    >
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={skillChartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip />

                                    <Bar
                                        dataKey="score"
                                        fill={chartColors.blue}
                                        radius={[10, 10, 0, 0]}
                                    />

                                    <Bar
                                        dataKey="target"
                                        fill={chartColors.yellow}
                                        radius={[10, 10, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-black">
                                    <Trophy className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                                    Detailed Skills
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Coach-visible skill assessment details only.
                                </p>
                            </div>

                            <Link
                                to={`/coach/skill-assessments?playerId=${player.id}`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-sm font-black text-brand-blue transition hover:bg-white"
                            >
                                <Star className="h-4 w-4" />
                                Assess Skills
                            </Link>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {skills.map((skill) => (
                                <SkillCard key={skill.name} skill={skill} />
                            ))}
                        </div>
                    </section>

                    <section className="grid gap-6 xl:grid-cols-2">
                        <ListPanel
                            icon={CheckCircle2}
                            title="Strengths"
                            items={player.strengths}
                        />

                        <ListPanel
                            icon={Zap}
                            title="Improvement Areas"
                            items={player.improvementAreas}
                            warning
                        />
                    </section>

                    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-black">
                                    <FileText className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                                    Progress Notes
                                </h2>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Previous coach notes for this assigned student.
                                </p>
                            </div>

                            <Link
                                to={`/coach/progress-notes?playerId=${player.id}`}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-sm font-black text-brand-blue transition hover:bg-white"
                            >
                                <FileText className="h-4 w-4" />
                                Add Note
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {progressNotes.map((note) => (
                                <ProgressNoteCard key={note.id} note={note} />
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5">
                            <h2 className="flex items-center gap-2 text-xl font-black">
                                <ClipboardCheck className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                                Attendance History
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Recent coach-visible attendance records.
                            </p>
                        </div>

                        <div className="grid gap-3">
                            {attendanceHistory.map((record) => (
                                <AttendanceRecordRow key={record.id} record={record} />
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <PlayerSummaryPanel player={player} />

                    <ListPanel
                        icon={ShieldCheck}
                        title="Safety Notes"
                        items={safetyNotes}
                        warning
                    />

                    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black">Coach Recommendation</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Current recommendation for this student.
                                </p>
                            </div>

                            <Sparkles className="h-6 w-6 text-brand-yellow" />
                        </div>

                        <p className="rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
                            {player.coachRecommendation}
                        </p>
                    </section>

                    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black">Quick Actions</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Coach actions for this assigned student.
                                </p>
                            </div>

                            <Eye className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
                        </div>

                        <div className="grid gap-3">
                            <QuickAction
                                icon={FileText}
                                title="Add Progress Note"
                                description="Create a new development note."
                                href={`/coach/progress-notes?playerId=${player.id}`}
                            />

                            <QuickAction
                                icon={Star}
                                title="Skill Assessment"
                                description="Update skill scores and notes."
                                href={`/coach/skill-assessments?playerId=${player.id}`}
                            />

                            <QuickAction
                                icon={ClipboardCheck}
                                title="Take Attendance"
                                description="Open attendance page."
                                href={`/coach/attendance?playerId=${player.id}`}
                            />

                            <QuickAction
                                icon={MessageSquare}
                                title="Message"
                                description="Contact admin or assigned parent."
                                href={`/coach/messages?playerId=${player.id}`}
                            />

                            <QuickAction
                                icon={ShieldCheck}
                                title="Report Incident"
                                description="Submit safety or behavior incident."
                                href={`/coach/incidents?playerId=${player.id}`}
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
                    This student profile is not assigned to your coach account, so it
                    cannot be displayed in the Coach Portal.
                </p>

                <Link
                    to="/coach/players"
                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Assigned Students
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

function PlayerSummaryPanel({ player }: { player: CoachAssignedPlayerDto }) {
    return (
        <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                    <Trophy className="h-7 w-7" />
                </div>

                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
                    Student Summary
                </p>

                <h2 className="mt-2 text-2xl font-black leading-tight">
                    {player.name}
                </h2>

                <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
                    {player.program} · {player.group}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                    <StatusBadge status={player.status} />

                    <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
                        {player.level}
                    </span>
                </div>
            </div>

            <div className="space-y-4 p-5">
                <DetailLine icon={UserRound} label="Age" value={`${player.age} years`} />
                <DetailLine icon={Users} label="Parent" value={player.parentName} />
                <DetailLine icon={MapPin} label="Branch" value={player.branch} />
                <DetailLine icon={Dumbbell} label="Program" value={player.program} />
                <DetailLine
                    icon={CalendarDays}
                    label="Next Session"
                    value={player.nextSession}
                />
                <DetailLine
                    icon={Clock3}
                    label="Last Session"
                    value={player.lastSession}
                />
                <DetailLine
                    icon={ShieldCheck}
                    label="Coach Scope"
                    value="Assigned parent communication only"
                />
            </div>
        </aside>
    );
}

function SkillCard({ skill }: { skill: SkillAssessmentView }) {
    return (
        <article className="rounded-[1.5rem] border border-border bg-background p-4 dark:bg-white/[0.04]">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-black">{skill.name}</h3>
                    <p className="mt-1 text-xs font-bold text-muted-foreground">
                        {skill.category} · {getSkillStatusLabel(skill.status)}
                    </p>
                </div>

                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
                    {skill.score}%
                </span>
            </div>

            <div className="mb-2 flex items-center justify-between text-xs font-black">
                <span>Current</span>
                <span>Target {skill.target}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                    className="h-full rounded-full bg-brand-yellow"
                    style={{ width: `${skill.score}%` }}
                />
            </div>

            <p className="mt-3 text-xs font-semibold leading-5 text-muted-foreground">
                {skill.note}
            </p>
        </article>
    );
}

function ListPanel({
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

function ProgressNoteCard({ note }: { note: ProgressNoteView }) {
    return (
        <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
                    <FileText className="h-5 w-5" />
                </div>

                <div>
                    <p className="text-sm font-black">{note.title}</p>
                    <p className="mt-1 text-xs font-bold text-muted-foreground">
                        {note.date}
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                        {note.note}
                    </p>
                    <p className="mt-2 rounded-xl bg-brand-yellow/10 p-3 text-xs font-bold leading-5 text-brand-blue dark:text-brand-yellow">
                        Recommendation: {note.recommendation}
                    </p>
                </div>
            </div>
        </article>
    );
}

function AttendanceRecordRow({ record }: { record: AttendanceRecordView }) {
    return (
        <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-black">{record.sessionTitle}</p>
                    <p className="mt-1 text-xs font-bold text-muted-foreground">
                        {record.date}
                    </p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
                        {record.note}
                    </p>
                </div>

                <AttendanceBadge status={record.status} />
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
                {percentage}% of records
            </p>
        </div>
    );
}

function StatusBadge({ status }: { status: CoachPlayerStatus }) {
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
            {getStatusLabel(status)}
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
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
        >
            {getAttendanceLabel(status)}
        </span>
    );
}