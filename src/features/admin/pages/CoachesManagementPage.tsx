import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarCheck,
  CheckCircle2,
  Eye,
  FileWarning,
  Filter,
  Mail,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Star,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getCoachesList } from "@/features/admin/coaches/services/coaches.service";
import type {
  CoachAvailabilityStatus,
  CoachEmploymentType,
  CoachesFiltersDto,
  CoachesListResponseDto,
  CoachListItemDto,
  CoachSkillLevel,
  CoachSportSpecialty,
  CoachStatus,
  FilterOptionDto,
} from "@/features/admin/coaches/types/coaches.dto";

const initialFilters: CoachesFiltersDto = {
  search: "",
  branchId: "all",
  sportSpecialty: "all",
  status: "all",
  availabilityStatus: "all",
  employmentType: "all",
  skillLevel: "all",
};

function getCoachStatusLabelKey(status: CoachStatus) {
  return `coachesPage.status.${status}`;
}

function getAvailabilityLabelKey(status: CoachAvailabilityStatus) {
  return `coachesPage.availability.${status}`;
}

function getEmploymentLabelKey(type: CoachEmploymentType) {
  return `coachesPage.employment.${type}`;
}

function getSkillLevelLabelKey(level: CoachSkillLevel) {
  return `coachesPage.skill.${level}`;
}

function getSportSpecialtyLabelKey(specialty: CoachSportSpecialty) {
  return `coachesPage.specialty.${specialty}`;
}

export default function CoachesManagementPage() {
  const { t } = useTranslation();

  const [data, setData] = useState<CoachesListResponseDto | null>(null);
  const [filters, setFilters] = useState<CoachesFiltersDto>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCoaches = async () => {
      setIsLoading(true);

      try {
        const response = await getCoachesList(filters);

        if (isMounted) {
          setData(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCoaches();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const updateFilter = <K extends keyof CoachesFiltersDto>(
    key: K,
    value: CoachesFiltersDto[K],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const refreshCoaches = async () => {
    setIsLoading(true);

    try {
      const response = await getCoachesList(filters);
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
            <Trophy className="h-4 w-4" />
            {t("coachesPage.badge")}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {t("coachesPage.title")}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t("coachesPage.description")}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={refreshCoaches}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
          >
            <RefreshCw className="h-4 w-4" />
            {t("coachesPage.actions.refresh")}
          </button>

          <Link
            to="/admin/coaches/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
          >
            <Plus className="h-4 w-4" />
            {t("coachesPage.actions.addCoach")}
          </Link>
        </div>
      </section>

      {data && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Users}
            label={t("coachesPage.summary.totalCoaches")}
            value={data.summary.totalCoaches}
            tone="blue"
          />

          <SummaryCard
            icon={CheckCircle2}
            label={t("coachesPage.summary.activeCoaches")}
            value={data.summary.activeCoaches}
            tone="green"
          />

          <SummaryCard
            icon={Activity}
            label={t("coachesPage.summary.availableCoaches")}
            value={data.summary.availableCoaches}
            tone="yellow"
          />

          <SummaryCard
            icon={UserRound}
            label={t("coachesPage.summary.assignedStudents")}
            value={data.summary.totalAssignedStudents}
            tone="red"
          />
        </section>
      )}

      {data && (
        <section className="grid gap-4 lg:grid-cols-2">
          <MetricCard
            icon={Star}
            title={t("coachesPage.metrics.averageRating")}
            value={`${data.summary.averageRating}/5`}
            description={t("coachesPage.metrics.averageRatingDescription")}
          />

          <MetricCard
            icon={CalendarCheck}
            title={t("coachesPage.metrics.attendanceCompletion")}
            value={`${data.summary.averageAttendanceCompletionRate}%`}
            description={t("coachesPage.metrics.attendanceCompletionDescription")}
          />
        </section>
      )}

      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black">
              <SlidersHorizontal className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
              {t("coachesPage.filters.title")}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("coachesPage.filters.description")}
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
          >
            <Filter className="h-4 w-4" />
            {t("coachesPage.filters.reset")}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <label className="block">
            <span className="mb-2 block text-sm font-black">
              {t("coachesPage.filters.search")}
            </span>

            <div className="relative">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                value={filters.search ?? ""}
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder={t("coachesPage.filters.searchPlaceholder")}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </div>
          </label>

          <FilterSelect
            label={t("coachesPage.filters.branch")}
            value={filters.branchId ?? "all"}
            options={data?.filters.branches ?? []}
            allLabel={t("coachesPage.filters.allBranches")}
            onChange={(value) => updateFilter("branchId", value)}
          />

          <FilterSelect
            label={t("coachesPage.filters.specialty")}
            value={filters.sportSpecialty ?? "all"}
            options={[
              { value: "football", label: t("coachesPage.specialty.football") },
              { value: "swimming", label: t("coachesPage.specialty.swimming") },
              { value: "basketball", label: t("coachesPage.specialty.basketball") },
              { value: "multi_sport", label: t("coachesPage.specialty.multi_sport") },
              { value: "fitness", label: t("coachesPage.specialty.fitness") },
              { value: "martial_arts", label: t("coachesPage.specialty.martial_arts") },
              { value: "tennis", label: t("coachesPage.specialty.tennis") },
              { value: "other", label: t("coachesPage.specialty.other") },
            ]}
            allLabel={t("coachesPage.filters.allSpecialties")}
            onChange={(value) =>
              updateFilter(
                "sportSpecialty",
                value as CoachSportSpecialty | "all",
              )
            }
          />

          <FilterSelect
            label={t("coachesPage.filters.status")}
            value={filters.status ?? "all"}
            options={[
              { value: "active", label: t("coachesPage.status.active") },
              { value: "inactive", label: t("coachesPage.status.inactive") },
              { value: "on_leave", label: t("coachesPage.status.on_leave") },
              { value: "suspended", label: t("coachesPage.status.suspended") },
              { value: "archived", label: t("coachesPage.status.archived") },
            ]}
            allLabel={t("coachesPage.filters.allStatuses")}
            onChange={(value) =>
              updateFilter("status", value as CoachStatus | "all")
            }
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FilterSelect
            label={t("coachesPage.filters.availability")}
            value={filters.availabilityStatus ?? "all"}
            options={[
              { value: "available", label: t("coachesPage.availability.available") },
              { value: "busy", label: t("coachesPage.availability.busy") },
              { value: "limited", label: t("coachesPage.availability.limited") },
              { value: "unavailable", label: t("coachesPage.availability.unavailable") },
            ]}
            allLabel={t("coachesPage.filters.allAvailability")}
            onChange={(value) =>
              updateFilter(
                "availabilityStatus",
                value as CoachAvailabilityStatus | "all",
              )
            }
          />

          <FilterSelect
            label={t("coachesPage.filters.employment")}
            value={filters.employmentType ?? "all"}
            options={[
              { value: "full_time", label: t("coachesPage.employment.full_time") },
              { value: "part_time", label: t("coachesPage.employment.part_time") },
              { value: "freelance", label: t("coachesPage.employment.freelance") },
              { value: "contract", label: t("coachesPage.employment.contract") },
            ]}
            allLabel={t("coachesPage.filters.allEmployment")}
            onChange={(value) =>
              updateFilter(
                "employmentType",
                value as CoachEmploymentType | "all",
              )
            }
          />

          <FilterSelect
            label={t("coachesPage.filters.skillLevel")}
            value={filters.skillLevel ?? "all"}
            options={[
              { value: "junior", label: t("coachesPage.skill.junior") },
              { value: "mid_level", label: t("coachesPage.skill.mid_level") },
              { value: "senior", label: t("coachesPage.skill.senior") },
              { value: "expert", label: t("coachesPage.skill.expert") },
            ]}
            allLabel={t("coachesPage.filters.allSkillLevels")}
            onChange={(value) =>
              updateFilter("skillLevel", value as CoachSkillLevel | "all")
            }
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black">
              {t("coachesPage.table.title")}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("coachesPage.table.description")}
            </p>
          </div>

          <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
            {isLoading
              ? t("coachesPage.table.loading")
              : t("coachesPage.table.results", {
                count: data?.coaches.length ?? 0,
              })}
          </div>
        </div>

        {isLoading ? (
          <CoachesLoadingState />
        ) : data && data.coaches.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1200px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/60 text-start">
                    <TableHead>{t("coachesPage.table.coach")}</TableHead>
                    <TableHead>{t("coachesPage.table.contact")}</TableHead>
                    <TableHead>{t("coachesPage.table.specialty")}</TableHead>
                    <TableHead>{t("coachesPage.table.branch")}</TableHead>
                    <TableHead>{t("coachesPage.table.status")}</TableHead>
                    <TableHead>{t("coachesPage.table.availability")}</TableHead>
                    <TableHead>{t("coachesPage.table.students")}</TableHead>
                    <TableHead>{t("coachesPage.table.rating")}</TableHead>
                    <TableHead>{t("coachesPage.table.actions")}</TableHead>
                  </tr>
                </thead>

                <tbody>
                  {data.coaches.map((coach) => (
                    <tr
                      key={coach.id}
                      className="border-b border-border last:border-b-0 hover:bg-secondary/35"
                    >
                      <TableCell>
                        <CoachIdentity coach={coach} />
                      </TableCell>

                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2 text-sm font-semibold">
                            <Phone className="h-4 w-4 text-brand-blue dark:text-brand-yellow" />
                            {coach.phone}
                          </div>

                          <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            {coach.email}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm font-black">
                            {t(getSportSpecialtyLabelKey(coach.sportSpecialty))}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {t(getSkillLevelLabelKey(coach.skillLevel))} •{" "}
                            {t(getEmploymentLabelKey(coach.employmentType))}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm font-black">{coach.branchName}</p>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {coach.weeklySessionsCount}{" "}
                            {t("coachesPage.table.weeklySessions")}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          value={coach.status}
                          label={t(getCoachStatusLabelKey(coach.status))}
                          type="coach"
                        />
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          value={coach.availabilityStatus}
                          label={t(
                            getAvailabilityLabelKey(coach.availabilityStatus),
                          )}
                          type="availability"
                        />
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm font-black">
                            {coach.assignedStudentsCount}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {coach.activeProgramsCount}{" "}
                            {t("coachesPage.table.activePrograms")}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <RatingBlock value={coach.rating} />
                      </TableCell>

                      <TableCell>
                        <CoachActions coachId={coach.id} />
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-5 xl:hidden">
              {data.coaches.map((coach) => (
                <CoachMobileCard key={coach.id} coach={coach} />
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
  tone: "blue" | "green" | "yellow" | "red";
}

function SummaryCard({ icon: Icon, label, value, tone }: SummaryCardProps) {
  const toneClasses: Record<SummaryCardProps["tone"], string> = {
    blue: "bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue",
    green: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
    yellow:
      "bg-brand-yellow text-brand-blue dark:bg-brand-yellow dark:text-brand-blue",
    red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
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
  options: FilterOptionDto[];
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

function CoachIdentity({ coach }: { coach: CoachListItemDto }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <UserRound className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{coach.fullName}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {coach.coachCode}
        </p>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  value: string;
  label: string;
  type: "coach" | "availability";
}

function StatusBadge({ value, label, type }: StatusBadgeProps) {
  const getClasses = () => {
    if (type === "coach") {
      if (value === "active") {
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
      }

      if (value === "on_leave") {
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
      }

      if (value === "suspended") {
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
      }

      if (value === "inactive") {
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      }

      return "bg-secondary text-secondary-foreground";
    }

    if (value === "available") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (value === "busy") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    if (value === "limited") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
    }

    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getClasses()}`}
    >
      {label}
    </span>
  );
}

function RatingBlock({ value }: { value: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2">
      <Star className="h-4 w-4 fill-current text-brand-yellow" />
      <span className="text-sm font-black">{value}/5</span>
    </div>
  );
}

function CoachActions({ coachId }: { coachId: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/admin/coaches/${coachId}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t("coachesPage.actions.view")}
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/coaches/${coachId}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t("coachesPage.actions.edit")}
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

function CoachMobileCard({ coach }: { coach: CoachListItemDto }) {
  const { t } = useTranslation();

  return (
    <article className="rounded-[2rem] border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <CoachIdentity coach={coach} />
        <CoachActions coachId={coach.id} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine
          label={t("coachesPage.table.specialty")}
          value={t(getSportSpecialtyLabelKey(coach.sportSpecialty))}
        />

        <InfoLine
          label={t("coachesPage.table.branch")}
          value={coach.branchName}
        />

        <InfoLine
          label={t("coachesPage.table.students")}
          value={`${coach.assignedStudentsCount}`}
        />

        <InfoLine
          label={t("coachesPage.table.rating")}
          value={`${coach.rating}/5`}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatusBadge
          value={coach.status}
          label={t(getCoachStatusLabelKey(coach.status))}
          type="coach"
        />

        <StatusBadge
          value={coach.availabilityStatus}
          label={t(getAvailabilityLabelKey(coach.availabilityStatus))}
          type="availability"
        />
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

      <h3 className="text-xl font-black">{t("coachesPage.empty.title")}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {t("coachesPage.empty.description")}
      </p>
    </div>
  );
}

function CoachesLoadingState() {
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