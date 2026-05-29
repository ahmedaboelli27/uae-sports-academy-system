import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Building2,
  CheckCircle2,
  Clock3,
  Eye,
  FileWarning,
  Filter,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getBranchesList } from "@/features/admin/branches/services/branches.service";
import type {
  BranchCity,
  BranchListItemDto,
  BranchStatus,
  BranchType,
  BranchesFiltersDto,
  BranchesListResponseDto,
} from "@/features/admin/branches/types/branches.dto";

const initialFilters: BranchesFiltersDto = {
  search: "",
  city: "all",
  status: "all",
  type: "all",
};

function getBranchStatusLabelKey(status: BranchStatus) {
  return `branchesPage.status.${status}`;
}

function getBranchTypeLabelKey(type: BranchType) {
  return `branchesPage.type.${type}`;
}

function getBranchCityLabelKey(city: BranchCity) {
  return `branchesPage.city.${city}`;
}

export default function BranchesManagementPage() {
  const { t } = useTranslation();

  const [data, setData] = useState<BranchesListResponseDto | null>(null);
  const [filters, setFilters] = useState<BranchesFiltersDto>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBranchId, setSelectedBranchId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBranches = async () => {
      setIsLoading(true);

      try {
        const response = await getBranchesList(filters);

        if (isMounted) {
          setData(response);

          if (!selectedBranchId && response.branches.length > 0) {
            setSelectedBranchId(response.branches[0].id);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBranches();

    return () => {
      isMounted = false;
    };
  }, [filters, selectedBranchId]);

  const selectedBranch = useMemo(() => {
    if (!data?.branches.length) {
      return null;
    }

    return (
      data.branches.find((branch) => branch.id === selectedBranchId) ??
      data.branches[0]
    );
  }, [data?.branches, selectedBranchId]);

  const capacityRate = useMemo(() => {
    if (!data || data.summary.totalCapacity === 0) {
      return 0;
    }

    return Math.round(
      (data.summary.totalStudents / data.summary.totalCapacity) * 100,
    );
  }, [data]);

  const updateFilter = <K extends keyof BranchesFiltersDto>(
    key: K,
    value: BranchesFiltersDto[K],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const refreshBranches = async () => {
    setIsLoading(true);

    try {
      const response = await getBranchesList(filters);
      setData(response);

      if (!selectedBranchId && response.branches.length > 0) {
        setSelectedBranchId(response.branches[0].id);
      }
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
              <Building2 className="h-4 w-4" />
              {t("branchesPage.badge")}
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {t("branchesPage.title")}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              {t("branchesPage.description")}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refreshBranches}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                {t("branchesPage.actions.refresh")}
              </button>

              <Link
                to="/admin/branches/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                {t("branchesPage.actions.addBranch")}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric
              icon={Building2}
              label={t("branchesPage.summary.totalBranches")}
              value={data ? `${data.summary.totalBranches}` : "—"}
            />
            <HeroMetric
              icon={CheckCircle2}
              label={t("branchesPage.summary.activeBranches")}
              value={data ? `${data.summary.activeBranches}` : "—"}
            />
            <HeroMetric
              icon={Users}
              label={t("branchesPage.summary.totalStudents")}
              value={data ? `${data.summary.totalStudents}` : "—"}
            />
            <HeroMetric
              icon={Wrench}
              label={t("branchesPage.summary.maintenanceBranches")}
              value={data ? `${data.summary.maintenanceBranches}` : "—"}
            />
          </div>
        </div>
      </section>

      {data && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Building2}
            label={t("branchesPage.summary.totalBranches")}
            value={data.summary.totalBranches}
            tone="blue"
          />

          <SummaryCard
            icon={CheckCircle2}
            label={t("branchesPage.summary.activeBranches")}
            value={data.summary.activeBranches}
            tone="green"
          />

          <SummaryCard
            icon={Wrench}
            label={t("branchesPage.summary.maintenanceBranches")}
            value={data.summary.maintenanceBranches}
            tone="yellow"
          />

          <SummaryCard
            icon={Users}
            label={t("branchesPage.summary.totalStudents")}
            value={data.summary.totalStudents}
            tone="red"
          />
        </section>
      )}

      {data && (
        <section className="grid gap-4 lg:grid-cols-3">
          <MetricCard
            icon={Activity}
            title={t("branchesPage.metrics.utilization")}
            value={`${data.summary.averageUtilizationRate}%`}
            description={`${t("branchesPage.metrics.utilizationDescription")} — ${capacityRate}% total capacity`}
          />

          <MetricCard
            icon={Users}
            title={t("branchesPage.metrics.totalCoaches")}
            value={`${data.summary.totalCoaches}`}
            description={t("branchesPage.metrics.totalCoachesDescription")}
          />

          <MetricCard
            icon={Star}
            title={t("branchesPage.metrics.averageRating")}
            value={`${data.summary.averageRating}/5`}
            description={t("branchesPage.metrics.averageRatingDescription")}
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
                  {t("branchesPage.filters.title")}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {t("branchesPage.filters.description")}
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
              >
                <Filter className="h-4 w-4" />
                {t("branchesPage.filters.reset")}
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">
                  {t("branchesPage.filters.search")}
                </span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={filters.search ?? ""}
                    onChange={(event) =>
                      updateFilter("search", event.target.value)
                    }
                    placeholder={t("branchesPage.filters.searchPlaceholder")}
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label={t("branchesPage.filters.city")}
                value={filters.city ?? "all"}
                allLabel={t("branchesPage.filters.allCities")}
                options={[
                  { value: "dubai", label: t("branchesPage.city.dubai") },
                  {
                    value: "abu_dhabi",
                    label: t("branchesPage.city.abu_dhabi"),
                  },
                  { value: "sharjah", label: t("branchesPage.city.sharjah") },
                  { value: "ajman", label: t("branchesPage.city.ajman") },
                  {
                    value: "ras_al_khaimah",
                    label: t("branchesPage.city.ras_al_khaimah"),
                  },
                  { value: "fujairah", label: t("branchesPage.city.fujairah") },
                  {
                    value: "umm_al_quwain",
                    label: t("branchesPage.city.umm_al_quwain"),
                  },
                  { value: "al_ain", label: t("branchesPage.city.al_ain") },
                ]}
                onChange={(value) =>
                  updateFilter("city", value as BranchCity | "all")
                }
              />

              <FilterSelect
                label={t("branchesPage.filters.status")}
                value={filters.status ?? "all"}
                allLabel={t("branchesPage.filters.allStatuses")}
                options={[
                  { value: "active", label: t("branchesPage.status.active") },
                  {
                    value: "inactive",
                    label: t("branchesPage.status.inactive"),
                  },
                  {
                    value: "under_maintenance",
                    label: t("branchesPage.status.under_maintenance"),
                  },
                  { value: "archived", label: t("branchesPage.status.archived") },
                ]}
                onChange={(value) =>
                  updateFilter("status", value as BranchStatus | "all")
                }
              />

              <FilterSelect
                label={t("branchesPage.filters.type")}
                value={filters.type ?? "all"}
                allLabel={t("branchesPage.filters.allTypes")}
                options={[
                  { value: "main", label: t("branchesPage.type.main") },
                  {
                    value: "satellite",
                    label: t("branchesPage.type.satellite"),
                  },
                  { value: "partner", label: t("branchesPage.type.partner") },
                  {
                    value: "temporary",
                    label: t("branchesPage.type.temporary"),
                  },
                ]}
                onChange={(value) =>
                  updateFilter("type", value as BranchType | "all")
                }
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black">
                  {t("branchesPage.table.title")}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {t("branchesPage.table.description")}
                </p>
              </div>

              <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
                {isLoading
                  ? t("branchesPage.table.loading")
                  : t("branchesPage.table.results", {
                    count: data?.branches.length ?? 0,
                  })}
              </div>
            </div>

            {isLoading ? (
              <BranchesLoadingState />
            ) : data && data.branches.length > 0 ? (
              <>
                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full min-w-[1180px] border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-secondary/60 text-start">
                        <TableHead>{t("branchesPage.table.branch")}</TableHead>
                        <TableHead>{t("branchesPage.table.location")}</TableHead>
                        <TableHead>{t("branchesPage.table.manager")}</TableHead>
                        <TableHead>{t("branchesPage.table.capacity")}</TableHead>
                        <TableHead>{t("branchesPage.table.operations")}</TableHead>
                        <TableHead>{t("branchesPage.table.status")}</TableHead>
                        <TableHead>{t("branchesPage.table.rating")}</TableHead>
                        <TableHead>{t("branchesPage.table.actions")}</TableHead>
                      </tr>
                    </thead>

                    <tbody>
                      {data.branches.map((branch) => (
                        <tr
                          key={branch.id}
                          onClick={() => setSelectedBranchId(branch.id)}
                          className={[
                            "cursor-pointer border-b border-border last:border-b-0 hover:bg-secondary/35",
                            selectedBranch?.id === branch.id
                              ? "bg-brand-yellow/10"
                              : "",
                          ].join(" ")}
                        >
                          <TableCell>
                            <BranchIdentity branch={branch} />
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="text-sm font-black">
                                {t(getBranchCityLabelKey(branch.city))}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {branch.area}
                              </p>
                              <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
                                {branch.address}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="text-sm font-black">
                                {branch.managerName}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {branch.managerPhone}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <UtilizationBlock
                              students={branch.studentsCount}
                              capacity={branch.capacity}
                              utilizationRate={branch.utilizationRate}
                            />
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="text-sm font-black">
                                {branch.programsCount} programs
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {branch.coachesCount} coaches •{" "}
                                {branch.weeklySessionsCount} weekly sessions
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {branch.facilitiesCount} facilities
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <StatusBadge
                              value={branch.status}
                              label={t(getBranchStatusLabelKey(branch.status))}
                            />
                          </TableCell>

                          <TableCell>
                            <RatingBlock value={branch.rating} />
                          </TableCell>

                          <TableCell>
                            <BranchActions branchId={branch.id} />
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 p-5 xl:hidden">
                  {data.branches.map((branch) => (
                    <BranchMobileCard
                      key={branch.id}
                      branch={branch}
                      active={selectedBranch?.id === branch.id}
                      onSelect={() => setSelectedBranchId(branch.id)}
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
          <BranchDetailsPanel branch={selectedBranch} />

          <StatusCard
            icon={ShieldCheck}
            title="Operational Core"
            description="Branches connect programs, coaches, schedules, facilities, attendance, trials, and reporting."
            tone="success"
          />

          <StatusCard
            icon={Clock3}
            title="Frontend Ready"
            description="This page keeps the existing branch service layer and remains ready for backend API migration."
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

function MetricCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
}) {
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

function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: {
  label: string;
  value: string;
  allLabel: string;
  options: Array<{ value: string; label: string }>;
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

function BranchIdentity({ branch }: { branch: BranchListItemDto }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <Building2 className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{branch.name}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {branch.branchCode}
        </p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {t(getBranchTypeLabelKey(branch.type))}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ value, label }: { value: string; label: string }) {
  const getClasses = () => {
    if (value === "active") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (value === "under_maintenance") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
    }

    if (value === "inactive") {
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }

    if (value === "archived") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    return "bg-secondary text-secondary-foreground";
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

function UtilizationBlock({
  students,
  capacity,
  utilizationRate,
}: {
  students: number;
  capacity: number;
  utilizationRate: number;
}) {
  return (
    <div>
      <p className="text-sm font-black">
        {students}/{capacity}
      </p>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-brand-yellow"
          style={{ width: `${Math.min(utilizationRate, 100)}%` }}
        />
      </div>

      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        {utilizationRate}% utilization
      </p>
    </div>
  );
}

function BranchActions({ branchId }: { branchId: string }) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Link
        to={`/admin/branches/${branchId}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t("branchesPage.actions.view")}
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/branches/${branchId}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t("branchesPage.actions.edit")}
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

function BranchMobileCard({
  branch,
  active,
  onSelect,
}: {
  branch: BranchListItemDto;
  active: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();

  return (
    <article
      onClick={onSelect}
      className={[
        "cursor-pointer rounded-[2rem] border p-5 transition",
        active
          ? "border-brand-yellow bg-brand-yellow/10"
          : "border-border bg-background hover:bg-secondary/60",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <BranchIdentity branch={branch} />
        <BranchActions branchId={branch.id} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine
          label={t("branchesPage.table.location")}
          value={`${t(getBranchCityLabelKey(branch.city))} • ${branch.area}`}
        />

        <InfoLine
          label={t("branchesPage.table.manager")}
          value={branch.managerName}
        />

        <InfoLine
          label={t("branchesPage.table.capacity")}
          value={`${branch.studentsCount}/${branch.capacity}`}
        />

        <InfoLine
          label={t("branchesPage.table.operations")}
          value={`${branch.programsCount} programs • ${branch.coachesCount} coaches`}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatusBadge
          value={branch.status}
          label={t(getBranchStatusLabelKey(branch.status))}
        />

        <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
          {branch.utilizationRate}% utilization
        </span>
      </div>
    </article>
  );
}

function BranchDetailsPanel({
  branch,
}: {
  branch: BranchListItemDto | null;
}) {
  const { t } = useTranslation();

  if (!branch) {
    return (
      <aside className="rounded-[2rem] border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
          <FileWarning className="h-8 w-8" />
        </div>

        <h3 className="text-lg font-black">No branch selected</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Select a branch from the list to preview its operational details.
        </p>
      </aside>
    );
  }

  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Building2 className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          {branch.branchCode}
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {branch.name}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {t(getBranchTypeLabelKey(branch.type))} •{" "}
          {t(getBranchCityLabelKey(branch.city))} • {branch.area}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge
            value={branch.status}
            label={t(getBranchStatusLabelKey(branch.status))}
          />
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {branch.utilizationRate}% utilization
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={MapPin}
          label={t("branchesPage.table.location")}
          value={`${t(getBranchCityLabelKey(branch.city))} • ${branch.area}`}
        />

        <DetailLine
          icon={Users}
          label={t("branchesPage.table.capacity")}
          value={`${branch.studentsCount}/${branch.capacity} students`}
        />

        <DetailLine
          icon={Activity}
          label="Utilization"
          value={`${branch.utilizationRate}%`}
        />

        <DetailLine
          icon={Building2}
          label="Programs / Coaches"
          value={`${branch.programsCount} programs • ${branch.coachesCount} coaches`}
        />

        <DetailLine
          icon={Wrench}
          label="Facilities / Sessions"
          value={`${branch.facilitiesCount} facilities • ${branch.weeklySessionsCount} weekly sessions`}
        />

        <DetailLine
          icon={Star}
          label={t("branchesPage.table.rating")}
          value={`${branch.rating}/5`}
        />

        <DetailLine
          icon={Phone}
          label="Phone"
          value={branch.phone}
        />

        <DetailLine
          icon={Mail}
          label="Email"
          value={branch.email}
        />

        <DetailLine
          icon={ShieldCheck}
          label="Manager"
          value={`${branch.managerName} • ${branch.managerPhone}`}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/admin/branches/${branch.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
          >
            <Eye className="h-4 w-4" />
            {t("branchesPage.actions.view")}
          </Link>

          <Link
            to={`/admin/branches/${branch.id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <Pencil className="h-4 w-4" />
            {t("branchesPage.actions.edit")}
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

      <h3 className="text-xl font-black">{t("branchesPage.empty.title")}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {t("branchesPage.empty.description")}
      </p>
    </div>
  );
}

function BranchesLoadingState() {
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
  tone: "success" | "warning";
}) {
  const toneClass =
    tone === "success"
      ? "border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300"
      : "border-brand-yellow/40 bg-brand-yellow/10 text-brand-blue dark:text-brand-yellow";

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