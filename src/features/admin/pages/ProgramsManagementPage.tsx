import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Eye,
  FileWarning,
  Filter,
  Layers,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Star,
  Trophy,
  Users
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getProgramsList } from "@/features/admin/programs/services/programs.service";
import type {
  ProgramAgeGroup,
  ProgramEnrollmentStatus,
  ProgramLevel,
  ProgramListItemDto,
  ProgramsFiltersDto,
  ProgramsListResponseDto,
  ProgramSportType,
  ProgramStatus,
} from "@/features/admin/programs/types/programs.dto";

const initialFilters: ProgramsFiltersDto = {
  search: "",
  sportType: "all",
  level: "all",
  ageGroup: "all",
  status: "all",
  enrollmentStatus: "all",
};

function getProgramStatusLabelKey(status: ProgramStatus) {
  return `programsPage.status.${status}`;
}

function getEnrollmentStatusLabelKey(status: ProgramEnrollmentStatus) {
  return `programsPage.enrollment.${status}`;
}

function getSportTypeLabelKey(sportType: ProgramSportType) {
  return `programsPage.sport.${sportType}`;
}

function getLevelLabelKey(level: ProgramLevel) {
  return `programsPage.level.${level}`;
}

function getAgeGroupLabelKey(ageGroup: ProgramAgeGroup) {
  return `programsPage.ageGroup.${ageGroup}`;
}

export default function ProgramsManagementPage() {
  const { t } = useTranslation();

  const [data, setData] = useState<ProgramsListResponseDto | null>(null);
  const [filters, setFilters] = useState<ProgramsFiltersDto>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPrograms = async () => {
      setIsLoading(true);

      try {
        const response = await getProgramsList(filters);

        if (isMounted) {
          setData(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPrograms();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const updateFilter = <K extends keyof ProgramsFiltersDto>(
    key: K,
    value: ProgramsFiltersDto[K],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const refreshPrograms = async () => {
    setIsLoading(true);

    try {
      const response = await getProgramsList(filters);
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
            <Layers className="h-4 w-4" />
            {t("programsPage.badge")}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {t("programsPage.title")}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t("programsPage.description")}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={refreshPrograms}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
          >
            <RefreshCw className="h-4 w-4" />
            {t("programsPage.actions.refresh")}
          </button>

          <Link
            to="/admin/programs/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
          >
            <Plus className="h-4 w-4" />
            {t("programsPage.actions.addProgram")}
          </Link>
        </div>
      </section>

      {data && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Layers}
            label={t("programsPage.summary.totalPrograms")}
            value={data.summary.totalPrograms}
            tone="blue"
          />

          <SummaryCard
            icon={CheckCircle2}
            label={t("programsPage.summary.activePrograms")}
            value={data.summary.activePrograms}
            tone="green"
          />

          <SummaryCard
            icon={Trophy}
            label={t("programsPage.summary.openEnrollment")}
            value={data.summary.openEnrollmentPrograms}
            tone="yellow"
          />

          <SummaryCard
            icon={Users}
            label={t("programsPage.summary.enrolledStudents")}
            value={data.summary.totalEnrolledStudents}
            tone="red"
          />
        </section>
      )}

      {data && (
        <section className="grid gap-4 lg:grid-cols-3">
          <MetricCard
            icon={BarChart3}
            title={t("programsPage.metrics.capacity")}
            value={`${data.summary.totalEnrolledStudents}/${data.summary.totalCapacity}`}
            description={t("programsPage.metrics.capacityDescription")}
          />

          <MetricCard
            icon={Activity}
            title={t("programsPage.metrics.averageAttendance")}
            value={`${data.summary.averageAttendance}%`}
            description={t("programsPage.metrics.averageAttendanceDescription")}
          />

          <MetricCard
            icon={Star}
            title={t("programsPage.metrics.averageRating")}
            value={`${data.summary.averageRating}/5`}
            description={t("programsPage.metrics.averageRatingDescription")}
          />
        </section>
      )}

      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black">
              <SlidersHorizontal className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
              {t("programsPage.filters.title")}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("programsPage.filters.description")}
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
          >
            <Filter className="h-4 w-4" />
            {t("programsPage.filters.reset")}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <label className="block">
            <span className="mb-2 block text-sm font-black">
              {t("programsPage.filters.search")}
            </span>

            <div className="relative">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                value={filters.search ?? ""}
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder={t("programsPage.filters.searchPlaceholder")}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </div>
          </label>

          <FilterSelect
            label={t("programsPage.filters.sport")}
            value={filters.sportType ?? "all"}
            allLabel={t("programsPage.filters.allSports")}
            options={[
              { value: "football", label: t("programsPage.sport.football") },
              { value: "swimming", label: t("programsPage.sport.swimming") },
              { value: "basketball", label: t("programsPage.sport.basketball") },
              { value: "multi_sport", label: t("programsPage.sport.multi_sport") },
              { value: "fitness", label: t("programsPage.sport.fitness") },
              { value: "martial_arts", label: t("programsPage.sport.martial_arts") },
              { value: "tennis", label: t("programsPage.sport.tennis") },
              { value: "other", label: t("programsPage.sport.other") },
            ]}
            onChange={(value) =>
              updateFilter("sportType", value as ProgramSportType | "all")
            }
          />

          <FilterSelect
            label={t("programsPage.filters.level")}
            value={filters.level ?? "all"}
            allLabel={t("programsPage.filters.allLevels")}
            options={[
              { value: "beginner", label: t("programsPage.level.beginner") },
              { value: "intermediate", label: t("programsPage.level.intermediate") },
              { value: "advanced", label: t("programsPage.level.advanced") },
              { value: "elite", label: t("programsPage.level.elite") },
              { value: "all_levels", label: t("programsPage.level.all_levels") },
            ]}
            onChange={(value) =>
              updateFilter("level", value as ProgramLevel | "all")
            }
          />

          <FilterSelect
            label={t("programsPage.filters.ageGroup")}
            value={filters.ageGroup ?? "all"}
            allLabel={t("programsPage.filters.allAgeGroups")}
            options={[
              { value: "kids", label: t("programsPage.ageGroup.kids") },
              { value: "juniors", label: t("programsPage.ageGroup.juniors") },
              { value: "teens", label: t("programsPage.ageGroup.teens") },
              { value: "adults", label: t("programsPage.ageGroup.adults") },
              { value: "all_ages", label: t("programsPage.ageGroup.all_ages") },
            ]}
            onChange={(value) =>
              updateFilter("ageGroup", value as ProgramAgeGroup | "all")
            }
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FilterSelect
            label={t("programsPage.filters.status")}
            value={filters.status ?? "all"}
            allLabel={t("programsPage.filters.allStatuses")}
            options={[
              { value: "active", label: t("programsPage.status.active") },
              { value: "inactive", label: t("programsPage.status.inactive") },
              { value: "draft", label: t("programsPage.status.draft") },
              { value: "archived", label: t("programsPage.status.archived") },
              { value: "seasonal", label: t("programsPage.status.seasonal") },
            ]}
            onChange={(value) =>
              updateFilter("status", value as ProgramStatus | "all")
            }
          />

          <FilterSelect
            label={t("programsPage.filters.enrollment")}
            value={filters.enrollmentStatus ?? "all"}
            allLabel={t("programsPage.filters.allEnrollmentStatuses")}
            options={[
              { value: "open", label: t("programsPage.enrollment.open") },
              { value: "limited", label: t("programsPage.enrollment.limited") },
              { value: "full", label: t("programsPage.enrollment.full") },
              { value: "closed", label: t("programsPage.enrollment.closed") },
            ]}
            onChange={(value) =>
              updateFilter(
                "enrollmentStatus",
                value as ProgramEnrollmentStatus | "all",
              )
            }
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black">
              {t("programsPage.table.title")}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("programsPage.table.description")}
            </p>
          </div>

          <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
            {isLoading
              ? t("programsPage.table.loading")
              : t("programsPage.table.results", {
                count: data?.programs.length ?? 0,
              })}
          </div>
        </div>

        {isLoading ? (
          <ProgramsLoadingState />
        ) : data && data.programs.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1200px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/60 text-start">
                    <TableHead>{t("programsPage.table.program")}</TableHead>
                    <TableHead>{t("programsPage.table.sport")}</TableHead>
                    <TableHead>{t("programsPage.table.ageLevel")}</TableHead>
                    <TableHead>{t("programsPage.table.capacity")}</TableHead>
                    <TableHead>{t("programsPage.table.price")}</TableHead>
                    <TableHead>{t("programsPage.table.status")}</TableHead>
                    <TableHead>{t("programsPage.table.enrollment")}</TableHead>
                    <TableHead>{t("programsPage.table.performance")}</TableHead>
                    <TableHead>{t("programsPage.table.actions")}</TableHead>
                  </tr>
                </thead>

                <tbody>
                  {data.programs.map((program) => (
                    <tr
                      key={program.id}
                      className="border-b border-border last:border-b-0 hover:bg-secondary/35"
                    >
                      <TableCell>
                        <ProgramIdentity program={program} />
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm font-black">
                            {t(getSportTypeLabelKey(program.sportType))}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {program.branchesCount}{" "}
                            {t("programsPage.table.branches")} •{" "}
                            {program.coachesCount}{" "}
                            {t("programsPage.table.coaches")}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm font-black">
                            {t(getAgeGroupLabelKey(program.ageGroup))}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {t(getLevelLabelKey(program.level))} •{" "}
                            {program.minAge}-{program.maxAge}{" "}
                            {t("programsPage.table.years")}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="text-sm font-black">
                            {program.enrolledStudentsCount}/{program.capacity}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {t("programsPage.table.students")}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="text-sm font-black text-brand-blue dark:text-brand-yellow">
                          {program.monthlyPrice} {program.currency}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-muted-foreground">
                          {t("programsPage.table.monthly")}
                        </p>
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          value={program.status}
                          label={t(getProgramStatusLabelKey(program.status))}
                          type="program"
                        />
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          value={program.enrollmentStatus}
                          label={t(
                            getEnrollmentStatusLabelKey(
                              program.enrollmentStatus,
                            ),
                          )}
                          type="enrollment"
                        />
                      </TableCell>

                      <TableCell>
                        <div className="space-y-2">
                          <RatingBlock value={program.rating} />

                          <p className="text-xs font-semibold text-muted-foreground">
                            {program.attendanceAverage}%{" "}
                            {t("programsPage.table.attendance")}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <ProgramActions programId={program.id} />
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-5 xl:hidden">
              {data.programs.map((program) => (
                <ProgramMobileCard key={program.id} program={program} />
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

function ProgramIdentity({ program }: { program: ProgramListItemDto }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <Layers className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{program.name}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {program.programCode}
        </p>
        <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
          {program.shortDescription}
        </p>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  value: string;
  label: string;
  type: "program" | "enrollment";
}

function StatusBadge({ value, label, type }: StatusBadgeProps) {
  const getClasses = () => {
    if (type === "program") {
      if (value === "active") {
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
      }

      if (value === "draft") {
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
      }

      if (value === "seasonal") {
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
      }

      if (value === "inactive") {
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      }

      return "bg-secondary text-secondary-foreground";
    }

    if (value === "open") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (value === "limited") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
    }

    if (value === "full") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
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

function ProgramActions({ programId }: { programId: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/admin/programs/${programId}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t("programsPage.actions.view")}
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/programs/${programId}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t("programsPage.actions.edit")}
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

function ProgramMobileCard({ program }: { program: ProgramListItemDto }) {
  const { t } = useTranslation();

  return (
    <article className="rounded-[2rem] border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <ProgramIdentity program={program} />
        <ProgramActions programId={program.id} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine
          label={t("programsPage.table.sport")}
          value={t(getSportTypeLabelKey(program.sportType))}
        />

        <InfoLine
          label={t("programsPage.table.ageLevel")}
          value={`${t(getAgeGroupLabelKey(program.ageGroup))} • ${t(
            getLevelLabelKey(program.level),
          )}`}
        />

        <InfoLine
          label={t("programsPage.table.capacity")}
          value={`${program.enrolledStudentsCount}/${program.capacity}`}
        />

        <InfoLine
          label={t("programsPage.table.price")}
          value={`${program.monthlyPrice} ${program.currency}`}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatusBadge
          value={program.status}
          label={t(getProgramStatusLabelKey(program.status))}
          type="program"
        />

        <StatusBadge
          value={program.enrollmentStatus}
          label={t(getEnrollmentStatusLabelKey(program.enrollmentStatus))}
          type="enrollment"
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

      <h3 className="text-xl font-black">{t("programsPage.empty.title")}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {t("programsPage.empty.description")}
      </p>
    </div>
  );
}

function ProgramsLoadingState() {
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