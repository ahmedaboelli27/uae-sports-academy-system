import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarCheck,
  CreditCard,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Star,
  Trophy,
  UserRound,
  Users
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { getStudentById } from "@/features/admin/students/services/students.service";
import type {
  PaymentStatus,
  SkillLevel,
  StudentAttendanceDto,
  StudentDetailsDto,
  StudentPaymentDto,
  StudentProgressNoteDto,
  StudentStatus,
  SubscriptionStatus,
} from "@/features/admin/students/types/students.dto";

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

export default function StudentDetailsPage() {
  const { t } = useTranslation();
  const { studentId } = useParams<{ studentId: string }>();

  const [student, setStudent] = useState<StudentDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadStudent = async () => {
      setIsLoading(true);

      try {
        if (!studentId) {
          setStudent(null);
          return;
        }

        const response = await getStudentById(studentId);

        if (isMounted) {
          setStudent(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadStudent();

    return () => {
      isMounted = false;
    };
  }, [studentId]);

  if (isLoading) {
    return <StudentDetailsLoadingState />;
  }

  if (!student) {
    return (
      <main className="space-y-6">
        <BackLink />

        <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-black">
            {t("studentDetailsPage.notFound.title")}
          </h1>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            {t("studentDetailsPage.notFound.description")}
          </p>

          <Link
            to="/admin/students"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("studentDetailsPage.notFound.back")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <BackLink />

      <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
        <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-brand-yellow text-brand-blue shadow-brand-yellow">
                <UserRound className="h-12 w-12" />
              </div>

              <div>
                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                  {student.studentCode}
                </p>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  {student.fullName}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                  <span>{student.age} {t("studentDetailsPage.profile.yearsOld")}</span>
                  <span>•</span>
                  <span>{t(getSkillLevelLabelKey(student.skillLevel))}</span>
                  <span>•</span>
                  <span>{student.programName}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
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
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
          <ProfileInfoCard
            icon={Trophy}
            label={t("studentDetailsPage.profile.program")}
            value={student.programName}
          />

          <ProfileInfoCard
            icon={MapPin}
            label={t("studentDetailsPage.profile.branch")}
            value={student.branchName}
          />

          <ProfileInfoCard
            icon={Users}
            label={t("studentDetailsPage.profile.coach")}
            value={student.coachName}
          />

          <ProfileInfoCard
            icon={CalendarCheck}
            label={t("studentDetailsPage.profile.attendanceRate")}
            value={`${student.attendanceRate}%`}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <div className="space-y-6">
          <DetailsSection
            icon={Users}
            title={t("studentDetailsPage.parent.title")}
            description={t("studentDetailsPage.parent.description")}
          >
            <div className="grid gap-4 md:grid-cols-3">
              <InfoItem
                label={t("studentDetailsPage.parent.name")}
                value={student.parentName}
              />

              <InfoItem
                label={t("studentDetailsPage.parent.phone")}
                value={student.parentPhone}
                icon={Phone}
              />

              <InfoItem
                label={t("studentDetailsPage.parent.email")}
                value={student.parentEmail}
                icon={Mail}
              />
            </div>
          </DetailsSection>

          <DetailsSection
            icon={CreditCard}
            title={t("studentDetailsPage.subscription.title")}
            description={t("studentDetailsPage.subscription.description")}
          >
            <div className="grid gap-4 md:grid-cols-4">
              <InfoItem
                label={t("studentDetailsPage.subscription.startDate")}
                value={student.subscriptionStartDate}
              />

              <InfoItem
                label={t("studentDetailsPage.subscription.endDate")}
                value={student.subscriptionEndDate}
              />

              <InfoItem
                label={t("studentDetailsPage.subscription.paymentStatus")}
                value={t(getPaymentStatusLabelKey(student.paymentStatus))}
              />

              <InfoItem
                label={t("studentDetailsPage.subscription.subscriptionStatus")}
                value={t(getSubscriptionLabelKey(student.subscriptionStatus))}
              />
            </div>
          </DetailsSection>

          <DetailsSection
            icon={CalendarCheck}
            title={t("studentDetailsPage.attendance.title")}
            description={t("studentDetailsPage.attendance.description")}
          >
            <div className="mb-6 rounded-2xl bg-secondary p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-black">
                  {t("studentDetailsPage.attendance.attendanceRate")}
                </span>
                <span className="text-sm font-black text-brand-blue dark:text-brand-yellow">
                  {student.attendanceRate}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-background">
                <div
                  className="h-full rounded-full bg-brand-blue dark:bg-brand-yellow"
                  style={{ width: `${student.attendanceRate}%` }}
                />
              </div>

              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                {t("studentDetailsPage.attendance.lastAttendance")}:{" "}
                {student.lastAttendanceDate ?? t("studentDetailsPage.common.notAvailable")}
              </p>
            </div>

            {student.recentAttendance.length > 0 ? (
              <div className="space-y-3">
                {student.recentAttendance.map((attendance) => (
                  <AttendanceItem key={attendance.id} item={attendance} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("studentDetailsPage.attendance.empty")} />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Star}
            title={t("studentDetailsPage.progress.title")}
            description={t("studentDetailsPage.progress.description")}
          >
            {student.progressNotes.length > 0 ? (
              <div className="space-y-3">
                {student.progressNotes.map((note) => (
                  <ProgressNoteItem key={note.id} item={note} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("studentDetailsPage.progress.empty")} />
            )}
          </DetailsSection>
        </div>

        <aside className="space-y-6">
          <DetailsSection
            icon={HeartPulse}
            title={t("studentDetailsPage.medical.title")}
            description={t("studentDetailsPage.medical.description")}
          >
            <div className="space-y-4">
              <InfoItem
                label={t("studentDetailsPage.medical.medicalNotes")}
                value={student.medicalNotes ?? t("studentDetailsPage.common.notAvailable")}
              />

              <InfoItem
                label={t("studentDetailsPage.medical.allergies")}
                value={student.allergies ?? t("studentDetailsPage.common.notAvailable")}
              />

              <InfoItem
                label={t("studentDetailsPage.medical.injuries")}
                value={student.injuries ?? t("studentDetailsPage.common.notAvailable")}
              />

              <InfoItem
                label={t("studentDetailsPage.medical.emergencyContact")}
                value={
                  student.emergencyContactName
                    ? `${student.emergencyContactName} - ${student.emergencyContactPhone ?? ""}`
                    : t("studentDetailsPage.common.notAvailable")
                }
              />
            </div>
          </DetailsSection>

          <DetailsSection
            icon={FileText}
            title={t("studentDetailsPage.payments.title")}
            description={t("studentDetailsPage.payments.description")}
          >
            {student.paymentHistory.length > 0 ? (
              <div className="space-y-3">
                {student.paymentHistory.map((payment) => (
                  <PaymentItem key={payment.id} item={payment} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("studentDetailsPage.payments.empty")} />
            )}
          </DetailsSection>

          <DetailsSection
            icon={FileText}
            title={t("studentDetailsPage.documents.title")}
            description={t("studentDetailsPage.documents.description")}
          >
            {student.documents.length > 0 ? (
              <div className="space-y-3">
                {student.documents.map((document) => (
                  <div
                    key={document.id}
                    className="rounded-2xl border border-border bg-background p-4"
                  >
                    <p className="text-sm font-black">{document.title}</p>
                    <p className="mt-1 text-xs font-semibold text-muted-foreground">
                      {document.type} • {document.uploadedAt}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("studentDetailsPage.documents.empty")} />
            )}
          </DetailsSection>
        </aside>
      </section>
    </main>
  );
}

function BackLink() {
  const { t } = useTranslation();

  return (
    <Link
      to="/admin/students"
      className="inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
      {t("studentDetailsPage.backToStudents")}
    </Link>
  );
}

interface DetailsSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

function DetailsSection({
  icon: Icon,
  title,
  description,
  children,
}: DetailsSectionProps) {
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

interface ProfileInfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function ProfileInfoCard({ icon: Icon, label, value }: ProfileInfoCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  icon?: LucideIcon;
}

function InfoItem({ label, value, icon: Icon }: InfoItemProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="mb-1 flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-brand-blue dark:text-brand-yellow" />}
        <p className="text-xs font-bold text-muted-foreground">{label}</p>
      </div>

      <p className="text-sm font-black leading-6">{value}</p>
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

function AttendanceItem({ item }: { item: StudentAttendanceDto }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
        <CalendarCheck className="h-5 w-5" />
      </div>

      <div className="flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-black">{item.sessionDate}</p>
          <span className="text-xs font-black text-muted-foreground">
            {t(`studentDetailsPage.attendance.status.${item.status}`)}
          </span>
        </div>

        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {item.programName} • {item.coachName}
        </p>
      </div>
    </div>
  );
}

function ProgressNoteItem({ item }: { item: StudentProgressNoteDto }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black">{item.title}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {item.coachName} • {item.createdAt.slice(0, 10)}
          </p>
        </div>

        <div className="flex items-center gap-1 text-brand-yellow">
          {Array.from({ length: item.rating }).map((_, index) => (
            <Star key={index} className="h-4 w-4 fill-current" />
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {item.note}
      </p>
    </div>
  );
}

function PaymentItem({ item }: { item: StudentPaymentDto }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">{item.invoiceNumber}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {item.amount} {item.currency}
          </p>
        </div>

        <StatusBadge
          value={item.status}
          label={t(getPaymentStatusLabelKey(item.status))}
          type="payment"
        />
      </div>

      <div className="mt-3 grid gap-2 text-xs font-semibold text-muted-foreground">
        <p>
          {t("studentDetailsPage.payments.dueDate")}: {item.dueDate}
        </p>
        <p>
          {t("studentDetailsPage.payments.paidAt")}:{" "}
          {item.paidAt ?? t("studentDetailsPage.common.notAvailable")}
        </p>
      </div>
    </div>
  );
}

function EmptyMiniState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-center text-sm font-semibold text-muted-foreground">
      {text}
    </div>
  );
}

function StudentDetailsLoadingState() {
  return (
    <main className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />
      <div className="h-72 animate-pulse rounded-[2.5rem] bg-secondary" />

      <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <div className="space-y-6">
          <div className="h-56 animate-pulse rounded-[2rem] bg-secondary" />
          <div className="h-56 animate-pulse rounded-[2rem] bg-secondary" />
          <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
        </div>

        <div className="space-y-6">
          <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
          <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
        </div>
      </div>
    </main>
  );
}