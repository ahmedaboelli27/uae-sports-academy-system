import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CheckCircle2,
  Clock,
  Clock3,
  Eye,
  FileWarning,
  Filter,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getParentsList } from "@/features/admin/parents/services/parents.service";
import type {
  FilterOptionDto,
  ParentContactPreference,
  ParentListItemDto,
  ParentPaymentStatus,
  ParentsFiltersDto,
  ParentsListResponseDto,
  ParentStatus,
} from "@/features/admin/parents/types/parents.dto";

const initialFilters: ParentsFiltersDto = {
  search: "",
  city: "all",
  status: "all",
  paymentStatus: "all",
  preferredContactMethod: "all",
};

function getParentStatusLabelKey(status: ParentStatus) {
  return `parentsPage.status.${status}`;
}

function getPaymentStatusLabelKey(status: ParentPaymentStatus) {
  return `parentsPage.payment.${status}`;
}

function getContactMethodLabelKey(method: ParentContactPreference) {
  return `parentsPage.contact.${method}`;
}

export default function ParentsPage() {
  const { t } = useTranslation();

  const [data, setData] = useState<ParentsListResponseDto | null>(null);
  const [filters, setFilters] = useState<ParentsFiltersDto>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedParentId, setSelectedParentId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadParents = async () => {
      setIsLoading(true);

      try {
        const response = await getParentsList(filters);

        if (isMounted) {
          setData(response);

          setSelectedParentId((currentId) => {
            if (currentId) {
              return currentId;
            }

            return response.parents[0]?.id ?? "";
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadParents();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const selectedParent = useMemo(() => {
    if (!data?.parents.length) {
      return null;
    }

    return (
      data.parents.find((parent) => parent.id === selectedParentId) ??
      data.parents[0]
    );
  }, [data?.parents, selectedParentId]);

  const totalChildren = useMemo(() => {
    return (
      data?.parents.reduce((total, parent) => total + parent.childrenCount, 0) ??
      0
    );
  }, [data?.parents]);

  const activeSubscriptions = useMemo(() => {
    return (
      data?.parents.reduce(
        (total, parent) => total + parent.activeSubscriptionsCount,
        0,
      ) ?? 0
    );
  }, [data?.parents]);

  const overdueParentsCount = useMemo(() => {
    return (
      data?.parents.filter((parent) => parent.paymentStatus === "overdue")
        .length ?? 0
    );
  }, [data?.parents]);

  const updateFilter = <K extends keyof ParentsFiltersDto>(
    key: K,
    value: ParentsFiltersDto[K],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const refreshParents = async () => {
    setIsLoading(true);

    try {
      const response = await getParentsList(filters);
      setData(response);

      setSelectedParentId((currentId) => {
        if (currentId) {
          return currentId;
        }

        return response.parents[0]?.id ?? "";
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
              <Users className="h-4 w-4" />
              {t("parentsPage.badge")}
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {t("parentsPage.title")}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              {t("parentsPage.description")}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refreshParents}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                {t("parentsPage.actions.refresh")}
              </button>

              <Link
                to="/admin/parents/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                {t("parentsPage.actions.addParent")}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric
              icon={Users}
              label={t("parentsPage.summary.totalParents")}
              value={data ? `${data.summary.totalParents}` : "—"}
            />
            <HeroMetric
              icon={CheckCircle2}
              label={t("parentsPage.summary.activeParents")}
              value={data ? `${data.summary.activeParents}` : "—"}
            />
            <HeroMetric
              icon={Clock}
              label={t("parentsPage.summary.pendingPayments")}
              value={data ? `${data.summary.parentsWithPendingPayments}` : "—"}
            />
            <HeroMetric
              icon={ShieldAlert}
              label={t("parentsPage.summary.overduePayments")}
              value={data ? `${data.summary.parentsWithOverduePayments}` : "—"}
            />
          </div>
        </div>
      </section>

      {data && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Users}
            label={t("parentsPage.summary.totalParents")}
            value={data.summary.totalParents}
            tone="blue"
          />

          <SummaryCard
            icon={CheckCircle2}
            label={t("parentsPage.summary.activeParents")}
            value={data.summary.activeParents}
            tone="green"
          />

          <SummaryCard
            icon={Clock}
            label={t("parentsPage.summary.pendingPayments")}
            value={data.summary.parentsWithPendingPayments}
            tone="yellow"
          />

          <SummaryCard
            icon={ShieldAlert}
            label={t("parentsPage.summary.overduePayments")}
            value={data.summary.parentsWithOverduePayments}
            tone="red"
          />
        </section>
      )}

      {data && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={WalletCards}
            title={t("parentsPage.financial.totalOutstanding")}
            value={`${data.summary.totalOutstandingAmount} ${data.summary.currency}`}
            description={t("parentsPage.financial.description")}
          />

          <MetricCard
            icon={Users}
            title="Linked Children"
            value={`${totalChildren}`}
            description="Total children connected to parent accounts in the current list."
          />

          <MetricCard
            icon={CheckCircle2}
            title="Active Subscriptions"
            value={`${activeSubscriptions}`}
            description="Total active subscriptions linked to parent accounts."
          />

          <MetricCard
            icon={ShieldAlert}
            title="Overdue Follow-up"
            value={`${overdueParentsCount}`}
            description="Parents with overdue payments that need finance or admin follow-up."
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
                  {t("parentsPage.filters.title")}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {t("parentsPage.filters.description")}
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
              >
                <Filter className="h-4 w-4" />
                {t("parentsPage.filters.reset")}
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">
                  {t("parentsPage.filters.search")}
                </span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={filters.search ?? ""}
                    onChange={(event) =>
                      updateFilter("search", event.target.value)
                    }
                    placeholder={t("parentsPage.filters.searchPlaceholder")}
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label={t("parentsPage.filters.city")}
                value={filters.city ?? "all"}
                options={data?.filters.cities ?? []}
                allLabel={t("parentsPage.filters.allCities")}
                onChange={(value) => updateFilter("city", value)}
              />

              <FilterSelect
                label={t("parentsPage.filters.status")}
                value={filters.status ?? "all"}
                options={[
                  { value: "active", label: t("parentsPage.status.active") },
                  { value: "inactive", label: t("parentsPage.status.inactive") },
                  { value: "blocked", label: t("parentsPage.status.blocked") },
                  { value: "archived", label: t("parentsPage.status.archived") },
                ]}
                allLabel={t("parentsPage.filters.allStatuses")}
                onChange={(value) =>
                  updateFilter("status", value as ParentStatus | "all")
                }
              />

              <FilterSelect
                label={t("parentsPage.filters.payment")}
                value={filters.paymentStatus ?? "all"}
                options={[
                  { value: "paid", label: t("parentsPage.payment.paid") },
                  { value: "pending", label: t("parentsPage.payment.pending") },
                  { value: "overdue", label: t("parentsPage.payment.overdue") },
                  { value: "mixed", label: t("parentsPage.payment.mixed") },
                ]}
                allLabel={t("parentsPage.filters.allPayments")}
                onChange={(value) =>
                  updateFilter(
                    "paymentStatus",
                    value as ParentPaymentStatus | "all",
                  )
                }
              />

              <FilterSelect
                label={t("parentsPage.filters.contact")}
                value={filters.preferredContactMethod ?? "all"}
                options={[
                  { value: "phone", label: t("parentsPage.contact.phone") },
                  {
                    value: "whatsapp",
                    label: t("parentsPage.contact.whatsapp"),
                  },
                  { value: "email", label: t("parentsPage.contact.email") },
                ]}
                allLabel={t("parentsPage.filters.allContacts")}
                onChange={(value) =>
                  updateFilter(
                    "preferredContactMethod",
                    value as ParentContactPreference | "all",
                  )
                }
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black">
                  {t("parentsPage.table.title")}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {t("parentsPage.table.description")}
                </p>
              </div>

              <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
                {isLoading
                  ? t("parentsPage.table.loading")
                  : t("parentsPage.table.results", {
                    count: data?.parents.length ?? 0,
                  })}
              </div>
            </div>

            {isLoading ? (
              <ParentsLoadingState />
            ) : data && data.parents.length > 0 ? (
              <>
                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full min-w-[1120px] border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-secondary/60 text-start">
                        <TableHead>{t("parentsPage.table.parent")}</TableHead>
                        <TableHead>{t("parentsPage.table.contact")}</TableHead>
                        <TableHead>{t("parentsPage.table.children")}</TableHead>
                        <TableHead>{t("parentsPage.table.status")}</TableHead>
                        <TableHead>{t("parentsPage.table.payment")}</TableHead>
                        <TableHead>
                          {t("parentsPage.table.outstanding")}
                        </TableHead>
                        <TableHead>
                          {t("parentsPage.table.lastContact")}
                        </TableHead>
                        <TableHead>{t("parentsPage.table.actions")}</TableHead>
                      </tr>
                    </thead>

                    <tbody>
                      {data.parents.map((parent) => (
                        <tr
                          key={parent.id}
                          onClick={() => setSelectedParentId(parent.id)}
                          className={[
                            "cursor-pointer border-b border-border last:border-b-0 hover:bg-secondary/35",
                            selectedParent?.id === parent.id
                              ? "bg-brand-yellow/10"
                              : "",
                          ].join(" ")}
                        >
                          <TableCell>
                            <ParentIdentity parent={parent} />
                          </TableCell>

                          <TableCell>
                            <div>
                              <div className="flex items-center gap-2 text-sm font-semibold">
                                <Phone className="h-4 w-4 text-brand-blue dark:text-brand-yellow" />
                                {parent.phone}
                              </div>

                              <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                {parent.email}
                              </div>

                              <p className="mt-2 text-xs font-black text-muted-foreground">
                                {t(
                                  getContactMethodLabelKey(
                                    parent.preferredContactMethod,
                                  ),
                                )}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="text-sm font-black">
                                {parent.childrenCount}{" "}
                                {t("parentsPage.table.childrenCount")}
                              </p>

                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {parent.activeSubscriptionsCount}{" "}
                                {t("parentsPage.table.activeSubscriptions")}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <StatusBadge
                              value={parent.status}
                              label={t(getParentStatusLabelKey(parent.status))}
                              type="parent"
                            />
                          </TableCell>

                          <TableCell>
                            <StatusBadge
                              value={parent.paymentStatus}
                              label={t(
                                getPaymentStatusLabelKey(parent.paymentStatus),
                              )}
                              type="payment"
                            />
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black text-brand-blue dark:text-brand-yellow">
                                {parent.totalOutstandingAmount} {parent.currency}
                              </p>

                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {t("parentsPage.table.paid")}:{" "}
                                {parent.totalPaidAmount} {parent.currency}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <p className="text-sm font-bold">
                              {parent.lastContactDate ??
                                t("parentsPage.common.notAvailable")}
                            </p>
                          </TableCell>

                          <TableCell>
                            <ParentActions parent={parent} />
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 p-5 xl:hidden">
                  {data.parents.map((parent) => (
                    <ParentMobileCard
                      key={parent.id}
                      parent={parent}
                      active={selectedParent?.id === parent.id}
                      onSelect={() => setSelectedParentId(parent.id)}
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
          <ParentDetailsPanel parent={selectedParent} />

          <StatusCard
            icon={ShieldCheck}
            title="Family Account Core"
            description="Parents connect students, subscriptions, invoices, payments, attendance alerts, and communication workflows."
            tone="success"
          />

          <StatusCard
            icon={Clock3}
            title="Frontend Ready"
            description="This page keeps the existing parents service layer and remains ready for backend API migration."
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
          <option key={option.value || option.label} value={option.value}>
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

function ParentIdentity({ parent }: { parent: ParentListItemDto }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <UserRound className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{parent.fullName}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {parent.city}
        </p>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  value: string;
  label: string;
  type: "parent" | "payment";
}

function StatusBadge({ value, label, type }: StatusBadgeProps) {
  const getClasses = () => {
    if (type === "parent") {
      if (value === "active") {
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
      }

      if (value === "inactive") {
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      }

      if (value === "blocked") {
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
      }

      return "bg-secondary text-secondary-foreground";
    }

    if (value === "paid") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (value === "pending") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
    }

    if (value === "overdue") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${getClasses()}`}
    >
      {label}
    </span>
  );
}

function ParentActions({ parent }: { parent: ParentListItemDto }) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <a
        href={`tel:${parent.phone}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="Call"
      >
        <Phone className="h-4 w-4" />
      </a>

      <a
        href={`mailto:${parent.email}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="Email"
      >
        <Mail className="h-4 w-4" />
      </a>

      <Link
        to={`/admin/parents/${parent.id}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t("parentsPage.actions.view")}
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/parents/${parent.id}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t("parentsPage.actions.edit")}
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

function ParentMobileCard({
  parent,
  active,
  onSelect,
}: {
  parent: ParentListItemDto;
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
        <ParentIdentity parent={parent} />
        <ParentActions parent={parent} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine label={t("parentsPage.table.phone")} value={parent.phone} />
        <InfoLine label={t("parentsPage.table.email")} value={parent.email} />
        <InfoLine
          label={t("parentsPage.table.children")}
          value={`${parent.childrenCount}`}
        />
        <InfoLine
          label={t("parentsPage.table.outstanding")}
          value={`${parent.totalOutstandingAmount} ${parent.currency}`}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatusBadge
          value={parent.status}
          label={t(getParentStatusLabelKey(parent.status))}
          type="parent"
        />

        <StatusBadge
          value={parent.paymentStatus}
          label={t(getPaymentStatusLabelKey(parent.paymentStatus))}
          type="payment"
        />
      </div>
    </article>
  );
}

function ParentDetailsPanel({
  parent,
}: {
  parent: ParentListItemDto | null;
}) {
  const { t } = useTranslation();

  if (!parent) {
    return (
      <aside className="rounded-[2rem] border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
          <FileWarning className="h-8 w-8" />
        </div>

        <h3 className="text-lg font-black">No parent selected</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Select a parent from the list to preview account, payment, and contact
          details.
        </p>
      </aside>
    );
  }

  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <UserRound className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Parent Account
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {parent.fullName}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {parent.city} • {parent.childrenCount} children •{" "}
          {parent.activeSubscriptionsCount} active subscriptions
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <StatusBadge
            value={parent.status}
            label={t(getParentStatusLabelKey(parent.status))}
            type="parent"
          />

          <StatusBadge
            value={parent.paymentStatus}
            label={t(getPaymentStatusLabelKey(parent.paymentStatus))}
            type="payment"
          />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={Phone} label="Phone" value={parent.phone} />

        <DetailLine icon={Mail} label="Email" value={parent.email} />

        <DetailLine
          icon={MessageCircle}
          label="Preferred Contact"
          value={t(getContactMethodLabelKey(parent.preferredContactMethod))}
        />

        <DetailLine
          icon={Users}
          label={t("parentsPage.table.children")}
          value={`${parent.childrenCount} children`}
        />

        <DetailLine
          icon={CheckCircle2}
          label={t("parentsPage.table.activeSubscriptions")}
          value={`${parent.activeSubscriptionsCount}`}
        />

        <DetailLine
          icon={WalletCards}
          label={t("parentsPage.table.outstanding")}
          value={`${parent.totalOutstandingAmount} ${parent.currency}`}
        />

        <DetailLine
          icon={Activity}
          label={t("parentsPage.table.paid")}
          value={`${parent.totalPaidAmount} ${parent.currency}`}
        />

        <DetailLine
          icon={Clock3}
          label={t("parentsPage.table.lastContact")}
          value={parent.lastContactDate ?? t("parentsPage.common.notAvailable")}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={`tel:${parent.phone}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>

          <a
            href={`mailto:${parent.email}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
          >
            <Mail className="h-4 w-4" />
            Email
          </a>

          <Link
            to={`/admin/parents/${parent.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
          >
            <Eye className="h-4 w-4" />
            {t("parentsPage.actions.view")}
          </Link>

          <Link
            to={`/admin/parents/${parent.id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <Pencil className="h-4 w-4" />
            {t("parentsPage.actions.edit")}
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

      <h3 className="text-xl font-black">{t("parentsPage.empty.title")}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {t("parentsPage.empty.description")}
      </p>
    </div>
  );
}

function ParentsLoadingState() {
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