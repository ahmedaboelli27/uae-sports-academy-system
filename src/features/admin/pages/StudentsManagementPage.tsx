import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  Clock,
  Eye,
  FileWarning,
  Filter,
  GraduationCap,
  Mail,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getStudentsList } from "@/features/admin/students/services/students.service";
import type {
  FilterOptionDto,
  PaymentStatus,
  SkillLevel,
  StudentListItemDto,
  StudentStatus,
  StudentsFiltersDto,
  StudentsListResponseDto,
  SubscriptionStatus,
} from "./../students/types/students.dto";

const initialFilters: StudentsFiltersDto = {
  search: "",
  programId: "all",
  branchId: "all",
  coachId: "all",
  status: "all",
  paymentStatus: "all",
  subscriptionStatus: "all",
  skillLevel: "all",
};

function getSubscriptionLabelKey(status: SubscriptionStatus) {
  const keys: Record<SubscriptionStatus, string> = {
    active: "studentsPage.subscription.active",
    expired: "studentsPage.subscription.expired",
    expiring_soon: "studentsPage.subscription.expiringSoon",
    not_started: "studentsPage.subscription.notStarted",
  };

  return keys[status];
}

function getStudentStatusLabelKey(status: StudentStatus) {
  return `studentsPage.status.${status}`;
}

function getPaymentStatusLabelKey(status: PaymentStatus) {
  return `studentsPage.payment.${status}`;
}

function getSkillLevelLabelKey(level: SkillLevel) {
  return `studentsPage.skill.${level}`;
}

export default function StudentsPage() {
  const { t } = useTranslation();

  const [data, setData] = useState<StudentsListResponseDto | null>(null);
  const [filters, setFilters] = useState<StudentsFiltersDto>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStudents = async () => {
      setIsLoading(true);

      try {
        const response = await getStudentsList(filters);

        if (isMounted) {
          setData(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadStudents();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const updateFilter = <K extends keyof StudentsFiltersDto>(
    key: K,
    value: StudentsFiltersDto[K],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const refreshStudents = async () => {
    setIsLoading(true);

    try {
      const response = await getStudentsList(filters);
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
            <GraduationCap className="h-4 w-4" />
            {t("studentsPage.badge")}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {t("studentsPage.title")}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t("studentsPage.description")}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={refreshStudents}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
          >
            <RefreshCw className="h-4 w-4" />
            {t("studentsPage.actions.refresh")}
          </button>

          <Link
            to="/admin/students/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
          >
            <Plus className="h-4 w-4" />
            {t("studentsPage.actions.addStudent")}
          </Link>
        </div>
      </section>

      {data && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={Users}
            label={t("studentsPage.summary.totalStudents")}
            value={data.summary.totalStudents}
            tone="blue"
          />

          <SummaryCard
            icon={CheckCircle2}
            label={t("studentsPage.summary.activeStudents")}
            value={data.summary.activeStudents}
            tone="green"
          />

          <SummaryCard
            icon={Clock}
            label={t("studentsPage.summary.pendingPayments")}
            value={data.summary.pendingPayments}
            tone="yellow"
          />

          <SummaryCard
            icon={ShieldAlert}
            label={t("studentsPage.summary.expiredSubscriptions")}
            value={data.summary.expiredSubscriptions}
            tone="red"
          />
        </section>
      )}

      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black">
              <SlidersHorizontal className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
              {t("studentsPage.filters.title")}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("studentsPage.filters.description")}
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
          >
            <Filter className="h-4 w-4" />
            {t("studentsPage.filters.reset")}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <label className="block">
            <span className="mb-2 block text-sm font-black">
              {t("studentsPage.filters.search")}
            </span>

            <div className="relative">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                value={filters.search ?? ""}
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder={t("studentsPage.filters.searchPlaceholder")}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </div>
          </label>

          <FilterSelect
            label={t("studentsPage.filters.program")}
            value={filters.programId ?? "all"}
            options={data?.filters.programs ?? []}
            allLabel={t("studentsPage.filters.allPrograms")}
            onChange={(value) => updateFilter("programId", value)}
          />

          <FilterSelect
            label={t("studentsPage.filters.branch")}
            value={filters.branchId ?? "all"}
            options={data?.filters.branches ?? []}
            allLabel={t("studentsPage.filters.allBranches")}
            onChange={(value) => updateFilter("branchId", value)}
          />

          <FilterSelect
            label={t("studentsPage.filters.coach")}
            value={filters.coachId ?? "all"}
            options={data?.filters.coaches ?? []}
            allLabel={t("studentsPage.filters.allCoaches")}
            onChange={(value) => updateFilter("coachId", value)}
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect
            label={t("studentsPage.filters.status")}
            value={filters.status ?? "all"}
            options={[
              { value: "active", label: t("studentsPage.status.active") },
              { value: "inactive", label: t("studentsPage.status.inactive") },
              { value: "suspended", label: t("studentsPage.status.suspended") },
              { value: "archived", label: t("studentsPage.status.archived") },
            ]}
            allLabel={t("studentsPage.filters.allStatuses")}
            onChange={(value) =>
              updateFilter("status", value as StudentStatus | "all")
            }
          />

          <FilterSelect
            label={t("studentsPage.filters.payment")}
            value={filters.paymentStatus ?? "all"}
            options={[
              { value: "paid", label: t("studentsPage.payment.paid") },
              { value: "pending", label: t("studentsPage.payment.pending") },
              { value: "overdue", label: t("studentsPage.payment.overdue") },
              { value: "refunded", label: t("studentsPage.payment.refunded") },
            ]}
            allLabel={t("studentsPage.filters.allPayments")}
            onChange={(value) =>
              updateFilter("paymentStatus", value as PaymentStatus | "all")
            }
          />

          <FilterSelect
            label={t("studentsPage.filters.subscription")}
            value={filters.subscriptionStatus ?? "all"}
            options={[
              { value: "active", label: t("studentsPage.subscription.active") },
              { value: "expired", label: t("studentsPage.subscription.expired") },
              {
                value: "expiring_soon",
                label: t("studentsPage.subscription.expiringSoon"),
              },
              {
                value: "not_started",
                label: t("studentsPage.subscription.notStarted"),
              },
            ]}
            allLabel={t("studentsPage.filters.allSubscriptions")}
            onChange={(value) =>
              updateFilter(
                "subscriptionStatus",
                value as SubscriptionStatus | "all",
              )
            }
          />

          <FilterSelect
            label={t("studentsPage.filters.skillLevel")}
            value={filters.skillLevel ?? "all"}
            options={[
              { value: "beginner", label: t("studentsPage.skill.beginner") },
              {
                value: "intermediate",
                label: t("studentsPage.skill.intermediate"),
              },
              { value: "advanced", label: t("studentsPage.skill.advanced") },
              { value: "elite", label: t("studentsPage.skill.elite") },
            ]}
            allLabel={t("studentsPage.filters.allSkillLevels")}
            onChange={(value) =>
              updateFilter("skillLevel", value as SkillLevel | "all")
            }
          />
        </div>
      </section>

      <section className="rounded-[2rem] border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black">
              {t("studentsPage.table.title")}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t("studentsPage.table.description")}
            </p>
          </div>

          <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
            {isLoading
              ? t("studentsPage.table.loading")
              : t("studentsPage.table.results", {
                count: data?.students.length ?? 0,
              })}
          </div>
        </div>

        {isLoading ? (
          <StudentsLoadingState />
        ) : data && data.students.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/60 text-start">
                    <TableHead>{t("studentsPage.table.student")}</TableHead>
                    <TableHead>{t("studentsPage.table.parent")}</TableHead>
                    <TableHead>{t("studentsPage.table.program")}</TableHead>
                    <TableHead>{t("studentsPage.table.branch")}</TableHead>
                    <TableHead>{t("studentsPage.table.status")}</TableHead>
                    <TableHead>{t("studentsPage.table.payment")}</TableHead>
                    <TableHead>
                      {t("studentsPage.table.subscription")}
                    </TableHead>
                    <TableHead>{t("studentsPage.table.attendance")}</TableHead>
                    <TableHead>{t("studentsPage.table.actions")}</TableHead>
                  </tr>
                </thead>

                <tbody>
                  {data.students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-border last:border-b-0 hover:bg-secondary/35"
                    >
                      <TableCell>
                        <StudentIdentity student={student} />
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-black">{student.parentName}</p>

                          <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {student.parentPhone}
                          </div>

                          <div className="mt-1 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            {student.parentEmail}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-black">{student.programName}</p>
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {t(getSkillLevelLabelKey(student.skillLevel))}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-black">{student.branchName}</p>
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {student.coachName}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          value={student.status}
                          label={t(getStudentStatusLabelKey(student.status))}
                          type="student"
                        />
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          value={student.paymentStatus}
                          label={t(
                            getPaymentStatusLabelKey(student.paymentStatus),
                          )}
                          type="payment"
                        />
                      </TableCell>

                      <TableCell>
                        <StatusBadge
                          value={student.subscriptionStatus}
                          label={t(
                            getSubscriptionLabelKey(
                              student.subscriptionStatus,
                            ),
                          )}
                          type="subscription"
                        />
                      </TableCell>

                      <TableCell>
                        <AttendanceBar value={student.attendanceRate} />
                      </TableCell>

                      <TableCell>
                        <StudentActions studentId={student.id} />
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-5 xl:hidden">
              {data.students.map((student) => (
                <StudentMobileCard key={student.id} student={student} />
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

function StudentIdentity({ student }: { student: StudentListItemDto }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <UserRound className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{student.fullName}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {student.studentCode} • {student.age} yrs
        </p>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  value: string;
  label: string;
  type: "student" | "payment" | "subscription";
}

function StatusBadge({ value, label, type }: StatusBadgeProps) {
  const getClasses = () => {
    if (type === "student") {
      if (value === "active") {
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
      }

      if (value === "inactive") {
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
      }

      if (value === "suspended") {
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
      }

      return "bg-secondary text-secondary-foreground";
    }

    if (type === "payment") {
      if (value === "paid") {
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
      }

      if (value === "pending") {
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
      }

      if (value === "overdue") {
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
      }

      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }

    if (value === "active") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (value === "expired") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    if (value === "expiring_soon") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
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

function AttendanceBar({ value }: { value: number }) {
  return (
    <div className="min-w-28">
      <div className="mb-1 flex items-center justify-between text-xs font-black">
        <span>{value}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-brand-blue dark:bg-brand-yellow"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StudentActions({ studentId }: { studentId: string }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2">
      <Link
        to={`/admin/students/${studentId}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t("studentsPage.actions.view")}
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/students/${studentId}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={t("studentsPage.actions.edit")}
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

function StudentMobileCard({ student }: { student: StudentListItemDto }) {
  const { t } = useTranslation();

  return (
    <article className="rounded-[2rem] border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-4">
        <StudentIdentity student={student} />
        <StudentActions studentId={student.id} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine
          label={t("studentsPage.table.parent")}
          value={student.parentName}
        />
        <InfoLine
          label={t("studentsPage.table.program")}
          value={student.programName}
        />
        <InfoLine
          label={t("studentsPage.table.branch")}
          value={student.branchName}
        />
        <InfoLine
          label={t("studentsPage.table.coach")}
          value={student.coachName}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatusBadge
          value={student.status}
          label={t(getStudentStatusLabelKey(student.status))}
          type="student"
        />

        <StatusBadge
          value={student.paymentStatus}
          label={t(getPaymentStatusLabelKey(student.paymentStatus))}
          type="payment"
        />

        <StatusBadge
          value={student.subscriptionStatus}
          label={t(getSubscriptionLabelKey(student.subscriptionStatus))}
          type="subscription"
        />
      </div>

      <div className="mt-5">
        <AttendanceBar value={student.attendanceRate} />
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

      <h3 className="text-xl font-black">{t("studentsPage.empty.title")}</h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {t("studentsPage.empty.description")}
      </p>
    </div>
  );
}

function StudentsLoadingState() {
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