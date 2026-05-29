import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  FileWarning,
  Plus,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { getAdminDashboardData } from "./services/admin-dashboard.service";
import type {
  AdminDashboardDto,
  DashboardKpiCardDto,
  OperationalAlertDto,
  RecentActivityDto,
} from "./types/admin-dashboard.dto";

const chartColors = {
  blue: "#00129B",
  blueDark: "#000B73",
  yellow: "#FFD400",
  gray: "#5F6368",
  green: "#16A34A",
  red: "#DC2626",
  orange: "#F97316",
  slate: "#64748B",
};

const programColors = [
  chartColors.blue,
  chartColors.yellow,
  chartColors.blueDark,
  chartColors.green,
  chartColors.orange,
  chartColors.gray,
];

function sumBy<T>(items: T[], selector: (item: T) => number) {
  return items.reduce((total, item) => total + selector(item), 0);
}

function safeAverage(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function calculateChange(current: number, previous: number) {
  if (!previous) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(((current - previous) / previous) * 100);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-AE", {
    notation: value >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export default function AdminDashboardPage() {
  const { t } = useTranslation();

  const [data, setData] = useState<AdminDashboardDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = async () => {
    setIsLoading(true);

    try {
      const dashboardData = await getAdminDashboardData();
      setData(dashboardData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const quickActions = useMemo(
    () => [
      {
        title: t("adminDashboard.quickActions.addStudent", {
          defaultValue: "Add Student",
        }),
        description: "Create a new student profile and link it to a parent account.",
        href: "/admin/students/new",
        icon: Users,
      },
      {
        title: t("adminDashboard.quickActions.addProgram", {
          defaultValue: "Add Program",
        }),
        description: "Create or update sports programs and academy packages.",
        href: "/admin/programs/new",
        icon: Trophy,
      },
      {
        title: t("adminDashboard.quickActions.viewPayments", {
          defaultValue: "View Payments",
        }),
        description: "Track incoming payments, refunds, and receipts.",
        href: "/admin/finance/payments",
        icon: CreditCard,
      },
      {
        title: t("adminDashboard.quickActions.reviewTrials", {
          defaultValue: "Review Trials",
        }),
        description: "Follow up on trial requests and conversion opportunities.",
        href: "/admin/trial-requests",
        icon: CalendarCheck,
      },
    ],
    [t],
  );

  const analytics = useMemo(() => {
    if (!data) {
      return null;
    }

    const totalRevenue = sumBy(data.revenueByMonth, (item) => item.revenue);
    const averageMonthlyRevenue = safeAverage(
      data.revenueByMonth.map((item) => item.revenue),
    );

    const lastRevenueMonth = data.revenueByMonth[data.revenueByMonth.length - 1];
    const previousRevenueMonth = data.revenueByMonth[data.revenueByMonth.length - 2];

    const revenueChange = calculateChange(
      lastRevenueMonth?.revenue ?? 0,
      previousRevenueMonth?.revenue ?? 0,
    );

    const bestRevenueMonth = data.revenueByMonth.reduce(
      (best, current) => (current.revenue > best.revenue ? current : best),
      data.revenueByMonth[0] ?? { month: "N/A", revenue: 0 },
    );

    const averageAttendanceRate = safeAverage(
      data.attendanceTrend.map((item) => item.attendanceRate),
    );

    const bestAttendanceDay = data.attendanceTrend.reduce(
      (best, current) =>
        current.attendanceRate > best.attendanceRate ? current : best,
      data.attendanceTrend[0] ?? { day: "N/A", attendanceRate: 0 },
    );

    const totalProgramStudents = sumBy(
      data.programDistribution,
      (item) => item.students,
    );

    const topProgram = data.programDistribution.reduce(
      (best, current) => (current.students > best.students ? current : best),
      data.programDistribution[0] ?? { name: "N/A", students: 0 },
    );

    const totalBranchStudents = sumBy(
      data.branchPerformance,
      (item) => item.students,
    );

    const topBranch = data.branchPerformance.reduce(
      (best, current) => (current.students > best.students ? current : best),
      data.branchPerformance[0] ?? { branch: "N/A", students: 0 },
    );

    const warningAlerts = data.alerts.filter(
      (alert) => alert.severity === "warning",
    ).length;

    const dangerAlerts = data.alerts.filter(
      (alert) => alert.severity === "danger",
    ).length;

    const importantAlerts = warningAlerts + dangerAlerts;

    const alertHealth = data.alerts.length
      ? ((data.alerts.length - importantAlerts) / data.alerts.length) * 100
      : 100;

    const revenueHealth = revenueChange >= 0 ? 100 : 62;
    const activityHealth = Math.min(100, data.recentActivities.length * 16);

    const healthScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          averageAttendanceRate * 0.4 +
          alertHealth * 0.25 +
          revenueHealth * 0.2 +
          activityHealth * 0.15,
        ),
      ),
    );

    return {
      totalRevenue,
      averageMonthlyRevenue,
      revenueChange,
      bestRevenueMonth,
      averageAttendanceRate,
      bestAttendanceDay,
      totalProgramStudents,
      topProgram,
      totalBranchStudents,
      topBranch,
      warningAlerts,
      dangerAlerts,
      importantAlerts,
      healthScore,
    };
  }, [data]);

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (!data || !analytics) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
          <FileWarning className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-black">
          {t("adminDashboard.empty.title", {
            defaultValue: "Dashboard data is not available",
          })}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("adminDashboard.empty.description", {
            defaultValue: "Please reload the dashboard to try again.",
          })}
        </p>

        <button
          type="button"
          onClick={loadDashboard}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-[0_18px_35px_rgba(0,18,155,0.18)] transition hover:-translate-y-0.5 hover:bg-brand-blue-dark"
        >
          <RefreshCw className="h-4 w-4" />
          {t("adminDashboard.empty.reload", {
            defaultValue: "Reload",
          })}
        </button>
      </div>
    );
  }

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <BarChart3 className="h-4 w-4" />
              {t("adminDashboard.badge", {
                defaultValue: "Executive Dashboard",
              })}
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {t("adminDashboard.title", {
                defaultValue: "Academy Performance Command Center",
              })}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              {t("adminDashboard.description", {
                defaultValue:
                  "Monitor students, revenue, attendance, branches, programs, recent activities, and operational risks from one unified dashboard.",
              })}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={loadDashboard}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                {t("adminDashboard.refresh", {
                  defaultValue: "Refresh dashboard",
                })}
              </button>

              <Link
                to="/admin/reports"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Eye className="h-4 w-4" />
                View Full Reports
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={WalletCards}
              label="Total revenue"
              value={formatCurrency(analytics.totalRevenue)}
              caption={`${analytics.revenueChange >= 0 ? "+" : ""}${analytics.revenueChange
                }% vs previous month`}
              positive={analytics.revenueChange >= 0}
            />

            <HeroMetricCard
              icon={CalendarCheck}
              label="Attendance average"
              value={formatPercent(analytics.averageAttendanceRate)}
              caption={`Best day: ${analytics.bestAttendanceDay.day}`}
              positive={analytics.averageAttendanceRate >= 75}
            />

            <HeroMetricCard
              icon={Trophy}
              label="Top program"
              value={analytics.topProgram.name}
              caption={`${analytics.topProgram.students} students`}
              positive
            />

            <HeroMetricCard
              icon={Building2}
              label="Top branch"
              value={analytics.topBranch.branch}
              caption={`${analytics.topBranch.students} students`}
              positive
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ExecutiveCard
          icon={Target}
          title="Operational Health"
          value={`${analytics.healthScore}%`}
          description="Composite score based on attendance, revenue direction, alerts, and activity."
          tone={analytics.healthScore >= 80 ? "success" : "warning"}
        />

        <ExecutiveCard
          icon={DollarSign}
          title="Monthly Average"
          value={formatCurrency(analytics.averageMonthlyRevenue)}
          description={`Best revenue month: ${analytics.bestRevenueMonth.month}`}
          tone="brand"
        />

        <ExecutiveCard
          icon={Users}
          title="Students in Programs"
          value={formatCompactNumber(analytics.totalProgramStudents)}
          description={`${analytics.topProgram.name} is currently the leading program.`}
          tone="blue"
        />

        <ExecutiveCard
          icon={AlertTriangle}
          title="Critical Attention"
          value={`${analytics.importantAlerts}`}
          description={`${analytics.dangerAlerts} danger alerts and ${analytics.warningAlerts} warnings.`}
          tone={analytics.importantAlerts > 0 ? "danger" : "success"}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} item={kpi} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <ChartCard
          icon={DollarSign}
          title={t("adminDashboard.charts.revenueTitle", {
            defaultValue: "Revenue Trend",
          })}
          description={t("adminDashboard.charts.revenueDescription", {
            defaultValue:
              "Monthly revenue movement with a clear view of growth direction.",
          })}
          action={
            <TrendBadge
              value={analytics.revenueChange}
              label="Revenue change"
            />
          }
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_16rem]">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.revenueByMonth}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartColors.blue}
                        stopOpacity={0.36}
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
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => formatCompactNumber(Number(value))}
                  />
                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke={chartColors.blue}
                    strokeWidth={4}
                    fill="url(#revenueGradient)"
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid gap-3">
              <MiniInsightCard
                icon={WalletCards}
                label="Total revenue"
                value={formatCurrency(analytics.totalRevenue)}
              />

              <MiniInsightCard
                icon={DollarSign}
                label="Average month"
                value={formatCurrency(analytics.averageMonthlyRevenue)}
              />

              <MiniInsightCard
                icon={TrendingUp}
                label="Best month"
                value={`${analytics.bestRevenueMonth.month} · ${formatCurrency(
                  analytics.bestRevenueMonth.revenue,
                )}`}
              />
            </div>
          </div>
        </ChartCard>

        <ChartCard
          icon={Target}
          title="Academy Health Score"
          description="A quick operational pulse for leadership review."
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="72%"
                outerRadius="100%"
                data={[
                  {
                    name: "Health",
                    value: analytics.healthScore,
                    fill:
                      analytics.healthScore >= 80
                        ? chartColors.green
                        : analytics.healthScore >= 60
                          ? chartColors.yellow
                          : chartColors.red,
                  },
                ]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar dataKey="value" cornerRadius={18} background />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>

          <div className="-mt-40 flex h-32 flex-col items-center justify-center text-center">
            <p className="text-5xl font-black text-brand-blue dark:text-white">
              {analytics.healthScore}%
            </p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Overall score
            </p>
          </div>

          <div className="mt-12 grid gap-3">
            <HealthLine
              label="Attendance"
              value={analytics.averageAttendanceRate}
            />
            <HealthLine
              label="Alert safety"
              value={
                data.alerts.length
                  ? Math.round(
                    ((data.alerts.length - analytics.importantAlerts) /
                      data.alerts.length) *
                    100,
                  )
                  : 100
              }
            />
            <HealthLine
              label="Activity flow"
              value={Math.min(100, data.recentActivities.length * 16)}
            />
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          icon={CalendarCheck}
          title={t("adminDashboard.charts.attendanceTitle", {
            defaultValue: "Attendance Intelligence",
          })}
          description={t("adminDashboard.charts.attendanceDescription", {
            defaultValue:
              "Attendance performance across the selected operating period.",
          })}
          action={
            <span className="rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
              Avg {analytics.averageAttendanceRate}%
            </span>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="attendanceRate"
                  stroke={chartColors.yellow}
                  strokeWidth={5}
                  dot={{
                    r: 5,
                    strokeWidth: 2,
                    stroke: chartColors.blue,
                    fill: chartColors.yellow,
                  }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          icon={Trophy}
          title={t("adminDashboard.charts.programTitle", {
            defaultValue: "Program Distribution",
          })}
          description={t("adminDashboard.charts.programDescription", {
            defaultValue:
              "Student distribution across active academy programs.",
          })}
          action={
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
              {analytics.totalProgramStudents} students
            </span>
          }
        >
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.programDistribution}
                    dataKey="students"
                    nameKey="name"
                    innerRadius={68}
                    outerRadius={108}
                    paddingAngle={5}
                  >
                    {data.programDistribution.map((program, index) => (
                      <Cell
                        key={program.name}
                        fill={programColors[index % programColors.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {data.programDistribution.map((program, index) => {
                const percentage = analytics.totalProgramStudents
                  ? Math.round(
                    (program.students / analytics.totalProgramStudents) * 100,
                  )
                  : 0;

                return (
                  <DistributionRow
                    key={program.name}
                    label={program.name}
                    value={program.students}
                    percentage={percentage}
                    color={programColors[index % programColors.length]}
                  />
                );
              })}
            </div>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard
          icon={BarChart3}
          title={t("adminDashboard.charts.branchTitle", {
            defaultValue: "Branch Performance",
          })}
          description={t("adminDashboard.charts.branchDescription", {
            defaultValue:
              "Student load and performance distribution across academy branches.",
          })}
          action={
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
              Top: {analytics.topBranch.branch}
            </span>
          }
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.branchPerformance}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                <XAxis dataKey="branch" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />

                <Bar
                  dataKey="students"
                  fill={chartColors.blue}
                  radius={[14, 14, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="grid gap-6">
          <InsightPanel
            title="Management Insights"
            description="Key readings generated from the current dashboard data."
            items={[
              {
                icon: TrendingUp,
                title: "Revenue momentum",
                value:
                  analytics.revenueChange >= 0
                    ? `Revenue is up by ${analytics.revenueChange}%`
                    : `Revenue is down by ${Math.abs(
                      analytics.revenueChange,
                    )}%`,
                tone: analytics.revenueChange >= 0 ? "success" : "danger",
              },
              {
                icon: CalendarCheck,
                title: "Attendance quality",
                value: `${analytics.averageAttendanceRate}% average attendance rate`,
                tone:
                  analytics.averageAttendanceRate >= 75 ? "success" : "warning",
              },
              {
                icon: Trophy,
                title: "Program demand",
                value: `${analytics.topProgram.name} leads with ${analytics.topProgram.students} students`,
                tone: "brand",
              },
              {
                icon: ShieldAlert,
                title: "Alerts requiring action",
                value: `${analytics.importantAlerts} important alerts detected`,
                tone: analytics.importantAlerts > 0 ? "danger" : "success",
              },
            ]}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.42fr]">
        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black">
                {t("adminDashboard.recentActivities.title", {
                  defaultValue: "Recent Activities",
                })}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {t("adminDashboard.recentActivities.description", {
                  defaultValue:
                    "Latest operational actions across students, payments, trials, renewals, and attendance.",
                })}
              </p>
            </div>

            <Activity className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
          </div>

          <div className="grid gap-4">
            {data.recentActivities.map((activity) => (
              <RecentActivityItem key={activity.id} item={activity} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  {t("adminDashboard.quickActions.title", {
                    defaultValue: "Quick Actions",
                  })}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Most frequent admin shortcuts.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.href}
                    to={action.href}
                    className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue text-white transition group-hover:scale-105 dark:bg-brand-yellow dark:text-brand-blue">
                        <Icon className="h-5 w-5" />
                      </div>

                      <div>
                        <span className="text-sm font-black">{action.title}</span>
                        <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>

                    <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">
                  {t("adminDashboard.alerts.title", {
                    defaultValue: "Operational Alerts",
                  })}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Alerts that may require admin action.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {data.alerts.map((alert) => (
                <AlertItem key={alert.id} item={alert} />
              ))}
            </div>
          </div>
        </div>
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
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black",
            positive
              ? "bg-green-400/15 text-green-200"
              : "bg-red-400/15 text-red-200",
          ].join(" ")}
        >
          {positive ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
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

function ExecutiveCard({
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
  tone: "brand" | "blue" | "success" | "warning" | "danger";
}) {
  const toneClasses = {
    brand:
      "bg-brand-yellow text-brand-blue border-brand-yellow/40 dark:bg-brand-yellow dark:text-brand-blue",
    blue: "bg-brand-blue text-white border-brand-blue/30 dark:bg-brand-yellow dark:text-brand-blue",
    success:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900",
    warning:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-900",
    danger:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  };

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute -end-10 -top-10 h-24 w-24 rounded-full bg-brand-yellow/10 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${toneClasses[tone]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
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

function KpiCard({ item }: { item: DashboardKpiCardDto }) {
  const { t } = useTranslation();

  const iconMap: Record<string, LucideIcon> = {
    "total-students": Users,
    "active-students": CheckCircle2,
    "monthly-revenue": DollarSign,
    "pending-payments": Clock,
    "attendance-rate": CalendarCheck,
    "trial-conversion": ArrowUpRight,
  };

  const Icon = iconMap[item.id] ?? BarChart3;

  const TrendIcon =
    item.trend === "up"
      ? TrendingUp
      : item.trend === "down"
        ? TrendingDown
        : BarChart3;

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute -end-8 -top-8 h-24 w-24 rounded-full bg-brand-yellow/10 blur-2xl transition group-hover:bg-brand-yellow/20" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-[0_14px_35px_rgba(0,18,155,0.16)] dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-6 w-6" />
        </div>

        <div
          className={[
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black",
            item.trend === "up"
              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
              : item.trend === "down"
                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                : "bg-secondary text-secondary-foreground",
          ].join(" ")}
        >
          <TrendIcon className="h-3.5 w-3.5" />
          {item.change}
        </div>
      </div>

      <p className="relative mt-5 text-sm font-bold text-muted-foreground">
        {t(item.titleKey)}
      </p>

      <h3 className="relative mt-2 text-3xl font-black text-brand-blue dark:text-white">
        {item.value}
      </h3>

      <p className="relative mt-2 text-xs font-semibold leading-5 text-muted-foreground">
        {t(item.descriptionKey)}
      </p>
    </article>
  );
}

interface ChartCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
}

function ChartCard({
  icon: Icon,
  title,
  description,
  action,
  children,
}: ChartCardProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="absolute -end-12 -top-12 h-32 w-32 rounded-full bg-brand-yellow/10 blur-3xl" />

      <div className="relative mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
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

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div className="relative">{children}</div>
    </section>
  );
}

function MiniInsightCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-black">{value}</p>
    </article>
  );
}

function TrendBadge({ value, label }: { value: number; label: string }) {
  const isPositive = value >= 0;

  return (
    <span
      className={[
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black",
        isPositive
          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
      ].join(" ")}
    >
      {isPositive ? (
        <TrendingUp className="h-3.5 w-3.5" />
      ) : (
        <TrendingDown className="h-3.5 w-3.5" />
      )}
      {label}: {isPositive ? "+" : ""}
      {value}%
    </span>
  );
}

function HealthLine({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-black">
        <span>{label}</span>
        <span>{value}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-brand-yellow"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

function DistributionRow({
  label,
  value,
  percentage,
  color,
}: {
  label: string;
  value: number;
  percentage: number;
  color: string;
}) {
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
        {percentage}% of total students
      </p>
    </div>
  );
}

function InsightPanel({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: Array<{
    icon: LucideIcon;
    title: string;
    value: string;
    tone: "success" | "warning" | "danger" | "brand";
  }>;
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-black">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="grid gap-3">
        {items.map((item) => {
          const Icon = item.icon;

          const toneClasses = {
            success:
              "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
            warning:
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
            danger:
              "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
            brand:
              "bg-brand-yellow text-brand-blue dark:bg-brand-yellow dark:text-brand-blue",
          };

          return (
            <article
              key={item.title}
              className="flex gap-3 rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneClasses[item.tone]}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-black">{item.title}</p>
                <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
                  {item.value}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function RecentActivityItem({ item }: { item: RecentActivityDto }) {
  const iconMap: Record<RecentActivityDto["type"], LucideIcon> = {
    registration: Users,
    payment: CreditCard,
    attendance: CalendarCheck,
    trial: Trophy,
    renewal: RefreshCw,
  };

  const Icon = iconMap[item.type];

  return (
    <div className="group flex gap-4 rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-brand-yellow hover:shadow-sm dark:bg-white/[0.04]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white dark:bg-brand-yellow/10 dark:text-brand-yellow">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-black">{item.title}</h3>

          <span className="text-xs font-bold text-muted-foreground">
            {item.time}
          </span>
        </div>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {item.description}
        </p>
      </div>
    </div>
  );
}

function AlertItem({ item }: { item: OperationalAlertDto }) {
  const severityClass: Record<OperationalAlertDto["severity"], string> = {
    info: "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
    warning:
      "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-900 dark:bg-yellow-950/40 dark:text-yellow-300",
    danger:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
    success:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300",
  };

  const Icon = item.severity === "danger" ? ShieldAlert : AlertTriangle;

  return (
    <div className={`rounded-2xl border p-4 ${severityClass[item.severity]}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 shrink-0" />

        <div>
          <h3 className="text-sm font-black">{item.title}</h3>

          <p className="mt-1 text-xs font-semibold leading-5">
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

function DashboardLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-64 animate-pulse rounded-[2rem] bg-secondary" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-40 animate-pulse rounded-[2rem] bg-secondary"
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-[2rem] bg-secondary"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-96 animate-pulse rounded-[2rem] bg-secondary" />
        <div className="h-96 animate-pulse rounded-[2rem] bg-secondary" />
      </div>
    </div>
  );
}