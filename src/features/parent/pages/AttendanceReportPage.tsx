import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  Clock3,
  Eye,
  FileText,
  Filter,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
  XCircle,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
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

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

interface AttendanceRecord {
  id: string;
  date: string;
  month: string;
  sessionTitle: string;
  program: string;
  coach: string;
  branch: string;
  time: string;
  location: string;
  status: AttendanceStatus;
  checkInTime: string;
  note: string;
}

interface AttendanceTrendPoint {
  month: string;
  attendance: number;
  present: number;
  absent: number;
  late: number;
}

interface UpcomingSession {
  id: string;
  date: string;
  time: string;
  title: string;
  coach: string;
  location: string;
}

interface ChildAttendanceProfile {
  id: string;
  name: string;
  age: number;
  studentCode: string;
  program: string;
  sport: string;
  branch: string;
  coach: string;
  attendanceRate: number;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  currentStreak: number;
  lastAbsentDate: string;
  nextSession: UpcomingSession;
  attendanceTrend: AttendanceTrendPoint[];
  records: AttendanceRecord[];
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

const attendanceProfiles: ChildAttendanceProfile[] = [
  {
    id: 'child-001',
    name: 'Omar Khaled',
    age: 9,
    studentCode: 'STU-1001',
    program: 'Football Development',
    sport: 'Football',
    branch: 'Dubai Main Branch',
    coach: 'Coach Omar',
    attendanceRate: 92,
    totalSessions: 28,
    presentCount: 24,
    absentCount: 2,
    lateCount: 1,
    excusedCount: 1,
    currentStreak: 8,
    lastAbsentDate: 'May 06, 2026',
    nextSession: {
      id: 'session-001',
      date: 'Today',
      time: '6:00 PM - 7:30 PM',
      title: 'Ball Control & Passing',
      coach: 'Coach Omar',
      location: 'Pitch A',
    },
    attendanceTrend: [
      { month: 'Jan', attendance: 82, present: 5, absent: 1, late: 1 },
      { month: 'Feb', attendance: 86, present: 6, absent: 1, late: 0 },
      { month: 'Mar', attendance: 88, present: 7, absent: 1, late: 0 },
      { month: 'Apr', attendance: 90, present: 8, absent: 1, late: 1 },
      { month: 'May', attendance: 92, present: 9, absent: 0, late: 1 },
      { month: 'Jun', attendance: 94, present: 8, absent: 0, late: 0 },
    ],
    records: [
      {
        id: 'att-001',
        date: '2026-06-02',
        month: 'June 2026',
        sessionTitle: 'Ball Control & Passing',
        program: 'Football Development',
        coach: 'Coach Omar',
        branch: 'Dubai Main Branch',
        time: '6:00 PM - 7:30 PM',
        location: 'Pitch A',
        status: 'present',
        checkInTime: '5:55 PM',
        note: 'Excellent focus and strong participation.',
      },
      {
        id: 'att-002',
        date: '2026-05-29',
        month: 'May 2026',
        sessionTitle: 'Match Simulation',
        program: 'Football Development',
        coach: 'Coach Omar',
        branch: 'Dubai Main Branch',
        time: '6:00 PM - 7:30 PM',
        location: 'Pitch B',
        status: 'present',
        checkInTime: '5:58 PM',
        note: 'Very good positioning during match drill.',
      },
      {
        id: 'att-003',
        date: '2026-05-24',
        month: 'May 2026',
        sessionTitle: 'Fitness & Stamina',
        program: 'Football Development',
        coach: 'Coach Omar',
        branch: 'Dubai Main Branch',
        time: '10:00 AM - 11:30 AM',
        location: 'Pitch A',
        status: 'late',
        checkInTime: '10:14 AM',
        note: 'Arrived late but completed the full session.',
      },
      {
        id: 'att-004',
        date: '2026-05-18',
        month: 'May 2026',
        sessionTitle: 'Passing Accuracy',
        program: 'Football Development',
        coach: 'Coach Omar',
        branch: 'Dubai Main Branch',
        time: '6:00 PM - 7:30 PM',
        location: 'Pitch A',
        status: 'present',
        checkInTime: '5:52 PM',
        note: 'Strong improvement in passing rhythm.',
      },
      {
        id: 'att-005',
        date: '2026-05-06',
        month: 'May 2026',
        sessionTitle: 'Tactical Awareness',
        program: 'Football Development',
        coach: 'Coach Omar',
        branch: 'Dubai Main Branch',
        time: '6:00 PM - 7:30 PM',
        location: 'Pitch A',
        status: 'absent',
        checkInTime: '—',
        note: 'Absent without recorded make-up request.',
      },
      {
        id: 'att-006',
        date: '2026-04-28',
        month: 'April 2026',
        sessionTitle: 'Team Play',
        program: 'Football Development',
        coach: 'Coach Omar',
        branch: 'Dubai Main Branch',
        time: '6:00 PM - 7:30 PM',
        location: 'Pitch B',
        status: 'excused',
        checkInTime: '—',
        note: 'Excused absence submitted by parent.',
      },
    ],
  },
  {
    id: 'child-002',
    name: 'Mariam Khaled',
    age: 7,
    studentCode: 'STU-1002',
    program: 'Swimming Academy',
    sport: 'Swimming',
    branch: 'Dubai Main Branch',
    coach: 'Coach Sara',
    attendanceRate: 86,
    totalSessions: 20,
    presentCount: 16,
    absentCount: 2,
    lateCount: 1,
    excusedCount: 1,
    currentStreak: 5,
    lastAbsentDate: 'May 11, 2026',
    nextSession: {
      id: 'session-002',
      date: 'Tomorrow',
      time: '5:30 PM - 6:30 PM',
      title: 'Breathing & Floating Control',
      coach: 'Coach Sara',
      location: 'Pool 2',
    },
    attendanceTrend: [
      { month: 'Jan', attendance: 76, present: 4, absent: 2, late: 0 },
      { month: 'Feb', attendance: 79, present: 5, absent: 1, late: 1 },
      { month: 'Mar', attendance: 82, present: 6, absent: 1, late: 0 },
      { month: 'Apr', attendance: 84, present: 6, absent: 1, late: 0 },
      { month: 'May', attendance: 86, present: 7, absent: 0, late: 1 },
      { month: 'Jun', attendance: 88, present: 6, absent: 0, late: 0 },
    ],
    records: [
      {
        id: 'att-101',
        date: '2026-06-03',
        month: 'June 2026',
        sessionTitle: 'Breathing Control',
        program: 'Swimming Academy',
        coach: 'Coach Sara',
        branch: 'Dubai Main Branch',
        time: '5:30 PM - 6:30 PM',
        location: 'Pool 2',
        status: 'present',
        checkInTime: '5:25 PM',
        note: 'Good confidence improvement.',
      },
      {
        id: 'att-102',
        date: '2026-05-27',
        month: 'May 2026',
        sessionTitle: 'Floating Practice',
        program: 'Swimming Academy',
        coach: 'Coach Sara',
        branch: 'Dubai Main Branch',
        time: '5:30 PM - 6:30 PM',
        location: 'Pool 2',
        status: 'late',
        checkInTime: '5:42 PM',
        note: 'Late arrival. Completed remaining practice.',
      },
      {
        id: 'att-103',
        date: '2026-05-20',
        month: 'May 2026',
        sessionTitle: 'Kick Technique',
        program: 'Swimming Academy',
        coach: 'Coach Sara',
        branch: 'Dubai Main Branch',
        time: '5:30 PM - 6:30 PM',
        location: 'Pool 2',
        status: 'present',
        checkInTime: '5:24 PM',
        note: 'Improved leg movement and balance.',
      },
      {
        id: 'att-104',
        date: '2026-05-11',
        month: 'May 2026',
        sessionTitle: 'Water Confidence',
        program: 'Swimming Academy',
        coach: 'Coach Sara',
        branch: 'Dubai Main Branch',
        time: '5:30 PM - 6:30 PM',
        location: 'Pool 2',
        status: 'absent',
        checkInTime: '—',
        note: 'Absent. Parent contacted academy.',
      },
    ],
  },
];

function formatStatusLabel(status: AttendanceStatus) {
  const labels: Record<AttendanceStatus, string> = {
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    excused: 'Excused',
  };

  return labels[status];
}

function getAttendanceHealthLabel(rate: number) {
  if (rate >= 90) return 'Excellent';
  if (rate >= 80) return 'Good';
  if (rate >= 70) return 'Needs Follow-up';

  return 'High Attention';
}

export default function AttendanceReportPage() {
  const { childId } = useParams();

  const child = useMemo(() => {
    return (
      attendanceProfiles.find((profile) => profile.id === childId) ??
      attendanceProfiles[0]!
    );
  }, [childId]);

  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus | 'all'>(
    'all',
  );

  const months = useMemo(() => {
    return Array.from(new Set(child.records.map((record) => record.month)));
  }, [child.records]);

  const filteredRecords = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return child.records.filter((record) => {
      const matchesSearch =
        !normalizedSearch ||
        record.sessionTitle.toLowerCase().includes(normalizedSearch) ||
        record.coach.toLowerCase().includes(normalizedSearch) ||
        record.branch.toLowerCase().includes(normalizedSearch) ||
        record.location.toLowerCase().includes(normalizedSearch) ||
        record.note.toLowerCase().includes(normalizedSearch);

      const matchesMonth =
        monthFilter === 'all' || record.month === monthFilter;

      const matchesStatus =
        statusFilter === 'all' || record.status === statusFilter;

      return matchesSearch && matchesMonth && matchesStatus;
    });
  }, [child.records, monthFilter, searchTerm, statusFilter]);

  const attendanceBreakdown = useMemo(() => {
    return [
      { name: 'Present', value: child.presentCount, color: chartColors.green },
      { name: 'Absent', value: child.absentCount, color: chartColors.red },
      { name: 'Late', value: child.lateCount, color: chartColors.orange },
      { name: 'Excused', value: child.excusedCount, color: chartColors.blue },
    ].filter((item) => item.value > 0);
  }, [child]);

  const needsFollowUp =
    child.absentCount > 0 || child.lateCount > 0 || child.attendanceRate < 85;

  const resetFilters = () => {
    setSearchTerm('');
    setMonthFilter('all');
    setStatusFilter('all');
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <CalendarCheck className="h-4 w-4" />
              Attendance Report
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {child.name}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Track attendance history, absences, late arrivals, excused
              sessions, upcoming classes, and attendance trend for{' '}
              {child.program} with {child.coach}.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/parent/children/${child.id}/progress`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Target className="h-4 w-4" />
                Progress Report
              </Link>

              <Link
                to="/parent/make-up-request"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                Request Make-up
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={CalendarCheck}
              label="Attendance Rate"
              value={`${child.attendanceRate}%`}
              caption={getAttendanceHealthLabel(child.attendanceRate)}
              positive={child.attendanceRate >= 80}
            />

            <HeroMetricCard
              icon={CheckCircle2}
              label="Present"
              value={`${child.presentCount}`}
              caption={`${child.totalSessions} total sessions`}
              positive
            />

            <HeroMetricCard
              icon={Clock3}
              label="Current Streak"
              value={`${child.currentStreak}`}
              caption="Consecutive attended sessions"
              positive={child.currentStreak >= 3}
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Needs Follow-up"
              value={needsFollowUp ? 'Yes' : 'No'}
              caption={needsFollowUp ? 'Review absences or lateness' : 'Attendance is stable'}
              positive={!needsFollowUp}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={CheckCircle2}
          title="Present"
          value={`${child.presentCount}`}
          description="Sessions attended successfully."
          tone="success"
        />

        <KpiCard
          icon={XCircle}
          title="Absent"
          value={`${child.absentCount}`}
          description={`Last absence: ${child.lastAbsentDate}.`}
          tone={child.absentCount > 0 ? 'danger' : 'success'}
        />

        <KpiCard
          icon={CircleDashed}
          title="Late"
          value={`${child.lateCount}`}
          description="Sessions where check-in was later than scheduled."
          tone={child.lateCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={ShieldCheck}
          title="Excused"
          value={`${child.excusedCount}`}
          description="Approved absence records submitted by parent."
          tone="blue"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={TrendingUp}
              title="Monthly Attendance Trend"
              description="Attendance rate movement across recent months."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={child.attendanceTrend}>
                    <defs>
                      <linearGradient
                        id="attendanceReportGradient"
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
                      fill="url(#attendanceReportGradient)"
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Activity}
              title="Attendance Breakdown"
              description="Distribution of present, absent, late, and excused records."
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
                      total={child.totalSessions}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <ChartCard
            icon={BarChart3}
            title="Monthly Session Summary"
            description="Present, absent, and late records by month."
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={child.attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />

                  <Bar
                    dataKey="present"
                    fill={chartColors.green}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="absent"
                    fill={chartColors.red}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="late"
                    fill={chartColors.orange}
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
                  <FileText className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Attendance Records
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter attendance history by month, status, coach,
                  session, or note.
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                <Filter className="h-4 w-4" />
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
                    placeholder="Search session, coach, branch, note..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Month"
                value={monthFilter}
                options={[
                  { label: 'All months', value: 'all' },
                  ...months.map((month) => ({
                    label: month,
                    value: month,
                  })),
                ]}
                onChange={setMonthFilter}
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Present', value: 'present' },
                  { label: 'Absent', value: 'absent' },
                  { label: 'Late', value: 'late' },
                  { label: 'Excused', value: 'excused' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as AttendanceStatus | 'all')
                }
              />
            </div>

            <div className="mt-6 hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1050px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/60 text-start">
                    <TableHead>Date</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Coach</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Note</TableHead>
                  </tr>
                </thead>

                <tbody>
                  {filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-border last:border-b-0 hover:bg-secondary/35"
                    >
                      <TableCell>
                        <div>
                          <p className="font-black">{record.date}</p>
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {record.month}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-black">{record.sessionTitle}</p>
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {record.program}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>{record.coach}</TableCell>

                      <TableCell>
                        <div>
                          <p className="font-black">{record.time}</p>
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            Check-in: {record.checkInTime}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>{record.location}</TableCell>

                      <TableCell>
                        <AttendanceStatusBadge status={record.status} />
                      </TableCell>

                      <TableCell>
                        <p className="max-w-xs text-sm font-semibold leading-6 text-muted-foreground">
                          {record.note}
                        </p>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-4 xl:hidden">
              {filteredRecords.map((record) => (
                <AttendanceRecordCard key={record.id} record={record} />
              ))}
            </div>

            {filteredRecords.length === 0 ? <EmptyState /> : null}
          </section>
        </div>

        <aside className="space-y-6">
          <ChildAttendancePanel child={child} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Next Session</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upcoming training session details.
                </p>
              </div>

              <CalendarDays className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <NextSessionCard session={child.nextSession} />
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Parent Attention</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Important attendance notes.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {needsFollowUp ? (
                <>
                  {child.absentCount > 0 ? (
                    <AttentionRow
                      icon={XCircle}
                      title="Absence follow-up"
                      description={`${child.absentCount} absence record(s). Last absence: ${child.lastAbsentDate}.`}
                      tone="danger"
                    />
                  ) : null}

                  {child.lateCount > 0 ? (
                    <AttentionRow
                      icon={Clock3}
                      title="Late arrival"
                      description={`${child.lateCount} late arrival record(s). Please keep session timing consistent.`}
                      tone="warning"
                    />
                  ) : null}

                  {child.attendanceRate < 85 ? (
                    <AttentionRow
                      icon={AlertTriangle}
                      title="Attendance below target"
                      description="Attendance rate is below the recommended 85% threshold."
                      tone="warning"
                    />
                  ) : null}
                </>
              ) : (
                <AttentionRow
                  icon={ShieldCheck}
                  title="Attendance stable"
                  description="No urgent attendance concern detected for this child."
                  tone="success"
                />
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful shortcuts for attendance follow-up.
                </p>
              </div>

              <Star className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={Eye}
                title="Child Profile"
                description="Open full child profile and enrollment details."
                href={`/parent/children/${child.id}`}
              />

              <QuickAction
                icon={Target}
                title="Progress Report"
                description="Review progress and skill development."
                href={`/parent/children/${child.id}/progress`}
              />

              <QuickAction
                icon={RefreshCw}
                title="Make-up Request"
                description="Request a replacement session if eligible."
                href="/parent/make-up-request"
              />

              <QuickAction
                icon={MessageSquare}
                title="Message Academy"
                description="Contact coach or academy team."
                href="/parent/messages"
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

function ChildAttendancePanel({
  child,
}: {
  child: ChildAttendanceProfile;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <UserRound className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Attendance Summary
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">{child.name}</h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {child.program} · {child.coach} · {child.branch}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
            {child.attendanceRate}% Attendance
          </span>

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {child.currentStreak} streak
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={Users}
          label="Student Code"
          value={child.studentCode}
        />

        <DetailLine
          icon={Trophy}
          label="Sport / Program"
          value={`${child.sport} · ${child.program}`}
        />

        <DetailLine
          icon={CalendarCheck}
          label="Total Sessions"
          value={`${child.totalSessions}`}
        />

        <DetailLine
          icon={CheckCircle2}
          label="Present Records"
          value={`${child.presentCount}`}
        />

        <DetailLine
          icon={XCircle}
          label="Absent Records"
          value={`${child.absentCount}`}
        />

        <DetailLine
          icon={Clock3}
          label="Late Records"
          value={`${child.lateCount}`}
        />

        <DetailLine
          icon={MapPin}
          label="Branch"
          value={child.branch}
        />
      </div>
    </aside>
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

function AttendanceRecordCard({ record }: { record: AttendanceRecord }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">{record.sessionTitle}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {record.date} · {record.time}
          </p>
        </div>

        <AttendanceStatusBadge status={record.status} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoLine label="Coach" value={record.coach} />
        <InfoLine label="Location" value={record.location} />
        <InfoLine label="Check-in" value={record.checkInTime} />
        <InfoLine label="Month" value={record.month} />
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-muted-foreground">
        {record.note}
      </p>
    </article>
  );
}

function NextSessionCard({ session }: { session: UpcomingSession }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 transition hover:border-brand-yellow hover:bg-brand-yellow/5 dark:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <CalendarDays className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{session.title}</p>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {session.date} · {session.time}
          </p>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {session.coach} · {session.location}
          </p>
        </div>
      </div>
    </article>
  );
}

function AttentionRow({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: 'success' | 'warning' | 'danger';
}) {
  const className =
    tone === 'success'
      ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
      : tone === 'warning'
        ? 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-blue dark:text-brand-yellow'
        : 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300';

  return (
    <article className={`rounded-2xl border p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-black">{title}</p>
          <p className="mt-1 text-xs font-semibold leading-5">{description}</p>
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

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-black">{value}</p>
    </div>
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

function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) {
  const className =
    status === 'present'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'absent'
        ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
        : status === 'late'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {formatStatusLabel(status)}
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
    <div className="mt-6 rounded-[2rem] border border-border bg-background p-8 text-center dark:bg-white/[0.04]">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <FileText className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No attendance records found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, month filter, or attendance status.
      </p>
    </div>
  );
}