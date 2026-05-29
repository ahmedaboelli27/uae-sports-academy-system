import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
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
  TrendingUp,
  Trophy,
  UserRound,
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
  CoachPlayerStatus,
  CoachSkillStatus,
} from '@/features/coach/types/coach.dto';

type LevelFilter = 'all' | 'Beginner' | 'Intermediate' | 'Advanced';

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

export default function AssignedStudentsPage() {
  const chartColors = useMemo(() => coachDataService.getChartColors(), []);
  const assignedStudents = useMemo(
    () => coachDataService.getAssignedPlayers(),
    [],
  );
  const attendanceTrend = useMemo(
    () => coachDataService.getAttendanceTrend(),
    [],
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [statusFilter, setStatusFilter] = useState<CoachPlayerStatus | 'all'>(
    'all',
  );
  const [selectedStudentId, setSelectedStudentId] = useState(
    assignedStudents[0]?.id ?? '',
  );

  const programs = useMemo(() => {
    return Array.from(
      new Set(assignedStudents.map((student) => student.program)),
    );
  }, [assignedStudents]);

  const searchedStudents = useMemo(() => {
    return coachDataService.searchAssignedPlayers(assignedStudents, searchTerm);
  }, [assignedStudents, searchTerm]);

  const filteredStudents = useMemo(() => {
    return searchedStudents.filter((student) => {
      const matchesProgram =
        programFilter === 'all' || student.program === programFilter;

      const matchesLevel = levelFilter === 'all' || student.level === levelFilter;

      const matchesStatus =
        statusFilter === 'all' || student.status === statusFilter;

      return matchesProgram && matchesLevel && matchesStatus;
    });
  }, [levelFilter, programFilter, searchedStudents, statusFilter]);

  const selectedStudent =
    assignedStudents.find((student) => student.id === selectedStudentId) ??
    filteredStudents[0] ??
    assignedStudents[0];

  const summary = useMemo(() => {
    const total = assignedStudents.length;

    const activeCount = assignedStudents.filter(
      (student) => student.status === 'active' || student.status === 'excellent',
    ).length;

    const followUpCount = assignedStudents.filter(
      (student) => student.status === 'needsFollowUp',
    ).length;

    const averageAttendance = total
      ? Math.round(
        assignedStudents.reduce(
          (totalValue, student) => totalValue + student.attendanceRate,
          0,
        ) / total,
      )
      : 0;

    const averageProgress = total
      ? Math.round(
        assignedStudents.reduce(
          (totalValue, student) => totalValue + student.progressScore,
          0,
        ) / total,
      )
      : 0;

    return {
      total,
      activeCount,
      followUpCount,
      averageAttendance,
      averageProgress,
    };
  }, [assignedStudents]);

  const progressTrend = useMemo(() => {
    return attendanceTrend.map((point) => ({
      month: point.day,
      attendance: point.attendance,
      progress: Math.max(0, Math.min(100, point.completion - 8)),
    }));
  }, [attendanceTrend]);

  const statusBreakdown = useMemo(() => {
    return [
      {
        name: 'Excellent',
        value: assignedStudents.filter(
          (student) => student.status === 'excellent',
        ).length,
        color: chartColors.green,
      },
      {
        name: 'Active',
        value: assignedStudents.filter((student) => student.status === 'active')
          .length,
        color: chartColors.blue,
      },
      {
        name: 'Needs Follow-up',
        value: assignedStudents.filter(
          (student) => student.status === 'needsFollowUp',
        ).length,
        color: chartColors.orange,
      },
      {
        name: 'Inactive',
        value: assignedStudents.filter(
          (student) => student.status === 'inactive',
        ).length,
        color: chartColors.slate,
      },
    ].filter((item) => item.value > 0);
  }, [assignedStudents, chartColors]);

  const levelBreakdown = useMemo(() => {
    return [
      {
        name: 'Beginner',
        value: assignedStudents.filter((student) => student.level === 'Beginner')
          .length,
        color: chartColors.yellow,
      },
      {
        name: 'Intermediate',
        value: assignedStudents.filter(
          (student) => student.level === 'Intermediate',
        ).length,
        color: chartColors.blue,
      },
      {
        name: 'Advanced',
        value: assignedStudents.filter((student) => student.level === 'Advanced')
          .length,
        color: chartColors.purple,
      },
    ].filter((item) => item.value > 0);
  }, [assignedStudents, chartColors]);

  const playerPerformanceData = useMemo(() => {
    return assignedStudents.map((student) => ({
      name: student.name.split(' ')[0],
      attendance: student.attendanceRate,
      progress: student.progressScore,
      skill: student.skillScore,
    }));
  }, [assignedStudents]);

  const resetFilters = () => {
    setSearchTerm('');
    setProgramFilter('all');
    setLevelFilter('all');
    setStatusFilter('all');
  };

  if (!selectedStudent) {
    return (
      <main className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black">No assigned students</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No students are currently assigned to this coach account.
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
              <Users className="h-4 w-4" />
              Coach Player Scope
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Assigned Students
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Review students assigned to your coaching groups only. Track
              attendance, progress, skill scores, latest notes, and follow-up
              priorities without exposing finance or admin-only information.
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
                to="/coach/progress-notes"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <FileText className="h-4 w-4" />
                Add Progress Note
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={Users}
              label="Assigned Students"
              value={`${summary.total}`}
              caption="Within your coach scope"
              positive
            />

            <HeroMetricCard
              icon={CheckCircle2}
              label="Active"
              value={`${summary.activeCount}`}
              caption="Currently active students"
              positive
            />

            <HeroMetricCard
              icon={TrendingUp}
              label="Avg Progress"
              value={`${summary.averageProgress}%`}
              caption="Average progress score"
              positive={summary.averageProgress >= 75}
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Follow-up"
              value={`${summary.followUpCount}`}
              caption="Students needing coach action"
              positive={summary.followUpCount === 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Users}
          title="Total Assigned"
          value={`${summary.total}`}
          description="Students assigned to your coaching groups."
          tone="blue"
        />

        <KpiCard
          icon={ClipboardCheck}
          title="Avg Attendance"
          value={`${summary.averageAttendance}%`}
          description="Average attendance for assigned students."
          tone="success"
        />

        <KpiCard
          icon={TrendingUp}
          title="Avg Progress"
          value={`${summary.averageProgress}%`}
          description="Average progress across assigned students."
          tone="brand"
        />

        <KpiCard
          icon={AlertTriangle}
          title="Needs Follow-up"
          value={`${summary.followUpCount}`}
          description="Students requiring notes or attention."
          tone={summary.followUpCount > 0 ? 'warning' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Student Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter assigned students by name, program, group,
                  branch, parent, level, status, or coach notes.
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
                    placeholder="Search student, parent, program, note..."
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

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Excellent', value: 'excellent' },
                  { label: 'Needs Follow-up', value: 'needsFollowUp' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as CoachPlayerStatus | 'all')
                }
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                active={selectedStudent.id === student.id}
                onSelect={() => setSelectedStudentId(student.id)}
              />
            ))}

            {filteredStudents.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Progress & Attendance Trend"
              description="Overall movement for assigned students across recent coaching days."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressTrend}>
                    <defs>
                      <linearGradient
                        id="studentsTrendGradient"
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
                      fill="url(#studentsTrendGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="progress"
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
              title="Student Status"
              description="Distribution of assigned students by coaching status."
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
                      total={assignedStudents.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <ChartCard
              icon={Target}
              title="Level Distribution"
              description="How assigned students are distributed by coaching level."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={levelBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {levelBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {levelBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={assignedStudents.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard
              icon={Trophy}
              title="Student Performance"
              description="Attendance, progress, and skill scores by assigned student."
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
          <SelectedStudentPanel student={selectedStudent} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Follow-up Alerts</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Students needing coach attention.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {assignedStudents
                .filter((student) => student.status === 'needsFollowUp')
                .map((student) => (
                  <FollowUpRow key={student.id} student={student} />
                ))}

              {summary.followUpCount === 0 ? (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-bold text-green-700 dark:text-green-300">
                  No assigned students currently need follow-up.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful coach shortcuts for selected student.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={Eye}
                title="Student Profile"
                description="Open selected student profile."
                href={`/coach/players/${selectedStudent.id}`}
              />

              <QuickAction
                icon={FileText}
                title="Add Progress Note"
                description="Create a development note."
                href={`/coach/progress-notes?playerId=${selectedStudent.id}`}
              />

              <QuickAction
                icon={ClipboardCheck}
                title="Take Attendance"
                description="Open attendance page."
                href="/coach/attendance"
              />

              <QuickAction
                icon={MessageSquare}
                title="Message"
                description="Contact admin or assigned parent."
                href={`/coach/messages?playerId=${selectedStudent.id}`}
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

function StudentCard({
  student,
  active,
  onSelect,
}: {
  student: CoachAssignedPlayerDto;
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
          <UserRound className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black">{student.name}</h3>

              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                Age {student.age} · {student.level}
              </p>

              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {student.group} · {student.branch}
              </p>
            </div>

            <StatusBadge status={student.status} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <MiniScore label="Attendance" value={`${student.attendanceRate}%`} />
        <MiniScore label="Progress" value={`${student.progressScore}%`} />
        <MiniScore label="Skills" value={`${student.skillScore}%`} />
      </div>

      <p className="mt-4 line-clamp-2 text-sm font-semibold leading-6 text-muted-foreground">
        {student.latestNote}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/coach/players/${student.id}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-black transition hover:bg-secondary"
        >
          <Eye className="h-4 w-4" />
          Profile
        </Link>

        <Link
          to={`/coach/progress-notes?playerId=${student.id}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
        >
          <FileText className="h-4 w-4" />
          Add Note
        </Link>
      </div>
    </article>
  );
}

function SelectedStudentPanel({
  student,
}: {
  student: CoachAssignedPlayerDto;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Trophy className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Student
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {student.name}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {student.program} · {student.group}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge status={student.status} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {student.level}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={UserRound} label="Age" value={`${student.age} years`} />
        <DetailLine icon={Dumbbell} label="Program" value={student.program} />
        <DetailLine icon={Users} label="Group" value={student.group} />
        <DetailLine icon={MapPin} label="Branch" value={student.branch} />
        <DetailLine icon={UserRound} label="Parent" value={student.parentName} />
        <DetailLine
          icon={ClipboardCheck}
          label="Attendance"
          value={`${student.attendanceRate}% · ${student.sessionsAttended}/${student.totalSessions} sessions`}
        />
        <DetailLine
          icon={TrendingUp}
          label="Progress"
          value={`${student.progressScore}% progress · ${student.skillScore}% skill score`}
        />
        <DetailLine
          icon={CalendarDays}
          label="Last Session"
          value={student.lastSession}
        />
        <DetailLine
          icon={Clock3}
          label="Next Session"
          value={student.nextSession}
        />
        <DetailLine
          icon={MessageSquare}
          label="Latest Coach Note"
          value={student.latestNote}
        />
      </div>

      <div className="border-t border-border p-5">
        <h3 className="mb-4 text-sm font-black">Skill Summary</h3>

        <div className="space-y-3">
          {student.skills.map((skill) => (
            <SkillRow key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </aside>
  );
}

function FollowUpRow({ student }: { student: CoachAssignedPlayerDto }) {
  return (
    <Link
      to={`/coach/players/${student.id}`}
      className="block rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue transition hover:-translate-y-0.5 hover:bg-brand-yellow/20 dark:text-brand-yellow"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-black">{student.name}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {student.coachRecommendation}
          </p>
        </div>
      </div>
    </Link>
  );
}

function SkillRow({
  skill,
}: {
  skill: CoachAssignedPlayerDto['skills'][number];
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black">{skill.name}</p>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {getSkillStatusLabel(skill.status)}
          </p>
        </div>

        <span className="text-sm font-black text-brand-blue dark:text-brand-yellow">
          {skill.score}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-brand-yellow"
          style={{ width: `${skill.score}%` }}
        />
      </div>
    </div>
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
        {percentage}% of students
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

      <h3 className="text-xl font-black">No assigned students found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, program, level, or student status.
      </p>
    </div>
  );
}