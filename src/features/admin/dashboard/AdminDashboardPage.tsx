import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Plus,
  RefreshCw,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
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
};

const programColors = [
  chartColors.blue,
  chartColors.yellow,
  chartColors.blueDark,
  chartColors.gray,
];

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
        title: t("adminDashboard.quickActions.addStudent"),
        href: "/admin/students/new",
        icon: Users,
      },
      {
        title: t("adminDashboard.quickActions.addProgram"),
        href: "/admin/programs/new",
        icon: Trophy,
      },
      {
        title: t("adminDashboard.quickActions.viewPayments"),
        href: "/admin/finance/payments",
        icon: CreditCard,
      },
      {
        title: t("adminDashboard.quickActions.reviewTrials"),
        href: "/admin/trial-requests",
        icon: CalendarCheck,
      },
    ],
    [t],
  );

  if (isLoading) {
    return <DashboardLoadingState />;
  }

  if (!data) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
        <h2 className="text-xl font-black">
          {t("adminDashboard.empty.title")}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {t("adminDashboard.empty.description")}
        </p>

        <button
          type="button"
          onClick={loadDashboard}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark"
        >
          <RefreshCw className="h-4 w-4" />
          {t("adminDashboard.empty.reload")}
        </button>
      </div>
    );
  }

  return (
    <main className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-4 py-2 text-sm font-black text-brand-blue dark:border-brand-yellow/20 dark:bg-brand-yellow/10 dark:text-brand-yellow">
            <BarChart3 className="h-4 w-4" />
            {t("adminDashboard.badge")}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {t("adminDashboard.title")}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t("adminDashboard.description")}
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow hover:shadow-md"
        >
          <RefreshCw className="h-4 w-4" />
          {t("adminDashboard.refresh")}
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.kpis.map((kpi) => (
          <KpiCard key={kpi.id} item={kpi} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ChartCard
          title={t("adminDashboard.charts.revenueTitle")}
          description={t("adminDashboard.charts.revenueDescription")}
        >
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
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartColors.blue}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={chartColors.blue}
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title={t("adminDashboard.charts.programTitle")}
          description={t("adminDashboard.charts.programDescription")}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.programDistribution}
                  dataKey="students"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={4}
                >
                  {data.programDistribution.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={programColors[index % programColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {data.programDistribution.map((program, index) => (
              <div
                key={program.name}
                className="flex items-center justify-between rounded-2xl bg-secondary p-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor:
                        programColors[index % programColors.length],
                    }}
                  />
                  <span className="text-sm font-bold">{program.name}</span>
                </div>

                <span className="text-sm font-black">{program.students}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard
          title={t("adminDashboard.charts.attendanceTitle")}
          description={t("adminDashboard.charts.attendanceDescription")}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="attendanceRate"
                  stroke={chartColors.yellow}
                  strokeWidth={4}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title={t("adminDashboard.charts.branchTitle")}
          description={t("adminDashboard.charts.branchDescription")}
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.branchPerformance}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis dataKey="branch" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />

                <Bar
                  dataKey="students"
                  fill={chartColors.blue}
                  radius={[12, 12, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.7fr_0.3fr]">
        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black">
                {t("adminDashboard.recentActivities.title")}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {t("adminDashboard.recentActivities.description")}
              </p>
            </div>

            <Activity className="h-6 w-6 text-brand-blue dark:text-brand-yellow" />
          </div>

          <div className="space-y-4">
            {data.recentActivities.map((activity) => (
              <RecentActivityItem key={activity.id} item={activity} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black">
              {t("adminDashboard.quickActions.title")}
            </h2>

            <div className="mt-5 grid gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.href}
                    to={action.href}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-brand-yellow hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-sm font-black">{action.title}</span>
                    </div>

                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-black">
              {t("adminDashboard.alerts.title")}
            </h2>

            <div className="mt-5 space-y-3">
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
    <article className="rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
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

      <p className="mt-5 text-sm font-bold text-muted-foreground">
        {t(item.titleKey)}
      </p>

      <h3 className="mt-2 text-3xl font-black text-brand-blue dark:text-white">
        {item.value}
      </h3>

      <p className="mt-2 text-xs font-semibold leading-5 text-muted-foreground">
        {t(item.descriptionKey)}
      </p>
    </article>
  );
}

interface ChartCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-black">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {children}
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
    <div className="flex gap-4 rounded-2xl border border-border bg-background p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
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
      <div className="h-32 animate-pulse rounded-[2rem] bg-secondary" />

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