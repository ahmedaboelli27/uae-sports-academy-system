import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock,
  Clock3,
  Eye,
  FileWarning,
  Filter,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  WalletCards,
} from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { getScheduleList } from '@/features/admin/schedule/services/schedule.service';
import type {
  ScheduleAttendanceStatus,
  ScheduleDayOfWeek,
  ScheduleFiltersDto,
  ScheduleListItemDto,
  ScheduleListResponseDto,
  ScheduleSessionStatus,
  ScheduleSessionType,
  ScheduleSportType,
} from '@/features/admin/schedule/types/schedule.dto';

const initialFilters: ScheduleFiltersDto = {
  search: '',
  status: 'all',
  sessionType: 'all',
  sportType: 'all',
  attendanceStatus: 'all',
  branchId: 'all',
  programId: 'all',
  coachId: 'all',
  dateFrom: '',
  dateTo: '',
};

function getStatusLabelKey(status: ScheduleSessionStatus) {
  return `schedulePage.status.${status}`;
}

function getSessionTypeLabelKey(type: ScheduleSessionType) {
  return `schedulePage.sessionType.${type}`;
}

function getSportLabelKey(sport: ScheduleSportType) {
  return `schedulePage.sport.${sport}`;
}

function getAttendanceLabelKey(status: ScheduleAttendanceStatus) {
  return `schedulePage.attendance.${status}`;
}

function getDayLabelKey(day: ScheduleDayOfWeek) {
  return `schedulePage.days.${day}`;
}

export default function ScheduleManagementPage() {
  const { t } = useTranslation();

  const [data, setData] = useState<ScheduleListResponseDto | null>(null);
  const [filters, setFilters] = useState<ScheduleFiltersDto>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSessionId, setSelectedSessionId] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadSchedule = async () => {
      setIsLoading(true);

      try {
        const response = await getScheduleList(filters);

        if (isMounted) {
          setData(response);

          setSelectedSessionId((currentId) => {
            if (currentId) {
              return currentId;
            }

            return response.sessions[0]?.id ?? '';
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSchedule();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const selectedSession = useMemo(() => {
    if (!data?.sessions.length) {
      return null;
    }

    return (
      data.sessions.find((session) => session.id === selectedSessionId) ??
      data.sessions[0]
    );
  }, [data?.sessions, selectedSessionId]);

  const postponedOrCancelledCount = useMemo(() => {
    return (
      data?.sessions.filter(
        (session) =>
          session.status === 'cancelled' || session.status === 'postponed',
      ).length ?? 0
    );
  }, [data?.sessions]);

  const attendancePendingCount = useMemo(() => {
    return (
      data?.sessions.filter(
        (session) => session.attendanceStatus !== 'completed',
      ).length ?? 0
    );
  }, [data?.sessions]);

  const updateFilter = <K extends keyof ScheduleFiltersDto>(
    key: K,
    value: ScheduleFiltersDto[K],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const refreshSchedule = async () => {
    setIsLoading(true);

    try {
      const response = await getScheduleList(filters);
      setData(response);

      setSelectedSessionId((currentId) => {
        if (currentId) {
          return currentId;
        }

        return response.sessions[0]?.id ?? '';
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <CalendarDays className="h-4 w-4" />
              {t('schedulePage.badge')}
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {t('schedulePage.title')}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              {t('schedulePage.description')}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refreshSchedule}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                {t('schedulePage.actions.refresh')}
              </button>

              <Link
                to="/admin/schedule/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                {t('schedulePage.actions.addSession')}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric
              icon={CalendarClock}
              label={t('schedulePage.summary.totalSessions')}
              value={data ? `${data.summary.totalSessions}` : '—'}
            />

            <HeroMetric
              icon={Clock}
              label={t('schedulePage.summary.todaySessions')}
              value={data ? `${data.summary.todaySessions}` : '—'}
            />

            <HeroMetric
              icon={CheckCircle2}
              label={t('schedulePage.summary.completedSessions')}
              value={data ? `${data.summary.completedSessions}` : '—'}
            />

            <HeroMetric
              icon={Users}
              label={t('schedulePage.summary.totalStudentsScheduled')}
              value={data ? `${data.summary.totalStudentsScheduled}` : '—'}
            />
          </div>
        </div>
      </section>

      {data && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={CalendarClock}
            label={t('schedulePage.summary.totalSessions')}
            value={data.summary.totalSessions}
            tone="blue"
          />

          <SummaryCard
            icon={Clock}
            label={t('schedulePage.summary.todaySessions')}
            value={data.summary.todaySessions}
            tone="yellow"
          />

          <SummaryCard
            icon={CheckCircle2}
            label={t('schedulePage.summary.completedSessions')}
            value={data.summary.completedSessions}
            tone="green"
          />

          <SummaryCard
            icon={Users}
            label={t('schedulePage.summary.totalStudentsScheduled')}
            value={data.summary.totalStudentsScheduled}
            tone="red"
          />
        </section>
      )}

      {data && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Activity}
            title={t('schedulePage.metrics.capacityUsage')}
            value={`${data.summary.averageCapacityUsage}%`}
            description={t('schedulePage.metrics.capacityUsageDescription')}
          />

          <MetricCard
            icon={CalendarDays}
            title={t('schedulePage.metrics.upcomingSessions')}
            value={`${data.summary.upcomingSessions}`}
            description={t('schedulePage.metrics.upcomingSessionsDescription')}
          />

          <MetricCard
            icon={CalendarCheck}
            title={t('schedulePage.metrics.attendanceCompletion')}
            value={`${data.summary.attendanceCompletedSessions}/${data.summary.totalSessions}`}
            description={t(
              'schedulePage.metrics.attendanceCompletionDescription',
            )}
          />

          <MetricCard
            icon={Clock3}
            title="Pending Attendance"
            value={`${attendancePendingCount}`}
            description="Sessions that still need attendance completion or review."
          />
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-[1fr_26rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <SlidersHorizontal className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  {t('schedulePage.filters.title')}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {t('schedulePage.filters.description')}
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
              >
                <Filter className="h-4 w-4" />
                {t('schedulePage.filters.reset')}
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">
                  {t('schedulePage.filters.search')}
                </span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={filters.search ?? ''}
                    onChange={(event) =>
                      updateFilter('search', event.target.value)
                    }
                    placeholder={t('schedulePage.filters.searchPlaceholder')}
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label={t('schedulePage.filters.status')}
                value={filters.status ?? 'all'}
                allLabel={t('schedulePage.filters.allStatuses')}
                options={[
                  {
                    value: 'scheduled',
                    label: t('schedulePage.status.scheduled'),
                  },
                  {
                    value: 'completed',
                    label: t('schedulePage.status.completed'),
                  },
                  {
                    value: 'cancelled',
                    label: t('schedulePage.status.cancelled'),
                  },
                  {
                    value: 'postponed',
                    label: t('schedulePage.status.postponed'),
                  },
                ]}
                onChange={(value) =>
                  updateFilter(
                    'status',
                    value as ScheduleSessionStatus | 'all',
                  )
                }
              />

              <FilterSelect
                label={t('schedulePage.filters.sessionType')}
                value={filters.sessionType ?? 'all'}
                allLabel={t('schedulePage.filters.allSessionTypes')}
                options={[
                  {
                    value: 'regular_training',
                    label: t('schedulePage.sessionType.regular_training'),
                  },
                  {
                    value: 'trial_session',
                    label: t('schedulePage.sessionType.trial_session'),
                  },
                  {
                    value: 'makeup_session',
                    label: t('schedulePage.sessionType.makeup_session'),
                  },
                  {
                    value: 'assessment',
                    label: t('schedulePage.sessionType.assessment'),
                  },
                  {
                    value: 'private_session',
                    label: t('schedulePage.sessionType.private_session'),
                  },
                  {
                    value: 'event_session',
                    label: t('schedulePage.sessionType.event_session'),
                  },
                ]}
                onChange={(value) =>
                  updateFilter(
                    'sessionType',
                    value as ScheduleSessionType | 'all',
                  )
                }
              />

              <FilterSelect
                label={t('schedulePage.filters.sport')}
                value={filters.sportType ?? 'all'}
                allLabel={t('schedulePage.filters.allSports')}
                options={[
                  { value: 'football', label: t('schedulePage.sport.football') },
                  { value: 'swimming', label: t('schedulePage.sport.swimming') },
                  {
                    value: 'basketball',
                    label: t('schedulePage.sport.basketball'),
                  },
                  {
                    value: 'multi_sport',
                    label: t('schedulePage.sport.multi_sport'),
                  },
                  { value: 'fitness', label: t('schedulePage.sport.fitness') },
                  {
                    value: 'martial_arts',
                    label: t('schedulePage.sport.martial_arts'),
                  },
                  { value: 'tennis', label: t('schedulePage.sport.tennis') },
                  { value: 'other', label: t('schedulePage.sport.other') },
                ]}
                onChange={(value) =>
                  updateFilter(
                    'sportType',
                    value as ScheduleSportType | 'all',
                  )
                }
              />
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-4">
              <FilterSelect
                label={t('schedulePage.filters.attendance')}
                value={filters.attendanceStatus ?? 'all'}
                allLabel={t('schedulePage.filters.allAttendanceStatuses')}
                options={[
                  {
                    value: 'not_taken',
                    label: t('schedulePage.attendance.not_taken'),
                  },
                  {
                    value: 'partially_taken',
                    label: t('schedulePage.attendance.partially_taken'),
                  },
                  {
                    value: 'completed',
                    label: t('schedulePage.attendance.completed'),
                  },
                ]}
                onChange={(value) =>
                  updateFilter(
                    'attendanceStatus',
                    value as ScheduleAttendanceStatus | 'all',
                  )
                }
              />

              <FilterSelect
                label={t('schedulePage.filters.branch')}
                value={filters.branchId ?? 'all'}
                allLabel={t('schedulePage.filters.allBranches')}
                options={[
                  {
                    value: 'branch-dubai',
                    label: t('schedulePage.branches.dubai'),
                  },
                  {
                    value: 'branch-abudhabi',
                    label: t('schedulePage.branches.abuDhabi'),
                  },
                  {
                    value: 'branch-sharjah',
                    label: t('schedulePage.branches.sharjah'),
                  },
                ]}
                onChange={(value) => updateFilter('branchId', value)}
              />

              <DateInput
                label={t('schedulePage.filters.dateFrom')}
                value={filters.dateFrom ?? ''}
                onChange={(value) => updateFilter('dateFrom', value)}
              />

              <DateInput
                label={t('schedulePage.filters.dateTo')}
                value={filters.dateTo ?? ''}
                onChange={(value) => updateFilter('dateTo', value)}
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black">
                  {t('schedulePage.table.title')}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {t('schedulePage.table.description')}
                </p>
              </div>

              <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
                {isLoading
                  ? t('schedulePage.table.loading')
                  : t('schedulePage.table.results', {
                    count: data?.sessions.length ?? 0,
                  })}
              </div>
            </div>

            {isLoading ? (
              <ScheduleLoadingState />
            ) : data && data.sessions.length > 0 ? (
              <>
                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full min-w-[1300px] border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-secondary/60 text-start">
                        <TableHead>{t('schedulePage.table.session')}</TableHead>
                        <TableHead>{t('schedulePage.table.dateTime')}</TableHead>
                        <TableHead>{t('schedulePage.table.program')}</TableHead>
                        <TableHead>{t('schedulePage.table.branch')}</TableHead>
                        <TableHead>{t('schedulePage.table.coach')}</TableHead>
                        <TableHead>{t('schedulePage.table.facility')}</TableHead>
                        <TableHead>{t('schedulePage.table.capacity')}</TableHead>
                        <TableHead>{t('schedulePage.table.status')}</TableHead>
                        <TableHead>{t('schedulePage.table.attendance')}</TableHead>
                        <TableHead>{t('schedulePage.table.actions')}</TableHead>
                      </tr>
                    </thead>

                    <tbody>
                      {data.sessions.map((session) => (
                        <tr
                          key={session.id}
                          onClick={() => setSelectedSessionId(session.id)}
                          className={[
                            'cursor-pointer border-b border-border last:border-b-0 hover:bg-secondary/35',
                            selectedSession?.id === session.id
                              ? 'bg-brand-yellow/10'
                              : '',
                          ].join(' ')}
                        >
                          <TableCell>
                            <SessionIdentity session={session} />
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="text-sm font-black">
                                {session.date}
                              </p>

                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {t(getDayLabelKey(session.dayOfWeek))} •{' '}
                                {session.startTime} - {session.endTime}
                              </p>

                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {session.durationMinutes}{' '}
                                {t('schedulePage.table.minutes')}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="text-sm font-black">
                                {session.programName}
                              </p>

                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {t(getSportLabelKey(session.sportType))}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <LocationBlock
                              branchName={session.branchName}
                              facilityName={session.facilityName}
                            />
                          </TableCell>

                          <TableCell>
                            <CoachBlock coachName={session.coachName} />
                          </TableCell>

                          <TableCell>
                            <p className="text-sm font-black">
                              {session.facilityName}
                            </p>
                          </TableCell>

                          <TableCell>
                            <CapacityBlock
                              students={session.studentsCount}
                              capacity={session.capacity}
                            />
                          </TableCell>

                          <TableCell>
                            <StatusBadge
                              value={session.status}
                              label={t(getStatusLabelKey(session.status))}
                            />
                          </TableCell>

                          <TableCell>
                            <AttendanceBadge
                              value={session.attendanceStatus}
                              label={t(
                                getAttendanceLabelKey(
                                  session.attendanceStatus,
                                ),
                              )}
                            />
                          </TableCell>

                          <TableCell>
                            <SessionActions sessionId={session.id} />
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 p-5 xl:hidden">
                  {data.sessions.map((session) => (
                    <ScheduleMobileCard
                      key={session.id}
                      session={session}
                      active={selectedSession?.id === session.id}
                      onSelect={() => setSelectedSessionId(session.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <SessionDetailsPanel session={selectedSession} />

          <StatusCard
            icon={ShieldCheck}
            title="Operational Core"
            description="Schedule connects programs, branches, coaches, facilities, students, attendance, and reporting."
            tone="success"
          />

          <StatusCard
            icon={Clock3}
            title="Schedule Attention"
            description={`${postponedOrCancelledCount} sessions are postponed/cancelled and ${attendancePendingCount} need attendance review.`}
            tone="warning"
          />
        </aside>
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

function SessionIdentity({ session }: { session: ScheduleListItemDto }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <CalendarClock className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{session.title}</p>

        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {session.sessionCode}
        </p>

        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {t(getSessionTypeLabelKey(session.sessionType))}
        </p>
      </div>
    </div>
  );
}

function LocationBlock({
  branchName,
  facilityName,
}: {
  branchName: string;
  facilityName: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <MapPin className="mt-0.5 h-4 w-4 text-brand-blue dark:text-brand-yellow" />

      <div>
        <p className="text-sm font-black">{branchName}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {facilityName}
        </p>
      </div>
    </div>
  );
}

function CoachBlock({ coachName }: { coachName: string }) {
  return (
    <div className="flex items-start gap-2">
      <UserRound className="mt-0.5 h-4 w-4 text-brand-blue dark:text-brand-yellow" />
      <p className="text-sm font-black">{coachName}</p>
    </div>
  );
}

function CapacityBlock({
  students,
  capacity,
}: {
  students: number;
  capacity: number;
}) {
  const percentage = capacity > 0 ? Math.round((students / capacity) * 100) : 0;

  return (
    <div>
      <p className="text-sm font-black">
        {students}/{capacity}
      </p>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-brand-yellow"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        {percentage}% capacity
      </p>
    </div>
  );
}

function StatusBadge({ value, label }: { value: string; label: string }) {
  const getClasses = () => {
    if (value === 'scheduled') {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
    }

    if (value === 'completed') {
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    }

    if (value === 'cancelled') {
      return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300';
    }

    if (value === 'postponed') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
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

function AttendanceBadge({ value, label }: { value: string; label: string }) {
  const getClasses = () => {
    if (value === 'completed') {
      return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300';
    }

    if (value === 'partially_taken') {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
    }

    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getClasses()}`}
    >
      {label}
    </span>
  );
}

function SessionActions({ sessionId }: { sessionId: string }) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Link
        to={`/admin/schedule/${sessionId}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t('schedulePage.actions.view')}
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/schedule/${sessionId}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t('schedulePage.actions.edit')}
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

function ScheduleMobileCard({
  session,
  active,
  onSelect,
}: {
  session: ScheduleListItemDto;
  active: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();

  return (
    <article
      onClick={onSelect}
      className={[
        'cursor-pointer rounded-[2rem] border p-5 transition',
        active
          ? 'border-brand-yellow bg-brand-yellow/10'
          : 'border-border bg-background hover:bg-secondary/60',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <SessionIdentity session={session} />
        <SessionActions sessionId={session.id} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine
          label={t('schedulePage.table.dateTime')}
          value={`${session.date} • ${session.startTime} - ${session.endTime}`}
        />

        <InfoLine
          label={t('schedulePage.table.program')}
          value={session.programName}
        />

        <InfoLine
          label={t('schedulePage.table.branch')}
          value={session.branchName}
        />

        <InfoLine
          label={t('schedulePage.table.coach')}
          value={session.coachName}
        />

        <InfoLine
          label={t('schedulePage.table.capacity')}
          value={`${session.studentsCount}/${session.capacity}`}
        />

        <InfoLine
          label={t('schedulePage.table.facility')}
          value={session.facilityName}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatusBadge
          value={session.status}
          label={t(getStatusLabelKey(session.status))}
        />

        <AttendanceBadge
          value={session.attendanceStatus}
          label={t(getAttendanceLabelKey(session.attendanceStatus))}
        />
      </div>
    </article>
  );
}

function SessionDetailsPanel({
  session,
}: {
  session: ScheduleListItemDto | null;
}) {
  const { t } = useTranslation();

  if (!session) {
    return (
      <aside className="rounded-[2rem] border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
          <FileWarning className="h-8 w-8" />
        </div>

        <h3 className="text-lg font-black">No session selected</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Select a schedule session from the list to preview operational details.
        </p>
      </aside>
    );
  }

  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <CalendarClock className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          {session.sessionCode}
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {session.title}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {session.date} • {session.startTime} - {session.endTime} •{' '}
          {t(getSessionTypeLabelKey(session.sessionType))}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge
            value={session.status}
            label={t(getStatusLabelKey(session.status))}
          />

          <AttendanceBadge
            value={session.attendanceStatus}
            label={t(getAttendanceLabelKey(session.attendanceStatus))}
          />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={CalendarDays}
          label={t('schedulePage.table.dateTime')}
          value={`${t(getDayLabelKey(session.dayOfWeek))} • ${session.date} • ${session.startTime} - ${session.endTime}`}
        />

        <DetailLine
          icon={Clock3}
          label="Duration"
          value={`${session.durationMinutes} ${t('schedulePage.table.minutes')}`}
        />

        <DetailLine
          icon={WalletCards}
          label={t('schedulePage.table.program')}
          value={`${session.programName} • ${t(getSportLabelKey(session.sportType))}`}
        />

        <DetailLine
          icon={MapPin}
          label={t('schedulePage.table.branch')}
          value={session.branchName}
        />

        <DetailLine
          icon={UserRound}
          label={t('schedulePage.table.coach')}
          value={session.coachName}
        />

        <DetailLine
          icon={ShieldCheck}
          label={t('schedulePage.table.facility')}
          value={session.facilityName}
        />

        <DetailLine
          icon={Users}
          label={t('schedulePage.table.capacity')}
          value={`${session.studentsCount}/${session.capacity} ${t(
            'schedulePage.table.students',
          )}`}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/admin/schedule/${session.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
          >
            <Eye className="h-4 w-4" />
            {t('schedulePage.actions.view')}
          </Link>

          <Link
            to={`/admin/schedule/${session.id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <Pencil className="h-4 w-4" />
            {t('schedulePage.actions.edit')}
          </Link>
        </div>
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

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-black">{value}</p>
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

      <h3 className="text-xl font-black">{t('schedulePage.empty.title')}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {t('schedulePage.empty.description')}
      </p>
    </div>
  );
}

function ScheduleLoadingState() {
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

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: 'success' | 'warning';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
      : 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-blue dark:text-brand-yellow';

  return (
    <article className={`rounded-[2rem] border p-5 ${toneClass}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-current dark:bg-white/10">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="text-sm font-black">{title}</h3>

      <p className="mt-2 text-xs font-bold leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}