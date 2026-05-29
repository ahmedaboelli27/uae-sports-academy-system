import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Clock3,
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
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  WalletCards
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
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
} from "@/features/admin/students/types/students.dto";

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
  const [selectedStudentId, setSelectedStudentId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadStudents = async () => {
      setIsLoading(true);

      try {
        const response = await getStudentsList(filters);

        if (isMounted) {
          setData(response);

          setSelectedStudentId((currentId) => {
            if (currentId) {
              return currentId;
            }

            return response.students[0]?.id ?? "";
          });
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

  const selectedStudent = useMemo(() => {
    if (!data?.students.length) {
      return null;
    }

    return (
      data.students.find((student) => student.id === selectedStudentId) ??
      data.students[0]
    );
  }, [data?.students, selectedStudentId]);

  const averageAttendance = useMemo(() => {
    if (!data?.students.length) {
      return 0;
    }

    const total = data.students.reduce(
      (sum, student) => sum + student.attendanceRate,
      0,
    );

    return Math.round(total / data.students.length);
  }, [data?.students]);

  const overdueStudentsCount = useMemo(() => {
    return (
      data?.students.filter((student) => student.paymentStatus === "overdue")
        .length ?? 0
    );
  }, [data?.students]);

  const expiringSoonCount = useMemo(() => {
    return (
      data?.students.filter(
        (student) => student.subscriptionStatus === "expiring_soon",
      ).length ?? 0
    );
  }, [data?.students]);

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

      setSelectedStudentId((currentId) => {
        if (currentId) {
          return currentId;
        }

        return response.students[0]?.id ?? "";
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
              <GraduationCap className="h-4 w-4" />
              {t("studentsPage.badge")}
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              {t("studentsPage.title")}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              {t("studentsPage.description")}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refreshStudents}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                {t("studentsPage.actions.refresh")}
              </button>

              <Link
                to="/admin/students/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                {t("studentsPage.actions.addStudent")}
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric
              icon={Users}
              label={t("studentsPage.summary.totalStudents")}
              value={data ? `${data.summary.totalStudents}` : "—"}
            />
            <HeroMetric
              icon={CheckCircle2}
              label={t("studentsPage.summary.activeStudents")}
              value={data ? `${data.summary.activeStudents}` : "—"}
            />
            <HeroMetric
              icon={Clock}
              label={t("studentsPage.summary.pendingPayments")}
              value={data ? `${data.summary.pendingPayments}` : "—"}
            />
            <HeroMetric
              icon={ShieldAlert}
              label={t("studentsPage.summary.expiredSubscriptions")}
              value={data ? `${data.summary.expiredSubscriptions}` : "—"}
            />
          </div>
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

      {data && (
        <section className="grid gap-4 lg:grid-cols-3">
          <MetricCard
            icon={Activity}
            title="Average Attendance"
            value={`${averageAttendance}%`}
            description="Average attendance rate across the currently filtered student list."
          />

          <MetricCard
            icon={WalletCards}
            title="Overdue Payments"
            value={`${overdueStudentsCount}`}
            description="Students with overdue payment status requiring finance follow-up."
          />

          <MetricCard
            icon={Clock3}
            title="Expiring Soon"
            value={`${expiringSoonCount}`}
            description="Students whose subscriptions are close to expiry."
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
                    onChange={(event) =>
                      updateFilter("search", event.target.value)
                    }
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
                  {
                    value: "suspended",
                    label: t("studentsPage.status.suspended"),
                  },
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
                  {
                    value: "refunded",
                    label: t("studentsPage.payment.refunded"),
                  },
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
                  {
                    value: "active",
                    label: t("studentsPage.subscription.active"),
                  },
                  {
                    value: "expired",
                    label: t("studentsPage.subscription.expired"),
                  },
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
                  <table className="w-full min-w-[1160px] border-collapse">
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
                        <TableHead>
                          {t("studentsPage.table.attendance")}
                        </TableHead>
                        <TableHead>{t("studentsPage.table.actions")}</TableHead>
                      </tr>
                    </thead>

                    <tbody>
                      {data.students.map((student) => (
                        <tr
                          key={student.id}
                          onClick={() => setSelectedStudentId(student.id)}
                          className={[
                            "cursor-pointer border-b border-border last:border-b-0 hover:bg-secondary/35",
                            selectedStudent?.id === student.id
                              ? "bg-brand-yellow/10"
                              : "",
                          ].join(" ")}
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
                    <StudentMobileCard
                      key={student.id}
                      student={student}
                      active={selectedStudent?.id === student.id}
                      onSelect={() => setSelectedStudentId(student.id)}
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
          <StudentDetailsPanel student={selectedStudent} />

          <StatusCard
            icon={ShieldCheck}
            title="Operational Core"
            description="Students connect parents, programs, branches, coaches, attendance, subscriptions, invoices, and reports."
            tone="success"
          />

          <StatusCard
            icon={Clock3}
            title="Frontend Ready"
            description="This page keeps the existing students service layer and remains ready for backend API migration."
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
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

function StudentActions({ studentId }: { studentId: string }) {
  const { t } = useTranslation();

  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
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

function StudentMobileCard({
  student,
  active,
  onSelect,
}: {
  student: StudentListItemDto;
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

function StudentDetailsPanel({
  student,
}: {
  student: StudentListItemDto | null;
}) {
  const { t } = useTranslation();

  if (!student) {
    return (
      <aside className="rounded-[2rem] border border-border bg-card p-6 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
          <FileWarning className="h-8 w-8" />
        </div>

        <h3 className="text-lg font-black">No student selected</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Select a student from the list to preview profile and operational
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
          {student.studentCode}
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {student.fullName}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {student.programName} • {student.branchName} • {student.age} yrs
        </p>

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
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={Users}
          label={t("studentsPage.table.parent")}
          value={student.parentName}
        />

        <DetailLine
          icon={Phone}
          label="Parent Phone"
          value={student.parentPhone}
        />

        <DetailLine
          icon={Mail}
          label="Parent Email"
          value={student.parentEmail}
        />

        <DetailLine
          icon={GraduationCap}
          label={t("studentsPage.table.program")}
          value={`${student.programName} • ${t(
            getSkillLevelLabelKey(student.skillLevel),
          )}`}
        />

        <DetailLine
          icon={ShieldCheck}
          label={t("studentsPage.table.coach")}
          value={student.coachName}
        />

        <DetailLine
          icon={CalendarCheck}
          label={t("studentsPage.table.attendance")}
          value={`${student.attendanceRate}%`}
        />

        <DetailLine
          icon={WalletCards}
          label={t("studentsPage.table.payment")}
          value={t(getPaymentStatusLabelKey(student.paymentStatus))}
        />

        <DetailLine
          icon={Clock3}
          label={t("studentsPage.table.subscription")}
          value={t(getSubscriptionLabelKey(student.subscriptionStatus))}
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to={`/admin/students/${student.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
          >
            <Eye className="h-4 w-4" />
            {t("studentsPage.actions.view")}
          </Link>

          <Link
            to={`/admin/students/${student.id}/edit`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <Pencil className="h-4 w-4" />
            {t("studentsPage.actions.edit")}
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