import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CalendarClock,
  Clock,
  FileText,
  Home,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Star,
  Trophy,
  Users,
  Wrench
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { getBranchById } from "@/features/admin/branches/services/branches.service";
import type {
  BranchCity,
  BranchCoachSummaryDto,
  BranchDetailsDto,
  BranchFacilityDto,
  BranchFacilityType,
  BranchOperatingDay,
  BranchOperatingHourDto,
  BranchPerformanceMetricDto,
  BranchProgramSummaryDto,
  BranchScheduleSlotDto,
  BranchStatus,
  BranchType,
} from "@/features/admin/branches/types/branches.dto";

function getBranchStatusLabelKey(status: BranchStatus) {
  return `branchesPage.status.${status}`;
}

function getBranchTypeLabelKey(type: BranchType) {
  return `branchesPage.type.${type}`;
}

function getBranchCityLabelKey(city: BranchCity) {
  return `branchesPage.city.${city}`;
}

function getFacilityTypeLabelKey(type: BranchFacilityType) {
  return `branchDetailsPage.facilityType.${type}`;
}

function getDayLabelKey(day: BranchOperatingDay) {
  return `branchDetailsPage.days.${day}`;
}

function getProgramStatusLabelKey(status: BranchProgramSummaryDto["status"]) {
  return `programsPage.status.${status}`;
}

function getCoachStatusLabelKey(status: BranchCoachSummaryDto["status"]) {
  return `coachesPage.status.${status}`;
}

function getSportLabelKey(
  sport:
    | BranchProgramSummaryDto["sportType"]
    | BranchCoachSummaryDto["sportSpecialty"],
) {
  return `programsPage.sport.${sport}`;
}

export default function BranchDetailsPage() {
  const { t } = useTranslation();
  const { branchId } = useParams<{ branchId: string }>();

  const [branch, setBranch] = useState<BranchDetailsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBranch = async () => {
      setIsLoading(true);

      try {
        if (!branchId) {
          setBranch(null);
          return;
        }

        const response = await getBranchById(branchId);

        if (isMounted) {
          setBranch(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBranch();

    return () => {
      isMounted = false;
    };
  }, [branchId]);

  if (isLoading) {
    return <BranchDetailsLoadingState />;
  }

  if (!branch) {
    return (
      <main className="space-y-6">
        <BackLink />

        <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-black">
            {t("branchDetailsPage.notFound.title")}
          </h1>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            {t("branchDetailsPage.notFound.description")}
          </p>

          <Link
            to="/admin/branches"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("branchDetailsPage.notFound.back")}
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
          to={`/admin/branches/${branch.id}/edit`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
        >
          <Pencil className="h-4 w-4" />
          {t("branchDetailsPage.actions.editBranch")}
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-sm">
        <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-brand-yellow text-brand-blue shadow-brand-yellow">
                <Building2 className="h-12 w-12" />
              </div>

              <div>
                <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white/80">
                  {branch.branchCode}
                </p>

                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  {branch.name}
                </h1>

                <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/75">
                  <span>{t(getBranchCityLabelKey(branch.city))}</span>
                  <span>•</span>
                  <span>{branch.area}</span>
                  <span>•</span>
                  <span>{t(getBranchTypeLabelKey(branch.type))}</span>
                </div>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
                  {branch.address}
                </p>
              </div>
            </div>

            <StatusBadge
              value={branch.status}
              label={t(getBranchStatusLabelKey(branch.status))}
            />
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 lg:p-6">
          <ProfileInfoCard
            icon={Users}
            label={t("branchDetailsPage.profile.students")}
            value={`${branch.studentsCount}/${branch.capacity}`}
          />

          <ProfileInfoCard
            icon={Trophy}
            label={t("branchDetailsPage.profile.programs")}
            value={`${branch.programsCount}`}
          />

          <ProfileInfoCard
            icon={CalendarClock}
            label={t("branchDetailsPage.profile.weeklySessions")}
            value={`${branch.weeklySessionsCount}`}
          />

          <ProfileInfoCard
            icon={Star}
            label={t("branchDetailsPage.profile.rating")}
            value={`${branch.rating}/5`}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <div className="space-y-6">
          <DetailsSection
            icon={FileText}
            title={t("branchDetailsPage.overview.title")}
            description={t("branchDetailsPage.overview.description")}
          >
            <p className="text-sm leading-7 text-muted-foreground">
              {branch.description ?? t("branchDetailsPage.common.notAvailable")}
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <InfoItem
                label={t("branchDetailsPage.overview.facilitiesCount")}
                value={`${branch.facilitiesCount}`}
              />

              <InfoItem
                label={t("branchDetailsPage.overview.coachesCount")}
                value={`${branch.coachesCount}`}
              />

              <InfoItem
                label={t("branchDetailsPage.overview.utilizationRate")}
                value={`${branch.utilizationRate}%`}
              />
            </div>
          </DetailsSection>

          <DetailsSection
            icon={Wrench}
            title={t("branchDetailsPage.facilities.title")}
            description={t("branchDetailsPage.facilities.description")}
          >
            {branch.facilities.length > 0 ? (
              <div className="space-y-3">
                {branch.facilities.map((facility) => (
                  <FacilityCard key={facility.id} facility={facility} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("branchDetailsPage.facilities.empty")} />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Clock}
            title={t("branchDetailsPage.operatingHours.title")}
            description={t("branchDetailsPage.operatingHours.description")}
          >
            {branch.operatingHours.length > 0 ? (
              <div className="space-y-3">
                {branch.operatingHours.map((hour) => (
                  <OperatingHourCard key={hour.id} operatingHour={hour} />
                ))}
              </div>
            ) : (
              <EmptyMiniState
                text={t("branchDetailsPage.operatingHours.empty")}
              />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Trophy}
            title={t("branchDetailsPage.programs.title")}
            description={t("branchDetailsPage.programs.description")}
          >
            {branch.programs.length > 0 ? (
              <div className="space-y-3">
                {branch.programs.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("branchDetailsPage.programs.empty")} />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Users}
            title={t("branchDetailsPage.coaches.title")}
            description={t("branchDetailsPage.coaches.description")}
          >
            {branch.coaches.length > 0 ? (
              <div className="space-y-3">
                {branch.coaches.map((coach) => (
                  <CoachCard key={coach.id} coach={coach} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("branchDetailsPage.coaches.empty")} />
            )}
          </DetailsSection>

          <DetailsSection
            icon={CalendarClock}
            title={t("branchDetailsPage.schedule.title")}
            description={t("branchDetailsPage.schedule.description")}
          >
            {branch.schedule.length > 0 ? (
              <div className="space-y-3">
                {branch.schedule.map((slot) => (
                  <ScheduleCard key={slot.id} slot={slot} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("branchDetailsPage.schedule.empty")} />
            )}
          </DetailsSection>
        </div>

        <aside className="space-y-6">
          <DetailsSection
            icon={Trophy}
            title={t("branchDetailsPage.performance.title")}
            description={t("branchDetailsPage.performance.description")}
          >
            {branch.performanceMetrics.length > 0 ? (
              <div className="space-y-3">
                {branch.performanceMetrics.map((metric) => (
                  <PerformanceMetricCard key={metric.id} metric={metric} />
                ))}
              </div>
            ) : (
              <EmptyMiniState text={t("branchDetailsPage.performance.empty")} />
            )}
          </DetailsSection>

          <DetailsSection
            icon={Phone}
            title={t("branchDetailsPage.contact.title")}
            description={t("branchDetailsPage.contact.description")}
          >
            <div className="grid gap-4">
              <InfoItem
                icon={Phone}
                label={t("branchDetailsPage.contact.phone")}
                value={branch.phone}
              />

              <InfoItem
                icon={Mail}
                label={t("branchDetailsPage.contact.email")}
                value={branch.email}
              />

              <InfoItem
                icon={ShieldCheck}
                label={t("branchDetailsPage.contact.managerName")}
                value={branch.managerName}
              />

              <InfoItem
                icon={Phone}
                label={t("branchDetailsPage.contact.managerPhone")}
                value={branch.managerPhone}
              />
            </div>
          </DetailsSection>

          <DetailsSection
            icon={MapPin}
            title={t("branchDetailsPage.location.title")}
            description={t("branchDetailsPage.location.description")}
          >
            <div className="grid gap-4">
              <InfoItem
                icon={MapPin}
                label={t("branchDetailsPage.location.city")}
                value={t(getBranchCityLabelKey(branch.city))}
              />

              <InfoItem
                icon={Home}
                label={t("branchDetailsPage.location.area")}
                value={branch.area}
              />

              <InfoItem
                icon={MapPin}
                label={t("branchDetailsPage.location.address")}
                value={branch.address}
              />

              <InfoItem
                label={t("branchDetailsPage.location.coordinates")}
                value={
                  branch.latitude && branch.longitude
                    ? `${branch.latitude}, ${branch.longitude}`
                    : t("branchDetailsPage.common.notAvailable")
                }
              />
            </div>
          </DetailsSection>

          <DetailsSection
            icon={FileText}
            title={t("branchDetailsPage.notes.title")}
            description={t("branchDetailsPage.notes.description")}
          >
            <InfoItem
              label={t("branchDetailsPage.notes.notes")}
              value={branch.notes ?? t("branchDetailsPage.common.notAvailable")}
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
      to="/admin/branches"
      className="inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
      {t("branchDetailsPage.backToBranches")}
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

function FacilityCard({ facility }: { facility: BranchFacilityDto }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black">{facility.name}</p>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {t(getFacilityTypeLabelKey(facility.type))}
          </p>

          <p className="mt-2 text-xs font-black text-muted-foreground">
            {t("branchDetailsPage.facilities.capacity")}: {facility.capacity}
          </p>
        </div>

        <StatusPill
          isActive={facility.isAvailable}
          activeText={t("branchDetailsPage.facilities.available")}
          inactiveText={t("branchDetailsPage.facilities.unavailable")}
        />
      </div>
    </div>
  );
}

function OperatingHourCard({
  operatingHour,
}: {
  operatingHour: BranchOperatingHourDto;
}) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-black">
          {t(getDayLabelKey(operatingHour.dayOfWeek))}
        </p>

        {operatingHour.isClosed ? (
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700 dark:bg-red-950 dark:text-red-300">
            {t("branchDetailsPage.operatingHours.closed")}
          </span>
        ) : (
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700 dark:bg-green-950 dark:text-green-300">
            {operatingHour.opensAt} - {operatingHour.closesAt}
          </span>
        )}
      </div>
    </div>
  );
}

function ProgramCard({ program }: { program: BranchProgramSummaryDto }) {
  const { t } = useTranslation();

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to={`/admin/programs/${program.id}`}
            className="text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
          >
            {program.name}
          </Link>

          <p className="mt-1 text-xs font-semibold text-muted-foreground">
            {program.programCode} • {t(getSportLabelKey(program.sportType))}
          </p>

          <p className="mt-2 text-xs font-black text-muted-foreground">
            {program.enrolledStudentsCount}/{program.capacity}{" "}
            {t("branchDetailsPage.programs.students")}
          </p>
        </div>

        <StatusBadge
          value={program.status}
          label={t(getProgramStatusLabelKey(program.status))}
        />
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: BranchCoachSummaryDto }) {
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
            {coach.coachCode} • {t(getSportLabelKey(coach.sportSpecialty))}
          </p>

          <p className="mt-2 text-xs font-black text-muted-foreground">
            {coach.weeklySessionsCount}{" "}
            {t("branchDetailsPage.coaches.weeklySessions")}
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <StatusBadge
            value={coach.status}
            label={t(getCoachStatusLabelKey(coach.status))}
          />

          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2">
            <Star className="h-4 w-4 fill-current text-brand-yellow" />
            <span className="text-sm font-black">{coach.rating}/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleCard({ slot }: { slot: BranchScheduleSlotDto }) {
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
            {slot.programName} • {slot.facilityName}
          </p>

          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            {slot.coachName}
          </p>

          <p className="mt-2 text-xs font-black text-muted-foreground">
            {t("branchDetailsPage.schedule.studentsCount")}:{" "}
            {slot.studentsCount}
          </p>
        </div>

        <Clock className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
      </div>
    </div>
  );
}

function PerformanceMetricCard({
  metric,
}: {
  metric: BranchPerformanceMetricDto;
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

function StatusBadge({ value, label }: { value: string; label: string }) {
  const getClasses = () => {
    if (value === "active") {
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
    }

    if (
      value === "under_maintenance" ||
      value === "seasonal" ||
      value === "on_leave" ||
      value === "draft"
    ) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300";
    }

    if (value === "inactive" || value === "archived") {
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
    }

    if (value === "suspended") {
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

function StatusPill({
  isActive,
  activeText,
  inactiveText,
}: {
  isActive: boolean;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${isActive
        ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
        : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
        }`}
    >
      {isActive ? activeText : inactiveText}
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

function BranchDetailsLoadingState() {
  return (
    <main className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />
      <div className="h-72 animate-pulse rounded-[2.5rem] bg-secondary" />

      <div className="grid gap-6 xl:grid-cols-[0.65fr_0.35fr]">
        <div className="space-y-6">
          <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
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