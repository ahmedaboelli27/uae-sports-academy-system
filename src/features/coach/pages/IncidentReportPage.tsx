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
  Dumbbell,
  Eye,
  FileText,
  Filter,
  MapPin,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  Users,
  Zap,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  CoachIncidentReportDto,
  CoachIncidentSeverity,
  CoachIncidentStatus,
  CoachIncidentType,
  CoachSessionDto,
} from '@/features/coach/types/coach.dto';

interface IncidentSessionView extends CoachSessionDto {
  date: string;
  location: string;
}

type IncidentReportWithRelations = CoachIncidentReportDto & {
  student: CoachAssignedPlayerDto;
  session: IncidentSessionView;
};

function getIncidentTypeLabel(type: CoachIncidentType) {
  const labels: Record<CoachIncidentType, string> = {
    safety: 'Safety',
    behavior: 'Behavior',
    attendance: 'Attendance',
    equipment: 'Equipment',
    medical: 'Medical',
    other: 'Other',
  };

  return labels[type];
}

function getSeverityLabel(severity: CoachIncidentSeverity) {
  const labels: Record<CoachIncidentSeverity, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return labels[severity];
}

function getStatusLabel(status: CoachIncidentStatus) {
  const labels: Record<CoachIncidentStatus, string> = {
    open: 'Open',
    underReview: 'Under Review',
    resolved: 'Resolved',
    closed: 'Closed',
  };

  return labels[status];
}

function getStudentLevelLabel(level: string) {
  return level || 'Not specified';
}

function getSessionDate(session: CoachSessionDto) {
  if (session.id === 'session-001') return '2026-06-02';
  if (session.id === 'session-002') return '2026-06-03';
  if (session.id === 'session-003') return '2026-06-04';

  return '2026-06-05';
}

function buildIncidentSessions(sessions: CoachSessionDto[]): IncidentSessionView[] {
  return sessions.map((session) => ({
    ...session,
    date: getSessionDate(session),
    location: session.court,
  }));
}

export default function IncidentReportPage() {
  const [searchParams] = useSearchParams();

  const chartColors = useMemo(() => coachDataService.getChartColors(), []);
  const currentCoach = useMemo(() => coachDataService.getCurrentCoach(), []);
  const assignedStudentsOnly = useMemo(
    () => coachDataService.getAssignedPlayers(),
    [],
  );
  const coachSessionsOnly = useMemo(
    () => buildIncidentSessions(coachDataService.getTodaySessions()),
    [],
  );

  const playerIdFromUrl = searchParams.get('playerId');
  const sessionIdFromUrl = searchParams.get('sessionId');

  const [incidents, setIncidents] = useState<CoachIncidentReportDto[]>(() =>
    coachDataService.getIncidentReports(),
  );

  const [selectedStudentId, setSelectedStudentId] = useState(
    playerIdFromUrl &&
      assignedStudentsOnly.some((student) => student.id === playerIdFromUrl)
      ? playerIdFromUrl
      : assignedStudentsOnly[0]?.id ?? '',
  );

  const [selectedSessionId, setSelectedSessionId] = useState(
    sessionIdFromUrl &&
      coachSessionsOnly.some((session) => session.id === sessionIdFromUrl)
      ? sessionIdFromUrl
      : coachSessionsOnly[0]?.id ?? '',
  );

  const [incidentType, setIncidentType] =
    useState<CoachIncidentType>('safety');
  const [severity, setSeverity] = useState<CoachIncidentSeverity>('low');
  const [status, setStatus] = useState<CoachIncidentStatus>('open');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [immediateAction, setImmediateAction] = useState('');
  const [adminNotified, setAdminNotified] = useState(true);
  const [parentFollowUpRequired, setParentFollowUpRequired] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [studentFilter, setStudentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<CoachIncidentType | 'all'>(
    'all',
  );
  const [severityFilter, setSeverityFilter] = useState<
    CoachIncidentSeverity | 'all'
  >('all');
  const [statusFilter, setStatusFilter] = useState<
    CoachIncidentStatus | 'all'
  >('all');

  const [selectedIncidentId, setSelectedIncidentId] = useState(
    incidents[0]?.id ?? '',
  );

  const selectedStudent =
    assignedStudentsOnly.find((student) => student.id === selectedStudentId) ??
    assignedStudentsOnly[0];

  const selectedSession =
    coachSessionsOnly.find((session) => session.id === selectedSessionId) ??
    coachSessionsOnly[0];

  const enrichedIncidents = useMemo(() => {
    return incidents
      .map((incident) => {
        const student = assignedStudentsOnly.find(
          (item) => item.id === incident.studentId,
        );

        const session = coachSessionsOnly.find(
          (item) => item.id === incident.sessionId,
        );

        if (!student || !session) return null;

        return {
          ...incident,
          student,
          session,
        };
      })
      .filter(Boolean) as IncidentReportWithRelations[];
  }, [assignedStudentsOnly, coachSessionsOnly, incidents]);

  const filteredIncidents = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return enrichedIncidents.filter((incident) => {
      const matchesSearch =
        !normalizedSearch ||
        incident.title.toLowerCase().includes(normalizedSearch) ||
        incident.description.toLowerCase().includes(normalizedSearch) ||
        incident.immediateAction.toLowerCase().includes(normalizedSearch) ||
        incident.resolutionNote.toLowerCase().includes(normalizedSearch) ||
        incident.student.name.toLowerCase().includes(normalizedSearch) ||
        incident.student.group.toLowerCase().includes(normalizedSearch) ||
        incident.session.title.toLowerCase().includes(normalizedSearch) ||
        getIncidentTypeLabel(incident.type)
          .toLowerCase()
          .includes(normalizedSearch) ||
        getSeverityLabel(incident.severity)
          .toLowerCase()
          .includes(normalizedSearch) ||
        getStatusLabel(incident.status).toLowerCase().includes(normalizedSearch);

      const matchesStudent =
        studentFilter === 'all' || incident.studentId === studentFilter;

      const matchesType = typeFilter === 'all' || incident.type === typeFilter;

      const matchesSeverity =
        severityFilter === 'all' || incident.severity === severityFilter;

      const matchesStatus =
        statusFilter === 'all' || incident.status === statusFilter;

      return (
        matchesSearch &&
        matchesStudent &&
        matchesType &&
        matchesSeverity &&
        matchesStatus
      );
    });
  }, [
    enrichedIncidents,
    searchTerm,
    severityFilter,
    statusFilter,
    studentFilter,
    typeFilter,
  ]);

  const selectedIncident =
    enrichedIncidents.find((incident) => incident.id === selectedIncidentId) ??
    filteredIncidents[0] ??
    enrichedIncidents[0];

  const summary = useMemo(() => {
    const total = enrichedIncidents.length;

    const openCount = enrichedIncidents.filter(
      (incident) =>
        incident.status === 'open' || incident.status === 'underReview',
    ).length;

    const highPriorityCount = enrichedIncidents.filter(
      (incident) => incident.severity === 'high',
    ).length;

    const resolvedCount = enrichedIncidents.filter(
      (incident) =>
        incident.status === 'resolved' || incident.status === 'closed',
    ).length;

    const parentFollowUpCount = enrichedIncidents.filter(
      (incident) => incident.parentFollowUpRequired,
    ).length;

    return {
      total,
      openCount,
      highPriorityCount,
      resolvedCount,
      parentFollowUpCount,
    };
  }, [enrichedIncidents]);

  const monthlyIncidentTrend = useMemo(() => {
    return [
      { month: 'Jan', incidents: 1, open: 0 },
      { month: 'Feb', incidents: 1, open: 0 },
      { month: 'Mar', incidents: 2, open: 1 },
      { month: 'Apr', incidents: 2, open: 1 },
      { month: 'May', incidents: Math.max(summary.total - 1, 0), open: 1 },
      { month: 'Jun', incidents: summary.total, open: summary.openCount },
    ];
  }, [summary.openCount, summary.total]);

  const severityBreakdown = useMemo(() => {
    const severities: CoachIncidentSeverity[] = ['low', 'medium', 'high'];

    return severities
      .map((item) => ({
        name: getSeverityLabel(item),
        value: enrichedIncidents.filter(
          (incident) => incident.severity === item,
        ).length,
        color:
          item === 'high'
            ? chartColors.red
            : item === 'medium'
              ? chartColors.orange
              : chartColors.green,
      }))
      .filter((item) => item.value > 0);
  }, [chartColors, enrichedIncidents]);

  const typeBreakdown = useMemo(() => {
    const types: CoachIncidentType[] = [
      'safety',
      'behavior',
      'attendance',
      'equipment',
      'medical',
      'other',
    ];

    return types
      .map((item) => ({
        name: getIncidentTypeLabel(item),
        value: enrichedIncidents.filter((incident) => incident.type === item)
          .length,
        color:
          item === 'safety'
            ? chartColors.blue
            : item === 'behavior'
              ? chartColors.orange
              : item === 'attendance'
                ? chartColors.yellow
                : item === 'equipment'
                  ? chartColors.purple
                  : item === 'medical'
                    ? chartColors.red
                    : chartColors.slate,
      }))
      .filter((item) => item.value > 0);
  }, [chartColors, enrichedIncidents]);

  const incidentsByStudent = useMemo(() => {
    return assignedStudentsOnly.map((student) => ({
      name: student.name.split(' ')[0],
      incidents: enrichedIncidents.filter(
        (incident) => incident.studentId === student.id,
      ).length,
      open: enrichedIncidents.filter(
        (incident) =>
          incident.studentId === student.id &&
          (incident.status === 'open' || incident.status === 'underReview'),
      ).length,
    }));
  }, [assignedStudentsOnly, enrichedIncidents]);

  const resetFilters = () => {
    setSearchTerm('');
    setStudentFilter('all');
    setTypeFilter('all');
    setSeverityFilter('all');
    setStatusFilter('all');
  };

  const clearForm = () => {
    setSelectedStudentId(assignedStudentsOnly[0]?.id ?? '');
    setSelectedSessionId(coachSessionsOnly[0]?.id ?? '');
    setIncidentType('safety');
    setSeverity('low');
    setStatus('open');
    setTitle('');
    setDescription('');
    setImmediateAction('');
    setAdminNotified(true);
    setParentFollowUpRequired(false);
    setSavedMessage('');
  };

  const saveIncident = () => {
    if (
      !selectedStudent ||
      !selectedSession ||
      !title.trim() ||
      !description.trim() ||
      !immediateAction.trim()
    ) {
      setSavedMessage(
        'Please select a student/session and complete the title, description, and immediate action.',
      );
      return;
    }

    const newIncident: CoachIncidentReportDto = {
      id: `incident-${Date.now()}`,
      studentId: selectedStudent.id,
      sessionId: selectedSession.id,
      coachId: currentCoach.id,
      date: '2026-06-05',
      type: incidentType,
      severity,
      status,
      title: title.trim(),
      description: description.trim(),
      immediateAction: immediateAction.trim(),
      adminNotified,
      parentFollowUpRequired,
      reviewedByAdmin: false,
      resolutionNote: 'Pending admin review.',
    };

    setIncidents((current) => [newIncident, ...current]);
    setSelectedIncidentId(newIncident.id);
    setSavedMessage(
      'Incident report saved locally. Backend incident-report endpoint will be connected later.',
    );

    setTitle('');
    setDescription('');
    setImmediateAction('');
    setParentFollowUpRequired(false);
  };

  if (!selectedStudent || !selectedSession) {
    return (
      <main className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-black">No assigned data</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No assigned students or sessions are currently available for this coach.
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
              <ShieldCheck className="h-4 w-4" />
              Coach Incident Reporting
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Incident Report
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Report and monitor safety, behavior, attendance, equipment, or
              training concerns for students and sessions assigned to your coach
              account only.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveIncident}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Report
              </button>

              <Link
                to="/coach/players"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Users className="h-4 w-4" />
                Assigned Students
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={FileText}
              label="Total Reports"
              value={`${summary.total}`}
              caption="Reports in your coach scope"
              positive
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Open"
              value={`${summary.openCount}`}
              caption="Open or under review"
              positive={summary.openCount === 0}
            />

            <HeroMetricCard
              icon={ShieldCheck}
              label="High Priority"
              value={`${summary.highPriorityCount}`}
              caption="High severity reports"
              positive={summary.highPriorityCount === 0}
            />

            <HeroMetricCard
              icon={CheckCircle2}
              label="Resolved"
              value={`${summary.resolvedCount}`}
              caption="Resolved or closed"
              positive
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={FileText}
          title="Total Reports"
          value={`${summary.total}`}
          description="Incident reports submitted by this coach."
          tone="blue"
        />

        <KpiCard
          icon={AlertTriangle}
          title="Open / Review"
          value={`${summary.openCount}`}
          description="Reports still open or under review."
          tone={summary.openCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={ShieldCheck}
          title="High Priority"
          value={`${summary.highPriorityCount}`}
          description="Reports marked as high severity."
          tone={summary.highPriorityCount > 0 ? 'danger' : 'success'}
        />

        <KpiCard
          icon={MessageSquare}
          title="Parent Follow-up"
          value={`${summary.parentFollowUpCount}`}
          description="Reports that require parent follow-up."
          tone={summary.parentFollowUpCount > 0 ? 'warning' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <PlusCircle className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  New Incident Report
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Submit a report for one of your assigned students and sessions.
                </p>
              </div>

              <button
                type="button"
                onClick={clearForm}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                <RefreshCw className="h-4 w-4" />
                Clear Form
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <FilterSelect
                label="Student"
                value={selectedStudentId}
                options={assignedStudentsOnly.map((student) => ({
                  label: student.name,
                  value: student.id,
                }))}
                onChange={setSelectedStudentId}
              />

              <FilterSelect
                label="Session"
                value={selectedSessionId}
                options={coachSessionsOnly.map((session) => ({
                  label: `${session.title} · ${session.time}`,
                  value: session.id,
                }))}
                onChange={setSelectedSessionId}
              />

              <FilterSelect
                label="Type"
                value={incidentType}
                options={[
                  { label: 'Safety', value: 'safety' },
                  { label: 'Behavior', value: 'behavior' },
                  { label: 'Attendance', value: 'attendance' },
                  { label: 'Equipment', value: 'equipment' },
                  { label: 'Medical', value: 'medical' },
                  { label: 'Other', value: 'other' },
                ]}
                onChange={(value) =>
                  setIncidentType(value as CoachIncidentType)
                }
              />

              <FilterSelect
                label="Severity"
                value={severity}
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
                onChange={(value) =>
                  setSeverity(value as CoachIncidentSeverity)
                }
              />

              <FilterSelect
                label="Status"
                value={status}
                options={[
                  { label: 'Open', value: 'open' },
                  { label: 'Under Review', value: 'underReview' },
                  { label: 'Resolved', value: 'resolved' },
                  { label: 'Closed', value: 'closed' },
                ]}
                onChange={(value) => setStatus(value as CoachIncidentStatus)}
              />

              <div className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
                <p className="mb-3 text-sm font-black">Notifications</p>

                <div className="flex flex-wrap gap-2">
                  <TogglePill
                    active={adminNotified}
                    label="Notify Admin"
                    onClick={() => setAdminNotified((current) => !current)}
                  />

                  <TogglePill
                    active={parentFollowUpRequired}
                    label="Parent Follow-up"
                    onClick={() =>
                      setParentFollowUpRequired((current) => !current)
                    }
                  />
                </div>
              </div>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">Report Title</span>

              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Student needed behavior follow-up during drill"
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">Description</span>

              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what happened clearly and professionally..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">
                Immediate Action Taken
              </span>

              <textarea
                value={immediateAction}
                onChange={(event) => setImmediateAction(event.target.value)}
                placeholder="Write what action was taken immediately..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={saveIncident}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Incident Report
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Incident Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter reports by student, session, type, severity,
                  status, description, or action taken.
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

            <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(4,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Search</span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search incident, student, session, action..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Student"
                value={studentFilter}
                options={[
                  { label: 'All students', value: 'all' },
                  ...assignedStudentsOnly.map((student) => ({
                    label: student.name,
                    value: student.id,
                  })),
                ]}
                onChange={setStudentFilter}
              />

              <FilterSelect
                label="Type"
                value={typeFilter}
                options={[
                  { label: 'All types', value: 'all' },
                  { label: 'Safety', value: 'safety' },
                  { label: 'Behavior', value: 'behavior' },
                  { label: 'Attendance', value: 'attendance' },
                  { label: 'Equipment', value: 'equipment' },
                  { label: 'Medical', value: 'medical' },
                  { label: 'Other', value: 'other' },
                ]}
                onChange={(value) =>
                  setTypeFilter(value as CoachIncidentType | 'all')
                }
              />

              <FilterSelect
                label="Severity"
                value={severityFilter}
                options={[
                  { label: 'All severities', value: 'all' },
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
                onChange={(value) =>
                  setSeverityFilter(value as CoachIncidentSeverity | 'all')
                }
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Open', value: 'open' },
                  { label: 'Under Review', value: 'underReview' },
                  { label: 'Resolved', value: 'resolved' },
                  { label: 'Closed', value: 'closed' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as CoachIncidentStatus | 'all')
                }
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                active={selectedIncident?.id === incident.id}
                onSelect={() => setSelectedIncidentId(incident.id)}
              />
            ))}

            {filteredIncidents.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Monthly Incident Trend"
              description="Incident reports and open cases across recent months."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyIncidentTrend}>
                    <defs>
                      <linearGradient
                        id="incidentTrendGradient"
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
                      dataKey="incidents"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#incidentTrendGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="open"
                      stroke={chartColors.orange}
                      strokeWidth={4}
                      fill="transparent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Activity}
              title="Incidents by Severity"
              description="Distribution of reports by severity level."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {severityBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {severityBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={enrichedIncidents.length}
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
              title="Incidents by Type"
              description="Distribution of reports by incident category."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {typeBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {typeBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={enrichedIncidents.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard
              icon={Users}
              title="Incidents by Student"
              description="Total and open incident reports by assigned student."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={incidentsByStudent}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Bar
                      dataKey="incidents"
                      fill={chartColors.blue}
                      radius={[10, 10, 0, 0]}
                    />

                    <Bar
                      dataKey="open"
                      fill={chartColors.orange}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>
        </div>

        <aside className="space-y-6">
          {selectedIncident ? (
            <SelectedIncidentPanel incident={selectedIncident} />
          ) : null}

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Open Follow-up</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reports that still need review or follow-up.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {enrichedIncidents
                .filter(
                  (incident) =>
                    incident.status === 'open' ||
                    incident.status === 'underReview' ||
                    incident.parentFollowUpRequired,
                )
                .map((incident) => (
                  <FollowUpRow key={incident.id} incident={incident} />
                ))}

              {summary.openCount === 0 && summary.parentFollowUpCount === 0 ? (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-bold text-green-700 dark:text-green-300">
                  No open incident follow-up is currently required.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Coach shortcuts for incident follow-up.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={UserRound}
                title="Student Profile"
                description="Open selected student profile."
                href={`/coach/players/${selectedStudent.id}`}
              />

              <QuickAction
                icon={MessageSquare}
                title="Message Admin"
                description="Contact academy administration."
                href={`/coach/messages?playerId=${selectedStudent.id}`}
              />

              <QuickAction
                icon={ClipboardCheck}
                title="Attendance"
                description="Open attendance page."
                href={`/coach/attendance?playerId=${selectedStudent.id}`}
              />

              <QuickAction
                icon={FileText}
                title="Progress Notes"
                description="Add a coach note."
                href={`/coach/progress-notes?playerId=${selectedStudent.id}`}
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

function IncidentCard({
  incident,
  active,
  onSelect,
}: {
  incident: IncidentReportWithRelations;
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
      <div className="mb-4 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black">{incident.title}</h3>

              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {incident.student.name} · {incident.session.title}
              </p>

              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {incident.date} · {incident.session.location}
              </p>
            </div>

            <SeverityBadge severity={incident.severity} />
          </div>
        </div>
      </div>

      <p className="line-clamp-3 text-sm font-semibold leading-6 text-muted-foreground">
        {incident.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <IncidentTypeBadge type={incident.type} />
        <IncidentStatusBadge status={incident.status} />

        {incident.parentFollowUpRequired ? (
          <span className="inline-flex rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
            Parent Follow-up
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/coach/players/${incident.studentId}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-black transition hover:bg-secondary"
        >
          <Eye className="h-4 w-4" />
          Student
        </Link>

        <Link
          to={`/coach/messages?playerId=${incident.studentId}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
        >
          <MessageSquare className="h-4 w-4" />
          Message
        </Link>
      </div>
    </article>
  );
}

function SelectedIncidentPanel({
  incident,
}: {
  incident: IncidentReportWithRelations;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Incident
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {incident.title}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {incident.student.name} · {getIncidentTypeLabel(incident.type)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SeverityBadge severity={incident.severity} />
          <IncidentStatusBadge status={incident.status} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={UserRound} label="Student" value={incident.student.name} />
        <DetailLine
          icon={Dumbbell}
          label="Student Level"
          value={`${getStudentLevelLabel(incident.student.level)} · ${incident.student.group}`}
        />
        <DetailLine icon={CalendarDays} label="Date" value={incident.date} />
        <DetailLine icon={CalendarCheck} label="Session" value={incident.session.title} />
        <DetailLine icon={MapPin} label="Location" value={incident.session.location} />
        <DetailLine icon={Target} label="Type" value={getIncidentTypeLabel(incident.type)} />
        <DetailLine icon={AlertTriangle} label="Severity" value={getSeverityLabel(incident.severity)} />
        <DetailLine icon={Activity} label="Status" value={getStatusLabel(incident.status)} />
        <DetailLine icon={FileText} label="Description" value={incident.description} />
        <DetailLine icon={Zap} label="Immediate Action" value={incident.immediateAction} />
        <DetailLine icon={CheckCircle2} label="Resolution Note" value={incident.resolutionNote} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/coach/players/${incident.studentId}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <UserRound className="h-4 w-4" />
            Student
          </Link>

          <Link
            to={`/coach/messages?playerId=${incident.studentId}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <MessageSquare className="h-4 w-4" />
            Message
          </Link>
        </div>
      </div>
    </aside>
  );
}

function FollowUpRow({ incident }: { incident: IncidentReportWithRelations }) {
  return (
    <Link
      to={`/coach/players/${incident.studentId}`}
      className="block rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue transition hover:-translate-y-0.5 hover:bg-brand-yellow/20 dark:text-brand-yellow"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-black">
            {incident.student.name} · {incident.title}
          </p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {getStatusLabel(incident.status)} · {incident.resolutionNote}
          </p>
        </div>
      </div>
    </Link>
  );
}

function TogglePill({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex h-9 items-center justify-center rounded-full border px-3 text-xs font-black transition',
        active
          ? 'border-brand-yellow bg-brand-yellow text-brand-blue'
          : 'border-border bg-card hover:border-brand-yellow hover:bg-brand-yellow/10',
      ].join(' ')}
    >
      {label}
    </button>
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
        {percentage}% of reports
      </p>
    </div>
  );
}

function IncidentTypeBadge({ type }: { type: CoachIncidentType }) {
  return (
    <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
      {getIncidentTypeLabel(type)}
    </span>
  );
}

function SeverityBadge({ severity }: { severity: CoachIncidentSeverity }) {
  const className =
    severity === 'high'
      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
      : severity === 'medium'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getSeverityLabel(severity)}
    </span>
  );
}

function IncidentStatusBadge({ status }: { status: CoachIncidentStatus }) {
  const className =
    status === 'resolved' || status === 'closed'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'underReview'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
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
        <ShieldCheck className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No incident reports found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, student, type, severity, or status filter.
      </p>
    </div>
  );
}