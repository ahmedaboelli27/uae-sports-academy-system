import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Dumbbell,
  Eye,
  FileText,
  Filter,
  Lightbulb,
  Medal,
  MessageSquare,
  Search,
  Star,
  Target,
  TrendingUp,
  Trophy,
  UserRound,
  Zap
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

type SkillStatus = 'excellent' | 'good' | 'needsWork';
type MilestoneStatus = 'completed' | 'inProgress' | 'upcoming';
type RecommendationPriority = 'high' | 'medium' | 'low';

interface ProgressTrendPoint {
  month: string;
  progress: number;
  skill: number;
  attendance: number;
}

interface SkillAssessment {
  id: string;
  skill: string;
  category: string;
  currentScore: number;
  previousScore: number;
  targetScore: number;
  status: SkillStatus;
  coachNote: string;
}

interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: MilestoneStatus;
}

interface CoachNote {
  id: string;
  date: string;
  coach: string;
  title: string;
  note: string;
}

interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  priority: RecommendationPriority;
}

interface ChildProgressProfile {
  id: string;
  name: string;
  age: number;
  studentCode: string;
  program: string;
  sport: string;
  branch: string;
  coach: string;
  level: string;
  progressScore: number;
  skillScore: number;
  attendanceRate: number;
  coachRating: number;
  improvementRate: number;
  completedMilestones: number;
  totalMilestones: number;
  latestSummary: string;
  progressTrend: ProgressTrendPoint[];
  skills: SkillAssessment[];
  milestones: MilestoneItem[];
  coachNotes: CoachNote[];
  strengths: string[];
  improvementAreas: string[];
  recommendations: RecommendationItem[];
}

const chartColors = {
  blue: '#00129B',
  blueDark: '#000B73',
  yellow: '#FFD400',
  green: '#16A34A',
  red: '#DC2626',
  orange: '#F97316',
  purple: '#7C3AED',
  slate: '#64748B',
};

const progressProfiles: ChildProgressProfile[] = [
  {
    id: 'child-001',
    name: 'Omar Khaled',
    age: 9,
    studentCode: 'STU-1001',
    program: 'Football Development',
    sport: 'Football',
    branch: 'Dubai Main Branch',
    coach: 'Coach Omar',
    level: 'Intermediate',
    progressScore: 84,
    skillScore: 88,
    attendanceRate: 92,
    coachRating: 4.7,
    improvementRate: 16,
    completedMilestones: 7,
    totalMilestones: 10,
    latestSummary:
      'Omar is showing strong development in passing accuracy, stamina, and teamwork. Tactical positioning still needs consistent practice.',
    progressTrend: [
      { month: 'Jan', progress: 68, skill: 72, attendance: 82 },
      { month: 'Feb', progress: 72, skill: 76, attendance: 86 },
      { month: 'Mar', progress: 76, skill: 80, attendance: 88 },
      { month: 'Apr', progress: 79, skill: 84, attendance: 90 },
      { month: 'May', progress: 82, skill: 86, attendance: 92 },
      { month: 'Jun', progress: 84, skill: 88, attendance: 94 },
    ],
    skills: [
      {
        id: 'skill-001',
        skill: 'Passing Accuracy',
        category: 'Technical',
        currentScore: 88,
        previousScore: 78,
        targetScore: 92,
        status: 'excellent',
        coachNote: 'Very strong improvement in short and medium passing.',
      },
      {
        id: 'skill-002',
        skill: 'Ball Control',
        category: 'Technical',
        currentScore: 85,
        previousScore: 76,
        targetScore: 90,
        status: 'good',
        coachNote: 'Good close control, especially during pressure drills.',
      },
      {
        id: 'skill-003',
        skill: 'Stamina',
        category: 'Physical',
        currentScore: 84,
        previousScore: 72,
        targetScore: 88,
        status: 'good',
        coachNote: 'Endurance improved across full sessions.',
      },
      {
        id: 'skill-004',
        skill: 'Positioning',
        category: 'Tactical',
        currentScore: 78,
        previousScore: 70,
        targetScore: 86,
        status: 'needsWork',
        coachNote: 'Needs repeated tactical awareness drills.',
      },
      {
        id: 'skill-005',
        skill: 'Teamwork',
        category: 'Behavioral',
        currentScore: 90,
        previousScore: 83,
        targetScore: 92,
        status: 'excellent',
        coachNote: 'Cooperative and communicates well with teammates.',
      },
    ],
    milestones: [
      {
        id: 'ms-001',
        title: 'Completed passing fundamentals',
        description: 'Achieved consistent accuracy in basic passing drills.',
        date: 'Feb 2026',
        status: 'completed',
      },
      {
        id: 'ms-002',
        title: 'Improved match stamina',
        description: 'Can complete full training sessions with better energy control.',
        date: 'Apr 2026',
        status: 'completed',
      },
      {
        id: 'ms-003',
        title: 'Tactical positioning target',
        description: 'Continue improving movement without the ball.',
        date: 'Current',
        status: 'inProgress',
      },
      {
        id: 'ms-004',
        title: 'Advanced match simulation',
        description: 'Next stage includes decision-making under pressure.',
        date: 'Next Month',
        status: 'upcoming',
      },
    ],
    coachNotes: [
      {
        id: 'note-001',
        date: 'Jun 02, 2026',
        coach: 'Coach Omar',
        title: 'Strong technical progress',
        note: 'Omar is much more confident with the ball and is showing better timing in passing sequences.',
      },
      {
        id: 'note-002',
        date: 'May 24, 2026',
        coach: 'Coach Omar',
        title: 'Positioning focus',
        note: 'He should continue working on when to move forward and when to hold position.',
      },
    ],
    strengths: [
      'Good passing accuracy under moderate pressure.',
      'Strong teamwork and positive communication.',
      'Improved stamina and commitment during training.',
    ],
    improvementAreas: [
      'Needs stronger tactical awareness during match simulation.',
      'Should improve first-touch control under pressure.',
      'Needs more consistency in defensive positioning.',
    ],
    recommendations: [
      {
        id: 'rec-001',
        title: 'Continue tactical positioning drills',
        description:
          'Add 10 minutes of positioning practice in each session for the next 4 weeks.',
        priority: 'high',
      },
      {
        id: 'rec-002',
        title: 'Maintain attendance consistency',
        description:
          'High attendance is helping progress. Keep the same session routine.',
        priority: 'medium',
      },
      {
        id: 'rec-003',
        title: 'Encourage match review',
        description:
          'Watching short match clips can help Omar understand movement and spacing.',
        priority: 'low',
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
    level: 'Beginner',
    progressScore: 78,
    skillScore: 74,
    attendanceRate: 86,
    coachRating: 4.4,
    improvementRate: 20,
    completedMilestones: 5,
    totalMilestones: 9,
    latestSummary:
      'Mariam is improving steadily in water confidence and kick technique. Breathing rhythm needs calm repetition and confidence building.',
    progressTrend: [
      { month: 'Jan', progress: 58, skill: 60, attendance: 76 },
      { month: 'Feb', progress: 63, skill: 64, attendance: 79 },
      { month: 'Mar', progress: 68, skill: 68, attendance: 82 },
      { month: 'Apr', progress: 72, skill: 70, attendance: 84 },
      { month: 'May', progress: 76, skill: 72, attendance: 86 },
      { month: 'Jun', progress: 78, skill: 74, attendance: 88 },
    ],
    skills: [
      {
        id: 'skill-101',
        skill: 'Breathing Rhythm',
        category: 'Technical',
        currentScore: 70,
        previousScore: 58,
        targetScore: 82,
        status: 'needsWork',
        coachNote: 'Needs calm repetition and confidence.',
      },
      {
        id: 'skill-102',
        skill: 'Floating Control',
        category: 'Technical',
        currentScore: 74,
        previousScore: 62,
        targetScore: 84,
        status: 'good',
        coachNote: 'Improving but still needs consistency.',
      },
      {
        id: 'skill-103',
        skill: 'Kick Technique',
        category: 'Physical',
        currentScore: 80,
        previousScore: 68,
        targetScore: 86,
        status: 'good',
        coachNote: 'Good progress in leg movement.',
      },
      {
        id: 'skill-104',
        skill: 'Water Confidence',
        category: 'Behavioral',
        currentScore: 72,
        previousScore: 56,
        targetScore: 84,
        status: 'needsWork',
        coachNote: 'Confidence is improving gradually.',
      },
    ],
    milestones: [
      {
        id: 'ms-101',
        title: 'Entered pool independently',
        description: 'Mariam can now enter the pool with less hesitation.',
        date: 'Mar 2026',
        status: 'completed',
      },
      {
        id: 'ms-102',
        title: 'Floating practice',
        description: 'Floating stability is improving with coach support.',
        date: 'Current',
        status: 'inProgress',
      },
      {
        id: 'ms-103',
        title: 'Breathing sequence',
        description: 'Next target is building a stable breathing rhythm.',
        date: 'Next Month',
        status: 'upcoming',
      },
    ],
    coachNotes: [
      {
        id: 'note-101',
        date: 'Jun 03, 2026',
        coach: 'Coach Sara',
        title: 'Confidence improving',
        note: 'Mariam is more relaxed in the water and responds well to positive reinforcement.',
      },
    ],
    strengths: [
      'Good improvement in kick technique.',
      'Responds well to calm encouragement.',
      'Shows steady development when routines are repeated.',
    ],
    improvementAreas: [
      'Needs confidence with floating without support.',
      'Breathing rhythm needs repeated practice.',
      'Should reduce hesitation before water activities.',
    ],
    recommendations: [
      {
        id: 'rec-101',
        title: 'Focus on breathing rhythm',
        description:
          'Repeat breathing drills in short calm cycles during each session.',
        priority: 'high',
      },
      {
        id: 'rec-102',
        title: 'Use positive reinforcement',
        description:
          'Encourage every successful floating or breathing attempt.',
        priority: 'medium',
      },
    ],
  },
];

function getSkillStatusLabel(status: SkillStatus) {
  const labels: Record<SkillStatus, string> = {
    excellent: 'Excellent',
    good: 'Good',
    needsWork: 'Needs Work',
  };

  return labels[status];
}

function getMilestoneStatusLabel(status: MilestoneStatus) {
  const labels: Record<MilestoneStatus, string> = {
    completed: 'Completed',
    inProgress: 'In Progress',
    upcoming: 'Upcoming',
  };

  return labels[status];
}

function getPriorityLabel(priority: RecommendationPriority) {
  const labels: Record<RecommendationPriority, string> = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };

  return labels[priority];
}

export default function ProgressReportPage() {
  const { childId } = useParams();

  const child = useMemo(() => {
    return (
      progressProfiles.find((profile) => profile.id === childId) ??
      progressProfiles[0]!
    );
  }, [childId]);

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<SkillStatus | 'all'>('all');

  const skillCategories = useMemo(() => {
    return Array.from(new Set(child.skills.map((skill) => skill.category)));
  }, [child.skills]);

  const filteredSkills = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return child.skills.filter((skill) => {
      const matchesSearch =
        !normalizedSearch ||
        skill.skill.toLowerCase().includes(normalizedSearch) ||
        skill.category.toLowerCase().includes(normalizedSearch) ||
        skill.coachNote.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === 'all' || skill.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'all' || skill.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, child.skills, searchTerm, statusFilter]);

  const skillBreakdown = useMemo(() => {
    return [
      {
        name: 'Excellent',
        value: child.skills.filter((skill) => skill.status === 'excellent')
          .length,
        color: chartColors.green,
      },
      {
        name: 'Good',
        value: child.skills.filter((skill) => skill.status === 'good').length,
        color: chartColors.blue,
      },
      {
        name: 'Needs Work',
        value: child.skills.filter((skill) => skill.status === 'needsWork')
          .length,
        color: chartColors.orange,
      },
    ].filter((item) => item.value > 0);
  }, [child.skills]);

  const averageTarget = useMemo(() => {
    return Math.round(
      child.skills.reduce((total, skill) => total + skill.targetScore, 0) /
      child.skills.length,
    );
  }, [child.skills]);

  const skillGain = useMemo(() => {
    const currentAverage = Math.round(
      child.skills.reduce((total, skill) => total + skill.currentScore, 0) /
      child.skills.length,
    );

    const previousAverage = Math.round(
      child.skills.reduce((total, skill) => total + skill.previousScore, 0) /
      child.skills.length,
    );

    return currentAverage - previousAverage;
  }, [child.skills]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
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
              <Target className="h-4 w-4" />
              Progress Report
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {child.name}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Review training progress, skill development, coach feedback,
              milestones, strengths, improvement areas, and recommendations for{' '}
              {child.program} with {child.coach}.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to={`/parent/children/${child.id}/attendance`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <CalendarCheck className="h-4 w-4" />
                Attendance Report
              </Link>

              <Link
                to={`/parent/children/${child.id}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <Eye className="h-4 w-4" />
                Child Profile
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={Target}
              label="Progress Score"
              value={`${child.progressScore}%`}
              caption={`${child.improvementRate}% improvement rate`}
              positive={child.progressScore >= 75}
            />

            <HeroMetricCard
              icon={Medal}
              label="Skill Score"
              value={`${child.skillScore}%`}
              caption={`+${skillGain}% average skill gain`}
              positive={skillGain >= 0}
            />

            <HeroMetricCard
              icon={Star}
              label="Coach Rating"
              value={`${child.coachRating}/5`}
              caption="Latest coach evaluation"
              positive={child.coachRating >= 4}
            />

            <HeroMetricCard
              icon={CalendarCheck}
              label="Attendance Impact"
              value={`${child.attendanceRate}%`}
              caption="Attendance supports progress"
              positive={child.attendanceRate >= 80}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Trophy}
          title="Program"
          value={child.sport}
          description={`${child.program} · ${child.level}`}
          tone="blue"
        />

        <KpiCard
          icon={Award}
          title="Milestones"
          value={`${child.completedMilestones}/${child.totalMilestones}`}
          description="Completed milestones within current training pathway."
          tone="brand"
        />

        <KpiCard
          icon={TrendingUp}
          title="Skill Target"
          value={`${averageTarget}%`}
          description="Average target score across all active skills."
          tone="success"
        />

        <KpiCard
          icon={AlertTriangle}
          title="Needs Work"
          value={`${child.skills.filter((skill) => skill.status === 'needsWork').length
            }`}
          description="Skills requiring additional attention."
          tone={
            child.skills.some((skill) => skill.status === 'needsWork')
              ? 'warning'
              : 'success'
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={TrendingUp}
              title="Progress Trend"
              description="Progress, skill score, and attendance movement over recent months."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={child.progressTrend}>
                    <defs>
                      <linearGradient
                        id="progressReportGradient"
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
                      dataKey="progress"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#progressReportGradient)"
                      activeDot={{ r: 7 }}
                    />

                    <Area
                      type="monotone"
                      dataKey="skill"
                      stroke={chartColors.yellow}
                      strokeWidth={4}
                      fill="transparent"
                      activeDot={{ r: 7 }}
                    />

                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke={chartColors.green}
                      strokeWidth={3}
                      fill="transparent"
                      activeDot={{ r: 7 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Activity}
              title="Skill Status Breakdown"
              description="How current skills are distributed by assessment status."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {skillBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {skillBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={child.skills.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <ChartCard
            icon={BarChart3}
            title="Skill Assessment"
            description="Current score, previous score, and target score for each active skill."
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={child.skills}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                  <XAxis dataKey="skill" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />

                  <Bar
                    dataKey="previousScore"
                    fill={chartColors.slate}
                    radius={[10, 10, 0, 0]}
                  />

                  <Bar
                    dataKey="currentScore"
                    fill={chartColors.blue}
                    radius={[10, 10, 0, 0]}
                  />

                  <Bar
                    dataKey="targetScore"
                    fill={chartColors.yellow}
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
                  <Medal className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Detailed Skill Review
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter skills by name, category, status, and coach
                  notes.
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
                    placeholder="Search skill, category, coach note..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Category"
                value={categoryFilter}
                options={[
                  { label: 'All categories', value: 'all' },
                  ...skillCategories.map((category) => ({
                    label: category,
                    value: category,
                  })),
                ]}
                onChange={setCategoryFilter}
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
                  setStatusFilter(value as SkillStatus | 'all')
                }
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {filteredSkills.map((skill) => (
                <SkillReviewCard key={skill.id} skill={skill} />
              ))}
            </div>

            {filteredSkills.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <InsightListCard
              icon={CheckCircle2}
              title="Strengths"
              description="Areas where the child is performing strongly."
              items={child.strengths}
              tone="success"
            />

            <InsightListCard
              icon={AlertTriangle}
              title="Areas for Improvement"
              description="Areas that need more practice and follow-up."
              items={child.improvementAreas}
              tone="warning"
            />
          </section>
        </div>

        <aside className="space-y-6">
          <ProgressSummaryPanel child={child} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Milestones</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Training pathway achievements and upcoming targets.
                </p>
              </div>

              <Award className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {child.milestones.map((milestone) => (
                <MilestoneRow key={milestone.id} milestone={milestone} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Coach Notes</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Latest coach feedback and progress comments.
                </p>
              </div>

              <MessageSquare className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {child.coachNotes.map((note) => (
                <CoachNoteRow key={note.id} note={note} />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Recommendations</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Suggested next steps from the progress review.
                </p>
              </div>

              <Lightbulb className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {child.recommendations.map((recommendation) => (
                <RecommendationRow
                  key={recommendation.id}
                  recommendation={recommendation}
                />
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Useful shortcuts for progress follow-up.
                </p>
              </div>

              <Zap className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={Eye}
                title="Child Profile"
                description="Open full child profile and enrollment details."
                href={`/parent/children/${child.id}`}
              />

              <QuickAction
                icon={CalendarCheck}
                title="Attendance Report"
                description="Review attendance records and absence notes."
                href={`/parent/children/${child.id}/attendance`}
              />

              <QuickAction
                icon={MessageSquare}
                title="Message Academy"
                description="Contact coach or academy support team."
                href="/parent/messages"
              />

              <QuickAction
                icon={FileText}
                title="Documents"
                description="Open family documents and uploaded files."
                href="/parent/documents"
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

function ProgressSummaryPanel({
  child,
}: {
  child: ChildProgressProfile;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <UserRound className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Progress Summary
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">{child.name}</h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {child.program} · {child.level} · {child.coach}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="inline-flex rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
            {child.progressScore}% Progress
          </span>

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {child.coachRating}/5 Rating
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={Trophy} label="Sport" value={child.sport} />
        <DetailLine icon={Dumbbell} label="Program" value={child.program} />
        <DetailLine icon={UserRound} label="Student Code" value={child.studentCode} />
        <DetailLine icon={Target} label="Progress Score" value={`${child.progressScore}%`} />
        <DetailLine icon={Medal} label="Skill Score" value={`${child.skillScore}%`} />
        <DetailLine icon={CalendarCheck} label="Attendance Rate" value={`${child.attendanceRate}%`} />
        <DetailLine icon={MessageSquare} label="Latest Summary" value={child.latestSummary} />
      </div>
    </aside>
  );
}

function SkillReviewCard({ skill }: { skill: SkillAssessment }) {
  const gain = skill.currentScore - skill.previousScore;

  return (
    <article className="rounded-2xl border border-border bg-background p-4 transition hover:border-brand-yellow hover:bg-brand-yellow/5 dark:bg-white/[0.04]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-black">{skill.skill}</h3>

          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {skill.category}
          </p>
        </div>

        <SkillStatusBadge status={skill.status} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <MiniScore label="Previous" value={`${skill.previousScore}%`} />
        <MiniScore label="Current" value={`${skill.currentScore}%`} />
        <MiniScore label="Target" value={`${skill.targetScore}%`} />
      </div>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs font-black">
          <span>Current Progress</span>
          <span>{skill.currentScore}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-brand-yellow"
            style={{ width: `${skill.currentScore}%` }}
          />
        </div>
      </div>

      <p className="mt-3 text-xs font-semibold leading-5 text-muted-foreground">
        {skill.coachNote}
      </p>

      <div className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-950 dark:text-green-300">
        {gain >= 0 ? '+' : ''}
        {gain}% improvement
      </div>
    </article>
  );
}

function MiniScore({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center dark:bg-white/[0.04]">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black text-brand-blue dark:text-brand-yellow">
        {value}
      </p>
    </div>
  );
}

function InsightListCard({
  icon: Icon,
  title,
  description,
  items,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  tone: 'success' | 'warning';
}) {
  const iconClass =
    tone === 'success'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';

  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex gap-3 rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]"
          >
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue dark:text-brand-yellow" />
            <p className="text-sm font-semibold leading-6 text-muted-foreground">
              {item}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function MilestoneRow({ milestone }: { milestone: MilestoneItem }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">{milestone.title}</p>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {milestone.date}
          </p>
        </div>

        <MilestoneBadge status={milestone.status} />
      </div>

      <p className="text-xs font-semibold leading-5 text-muted-foreground">
        {milestone.description}
      </p>
    </article>
  );
}

function CoachNoteRow({ note }: { note: CoachNote }) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <MessageSquare className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{note.title}</p>

          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {note.coach} · {note.date}
          </p>

          <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
            {note.note}
          </p>
        </div>
      </div>
    </article>
  );
}

function RecommendationRow({
  recommendation,
}: {
  recommendation: RecommendationItem;
}) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">{recommendation.title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
            {recommendation.description}
          </p>
        </div>

        <PriorityBadge priority={recommendation.priority} />
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
        {percentage}% of skills
      </p>
    </div>
  );
}

function SkillStatusBadge({ status }: { status: SkillStatus }) {
  const className =
    status === 'excellent'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'good'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {getSkillStatusLabel(status)}
    </span>
  );
}

function MilestoneBadge({ status }: { status: MilestoneStatus }) {
  const className =
    status === 'completed'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'inProgress'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {getMilestoneStatusLabel(status)}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: RecommendationPriority }) {
  const className =
    priority === 'high'
      ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
      : priority === 'medium'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';

  return (
    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {getPriorityLabel(priority)}
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

      <h3 className="text-xl font-black">No skills found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, category filter, or skill status.
      </p>
    </div>
  );
}