import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Dumbbell,
  Eye,
  FileText,
  Filter,
  MessageSquare,
  PlusCircle,
  RefreshCw,
  Save,
  Search,
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
  CoachSkillAssessmentDto,
  CoachSkillCategory,
  CoachSkillStatus,
} from '@/features/coach/types/coach.dto';

type SkillAssessmentWithStudent = CoachSkillAssessmentDto & {
  student: CoachAssignedPlayerDto;
};

function getCategoryLabel(category: CoachSkillCategory) {
  const labels: Record<CoachSkillCategory, string> = {
    technical: 'Technical',
    tactical: 'Tactical',
    physical: 'Physical',
    mental: 'Mental',
  };

  return labels[category];
}

function getSkillStatusLabel(status: CoachSkillStatus) {
  const labels: Record<CoachSkillStatus, string> = {
    excellent: 'Excellent',
    good: 'Good',
    needsWork: 'Needs Work',
  };

  return labels[status];
}

export default function SkillAssessmentsPage() {
  const [searchParams] = useSearchParams();

  const chartColors = useMemo(() => coachDataService.getChartColors(), []);
  const currentCoach = useMemo(() => coachDataService.getCurrentCoach(), []);
  const assignedStudentsOnly = useMemo(
    () => coachDataService.getAssignedPlayers(),
    [],
  );

  const playerIdFromUrl = searchParams.get('playerId');

  const [assessments, setAssessments] = useState<CoachSkillAssessmentDto[]>(
    () => coachDataService.getSkillAssessments(),
  );

  const [selectedStudentId, setSelectedStudentId] = useState(
    playerIdFromUrl &&
      assignedStudentsOnly.some((student) => student.id === playerIdFromUrl)
      ? playerIdFromUrl
      : assignedStudentsOnly[0]?.id ?? '',
  );

  const [skillName, setSkillName] = useState('Passing');
  const [category, setCategory] = useState<CoachSkillCategory>('technical');
  const [currentScore, setCurrentScore] = useState(80);
  const [targetScore, setTargetScore] = useState(90);
  const [status, setStatus] = useState<CoachSkillStatus>('good');
  const [note, setNote] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [studentFilter, setStudentFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState<
    CoachSkillCategory | 'all'
  >('all');
  const [statusFilter, setStatusFilter] = useState<CoachSkillStatus | 'all'>(
    'all',
  );

  const [selectedAssessmentId, setSelectedAssessmentId] = useState(
    assessments[0]?.id ?? '',
  );

  const selectedStudent =
    assignedStudentsOnly.find((student) => student.id === selectedStudentId) ??
    assignedStudentsOnly[0];

  const enrichedAssessments = useMemo(() => {
    return assessments
      .map((assessment) => {
        const student = assignedStudentsOnly.find(
          (item) => item.id === assessment.studentId,
        );

        if (!student) return null;

        return {
          ...assessment,
          student,
        };
      })
      .filter(Boolean) as SkillAssessmentWithStudent[];
  }, [assignedStudentsOnly, assessments]);

  const filteredAssessments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return enrichedAssessments.filter((assessment) => {
      const matchesSearch =
        !normalizedSearch ||
        assessment.skillName.toLowerCase().includes(normalizedSearch) ||
        assessment.note.toLowerCase().includes(normalizedSearch) ||
        assessment.recommendation.toLowerCase().includes(normalizedSearch) ||
        assessment.student.name.toLowerCase().includes(normalizedSearch) ||
        assessment.student.group.toLowerCase().includes(normalizedSearch) ||
        getCategoryLabel(assessment.category)
          .toLowerCase()
          .includes(normalizedSearch) ||
        getSkillStatusLabel(assessment.status)
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStudent =
        studentFilter === 'all' || assessment.studentId === studentFilter;

      const matchesCategory =
        categoryFilter === 'all' || assessment.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'all' || assessment.status === statusFilter;

      return matchesSearch && matchesStudent && matchesCategory && matchesStatus;
    });
  }, [
    categoryFilter,
    enrichedAssessments,
    searchTerm,
    statusFilter,
    studentFilter,
  ]);

  const selectedAssessment =
    enrichedAssessments.find(
      (assessment) => assessment.id === selectedAssessmentId,
    ) ??
    filteredAssessments[0] ??
    enrichedAssessments[0];

  const summary = useMemo(() => {
    const total = enrichedAssessments.length;

    const averageSkillScore = total
      ? Math.round(
          enrichedAssessments.reduce(
            (sum, assessment) => sum + assessment.currentScore,
            0,
          ) / total,
        )
      : 0;

    const studentsAssessed = new Set(
      enrichedAssessments.map((assessment) => assessment.studentId),
    ).size;

    const needsWorkCount = enrichedAssessments.filter(
      (assessment) => assessment.status === 'needsWork',
    ).length;

    const targetGap = total
      ? Math.round(
          enrichedAssessments.reduce(
            (sum, assessment) =>
              sum + Math.max(assessment.targetScore - assessment.currentScore, 0),
            0,
          ) / total,
        )
      : 0;

    return {
      total,
      averageSkillScore,
      studentsAssessed,
      needsWorkCount,
      targetGap,
    };
  }, [enrichedAssessments]);

  const scoreTrend = useMemo(() => {
    return [
      {
        month: 'Jan',
        average: Math.max(summary.averageSkillScore - 11, 0),
        needsWork: summary.needsWorkCount + 4,
      },
      {
        month: 'Feb',
        average: Math.max(summary.averageSkillScore - 8, 0),
        needsWork: summary.needsWorkCount + 3,
      },
      {
        month: 'Mar',
        average: Math.max(summary.averageSkillScore - 6, 0),
        needsWork: summary.needsWorkCount + 2,
      },
      {
        month: 'Apr',
        average: Math.max(summary.averageSkillScore - 4, 0),
        needsWork: summary.needsWorkCount + 2,
      },
      {
        month: 'May',
        average: Math.max(summary.averageSkillScore - 2, 0),
        needsWork: summary.needsWorkCount + 1,
      },
      {
        month: 'Jun',
        average: summary.averageSkillScore,
        needsWork: summary.needsWorkCount,
      },
    ];
  }, [summary.averageSkillScore, summary.needsWorkCount]);

  const categoryBreakdown = useMemo(() => {
    const categories: CoachSkillCategory[] = [
      'technical',
      'tactical',
      'physical',
      'mental',
    ];

    return categories
      .map((item) => ({
        name: getCategoryLabel(item),
        value: enrichedAssessments.filter(
          (assessment) => assessment.category === item,
        ).length,
        color:
          item === 'technical'
            ? chartColors.blue
            : item === 'tactical'
              ? chartColors.purple
              : item === 'physical'
                ? chartColors.green
                : chartColors.yellow,
      }))
      .filter((item) => item.value > 0);
  }, [chartColors, enrichedAssessments]);

  const statusBreakdown = useMemo(() => {
    const statuses: CoachSkillStatus[] = ['excellent', 'good', 'needsWork'];

    return statuses
      .map((item) => ({
        name: getSkillStatusLabel(item),
        value: enrichedAssessments.filter(
          (assessment) => assessment.status === item,
        ).length,
        color:
          item === 'excellent'
            ? chartColors.green
            : item === 'good'
              ? chartColors.blue
              : chartColors.orange,
      }))
      .filter((item) => item.value > 0);
  }, [chartColors, enrichedAssessments]);

  const scoresByStudent = useMemo(() => {
    return assignedStudentsOnly.map((student) => {
      const studentAssessments = enrichedAssessments.filter(
        (assessment) => assessment.studentId === student.id,
      );

      const averageScore = studentAssessments.length
        ? Math.round(
            studentAssessments.reduce(
              (sum, assessment) => sum + assessment.currentScore,
              0,
            ) / studentAssessments.length,
          )
        : 0;

      const averageTarget = studentAssessments.length
        ? Math.round(
            studentAssessments.reduce(
              (sum, assessment) => sum + assessment.targetScore,
              0,
            ) / studentAssessments.length,
          )
        : 0;

      return {
        name: student.name.split(' ')[0],
        score: averageScore,
        target: averageTarget,
        needsWork: studentAssessments.filter(
          (assessment) => assessment.status === 'needsWork',
        ).length,
      };
    });
  }, [assignedStudentsOnly, enrichedAssessments]);

  const resetFilters = () => {
    setSearchTerm('');
    setStudentFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const clearForm = () => {
    setSelectedStudentId(assignedStudentsOnly[0]?.id ?? '');
    setSkillName('Passing');
    setCategory('technical');
    setCurrentScore(80);
    setTargetScore(90);
    setStatus('good');
    setNote('');
    setRecommendation('');
    setSavedMessage('');
  };

  const saveAssessment = () => {
    if (!selectedStudent || !skillName.trim() || !note.trim()) {
      setSavedMessage(
        'Please select a student and complete the skill name and coach note.',
      );
      return;
    }

    const newAssessment: CoachSkillAssessmentDto = {
      id: `assessment-${Date.now()}`,
      studentId: selectedStudent.id,
      coachId: currentCoach.id,
      date: '2026-06-05',
      skillName: skillName.trim(),
      category,
      currentScore,
      targetScore,
      status,
      note: note.trim(),
      recommendation: recommendation.trim() || 'No recommendation added.',
    };

    setAssessments((current) => [newAssessment, ...current]);
    setSelectedAssessmentId(newAssessment.id);
    setSavedMessage(
      'Skill assessment saved locally. Backend skill-assessment endpoint will be connected later.',
    );

    setNote('');
    setRecommendation('');
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
              <Star className="h-4 w-4" />
              Coach Skill Assessment
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Skill Assessments
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Record and review skill assessments for students assigned to your
              coaching scope only. Track technical, tactical, physical, and
              mental development without exposing finance or admin-only data.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={saveAssessment}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Assessment
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
              icon={Star}
              label="Assessments"
              value={`${summary.total}`}
              caption="Coach assessments in scope"
              positive
            />

            <HeroMetricCard
              icon={TrendingUp}
              label="Avg Score"
              value={`${summary.averageSkillScore}%`}
              caption="Average skill score"
              positive={summary.averageSkillScore >= 75}
            />

            <HeroMetricCard
              icon={Users}
              label="Students"
              value={`${summary.studentsAssessed}`}
              caption="Students assessed"
              positive
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Needs Work"
              value={`${summary.needsWorkCount}`}
              caption="Skills requiring extra support"
              positive={summary.needsWorkCount === 0}
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
          icon={Star}
          title="Total Assessments"
          value={`${summary.total}`}
          description="Skill records created by this coach."
          tone="blue"
        />

        <KpiCard
          icon={TrendingUp}
          title="Average Score"
          value={`${summary.averageSkillScore}%`}
          description="Average current skill assessment score."
          tone="success"
        />

        <KpiCard
          icon={Target}
          title="Target Gap"
          value={`${summary.targetGap}%`}
          description="Average gap between current and target score."
          tone={summary.targetGap > 8 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={AlertTriangle}
          title="Needs Work"
          value={`${summary.needsWorkCount}`}
          description="Assessments requiring extra attention."
          tone={summary.needsWorkCount > 0 ? 'warning' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <PlusCircle className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  New Skill Assessment
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add a skill assessment for one of your assigned students only.
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

              <label className="block">
                <span className="mb-2 block text-sm font-black">Skill Name</span>

                <input
                  value={skillName}
                  onChange={(event) => setSkillName(event.target.value)}
                  placeholder="Example: Passing"
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </label>

              <FilterSelect
                label="Category"
                value={category}
                options={[
                  { label: 'Technical', value: 'technical' },
                  { label: 'Tactical', value: 'tactical' },
                  { label: 'Physical', value: 'physical' },
                  { label: 'Mental', value: 'mental' },
                ]}
                onChange={(value) => setCategory(value as CoachSkillCategory)}
              />

              <ScoreField
                label="Current Score"
                value={currentScore}
                onChange={setCurrentScore}
              />

              <ScoreField
                label="Target Score"
                value={targetScore}
                onChange={setTargetScore}
              />

              <FilterSelect
                label="Status"
                value={status}
                options={[
                  { label: 'Excellent', value: 'excellent' },
                  { label: 'Good', value: 'good' },
                  { label: 'Needs Work', value: 'needsWork' },
                ]}
                onChange={(value) => setStatus(value as CoachSkillStatus)}
              />
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-black">Coach Note</span>

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Write the skill assessment note here..."
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
                placeholder="Write the next training recommendation..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-6 outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </label>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={saveAssessment}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Skill Assessment
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Assessment Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter assessments by student, skill, category,
                  status, note, or recommendation.
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
                    placeholder="Search skill, student, note, recommendation..."
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
                label="Category"
                value={categoryFilter}
                options={[
                  { label: 'All categories', value: 'all' },
                  { label: 'Technical', value: 'technical' },
                  { label: 'Tactical', value: 'tactical' },
                  { label: 'Physical', value: 'physical' },
                  { label: 'Mental', value: 'mental' },
                ]}
                onChange={(value) =>
                  setCategoryFilter(value as CoachSkillCategory | 'all')
                }
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Excellent', value: 'excellent' },
                  { label: 'Good', value: 'good' },
                  { label: 'Needs Work', value: 'needsWork' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as CoachSkillStatus | 'all')
                }
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            {filteredAssessments.map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                active={selectedAssessment?.id === assessment.id}
                onSelect={() => setSelectedAssessmentId(assessment.id)}
              />
            ))}

            {filteredAssessments.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Skill Score Trend"
              description="Average skill score and needs-work count across recent months."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreTrend}>
                    <defs>
                      <linearGradient
                        id="skillTrendGradient"
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
                      dataKey="average"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#skillTrendGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="needsWork"
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
              title="Skill Categories"
              description="Distribution of assessments by skill category."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {categoryBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {categoryBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={enrichedAssessments.length}
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
              title="Skill Status"
              description="Excellent, good, and needs-work assessment distribution."
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
                      total={enrichedAssessments.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard
              icon={Trophy}
              title="Scores by Student"
              description="Average current score, target score, and needs-work count by student."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoresByStudent}>
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

                    <Bar
                      dataKey="needsWork"
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
          {selectedAssessment ? (
            <SelectedAssessmentPanel assessment={selectedAssessment} />
          ) : null}

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Needs Work</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Skills that require coach attention.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {enrichedAssessments
                .filter((assessment) => assessment.status === 'needsWork')
                .map((assessment) => (
                  <NeedsWorkRow key={assessment.id} assessment={assessment} />
                ))}

              {summary.needsWorkCount === 0 ? (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm font-bold text-green-700 dark:text-green-300">
                  No assessed skills currently require urgent work.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Coach shortcuts for selected student.
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
                icon={FileText}
                title="Progress Notes"
                description="Add a development note."
                href={`/coach/progress-notes?playerId=${selectedStudent.id}`}
              />

              <QuickAction
                icon={ClipboardCheck}
                title="Attendance"
                description="Open attendance page."
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

function AssessmentCard({
  assessment,
  active,
  onSelect,
}: {
  assessment: SkillAssessmentWithStudent;
  active: boolean;
  onSelect: () => void;
}) {
  const gap = Math.max(assessment.targetScore - assessment.currentScore, 0);

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
          <Star className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-black">{assessment.skillName}</h3>

              <p className="mt-1 text-sm font-semibold text-muted-foreground">
                {assessment.student.name} · {getCategoryLabel(assessment.category)}
              </p>

              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {assessment.date} · Gap {gap}%
              </p>
            </div>

            <SkillStatusBadge status={assessment.status} />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MiniScore label="Current" value={`${assessment.currentScore}%`} />
        <MiniScore label="Target" value={`${assessment.targetScore}%`} />
        <MiniScore label="Gap" value={`${gap}%`} />
      </div>

      <p className="mt-4 line-clamp-3 text-sm font-semibold leading-6 text-muted-foreground">
        {assessment.note}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/coach/players/${assessment.studentId}`}
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-xs font-black transition hover:bg-secondary"
        >
          <Eye className="h-4 w-4" />
          Student
        </Link>

        <Link
          to={`/coach/progress-notes?playerId=${assessment.studentId}`}
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

function SelectedAssessmentPanel({
  assessment,
}: {
  assessment: SkillAssessmentWithStudent;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Trophy className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Assessment
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {assessment.skillName}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {assessment.student.name} · {getCategoryLabel(assessment.category)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SkillStatusBadge status={assessment.status} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {assessment.currentScore}% / {assessment.targetScore}%
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={UserRound} label="Student" value={assessment.student.name} />
        <DetailLine icon={CalendarDays} label="Date" value={assessment.date} />
        <DetailLine icon={Dumbbell} label="Category" value={getCategoryLabel(assessment.category)} />
        <DetailLine icon={Star} label="Status" value={getSkillStatusLabel(assessment.status)} />
        <DetailLine icon={TrendingUp} label="Current Score" value={`${assessment.currentScore}%`} />
        <DetailLine icon={Target} label="Target Score" value={`${assessment.targetScore}%`} />
        <DetailLine icon={FileText} label="Coach Note" value={assessment.note} />
        <DetailLine
          icon={Zap}
          label="Recommendation"
          value={assessment.recommendation}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/coach/players/${assessment.studentId}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <UserRound className="h-4 w-4" />
            Student
          </Link>

          <Link
            to={`/coach/progress-notes?playerId=${assessment.studentId}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <FileText className="h-4 w-4" />
            Note
          </Link>
        </div>
      </div>
    </aside>
  );
}

function NeedsWorkRow({
  assessment,
}: {
  assessment: SkillAssessmentWithStudent;
}) {
  return (
    <Link
      to={`/coach/players/${assessment.studentId}`}
      className="block rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue transition hover:-translate-y-0.5 hover:bg-brand-yellow/20 dark:text-brand-yellow"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <p className="text-sm font-black">
            {assessment.student.name} · {assessment.skillName}
          </p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {assessment.recommendation}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ScoreField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>

      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(event) =>
          onChange(Math.min(100, Math.max(0, Number(event.target.value))))
        }
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      />
    </label>
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
        {percentage}% of assessments
      </p>
    </div>
  );
}

function SkillStatusBadge({ status }: { status: CoachSkillStatus }) {
  const className =
    status === 'excellent'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'needsWork'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
      {getSkillStatusLabel(status)}
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
        <Star className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No skill assessments found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, student, category, or skill status filter.
      </p>
    </div>
  );
}