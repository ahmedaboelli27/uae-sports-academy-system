import type { LucideIcon } from 'lucide-react';
import {
  CheckCircle2,
  CircleDashed,
  ClipboardCheck,
  Eye,
  FileWarning,
  Filter,
  Lock,
  MapPin,
  Pencil,
  Percent,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserRound,
  Users,
  XCircle
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { getAttendanceList } from '@/features/admin/attendance/services/attendance.service';
import type {
  AttendanceFiltersDto,
  AttendanceListItemDto,
  AttendanceListResponseDto,
  AttendanceRecordStatus,
  AttendanceSessionStatus,
  AttendanceSessionType,
  AttendanceSportType,
} from '@/features/admin/attendance/types/attendance.dto';

const initialFilters: AttendanceFiltersDto = {
  search: '',
  sessionStatus: 'all',
  recordStatus: 'all',
  sessionType: 'all',
  sportType: 'all',
  branchId: 'all',
  programId: 'all',
  coachId: 'all',
  dateFrom: '',
  dateTo: '',
};

function getSessionStatusLabelKey(status: AttendanceSessionStatus) {
  return `attendancePage.sessionStatus.${status}`;
}

function getSessionTypeLabelKey(type: AttendanceSessionType) {
  return `attendancePage.sessionType.${type}`;
}

function getSportLabelKey(sport: AttendanceSportType) {
  return `attendancePage.sport.${sport}`;
}

export default function AttendanceManagementPage() {
  const { t } = useTranslation();

  const [data, setData] = useState<AttendanceListResponseDto | null>(null);
  const [filters, setFilters] =
    useState<AttendanceFiltersDto>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAttendance = async () => {
      setIsLoading(true);

      try {
        const response = await getAttendanceList(filters);

        if (isMounted) {
          setData(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAttendance();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const updateFilter = <K extends keyof AttendanceFiltersDto>(
    key: K,
    value: AttendanceFiltersDto[K],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const refreshAttendance = async () => {
    setIsLoading(true);

    try {
      const response = await getAttendanceList(filters);
      setData(response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-4 py-2 text-sm font-black text-brand-blue dark:border-brand-yellow/20 dark:bg-brand-yellow/10 dark:text-brand-yellow">
            <ClipboardCheck className="h-4 w-4" />
            {t('attendancePage.badge')}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {t('attendancePage.title')}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t('attendancePage.description')}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={refreshAttendance}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
          >
            <RefreshCw className="h-4 w-4" />
            {t('attendancePage.actions.refresh')}
          </button>

          <Link
            to="/admin/attendance/mark"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
          >
            <ClipboardCheck className="h-4 w-4" />
            {t('attendancePage.actions.markAttendance')}
          </Link>
        </div>
      </section>

      {data && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={ClipboardCheck}
            label={t('attendancePage.summary.totalSheets')}
            value={data.summary.totalAttendanceSheets}
            tone="blue"
          />

          <SummaryCard
            icon={CheckCircle2}
            label={t('attendancePage.summary.completedSheets')}
            value={data.summary.completedSheets}
            tone="green"
          />

          <SummaryCard
            icon={CircleDashed}
            label={t('attendancePage.summary.inProgressSheets')}
            value={data.summary.inProgressSheets}
            tone="yellow"
          />

          <SummaryCard
            icon={Lock}
            label={t('attendancePage.summary.lockedSheets')}
            value={data.summary.lockedSheets}
            tone="red"
          />
        </section>
      )}

      {data && (
        <section className="grid gap-4 lg:grid-cols-4">
          <MetricCard
            icon={Users}
            title={t('attendancePage.metrics.totalStudents')}
            value={`${data.summary.totalStudents}`}
            description={t('attendancePage.metrics.totalStudentsDescription')}
          />

          <MetricCard
            icon={CheckCircle2}
            title={t('attendancePage.metrics.present')}
            value={`${data.summary.totalPresent}`}
            description={t('attendancePage.metrics.presentDescription')}
          />

          <MetricCard
            icon={XCircle}
            title={t('attendancePage.metrics.absent')}
            value={`${data.summary.totalAbsent}`}
            description={t('attendancePage.metrics.absentDescription')}
          />

          <MetricCard
            icon={Percent}
            title={t('attendancePage.metrics.averageRate')}
            value={`${data.summary.averageAttendanceRate}%`}
            description={t('attendancePage.metrics.averageRateDescription')}
          />
        </section>
      )}

      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black">
              <SlidersHorizontal className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
              {t('attendancePage.filters.title')}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t('attendancePage.filters.description')}
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
          >
            <Filter className="h-4 w-4" />
            {t('attendancePage.filters.reset')}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <label className="block">
            <span className="mb-2 block text-sm font-black">
              {t('attendancePage.filters.search')}
            </span>

            <div className="relative">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                value={filters.search ?? ''}
                onChange={(event) => updateFilter('search', event.target.value)}
                placeholder={t('attendancePage.filters.searchPlaceholder')}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </div>
          </label>

          <FilterSelect
            label={t('attendancePage.filters.sessionStatus')}
            value={filters.sessionStatus ?? 'all'}
            allLabel={t('attendancePage.filters.allSessionStatuses')}
            options={[
              {
                value: 'not_started',
                label: t('attendancePage.sessionStatus.not_started'),
              },
              {
                value: 'in_progress',
                label: t('attendancePage.sessionStatus.in_progress'),
              },
              {
                value: 'completed',
                label: t('attendancePage.sessionStatus.completed'),
              },
              {
                value: 'locked',
                label: t('attendancePage.sessionStatus.locked'),
              },
            ]}
            onChange={(value) =>
              updateFilter(
                'sessionStatus',
                value as AttendanceSessionStatus | 'all',
              )
            }
          />

          <FilterSelect
            label={t('attendancePage.filters.recordStatus')}
            value={filters.recordStatus ?? 'all'}
            allLabel={t('attendancePage.filters.allRecordStatuses')}
            options={[
              {
                value: 'present',
                label: t('attendancePage.recordStatus.present'),
              },
              {
                value: 'absent',
                label: t('attendancePage.recordStatus.absent'),
              },
              {
                value: 'late',
                label: t('attendancePage.recordStatus.late'),
              },
              {
                value: 'excused',
                label: t('attendancePage.recordStatus.excused'),
              },
              {
                value: 'not_marked',
                label: t('attendancePage.recordStatus.not_marked'),
              },
            ]}
            onChange={(value) =>
              updateFilter(
                'recordStatus',
                value as AttendanceRecordStatus | 'all',
              )
            }
          />

          <FilterSelect
            label={t('attendancePage.filters.sport')}
            value={filters.sportType ?? 'all'}
            allLabel={t('attendancePage.filters.allSports')}
            options={[
              { value: 'football', label: t('attendancePage.sport.football') },
              { value: 'swimming', label: t('attendancePage.sport.swimming') },
              {
                value: 'basketball',
                label: t('attendancePage.sport.basketball'),
              },
              {
                value: 'multi_sport',
                label: t('attendancePage.sport.multi_sport'),
              },
              { value: 'fitness', label: t('attendancePage.sport.fitness') },
              {
                value: 'martial_arts',
                label: t('attendancePage.sport.martial_arts'),
              },
              { value: 'tennis', label: t('attendancePage.sport.tennis') },
              { value: 'other', label: t('attendancePage.sport.other') },
            ]}
            onChange={(value) =>
              updateFilter('sportType', value as AttendanceSportType | 'all')
            }
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          <FilterSelect
            label={t('attendancePage.filters.sessionType')}
            value={filters.sessionType ?? 'all'}
            allLabel={t('attendancePage.filters.allSessionTypes')}
            options={[
              {
                value: 'regular_training',
                label: t('attendancePage.sessionType.regular_training'),
              },
              {
                value: 'trial_session',
                label: t('attendancePage.sessionType.trial_session'),
              },
              {
                value: 'makeup_session',
                label: t('attendancePage.sessionType.makeup_session'),
              },
              {
                value: 'assessment',
                label: t('attendancePage.sessionType.assessment'),
              },
              {
                value: 'private_session',
                label: t('attendancePage.sessionType.private_session'),
              },
              {
                value: 'event_session',
                label: t('attendancePage.sessionType.event_session'),
              },
            ]}
            onChange={(value) =>
              updateFilter(
                'sessionType',
                value as AttendanceSessionType | 'all',
              )
            }
          />

          <FilterSelect
            label={t('attendancePage.filters.branch')}
            value={filters.branchId ?? 'all'}
            allLabel={t('attendancePage.filters.allBranches')}
            options={[
              {
                value: 'branch-dubai',
                label: t('attendancePage.branches.dubai'),
              },
              {
                value: 'branch-abudhabi',
                label: t('attendancePage.branches.abuDhabi'),
              },
              {
                value: 'branch-sharjah',
                label: t('attendancePage.branches.sharjah'),
              },
            ]}
            onChange={(value) => updateFilter('branchId', value)}
          />

          <DateInput
            label={t('attendancePage.filters.dateFrom')}
            value={filters.dateFrom ?? ''}
            onChange={(value) => updateFilter('dateFrom', value)}
          />

          <DateInput
            label={t('attendancePage.filters.dateTo')}
            value={filters.dateTo ?? ''}
            onChange={(value) => updateFilter('dateTo', value)}
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black">
              {t('attendancePage.table.title')}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t('attendancePage.table.description')}
            </p>
          </div>

          <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
            {isLoading
              ? t('attendancePage.table.loading')
              : t('attendancePage.table.results', {
                count: data?.attendanceSheets.length ?? 0,
              })}
          </div>
        </div>

        {isLoading ? (
          <AttendanceLoadingState />
        ) : data && data.attendanceSheets.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1350px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/60 text-start">
                    <TableHead>{t('attendancePage.table.session')}</TableHead>
                    <TableHead>{t('attendancePage.table.dateTime')}</TableHead>
                    <TableHead>{t('attendancePage.table.program')}</TableHead>
                    <TableHead>{t('attendancePage.table.branch')}</TableHead>
                    <TableHead>{t('attendancePage.table.coach')}</TableHead>
                    <TableHead>{t('attendancePage.table.status')}</TableHead>
                    <TableHead>{t('attendancePage.table.students')}</TableHead>
                    <TableHead>{t('attendancePage.table.rate')}</TableHead>
                    <TableHead>{t('attendancePage.table.markedBy')}</TableHead>
                    <TableHead>{t('attendancePage.table.actions')}</TableHead>
                  </tr>
                </thead>

                <tbody>
                  {data.attendanceSheets.map((attendance) => (
                    <tr
                      key={attendance.id}
                      className="border-b border-border last:border-b-0 hover:bg-secondary/35"
                    >
                      <TableCell>
                        <AttendanceIdentity attendance={attendance} />
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm font-black">{attendance.date}</p>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {attendance.startTime} - {attendance.endTime}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm font-black">
                            {attendance.programName}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {t(getSportLabelKey(attendance.sportType))}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 text-brand-blue dark:text-brand-yellow" />

                          <p className="text-sm font-black">
                            {attendance.branchName}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-start gap-2">
                          <UserRound className="mt-0.5 h-4 w-4 text-brand-blue dark:text-brand-yellow" />

                          <p className="text-sm font-black">
                            {attendance.coachName}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <SessionStatusBadge
                          value={attendance.sessionStatus}
                          label={t(
                            getSessionStatusLabelKey(
                              attendance.sessionStatus,
                            ),
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <AttendanceBreakdown attendance={attendance} />
                      </TableCell>

                      <TableCell>
                        <AttendanceRateBadge value={attendance.attendanceRate} />
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm font-black">
                            {attendance.markedBy ??
                              t('attendancePage.common.notAvailable')}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {attendance.markedAt
                              ? attendance.markedAt.slice(0, 10)
                              : t('attendancePage.common.notAvailable')}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <AttendanceActions attendanceId={attendance.id} />
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-5 xl:hidden">
              {data.attendanceSheets.map((attendance) => (
                <AttendanceMobileCard
                  key={attendance.id}
                  attendance={attendance}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </section>
    </main>
  );
}

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: 'blue' | 'green' | 'yellow' | 'red';
}

function SummaryCard({ icon: Icon, label, value, tone }: SummaryCardProps) {
  const toneClasses: Record<SummaryCardProps['tone'], string> = {
    blue: 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue',
    green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    yellow:
      'bg-brand-yellow text-brand-blue dark:bg-brand-yellow dark:text-brand-blue',
    red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  };

  return (
    <article className="rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <p className="mt-5 text-sm font-bold text-muted-foreground">{label}</p>

      <p className="mt-2 text-3xl font-black text-brand-blue dark:text-white">
        {value}
      </p>
    </article>
  );
}

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
}

function MetricCard({ icon: Icon, title, value, description }: MetricCardProps) {
  return (
    <article className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-bold text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-black text-brand-blue dark:text-white">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  allLabel: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      >
        <option value="all">{allLabel}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function DateInput({ label, value, onChange }: DateInputProps) {
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

function AttendanceIdentity({
  attendance,
}: {
  attendance: AttendanceListItemDto;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <ClipboardCheck className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{attendance.sessionTitle}</p>

        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {attendance.attendanceCode} • {attendance.sessionCode}
        </p>

        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {t(getSessionTypeLabelKey(attendance.sessionType))}
        </p>
      </div>
    </div>
  );
}

function SessionStatusBadge({
  value,
  label,
}: {
  value: AttendanceSessionStatus;
  label: string;
}) {
  const getClasses = () => {
    if (value === 'completed') {
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    }

    if (value === 'in_progress') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
    }

    if (value === 'not_started') {
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }

    if (value === 'locked') {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    }

    return 'bg-secondary text-secondary-foreground';
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getClasses()}`}
    >
      {label}
    </span>
  );
}

function AttendanceBreakdown({
  attendance,
}: {
  attendance: AttendanceListItemDto;
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      <p className="text-sm font-black">
        {attendance.totalStudents} {t('attendancePage.table.studentsShort')}
      </p>

      <div className="flex flex-wrap gap-1.5 text-[11px] font-black">
        <CountPill
          label={t('attendancePage.recordStatus.present')}
          value={attendance.presentCount}
          tone="green"
        />

        <CountPill
          label={t('attendancePage.recordStatus.absent')}
          value={attendance.absentCount}
          tone="red"
        />

        <CountPill
          label={t('attendancePage.recordStatus.late')}
          value={attendance.lateCount}
          tone="yellow"
        />

        <CountPill
          label={t('attendancePage.recordStatus.not_marked')}
          value={attendance.notMarkedCount}
          tone="slate"
        />
      </div>
    </div>
  );
}

function CountPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'green' | 'red' | 'yellow' | 'slate';
}) {
  const toneClasses: Record<typeof tone, string> = {
    green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    yellow:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <span className={`rounded-full px-2 py-1 ${toneClasses[tone]}`}>
      {value} {label}
    </span>
  );
}

function AttendanceRateBadge({ value }: { value: number }) {
  const getClasses = () => {
    if (value >= 80) {
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    }

    if (value >= 50) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
    }

    return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getClasses()}`}
    >
      {value}%
    </span>
  );
}

function AttendanceActions({ attendanceId }: { attendanceId: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/admin/attendance/${attendanceId}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t('attendancePage.actions.view')}
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/attendance/${attendanceId}/mark`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t('attendancePage.actions.mark')}
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

function AttendanceMobileCard({
  attendance,
}: {
  attendance: AttendanceListItemDto;
}) {
  const { t } = useTranslation();

  return (
    <article className="rounded-[2rem] border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <AttendanceIdentity attendance={attendance} />
        <AttendanceActions attendanceId={attendance.id} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine
          label={t('attendancePage.table.dateTime')}
          value={`${attendance.date} • ${attendance.startTime} - ${attendance.endTime}`}
        />

        <InfoLine
          label={t('attendancePage.table.program')}
          value={attendance.programName}
        />

        <InfoLine
          label={t('attendancePage.table.branch')}
          value={attendance.branchName}
        />

        <InfoLine
          label={t('attendancePage.table.coach')}
          value={attendance.coachName}
        />

        <InfoLine
          label={t('attendancePage.table.students')}
          value={`${attendance.totalStudents}`}
        />

        <InfoLine
          label={t('attendancePage.table.rate')}
          value={`${attendance.attendanceRate}%`}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <SessionStatusBadge
          value={attendance.sessionStatus}
          label={t(getSessionStatusLabelKey(attendance.sessionStatus))}
        />

        <AttendanceRateBadge value={attendance.attendanceRate} />
      </div>
    </article>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <FileWarning className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">{t('attendancePage.empty.title')}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {t('attendancePage.empty.description')}
      </p>
    </div>
  );
}

function AttendanceLoadingState() {
  return (
    <div className="space-y-4 p-5 sm:p-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-2xl bg-secondary"
        />
      ))}
    </div>
  );
}