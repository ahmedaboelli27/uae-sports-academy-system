import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowLeft,
  Award,
  CalendarClock,
  CheckCircle2,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Layers,
  MapPin,
  Pencil,
  Star,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { getProgramById } from "@/features/admin/programs/services/programs.service";
import type {
  ProgramAgeGroup,
  ProgramBranchSummaryDto,
  ProgramCoachSummaryDto,
  ProgramDetailsDto,
  ProgramEnrollmentStatus,
  ProgramLevel,
  ProgramPerformanceMetricDto,
  ProgramPricingCycle,
  ProgramPricingDto,
  ProgramScheduleSlotDto,
  ProgramSportType,
  ProgramStatus,
} from "@/features/admin/programs/types/programs.dto";

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

function getPricingCycleLabelKey(cycle: ProgramPricingCycle) {
  return `programDetailsPage.pricingCycle.${cycle}`;
}

function getDayLabelKey(day: ProgramScheduleSlotDto["dayOfWeek"]) {
  return `programDetailsPage.days.${day}`;
}

export default function ProgramDetailsPage() {
  const { t } = useTranslation();
  const { programId } = useParams<{ programId: string }>();

  const [program, setProgram] = useState<ProgramDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProgram = async () => {
      setIsLoading(true);

      try {
        if (!programId) {
          setProgram(null);
          return;
        }

        const response = await getProgramById(programId);

        if (isMounted) {
          setProgram(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProgram();

    return () => {
      isMounted = false;
    };
  }, [programId]);

  if (isLoading) {
    return <ProgramDetailsLoadingState />;
  }

  if (!program) {
    return (
      <main className="space-y-6">
        <BackLink />

        <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-black">
            {t("programDetailsPage.notFound.title")}
          </h1>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            {t("programDetailsPage.notFound.description")}
          </p>

          <Link
            to="/admin/programs"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("programDetailsPage.notFound.back")}
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
          to={`/admin/programs/${program.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
        >
          <Pencil className="h-4 w-4" />
          {t("programDetailsPage.actions.editProgram")}
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
        <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-brand-yellow text-brand-blue shadow-brand-yellow">
                <Layers className="h-12 w-12" />
              </div>

              <div>
                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                  {program.programCode}
                </p>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  {program.name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                  <span>{t(getSportTypeLabelKey(program.sportType))}</span>
                  <span>•</span>
                  <span>{t(getAgeGroupLabelKey(program.ageGroup))}</span>
                  <span>•</span>
                  <span>{t(getLevelLabelKey(program.level))}</span>
                </div>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
                  {program.shortDescription}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
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
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
          <ProfileInfoCard
            icon={Users}
            label={t("programDetailsPage.profile.capacity")}
            value={`${program.enrolledStudentsCount}/${program.capacity}`}
          />

          <ProfileInfoCard
            icon={DollarSign}
            label={t("programDetailsPage.profile.monthlyPrice")}
            value={`${program.monthlyPrice} ${program.currency}`}
          />

          <ProfileInfoCard
            icon={Star}
            label={t("programDetailsPage.profile.rating")}
            value={`${program.rating}/5`}
          />

          <ProfileInfoCard
            icon={CheckCircle2}
            label={t("programDetailsPage.profile.attendanceAverage")}
            value={`${program.attendanceAverage}%`}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <div className="space-y-6">
          <DetailsSection
            icon={FileText}
            title={t("programDetailsPage.overview.title")}
            description={t("programDetailsPage.overview.description")}
          >
            <p className="text-sm leading-7 text-muted-foreground">
              {program.description}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <InfoItem
                label={t("programDetailsPage.overview.durationWeeks")}
                value={`${program.durationWeeks}`}
              />

              <InfoItem
                label={t("programDetailsPage.overview.sessionsPerWeek")}
                value={`${program.sessionsPerWeek}`}
              />

              <InfoItem
                label={t("programDetailsPage.overview.sessionDuration")}
                value={`${program.sessionDurationMinutes} ${t(
                  "programDetailsPage.common.minutes",
                )}`}
              />
            </div>
          </DetailsSection>

          <DetailsSection
            icon={Target}
            title={t("programDetailsPage.objectives.title")}
            description={t("programDetailsPage.objectives.description")}
          >
            <BulletList
              items={program.objectives}
              emptyText={t("programDetailsPage.objectives.empty")}
            />
          </DetailsSection>

          <DetailsSection
            icon={Award}
            title={t("programDetailsPage.requirements.title")}
            description={t("programDetailsPage.requirements.description")}
          >
            <BulletList
              items={program.requirements}
              emptyText={t("programDetailsPage.requirements.empty")}
            />
          </DetailsSection>

          <DetailsSection
            icon={MapPin}
            title={t("programDetailsPage.branches.title")}
            description={t("programDetailsPage.branches.description")}
          >
            {program.branches.length > 0 ? (
              <div className="space-y-3">
                {program.branches.map((branch) => (
                  <BranchCard key={branch.id} branch={branch} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("programDetailsPage.branches.empty")} />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Users}
            title={t("programDetailsPage.coaches.title")}
            description={t("programDetailsPage.coaches.description")}
          >
            {program.coaches.length > 0 ? (
              <div className="space-y-3">
                {program.coaches.map((coach) => (
                  <CoachCard key={coach.id} coach={coach} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("programDetailsPage.coaches.empty")} />
            )}
          </DetailsSection>

          <DetailsSection
            icon={CalendarClock}
            title={t("programDetailsPage.schedule.title")}
            description={t("programDetailsPage.schedule.description")}
          >
            {program.schedule.length > 0 ? (
              <div className="space-y-3">
                {program.schedule.map((slot) => (
                  <ScheduleCard key={slot.id} slot={slot} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("programDetailsPage.schedule.empty")} />
            )}
          </DetailsSection>
        </div>

        <aside className="space-y-6">
          <DetailsSection
            icon={DollarSign}
            title={t("programDetailsPage.pricing.title")}
            description={t("programDetailsPage.pricing.description")}
          >
            {program.pricing.length > 0 ? (
              <div className="space-y-3">
                {program.pricing.map((pricing) => (
                  <PricingCard key={pricing.id} pricing={pricing} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("programDetailsPage.pricing.empty")} />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Trophy}
            title={t("programDetailsPage.performance.title")}
            description={t("programDetailsPage.performance.description")}
          >
            {program.performanceMetrics.length > 0 ? (
              <div className="space-y-3">
                {program.performanceMetrics.map((metric) => (
                  <PerformanceMetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            ) : (
              <EmptyMiniState
                text={t("programDetailsPage.performance.empty")}
              />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Eye}
            title={t("programDetailsPage.quickInfo.title")}
            description={t("programDetailsPage.quickInfo.description")}
          >
            <div className="grid gap-4">
              <InfoItem
                label={t("programDetailsPage.quickInfo.sport")}
                value={t(getSportTypeLabelKey(program.sportType))}
              />

              <InfoItem
                label={t("programDetailsPage.quickInfo.level")}
                value={t(getLevelLabelKey(program.level))}
              />

              <InfoItem
                label={t("programDetailsPage.quickInfo.ageGroup")}
                value={t(getAgeGroupLabelKey(program.ageGroup))}
              />

              <InfoItem
                label={t("programDetailsPage.quickInfo.ageRange")}
                value={`${program.minAge}-${program.maxAge} ${t(
                  "programDetailsPage.common.years",
                )}`}
              />

              <InfoItem
                label={t("programDetailsPage.quickInfo.createdAt")}
                value={program.createdAt.slice(0, 10)}
              />

              <InfoItem
                label={t("programDetailsPage.quickInfo.updatedAt")}
                value={program.updatedAt.slice(0, 10)}
              />
            </div>
          </DetailsSection>

          <DetailsSection
            icon={FileText}
            title={t("programDetailsPage.notes.title")}
            description={t("programDetailsPage.notes.description")}
          >
            <InfoItem
              label={t("programDetailsPage.notes.notes")}
              value={program.notes ?? t("programDetailsPage.common.notAvailable")}
            />
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
      to="/admin/programs"
      className="inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
      {t("programDetailsPage.backToPrograms")}
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

function BranchCard({ branch }: { branch: ProgramBranchSummaryDto }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black">{branch.name}</p>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {branch.city}
          </p>
        </div>

        <div className="rounded-2xl bg-secondary px-4 py-3 text-sm font-black">
          {branch.enrolledStudentsCount}/{branch.capacity}{" "}
          {t("programDetailsPage.branches.students")}
        </div>
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: ProgramCoachSummaryDto }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to={`/admin/coaches/${coach.id}`}
            className="text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
          >
            {coach.fullName}
          </Link>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {coach.coachCode} • {t(getSportTypeLabelKey(coach.sportSpecialty))}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2">
          <Star className="h-4 w-4 fill-current text-brand-yellow" />
          <span className="text-sm font-black">{coach.rating}/5</span>
        </div>
      </div>
    </div>
  );
}

function ScheduleCard({ slot }: { slot: ProgramScheduleSlotDto }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black">
            {t(getDayLabelKey(slot.dayOfWeek))} • {slot.startTime} -{" "}
            {slot.endTime}
          </p>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {slot.branchName} • {slot.locationName}
          </p>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {slot.coachName}
          </p>
        </div>

        <Clock className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
      </div>
    </div>
  );
}

function PricingCard({ pricing }: { pricing: ProgramPricingDto }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">
            {t(getPricingCycleLabelKey(pricing.cycle))}
          </p>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {pricing.sessionsCount
              ? `${pricing.sessionsCount} ${t(
                "programDetailsPage.pricing.sessions",
              )}`
              : t("programDetailsPage.pricing.unlimitedSessions")}
          </p>
        </div>

        <div className="text-end">
          <p className="text-lg font-black text-brand-blue dark:text-brand-yellow">
            {pricing.price} {pricing.currency}
          </p>

          {pricing.isRecommended && (
            <p className="mt-1 text-xs font-black text-green-600 dark:text-green-300">
              {t("programDetailsPage.pricing.recommended")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PerformanceMetricCard({
  metric,
}: {
  metric: ProgramPerformanceMetricDto;
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

function BulletList({
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
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 rounded-2xl border border-border bg-background p-4"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-300" />
          <p className="text-sm font-semibold leading-6 text-muted-foreground">
            {item}
          </p>
        </div>
      ))}
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black leading-6">{value}</p>
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

function EmptyMiniState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-5 text-center text-sm font-semibold text-muted-foreground">
      {text}
    </div>
  );
}

function ProgramDetailsLoadingState() {
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