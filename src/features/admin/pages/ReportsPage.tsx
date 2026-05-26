import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Percent,
  RefreshCw,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import {
  exportReport,
  getReportsDashboard,
} from '@/features/admin/reports/services/reports.service';
import type {
  BranchPerformanceReportDto,
  CoachPerformanceReportDto,
  ProgramPerformanceReportDto,
  ReportChartPointDto,
  ReportHealthStatus,
  ReportKpiDto,
  ReportPeriod,
  ReportsDashboardDto,
  ReportsFiltersDto,
  ReportSportType,
  StudentAttendanceRiskReportDto,
} from '@/features/admin/reports/types/reports.dto';

const initialFilters: ReportsFiltersDto = {
  period: 'this_month',
  dateFrom: '',
  dateTo: '',
  branchId: 'all',
  programId: 'all',
  coachId: 'all',
  sportType: 'all',
};

// function getPeriodLabelKey(period: ReportPeriod) {
//   return `reportsPage.period.${period}`;
// }

function getSportLabelKey(sport: ReportSportType) {
  return `reportsPage.sport.${sport}`;
}

function getHealthStatusLabelKey(status: ReportHealthStatus) {
  return `reportsPage.healthStatus.${status}`;
}

export default function ReportsPage() {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<ReportsFiltersDto>(initialFilters);
  const [data, setData] = useState<ReportsDashboardDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      setIsLoading(true);

      try {
        const response = await getReportsDashboard(filters);

        if (isMounted) {
          setData(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadReports();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const updateFilter = <K extends keyof ReportsFiltersDto>(
    key: K,
    value: ReportsFiltersDto[K],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setExportMessage('');
  };

  const refreshReports = async () => {
    setIsLoading(true);

    try {
      const response = await getReportsDashboard(filters);
      setData(response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    setExportMessage('');

    try {
      const response = await exportReport({
        reportType: 'full_dashboard',
        format,
        filters,
      });

      setExportMessage(
        t('reportsPage.export.successMessage', {
          fileName: response.fileName,
        }),
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <main className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-4 py-2 text-sm font-black text-brand-blue dark:border-brand-yellow/20 dark:bg-brand-yellow/10 dark:text-brand-yellow">
            <BarChart3 className="h-4 w-4" />
            {t('reportsPage.badge')}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {t('reportsPage.title')}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t('reportsPage.description')}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={refreshReports}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
          >
            <RefreshCw className="h-4 w-4" />
            {t('reportsPage.actions.refresh')}
          </button>

          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-yellow dark:text-brand-blue"
          >
            <Download className="h-4 w-4" />
            {isExporting
              ? t('reportsPage.actions.exporting')
              : t('reportsPage.actions.exportPdf')}
          </button>
        </div>
      </section>

      {exportMessage ? (
        <section className="rounded-[2rem] border border-green-200 bg-green-50 p-5 text-green-800 shadow-sm dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />

            <div>
              <h2 className="text-lg font-black">
                {t('reportsPage.export.successTitle')}
              </h2>

              <p className="mt-1 text-sm font-semibold leading-6">
                {exportMessage}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black">
              <SlidersHorizontal className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
              {t('reportsPage.filters.title')}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t('reportsPage.filters.description')}
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
          >
            <Filter className="h-4 w-4" />
            {t('reportsPage.filters.reset')}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-4">
          <FilterSelect
            label={t('reportsPage.filters.period')}
            value={filters.period ?? 'this_month'}
            options={[
              { value: 'today', label: t('reportsPage.period.today') },
              {
                value: 'this_week',
                label: t('reportsPage.period.this_week'),
              },
              {
                value: 'this_month',
                label: t('reportsPage.period.this_month'),
              },
              {
                value: 'this_quarter',
                label: t('reportsPage.period.this_quarter'),
              },
              {
                value: 'this_year',
                label: t('reportsPage.period.this_year'),
              },
              { value: 'custom', label: t('reportsPage.period.custom') },
            ]}
            onChange={(value) => updateFilter('period', value as ReportPeriod)}
          />

          <FilterSelect
            label={t('reportsPage.filters.branch')}
            value={filters.branchId ?? 'all'}
            allLabel={t('reportsPage.filters.allBranches')}
            options={[
              {
                value: 'branch-dubai',
                label: t('reportsPage.branches.dubai'),
              },
              {
                value: 'branch-abudhabi',
                label: t('reportsPage.branches.abuDhabi'),
              },
              {
                value: 'branch-sharjah',
                label: t('reportsPage.branches.sharjah'),
              },
            ]}
            onChange={(value) => updateFilter('branchId', value)}
            includeAll
          />

          <FilterSelect
            label={t('reportsPage.filters.program')}
            value={filters.programId ?? 'all'}
            allLabel={t('reportsPage.filters.allPrograms')}
            options={[
              {
                value: 'program-001',
                label: t('reportsPage.programs.football'),
              },
              {
                value: 'program-002',
                label: t('reportsPage.programs.swimming'),
              },
              {
                value: 'program-003',
                label: t('reportsPage.programs.basketball'),
              },
              {
                value: 'program-004',
                label: t('reportsPage.programs.multiSport'),
              },
            ]}
            onChange={(value) => updateFilter('programId', value)}
            includeAll
          />

          <FilterSelect
            label={t('reportsPage.filters.sport')}
            value={filters.sportType ?? 'all'}
            allLabel={t('reportsPage.filters.allSports')}
            options={[
              { value: 'football', label: t('reportsPage.sport.football') },
              { value: 'swimming', label: t('reportsPage.sport.swimming') },
              {
                value: 'basketball',
                label: t('reportsPage.sport.basketball'),
              },
              {
                value: 'multi_sport',
                label: t('reportsPage.sport.multi_sport'),
              },
              { value: 'fitness', label: t('reportsPage.sport.fitness') },
              {
                value: 'martial_arts',
                label: t('reportsPage.sport.martial_arts'),
              },
              { value: 'tennis', label: t('reportsPage.sport.tennis') },
              { value: 'other', label: t('reportsPage.sport.other') },
            ]}
            onChange={(value) =>
              updateFilter('sportType', value as ReportSportType | 'all')
            }
            includeAll
          />
        </div>

        {filters.period === 'custom' ? (
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <DateInput
              label={t('reportsPage.filters.dateFrom')}
              value={filters.dateFrom ?? ''}
              onChange={(value) => updateFilter('dateFrom', value)}
            />

            <DateInput
              label={t('reportsPage.filters.dateTo')}
              value={filters.dateTo ?? ''}
              onChange={(value) => updateFilter('dateTo', value)}
            />
          </div>
        ) : null}
      </section>

      {isLoading ? (
        <ReportsLoadingState />
      ) : data ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.kpis.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.58fr_0.42fr]">
            <ReportPanel
              icon={ClipboardCheck}
              title={t('reportsPage.attendanceOverview.title')}
              description={t('reportsPage.attendanceOverview.description')}
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MiniMetric
                  label={t('reportsPage.attendanceOverview.totalStudents')}
                  value={`${data.attendanceOverview.totalStudents}`}
                />

                <MiniMetric
                  label={t('reportsPage.attendanceOverview.completedSheets')}
                  value={`${data.attendanceOverview.completedSheets}`}
                />

                <MiniMetric
                  label={t('reportsPage.attendanceOverview.pendingSheets')}
                  value={`${data.attendanceOverview.pendingSheets}`}
                />

                <MiniMetric
                  label={t('reportsPage.attendanceOverview.presentCount')}
                  value={`${data.attendanceOverview.presentCount}`}
                />

                <MiniMetric
                  label={t('reportsPage.attendanceOverview.absentCount')}
                  value={`${data.attendanceOverview.absentCount}`}
                />

                <MiniMetric
                  label={t('reportsPage.attendanceOverview.lateCount')}
                  value={`${data.attendanceOverview.lateCount}`}
                />
              </div>
            </ReportPanel>

            <ReportPanel
              icon={CalendarDays}
              title={t('reportsPage.scheduleOperations.title')}
              description={t('reportsPage.scheduleOperations.description')}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <MiniMetric
                  label={t('reportsPage.scheduleOperations.totalSessions')}
                  value={`${data.scheduleOperations.totalSessions}`}
                />

                <MiniMetric
                  label={t('reportsPage.scheduleOperations.completedSessions')}
                  value={`${data.scheduleOperations.completedSessions}`}
                />

                <MiniMetric
                  label={t('reportsPage.scheduleOperations.upcomingSessions')}
                  value={`${data.scheduleOperations.upcomingSessions}`}
                />

                <MiniMetric
                  label={t('reportsPage.scheduleOperations.capacityUsage')}
                  value={`${data.scheduleOperations.averageCapacityUsage}%`}
                />
              </div>
            </ReportPanel>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <ChartCard
              title={t('reportsPage.charts.attendanceByStatus')}
              data={data.attendanceByStatusChart}
              suffix=""
            />

            <ChartCard
              title={t('reportsPage.charts.branchAttendance')}
              data={data.branchAttendanceChart}
              suffix="%"
            />

            <ChartCard
              title={t('reportsPage.charts.programAttendance')}
              data={data.programAttendanceChart}
              suffix="%"
            />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <ReportPanel
              icon={Activity}
              title={t('reportsPage.trend.title')}
              description={t('reportsPage.trend.description')}
            >
              <div className="space-y-3">
                {data.attendanceTrend.map((point) => (
                  <TrendRow
                    key={point.date}
                    date={point.date}
                    attendanceRate={point.attendanceRate}
                    sessionsCount={point.sessionsCount}
                    studentsCount={point.studentsCount}
                  />
                ))}
              </div>
            </ReportPanel>

            <ReportPanel
              icon={AlertCircle}
              title={t('reportsPage.studentRisks.title')}
              description={t('reportsPage.studentRisks.description')}
            >
              {data.studentAttendanceRisks.length > 0 ? (
                <div className="space-y-3">
                  {data.studentAttendanceRisks.map((student) => (
                    <StudentRiskCard key={student.studentId} student={student} />
                  ))}
                </div>
              ) : (
                <EmptyMiniState text={t('reportsPage.studentRisks.empty')} />
              )}
            </ReportPanel>
          </section>

          <section className="grid gap-6">
            <PerformanceTable
              icon={BarChart3}
              title={t('reportsPage.branchPerformance.title')}
              description={t('reportsPage.branchPerformance.description')}
            >
              <BranchPerformanceTable rows={data.branchPerformance} />
            </PerformanceTable>

            <PerformanceTable
              icon={Trophy}
              title={t('reportsPage.programPerformance.title')}
              description={t('reportsPage.programPerformance.description')}
            >
              <ProgramPerformanceTable rows={data.programPerformance} />
            </PerformanceTable>

            <PerformanceTable
              icon={Users}
              title={t('reportsPage.coachPerformance.title')}
              description={t('reportsPage.coachPerformance.description')}
            >
              <CoachPerformanceTable rows={data.coachPerformance} />
            </PerformanceTable>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <FileSpreadsheet className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  {t('reportsPage.export.title')}
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {t('reportsPage.export.description')}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <ExportButton
                  label={t('reportsPage.export.pdf')}
                  icon={FileText}
                  disabled={isExporting}
                  onClick={() => handleExport('pdf')}
                />

                <ExportButton
                  label={t('reportsPage.export.excel')}
                  icon={FileSpreadsheet}
                  disabled={isExporting}
                  onClick={() => handleExport('excel')}
                />

                <ExportButton
                  label={t('reportsPage.export.csv')}
                  icon={Download}
                  disabled={isExporting}
                  onClick={() => handleExport('csv')}
                />
              </div>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
  allLabel?: string;
  includeAll?: boolean;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel,
  includeAll = false,
}: FilterSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      >
        {includeAll ? <option value="all">{allLabel}</option> : null}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>

      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      />
    </label>
  );
}

function KpiCard({ kpi }: { kpi: ReportKpiDto }) {
  const { t } = useTranslation();

  const trendIsUp = kpi.trendDirection === 'up';
  const TrendIcon = trendIsUp ? TrendingUp : TrendingDown;

  return (
    <article className="rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Percent className="h-6 w-6" />
        </div>

        <HealthStatusBadge status={kpi.status} />
      </div>

      <p className="mt-5 text-sm font-bold text-muted-foreground">
        {t(`reportsPage.kpi.${kpi.id}.title`, {
          defaultValue: kpi.title,
        })}
      </p>

      <p className="mt-2 text-3xl font-black text-brand-blue dark:text-white">
        {kpi.value}
        {kpi.suffix ?? ''}
      </p>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {t(`reportsPage.kpi.${kpi.id}.description`, {
          defaultValue: kpi.description,
        })}
      </p>

      <div
        className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${trendIsUp
          ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
          : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
          }`}
      >
        <TrendIcon className="h-3.5 w-3.5" />
        {Math.abs(kpi.trendValue)}%
      </div>
    </article>
  );
}

interface ReportPanelProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

function ReportPanel({
  icon: Icon,
  title,
  description,
  children,
}: ReportPanelProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black text-brand-blue dark:text-white">
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  data,
  suffix,
}: {
  title: string;
  data: ReportChartPointDto[];
  suffix: string;
}) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);

  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-black">{title}</h2>

      <div className="mt-5 space-y-4">
        {data.map((point) => {
          const width = `${Math.max((point.value / maxValue) * 100, 4)}%`;

          return (
            <div key={point.label}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="truncate text-sm font-black">{point.label}</p>
                <p className="text-sm font-black text-brand-blue dark:text-brand-yellow">
                  {point.value}
                  {suffix}
                </p>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-brand-blue dark:bg-brand-yellow"
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TrendRow({
  date,
  attendanceRate,
  sessionsCount,
  studentsCount,
}: {
  date: string;
  attendanceRate: number;
  sessionsCount: number;
  studentsCount: number;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black">{date}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {sessionsCount} {t('reportsPage.trend.sessions')} • {studentsCount}{' '}
            {t('reportsPage.trend.students')}
          </p>
        </div>

        <div className="rounded-full bg-brand-blue px-3 py-1 text-xs font-black text-white dark:bg-brand-yellow dark:text-brand-blue">
          {attendanceRate}%
        </div>
      </div>
    </div>
  );
}

function StudentRiskCard({
  student,
}: {
  student: StudentAttendanceRiskReportDto;
}) {
  return (
    <article className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black">{student.studentName}</p>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {student.studentCode} • {student.programName}
          </p>

          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {student.parentName} • {student.parentPhone}
          </p>
        </div>

        <HealthStatusBadge status={student.riskStatus} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <MiniLine label="Rate" value={`${student.attendanceRate}%`} />
        <MiniLine label="Present" value={`${student.presentCount}`} />
        <MiniLine label="Absent" value={`${student.absentCount}`} />
        <MiniLine label="Late" value={`${student.lateCount}`} />
      </div>
    </article>
  );
}

function MiniLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

interface PerformanceTableProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

function PerformanceTable({
  icon: Icon,
  title,
  description,
  children,
}: PerformanceTableProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="flex items-start gap-4 border-b border-border p-5 sm:p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function BranchPerformanceTable({
  rows,
}: {
  rows: BranchPerformanceReportDto[];
}) {
  const { t } = useTranslation();

  return (
    <table className="w-full min-w-[900px] border-collapse">
      <thead>
        <tr className="border-b border-border bg-secondary/60">
          <TableHead>{t('reportsPage.table.branch')}</TableHead>
          <TableHead>{t('reportsPage.table.sessions')}</TableHead>
          <TableHead>{t('reportsPage.table.students')}</TableHead>
          <TableHead>{t('reportsPage.table.capacityUsage')}</TableHead>
          <TableHead>{t('reportsPage.table.attendanceRate')}</TableHead>
          <TableHead>{t('reportsPage.table.absent')}</TableHead>
          <TableHead>{t('reportsPage.table.late')}</TableHead>
          <TableHead>{t('reportsPage.table.status')}</TableHead>
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr
            key={row.branchId}
            className="border-b border-border last:border-b-0 hover:bg-secondary/35"
          >
            <TableCell>
              <div>
                <p className="font-black">{row.branchName}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {row.city} • {row.area}
                </p>
              </div>
            </TableCell>

            <TableCell>
              {row.completedSessions}/{row.totalSessions}
            </TableCell>

            <TableCell>{row.totalStudents}</TableCell>
            <TableCell>{row.capacityUsage}%</TableCell>
            <TableCell>{row.attendanceRate}%</TableCell>
            <TableCell>{row.absentCount}</TableCell>
            <TableCell>{row.lateCount}</TableCell>
            <TableCell>
              <HealthStatusBadge status={row.healthStatus} />
            </TableCell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProgramPerformanceTable({
  rows,
}: {
  rows: ProgramPerformanceReportDto[];
}) {
  const { t } = useTranslation();

  return (
    <table className="w-full min-w-[850px] border-collapse">
      <thead>
        <tr className="border-b border-border bg-secondary/60">
          <TableHead>{t('reportsPage.table.program')}</TableHead>
          <TableHead>{t('reportsPage.table.sport')}</TableHead>
          <TableHead>{t('reportsPage.table.sessions')}</TableHead>
          <TableHead>{t('reportsPage.table.students')}</TableHead>
          <TableHead>{t('reportsPage.table.attendanceRate')}</TableHead>
          <TableHead>{t('reportsPage.table.absent')}</TableHead>
          <TableHead>{t('reportsPage.table.late')}</TableHead>
          <TableHead>{t('reportsPage.table.status')}</TableHead>
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr
            key={row.programId}
            className="border-b border-border last:border-b-0 hover:bg-secondary/35"
          >
            <TableCell>{row.programName}</TableCell>
            <TableCell>{t(getSportLabelKey(row.sportType))}</TableCell>
            <TableCell>
              {row.completedSessions}/{row.totalSessions}
            </TableCell>
            <TableCell>{row.enrolledStudents}</TableCell>
            <TableCell>{row.averageAttendanceRate}%</TableCell>
            <TableCell>{row.absentCount}</TableCell>
            <TableCell>{row.lateCount}</TableCell>
            <TableCell>
              <HealthStatusBadge status={row.healthStatus} />
            </TableCell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CoachPerformanceTable({ rows }: { rows: CoachPerformanceReportDto[] }) {
  const { t } = useTranslation();

  return (
    <table className="w-full min-w-[900px] border-collapse">
      <thead>
        <tr className="border-b border-border bg-secondary/60">
          <TableHead>{t('reportsPage.table.coach')}</TableHead>
          <TableHead>{t('reportsPage.table.sport')}</TableHead>
          <TableHead>{t('reportsPage.table.sessions')}</TableHead>
          <TableHead>{t('reportsPage.table.pendingSheets')}</TableHead>
          <TableHead>{t('reportsPage.table.students')}</TableHead>
          <TableHead>{t('reportsPage.table.attendanceRate')}</TableHead>
          <TableHead>{t('reportsPage.table.absent')}</TableHead>
          <TableHead>{t('reportsPage.table.late')}</TableHead>
          <TableHead>{t('reportsPage.table.status')}</TableHead>
        </tr>
      </thead>

      <tbody>
        {rows.map((row) => (
          <tr
            key={row.coachId}
            className="border-b border-border last:border-b-0 hover:bg-secondary/35"
          >
            <TableCell>{row.coachName}</TableCell>
            <TableCell>{t(getSportLabelKey(row.sportSpecialty))}</TableCell>
            <TableCell>
              {row.completedSessions}/{row.totalSessions}
            </TableCell>
            <TableCell>{row.pendingAttendanceSheets}</TableCell>
            <TableCell>{row.totalStudentsHandled}</TableCell>
            <TableCell>{row.averageAttendanceRate}%</TableCell>
            <TableCell>{row.absentStudentsCount}</TableCell>
            <TableCell>{row.lateStudentsCount}</TableCell>
            <TableCell>
              <HealthStatusBadge status={row.healthStatus} />
            </TableCell>
          </tr>
        ))}
      </tbody>
    </table>
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
  return <td className="px-5 py-4 align-middle text-sm font-semibold">{children}</td>;
}

function HealthStatusBadge({ status }: { status: ReportHealthStatus }) {
  const { t } = useTranslation();

  const getClasses = () => {
    if (status === 'excellent') {
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    }

    if (status === 'good') {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    }

    if (status === 'warning') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
    }

    return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getClasses()}`}
    >
      {t(getHealthStatusLabelKey(status))}
    </span>
  );
}

function ExportButton({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function EmptyMiniState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-center text-sm font-semibold text-muted-foreground">
      {text}
    </div>
  );
}

function ReportsLoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-[2rem] bg-secondary"
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="h-80 animate-pulse rounded-[2rem] bg-secondary" />
        <div className="h-80 animate-pulse rounded-[2rem] bg-secondary" />
      </div>

      <div className="h-96 animate-pulse rounded-[2rem] bg-secondary" />
    </div>
  );
}