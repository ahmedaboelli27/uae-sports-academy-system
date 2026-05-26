import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarCheck,
  Clock,
  FileText,
  Languages,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Star,
  Trophy,
  UserRound,
  Users,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { getCoachById } from "@/features/admin/coaches/services/coaches.service";
import type {
  CoachAssignedStudentDto,
  CoachAvailabilityStatus,
  CoachCertificationDto,
  CoachDetailsDto,
  CoachEmploymentType,
  CoachPerformanceMetricDto,
  CoachScheduleSessionDto,
  CoachSkillLevel,
  CoachSportSpecialty,
  CoachStatus,
} from "@/features/admin/coaches/types/coaches.dto";

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

function getSessionStatusLabelKey(status: CoachScheduleSessionDto["sessionStatus"]) {
  return `coachDetailsPage.sessionStatus.${status}`;
}

function getSubscriptionStatusLabelKey(
  status: CoachAssignedStudentDto["subscriptionStatus"],
) {
  return `coachDetailsPage.subscription.${status}`;
}

function getPaymentStatusLabelKey(status: CoachAssignedStudentDto["paymentStatus"]) {
  return `coachDetailsPage.payment.${status}`;
}

export default function CoachDetailsPage() {
  const { t } = useTranslation();
  const { coachId } = useParams<{ coachId: string }>();

  const [coach, setCoach] = useState<CoachDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadCoach = async () => {
      setIsLoading(true);

      try {
        if (!coachId) {
          setCoach(null);
          return;
        }

        const response = await getCoachById(coachId);

        if (isMounted) {
          setCoach(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadCoach();

    return () => {
      isMounted = false;
    };
  }, [coachId]);

  if (isLoading) {
    return <CoachDetailsLoadingState />;
  }

  if (!coach) {
    return (
      <main className="space-y-6">
        <BackLink />

        <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-black">
            {t("coachDetailsPage.notFound.title")}
          </h1>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            {t("coachDetailsPage.notFound.description")}
          </p>

          <Link
            to="/admin/coaches"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("coachDetailsPage.notFound.back")}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <BackLink />

        <Link
          to={`/admin/coaches/${coach.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
        >
          <Pencil className="h-4 w-4" />
          {t("coachDetailsPage.actions.editCoach")}
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
        <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-brand-yellow text-brand-blue shadow-brand-yellow">
                <UserRound className="h-12 w-12" />
              </div>

              <div>
                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                  {coach.coachCode}
                </p>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  {coach.fullName}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                  <span>{t(getSportSpecialtyLabelKey(coach.sportSpecialty))}</span>
                  <span>•</span>
                  <span>{coach.branchName}</span>
                  <span>•</span>
                  <span>{t(getSkillLevelLabelKey(coach.skillLevel))}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
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
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
          <ProfileInfoCard
            icon={Users}
            label={t("coachDetailsPage.profile.assignedStudents")}
            value={`${coach.assignedStudentsCount}`}
          />

          <ProfileInfoCard
            icon={CalendarCheck}
            label={t("coachDetailsPage.profile.weeklySessions")}
            value={`${coach.weeklySessionsCount}`}
          />

          <ProfileInfoCard
            icon={Star}
            label={t("coachDetailsPage.profile.rating")}
            value={`${coach.rating}/5`}
          />

          <ProfileInfoCard
            icon={BadgeCheck}
            label={t("coachDetailsPage.profile.attendanceCompletion")}
            value={`${coach.attendanceCompletionRate}%`}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <div className="space-y-6">
          <DetailsSection
            icon={Users}
            title={t("coachDetailsPage.assignedStudents.title")}
            description={t("coachDetailsPage.assignedStudents.description")}
          >
            {coach.assignedStudents.length > 0 ? (
              <div className="space-y-3">
                {coach.assignedStudents.map((student) => (
                  <AssignedStudentCard key={student.id} student={student} />
                ))}
              </div>
            ) : (
              <EmptyMiniState
                text={t("coachDetailsPage.assignedStudents.empty")}
              />
            )}
          </DetailsSection>

          <DetailsSection
            icon={CalendarCheck}
            title={t("coachDetailsPage.upcomingSessions.title")}
            description={t("coachDetailsPage.upcomingSessions.description")}
          >
            {coach.upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {coach.upcomingSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <EmptyMiniState
                text={t("coachDetailsPage.upcomingSessions.empty")}
              />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Clock}
            title={t("coachDetailsPage.recentSessions.title")}
            description={t("coachDetailsPage.recentSessions.description")}
          >
            {coach.recentSessions.length > 0 ? (
              <div className="space-y-3">
                {coach.recentSessions.map((session) => (
                  <SessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <EmptyMiniState
                text={t("coachDetailsPage.recentSessions.empty")}
              />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Award}
            title={t("coachDetailsPage.certifications.title")}
            description={t("coachDetailsPage.certifications.description")}
          >
            {coach.certifications.length > 0 ? (
              <div className="space-y-3">
                {coach.certifications.map((certification) => (
                  <CertificationCard
                    key={certification.id}
                    certification={certification}
                  />
                ))}
              </div>
            ) : (
              <EmptyMiniState
                text={t("coachDetailsPage.certifications.empty")}
              />
            )}
          </DetailsSection>
        </div>

        <aside className="space-y-6">
          <DetailsSection
            icon={Trophy}
            title={t("coachDetailsPage.performance.title")}
            description={t("coachDetailsPage.performance.description")}
          >
            {coach.performanceMetrics.length > 0 ? (
              <div className="space-y-3">
                {coach.performanceMetrics.map((metric) => (
                  <PerformanceMetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            ) : (
              <EmptyMiniState
                text={t("coachDetailsPage.performance.empty")}
              />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Phone}
            title={t("coachDetailsPage.contact.title")}
            description={t("coachDetailsPage.contact.description")}
          >
            <div className="grid gap-4">
              <InfoItem
                icon={Phone}
                label={t("coachDetailsPage.contact.phone")}
                value={coach.phone}
              />

              <InfoItem
                icon={Mail}
                label={t("coachDetailsPage.contact.email")}
                value={coach.email}
              />

              <InfoItem
                icon={MapPin}
                label={t("coachDetailsPage.contact.address")}
                value={coach.address ?? t("coachDetailsPage.common.notAvailable")}
              />

              <InfoItem
                icon={ShieldCheck}
                label={t("coachDetailsPage.contact.emergencyContact")}
                value={
                  coach.emergencyContactName
                    ? `${coach.emergencyContactName} - ${coach.emergencyContactPhone ?? ""
                    }`
                    : t("coachDetailsPage.common.notAvailable")
                }
              />
            </div>
          </DetailsSection>

          <DetailsSection
            icon={BriefcaseBusiness}
            title={t("coachDetailsPage.workInfo.title")}
            description={t("coachDetailsPage.workInfo.description")}
          >
            <div className="grid gap-4">
              <InfoItem
                label={t("coachDetailsPage.workInfo.employmentType")}
                value={t(getEmploymentLabelKey(coach.employmentType))}
              />

              <InfoItem
                label={t("coachDetailsPage.workInfo.joinedAt")}
                value={coach.joinedAt}
              />

              <InfoItem
                label={t("coachDetailsPage.workInfo.experienceYears")}
                value={`${coach.experienceYears}`}
              />

              <InfoItem
                label={t("coachDetailsPage.workInfo.lastSession")}
                value={
                  coach.lastSessionDate ??
                  t("coachDetailsPage.common.notAvailable")
                }
              />
            </div>
          </DetailsSection>

          <DetailsSection
            icon={Languages}
            title={t("coachDetailsPage.languages.title")}
            description={t("coachDetailsPage.languages.description")}
          >
            <TagList
              items={coach.languages}
              emptyText={t("coachDetailsPage.languages.empty")}
            />
          </DetailsSection>

          <DetailsSection
            icon={FileText}
            title={t("coachDetailsPage.notes.title")}
            description={t("coachDetailsPage.notes.description")}
          >
            <div className="grid gap-4">
              <InfoItem
                label={t("coachDetailsPage.notes.bio")}
                value={coach.bio ?? t("coachDetailsPage.common.notAvailable")}
              />

              <InfoItem
                label={t("coachDetailsPage.notes.specialties")}
                value={
                  coach.specialties.length > 0
                    ? coach.specialties.join(", ")
                    : t("coachDetailsPage.common.notAvailable")
                }
              />

              <InfoItem
                label={t("coachDetailsPage.notes.notes")}
                value={coach.notes ?? t("coachDetailsPage.common.notAvailable")}
              />
            </div>
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
      to="/admin/coaches"
      className="inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
      {t("coachDetailsPage.backToCoaches")}
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

function AssignedStudentCard({
  student,
}: {
  student: CoachAssignedStudentDto;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to={`/admin/students/${student.id}`}
            className="text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
          >
            {student.fullName}
          </Link>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {student.studentCode} • {student.age}{" "}
            {t("coachDetailsPage.assignedStudents.yearsOld")}
          </p>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {student.programName} • {student.branchName}
          </p>

          <p className="mt-2 text-xs font-black text-muted-foreground">
            {t("coachDetailsPage.assignedStudents.attendanceRate")}:{" "}
            {student.attendanceRate}%
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusBadge
            value={student.subscriptionStatus}
            label={t(getSubscriptionStatusLabelKey(student.subscriptionStatus))}
            type="subscription"
          />

          <StatusBadge
            value={student.paymentStatus}
            label={t(getPaymentStatusLabelKey(student.paymentStatus))}
            type="payment"
          />
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: CoachScheduleSessionDto }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black">
            {session.programName} • {session.locationName}
          </p>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {session.branchName}
          </p>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {session.sessionDate} • {session.startTime} - {session.endTime}
          </p>

          <p className="mt-2 text-xs font-black text-muted-foreground">
            {t("coachDetailsPage.sessions.studentsCount")}:{" "}
            {session.studentsCount}
          </p>
        </div>

        <StatusBadge
          value={session.sessionStatus}
          label={t(getSessionStatusLabelKey(session.sessionStatus))}
          type="session"
        />
      </div>
    </div>
  );
}

function CertificationCard({
  certification,
}: {
  certification: CoachCertificationDto;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-sm font-black">{certification.title}</p>

      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        {certification.issuingOrganization}
      </p>

      <div className="mt-3 grid gap-2 text-xs font-semibold text-muted-foreground sm:grid-cols-2">
        <p>
          {t("coachDetailsPage.certifications.issuedAt")}:{" "}
          {certification.issuedAt}
        </p>

        <p>
          {t("coachDetailsPage.certifications.expiresAt")}:{" "}
          {certification.expiresAt ??
            t("coachDetailsPage.common.notAvailable")}
        </p>
      </div>
    </div>
  );
}

function PerformanceMetricCard({
  metric,
}: {
  metric: CoachPerformanceMetricDto;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black">{metric.title}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {metric.description}
          </p>
        </div>

        <div className="rounded-2xl bg-brand-blue px-4 py-3 text-sm font-black text-white dark:bg-brand-yellow dark:text-brand-blue">
          {metric.value}
          {metric.suffix}
        </div>
      </div>
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
        {Icon && (
          <Icon className="h-4 w-4 text-brand-blue dark:text-brand-yellow" />
        )}

        <p className="text-xs font-bold text-muted-foreground">{label}</p>
      </div>

      <p className="text-sm font-black leading-6">{value}</p>
    </div>
  );
}

function TagList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText: string;
}) {
  if (items.length === 0) {
    return <EmptyMiniState text={emptyText} />;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-secondary px-3 py-2 text-xs font-black text-secondary-foreground"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

interface StatusBadgeProps {
  value: string;
  label: string;
  type: "coach" | "availability" | "subscription" | "payment" | "session";
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

    if (type === "availability") {
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

      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
    }

    if (type === "subscription") {
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
    }

    if (value === "completed") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (value === "cancelled") {
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    }

    if (value === "postponed") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
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

function EmptyMiniState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-center text-sm font-semibold text-muted-foreground">
      {text}
    </div>
  );
}

function CoachDetailsLoadingState() {
  return (
    <main className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />
      <div className="h-72 animate-pulse rounded-[2.5rem] bg-secondary" />

      <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <div className="space-y-6">
          <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
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