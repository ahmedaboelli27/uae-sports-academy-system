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
  Star,
  Target,
  Trophy,
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
  CoachNotePriority,
  CoachNoteType,
  CoachNoteVisibility,
  CoachProgressNoteDto,
  CoachSessionDto,
} from '@/features/coach/types/coach.dto';

type ProgressNoteWithRelations = CoachProgressNoteDto & {
  student: CoachAssignedPlayerDto;
  session: CoachSessionDto;
};

function getNoteTypeLabel(type: CoachNoteType) {
  const labels: Record<CoachNoteType, string> = {
    development: 'Development',
    skill: 'Skill',
    attendance: 'Attendance',
    behavior: 'Behavior',
    followUp: 'Follow-up',
  };

  return labels[type];
}

function getPriorityLabel(priority: CoachNotePriority) {
  const labels: Record<CoachNotePriority, string> = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };

  return labels[priority];
}

function getVisibilityLabel(visibility: CoachNoteVisibility) {
  const labels: Record<CoachNoteVisibility, string> = {
    coachOnly: 'Coach Only',
    adminParent: 'Admin / Parent',
  };

  return labels[visibility];
}

export default function ProgressNotesPage() {
  const [searchParams] = useSearchParams();

  const chartColors = useMemo(() => coachDataService.getChartColors(), []);
  const currentCoach = useMemo(() => coachDataService.getCurrentCoach(), []);
  const assignedStudentsOnly = useMemo(
    () => coachDataService.getAssignedPlayers(),
    [],
  );
  const coachSessionsOnly = useMemo(() => coachDataService.getTodaySessions(), []);

  const playerIdFromUrl = searchParams.get('playerId');
  const sessionIdFromUrl = searchParams.get('sessionId');

  const [notes, setNotes] = useState<CoachProgressNoteDto[]>(() =>
    coachDataService.getProgressNotes(),
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

  const [noteType, setNoteType] = useState<CoachNoteType>('development');
  const [priority, setPriority] = useState<CoachNotePriority>('medium');
  const [visibility, setVisibility] =
    useState<CoachNoteVisibility>('adminParent');
  const [rating, setRating] = useState(4);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteText, setNoteText] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [studentFilter, setStudentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<CoachNoteType | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<
    CoachNotePriority | 'all'
  >('all');
  const [followUpFilter, setFollowUpFilter] = useState<'all' | 'yes' | 'no'>(
    'all',
  );

  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id ?? '');

  const selectedStudent =
    assignedStudentsOnly.find((student) => student.id === selectedStudentId) ??
    assignedStudentsOnly[0];

  const selectedSession =
    coachSessionsOnly.find((session) => session.id === selectedSessionId) ??
    coachSessionsOnly[0];

  const enrichedNotes = useMemo(() => {
    return notes
      .map((note) => {
        const student = assignedStudentsOnly.find(
          (item) => item.id === note.studentId,
        );

        const session = coachSessionsOnly.find(
          (item) => item.id === note.sessionId,
        );

        if (!student || !session) return null;

        return {
          ...note,
          student,
          session,
        };
      })
      .filter(Boolean) as ProgressNoteWithRelations[];
  }, [assignedStudentsOnly, coachSessionsOnly, notes]);

  const filteredNotes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return enrichedNotes.filter((note) => {
      const matchesSearch =
        !normalizedSearch ||
        note.title.toLowerCase().includes(normalizedSearch) ||
        note.note.toLowerCase().includes(normalizedSearch) ||
        note.recommendation.toLowerCase().includes(normalizedSearch) ||
        note.student.name.toLowerCase().includes(normalizedSearch) ||
        note.student.group.toLowerCase().includes(normalizedSearch) ||
        note.session.title.toLowerCase().includes(normalizedSearch) ||
        getNoteTypeLabel(note.type).toLowerCase().includes(normalizedSearch);

      const matchesStudent =
        studentFilter === 'all' || note.studentId === studentFilter;

      const matchesType = typeFilter === 'all' || note.type === typeFilter;

      const matchesPriority =
        priorityFilter === 'all' || note.priority === priorityFilter;

      const matchesFollowUp =
        followUpFilter === 'all' ||
        (followUpFilter === 'yes' && note.followUpRequired) ||
        (followUpFilter === 'no' && !note.followUpRequired);

      return (
        matchesSearch &&
        matchesStudent &&
        matchesType &&
        matchesPriority &&
        matchesFollowUp
      );
    });
  }, [
    enrichedNotes,
    followUpFilter,
    priorityFilter,
    searchTerm,
    studentFilter,
    typeFilter,
  ]);

  const selectedNote =
    enrichedNotes.find((note) => note.id === selectedNoteId) ??
    filteredNotes[0] ??
    enrichedNotes[0];

  const summary = useMemo(() => {
    const total = enrichedNotes.length;

    const thisMonth = enrichedNotes.filter((note) =>
      note.date.startsWith('2026-06'),
    ).length;

    const followUp = enrichedNotes.filter((note) => note.followUpRequired).length;

    const studentsWithNotes = new Set(enrichedNotes.map((note) => note.studentId));

    const studentsNeedingNotes = assignedStudentsOnly.filter(
      (student) =>
        student.status === 'needsFollowUp' || !studentsWithNotes.has(student.id),
    ).length;

    const averageRating = total
      ? Math.round(
        (enrichedNotes.reduce((sum, note) => sum + note.rating, 0) / total) *
        10,
      ) / 10
      : 0;

    return {
      total,
      thisMonth,
      followUp,
      studentsNeedingNotes,
      averageRating,
    };
  }, [assignedStudentsOnly, enrichedNotes]);

  const typeBreakdown = useMemo(() => {
    const types: CoachNoteType[] = [
      'development',
      'skill',
      'attendance',
      'behavior',
      'followUp',
    ];

    return types
      .map((type) => ({
        name: getNoteTypeLabel(type),
        value: enrichedNotes.filter((note) => note.type === type).length,
        color:
          type === 'development'
            ? chartColors.blue
            : type === 'skill'
              ? chartColors.green
              : type === 'attendance'
                ? chartColors.yellow
                : type === 'behavior'
                  ? chartColors.red
                  : chartColors.orange,
      }))
      .filter((item) => item.value > 0);
  }, [chartColors, enrichedNotes]);

  const notesByStudent = useMemo(() => {
    return assignedStudentsOnly.map((student) => ({
      name: student.name.split(' ')[0],
      notes: enrichedNotes.filter((note) => note.studentId === student.id)
        .length,
      followUp: enrichedNotes.filter(
        (note) => note.studentId === student.id && note.followUpRequired,
      ).length,
    }));
  }, [assignedStudentsOnly, enrichedNotes]);

  const monthlyTrend = useMemo(() => {
    return [
      { month: 'Jan', notes: 2, followUp: 0 },
      { month: 'Feb', notes: 3, followUp: 1 },
      { month: 'Mar', notes: 4, followUp: 1 },
      { month: 'Apr', notes: 5, followUp: 2 },
      { month: 'May', notes: 6, followUp: 2 },
      { month: 'Jun', notes: summary.thisMonth, followUp: summary.followUp },
    ];
  }, [summary.followUp, summary.thisMonth]);

  const resetFilters = () => {
    setSearchTerm('');
    setStudentFilter('all');
    setTypeFilter('all');
    setPriorityFilter('all');
    setFollowUpFilter('all');
  };

  const clearForm = () => {
    setSelectedStudentId(assignedStudentsOnly[0]?.id ?? '');
    setSelectedSessionId(coachSessionsOnly[0]?.id ?? '');
    setNoteType('development');
    setPriority('medium');
    setVisibility('adminParent');
    setRating(4);
    setNoteTitle('');
    setNoteText('');
    setRecommendation('');
    setFollowUpRequired(false);
    setSavedMessage('');
  };

  const saveNote = () => {
    if (!selectedStudent || !selectedSession || !noteTitle.trim() || !noteText.trim()) {
      setSavedMessage(
        'Please select a student/session and complete the note title and note body.',
      );
      return;
    }

    const newNote: CoachProgressNoteDto = {
      id: `note-${Date.now()}`,
      studentId: selectedStudent.id,
      sessionId: selectedSession.id,
      coachId: currentCoach.id,
      date: '2026-06-05',
      type: noteType,
      priority,
      visibility,
      rating,
      title: noteTitle.trim(),
      note: noteText.trim(),
      recommendation: recommendation.trim() || 'No recommendation added.',
      followUpRequired,
    };

    setNotes((current) => [newNote, ...current]);
    setSelectedNoteId(newNote.id);
    setSavedMessage(
      'Progress note saved locally. Backend progress-notes endpoint will be connected later.',
    );

    setNoteTitle('');
    setNoteText('');
    setRecommendation('');
    setFollowUpRequired(false);
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
              <FileText className="h-4 w-4" />
              Coach Progress Notes
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Progress Notes
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Add and review development notes for students assigned to your
              coaching scope only. Track progress, skills, follow-up actions,
              and recommendations without exposing finance or admin-only data.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveNote}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Note
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
              label="Total Notes"
              value={`${summary.total}`}
              caption="Coach notes in your scope"
              positive
            />

            <HeroMetricCard
              icon={CalendarDays}
              label="This Month"
              value={`${summary.thisMonth}`}
              caption="Recent notes added"
              positive
            />

            <HeroMetricCard
              icon={Star}
              label="Avg Rating"
              value={`${summary.averageRating}/5`}
              caption="Average note rating"
              positive={summary.averageRating >= 3.5}
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Follow-up"
              value={`${summary.followUp}`}
              caption="Notes needing follow-up"
              positive={summary.followUp === 0}
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
          title="Total Notes"
          value={`${summary.total}`}
          description="Progress notes written by this coach."
          tone="blue"
        />

        <KpiCard
          icon={CalendarCheck}
          title="Recent Notes"
          value={`${summary.thisMonth}`}
          description="Notes added in the current month."
          tone="success"
        />

        <KpiCard
          icon={AlertTriangle}
          title="Follow-up Notes"
          value={`${summary.followUp}`}
          description="Notes requiring future coach action."
          tone={summary.followUp > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={Users}
          title="Students Need Notes"
          value={`${summary.studentsNeedingNotes}`}
          description="Assigned students needing coach notes."
          tone={summary.studentsNeedingNotes > 0 ? 'warning' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <PlusCircle className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Add Progress Note
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create a coach-scoped development note for an assigned student.
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
                label="Note Type"
                value={noteType}
                options={[
                  { label: 'Development', value: 'development' },
                  { label: 'Skill', value: 'skill' },
                  { label: 'Attendance', value: 'attendance' },
                  { label: 'Behavior', value: 'behavior' },
                  { label: 'Follow-up', value: 'followUp' },
                ]}
                onChange={(value) => setNoteType(value as CoachNoteType)}
              />

              <FilterSelect
                label="Priority"
                value={priority}
                options={[
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
                onChange={(value) => setPriority(value as CoachNotePriority)}
              />

              <FilterSelect
                label="Visibility"
                value={visibility}
                options={[
                  { label: 'Coach Only', value: 'coachOnly' },
                  { label: 'Admin / Parent', value: 'adminParent' },
                ]}
                onChange={(value) =>
                  setVisibility(value as CoachNoteVisibility)
                }
              />

              <label className="block">
                <span className="mb-2 block text-sm font-black">Rating</span>

                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={[
                        'flex h-12 items-center justify-center rounded-2xl border text-sm font-black transition',
                        rating === value
                          ? 'border-brand-yellow bg-brand-yellow text-brand-blue'
                          : 'border-border bg-background hover:border-brand-yellow hover:bg-brand-yellow/10',
                      ].join(' ')}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">Note Title</span>

              <input
                value={noteTitle}
                onChange={(event) => setNoteTitle(event.target.value)}
                placeholder="Example: Passing and teamwork improvement"
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">Coach Note</span>

              <textarea
                value={noteText}
                onChange={(event) => setNoteText(event.target.value)}
                placeholder="Write the progress note here..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">
                Recommendation
              </span>

              <textarea
                value={recommendation}
                onChange={(event) => setRecommendation(event.target.value)}
                placeholder="Write the next recommended action..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => setFollowUpRequired((current) => !current)}
                className={[
                  'inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-black transition',
                  followUpRequired
                    ? 'border-brand-yellow bg-brand-yellow text-brand-blue'
                    : 'border-border bg-background hover:border-brand-yellow hover:bg-brand-yellow/10',
                ].join(' ')}
              >
                <AlertTriangle className="h-4 w-4" />
                Follow-up Required
              </button>

              <button
                type="button"
                onClick={saveNote}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Progress Note
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Notes Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter notes by student, type, priority, follow-up,
                  title, session, note, or recommendation.
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
                    placeholder="Search note, student, session, recommendation..."
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
                  { label: 'Development', value: 'development' },
                  { label: 'Skill', value: 'skill' },
                  { label: 'Attendance', value: 'attendance' },
                  { label: 'Behavior', value: 'behavior' },
                  { label: 'Follow-up', value: 'followUp' },
                ]}
                onChange={(value) =>
                  setTypeFilter(value as CoachNoteType | 'all')
                }
              />

              <FilterSelect
                label="Priority"
                value={priorityFilter}
                options={[
                  { label: 'All priorities', value: 'all' },
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
                ]}
                onChange={(value) =>
                  setPriorityFilter(value as CoachNotePriority | 'all')
                }
              />

              <FilterSelect
                label="Follow-up"
                value={followUpFilter}
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Required', value: 'yes' },
                  { label: 'Not required', value: 'no' },
                ]}
                onChange={(value) =>
                  setFollowUpFilter(value as 'all' | 'yes' | 'no')
                }
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                active={selectedNote?.id === note.id}
                onSelect={() => setSelectedNoteId(note.id)}
              />
            ))}

            {filteredNotes.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Monthly Notes Trend"
              description="Progress notes and follow-up notes across recent months."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                    <defs>
                      <linearGradient
                        id="notesTrendGradient"
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
                      dataKey="notes"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#notesTrendGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="followUp"
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
              title="Notes by Type"
              description="Distribution of coach notes by selected category."
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
                      total={enrichedNotes.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <ChartCard
            icon={Users}
            title="Notes by Student"
            description="Total notes and follow-up notes by assigned student."
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={notesByStudent}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />

                  <Bar
                    dataKey="notes"
                    fill={chartColors.blue}
                    radius={[10, 10, 0, 0]}
                  />

                  <Bar
                    dataKey="followUp"
                    fill={chartColors.orange}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <aside className="space-y-6">
          {selectedNote ? <SelectedNotePanel note={selectedNote} /> : null}

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Students Needing Notes</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Assigned students who need follow-up or recent notes.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {assignedStudentsOnly
                .filter((student) => student.status === 'needsFollowUp')
                .map((student) => (
                  <StudentAttentionRow key={student.id} student={student} />
                ))}

              {summary.studentsNeedingNotes === 0 ? (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-bold text-green-700 dark:text-green-300">
                  All assigned students have recent progress coverage.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Coach shortcuts for progress follow-up.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={UserRound}
                title="Selected Student"
                description="Open selected student profile."
                href={`/coach/players/${selectedStudent.id}`}
              />

              <QuickAction
                icon={Star}
                title="Skill Assessment"
                description="Update skill score and assessment."
                href={`/coach/skill-assessments?playerId=${selectedStudent.id}`}
              />

              <QuickAction
                icon={ClipboardCheck}
                title="Attendance"
                description="Open coach attendance page."
                href={`/coach/attendance?playerId=${selectedStudent.id}`}
              />

              <QuickAction
                icon={MessageSquare}
                title="Messages"
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

function NoteCard({
  note,
  active,
  onSelect,
}: {
  note: ProgressNoteWithRelations;
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
          <FileText className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black">{note.title}</h3>

              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {note.student.name} · {note.session.title}
              </p>

              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {note.date} · Rating {note.rating}/5
              </p>
            </div>

            <NoteTypeBadge type={note.type} />
          </div>
        </div>
      </div>

      <p className="line-clamp-3 text-sm font-semibold leading-6 text-muted-foreground">
        {note.note}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <PriorityBadge priority={note.priority} />
        <VisibilityBadge visibility={note.visibility} />

        {note.followUpRequired ? (
          <span className="inline-flex rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
            Follow-up Required
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/coach/players/${note.studentId}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-black transition hover:bg-secondary"
        >
          <Eye className="h-4 w-4" />
          Student
        </Link>

        <Link
          to={`/coach/skill-assessments?playerId=${note.studentId}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
        >
          <Star className="h-4 w-4" />
          Assess
        </Link>
      </div>
    </article>
  );
}

function SelectedNotePanel({ note }: { note: ProgressNoteWithRelations }) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Trophy className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Note
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">{note.title}</h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {note.student.name} · {getNoteTypeLabel(note.type)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <NoteTypeBadge type={note.type} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            Rating {note.rating}/5
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={UserRound} label="Student" value={note.student.name} />
        <DetailLine icon={CalendarDays} label="Date" value={note.date} />
        <DetailLine icon={Dumbbell} label="Session" value={note.session.title} />
        <DetailLine icon={MapPin} label="Location" value={note.session.court} />
        <DetailLine
          icon={Target}
          label="Priority"
          value={getPriorityLabel(note.priority)}
        />
        <DetailLine
          icon={ShieldCheck}
          label="Visibility"
          value={getVisibilityLabel(note.visibility)}
        />
        <DetailLine icon={FileText} label="Note" value={note.note} />
        <DetailLine
          icon={Zap}
          label="Recommendation"
          value={note.recommendation}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/coach/players/${note.studentId}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <UserRound className="h-4 w-4" />
            Student
          </Link>

          <Link
            to={`/coach/messages?playerId=${note.studentId}`}
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

function StudentAttentionRow({ student }: { student: CoachAssignedPlayerDto }) {
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
            {student.latestNote}
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

        <span className="text-xs font-black text-muted-foreground">{value}</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>

      <p className="mt-1 text-xs font-bold text-muted-foreground">
        {percentage}% of notes
      </p>
    </div>
  );
}

function NoteTypeBadge({ type }: { type: CoachNoteType }) {
  const className =
    type === 'development'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
      : type === 'skill'
        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
        : type === 'attendance'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
          : type === 'behavior'
            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
            : 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getNoteTypeLabel(type)}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: CoachNotePriority }) {
  const className =
    priority === 'high'
      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
      : priority === 'medium'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getPriorityLabel(priority)}
    </span>
  );
}

function VisibilityBadge({ visibility }: { visibility: CoachNoteVisibility }) {
  return (
    <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
      {getVisibilityLabel(visibility)}
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
        <FileText className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No progress notes found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, student, note type, priority, or follow-up
        filter.
      </p>
    </div>
  );
}