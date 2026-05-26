import BrandLogo from "@/components/shared/BrandLogo";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  CreditCard,
  Dumbbell,
  MapPin,
  Medal,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

interface KpiItem {
  value: string;
  label: string;
}

interface ProgramItem {
  title: string;
  age: string;
  level: string;
  description: string;
  icon: LucideIcon;
}

interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface CoachItem {
  name: string;
  role: string;
  experience: string;
}

interface BranchItem {
  city: string;
  location: string;
  schedule: string;
}

export default function HomePage() {
  const { t } = useTranslation();

  const kpis: KpiItem[] = [
    {
      value: "1,200+",
      label: t("home.kpis.players"),
    },
    {
      value: "35+",
      label: t("home.kpis.coaches"),
    },
    {
      value: "8",
      label: t("home.kpis.locations"),
    },
    {
      value: "94%",
      label: t("home.kpis.satisfaction"),
    },
  ];

  const programs: ProgramItem[] = [
    {
      title: t("home.programs.football.title"),
      age: t("home.programs.football.age"),
      level: t("home.programs.football.level"),
      description: t("home.programs.football.description"),
      icon: Trophy,
    },
    {
      title: t("home.programs.swimming.title"),
      age: t("home.programs.swimming.age"),
      level: t("home.programs.swimming.level"),
      description: t("home.programs.swimming.description"),
      icon: ShieldCheck,
    },
    {
      title: t("home.programs.basketball.title"),
      age: t("home.programs.basketball.age"),
      level: t("home.programs.basketball.level"),
      description: t("home.programs.basketball.description"),
      icon: Dumbbell,
    },
  ];

  const features: FeatureItem[] = [
    {
      title: t("home.features.parentPortal.title"),
      description: t("home.features.parentPortal.description"),
      icon: Users,
    },
    {
      title: t("home.features.scheduling.title"),
      description: t("home.features.scheduling.description"),
      icon: CalendarDays,
    },
    {
      title: t("home.features.finance.title"),
      description: t("home.features.finance.description"),
      icon: CreditCard,
    },
    {
      title: t("home.features.kpi.title"),
      description: t("home.features.kpi.description"),
      icon: BarChart3,
    },
  ];

  const coaches: CoachItem[] = [
    {
      name: t("home.coaches.items.first.name"),
      role: t("home.coaches.items.first.role"),
      experience: t("home.coaches.items.first.experience"),
    },
    {
      name: t("home.coaches.items.second.name"),
      role: t("home.coaches.items.second.role"),
      experience: t("home.coaches.items.second.experience"),
    },
    {
      name: t("home.coaches.items.third.name"),
      role: t("home.coaches.items.third.role"),
      experience: t("home.coaches.items.third.experience"),
    },
  ];

  const branches: BranchItem[] = [
    {
      city: t("home.branches.items.dubai.city"),
      location: t("home.branches.items.dubai.location"),
      schedule: t("home.branches.items.dubai.schedule"),
    },
    {
      city: t("home.branches.items.abudhabi.city"),
      location: t("home.branches.items.abudhabi.location"),
      schedule: t("home.branches.items.abudhabi.schedule"),
    },
    {
      city: t("home.branches.items.sharjah.city"),
      location: t("home.branches.items.sharjah.location"),
      schedule: t("home.branches.items.sharjah.schedule"),
    },
  ];

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <section className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-[720px] bg-[radial-gradient(circle_at_top_left,rgba(0,18,155,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(255,212,0,0.22),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.12),transparent_34%),radial-gradient(circle_at_top_right,rgba(0,18,155,0.30),transparent_30%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-white px-4 py-2 text-sm font-black text-brand-blue shadow-sm dark:border-white/10 dark:bg-white/10 dark:text-brand-yellow">
              <Sparkles className="h-4 w-4" />
              {t("home.hero.badge")}
            </div>

            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-brand-blue dark:text-white sm:text-5xl lg:text-6xl">
              {t("home.hero.title")}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {t("home.hero.description")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register-child"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-7 py-4 text-sm font-black text-white shadow-brand transition hover:-translate-y-1 hover:bg-brand-blue-dark"
              >
                {t("common.registerChild")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>

              <Link
                to="/programs"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-sm font-black text-foreground shadow-sm transition hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg"
              >
                {t("common.explorePrograms")}
                <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {kpis.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-border bg-card p-4 shadow-sm"
                >
                  <p className="text-2xl font-black text-brand-blue dark:text-brand-yellow">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs font-bold text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-yellow/30 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-brand-blue/20 blur-3xl" />

            <div className="relative rounded-[2.5rem] border border-border bg-card p-4 shadow-2xl">
              <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <BrandLogo size="lg" showText variant="white" />

                    <p className="mt-6 text-sm font-bold text-white/70">
                      {t("home.heroVisual.overview")}
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      {t("home.heroVisual.dashboard")}
                    </h2>
                  </div>

                  <div className="rounded-2xl bg-brand-yellow p-3 text-brand-blue shadow-brand-yellow">
                    <BarChart3 className="h-7 w-7" />
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <MiniDashboardCard
                    title={t("home.heroVisual.todaySessions")}
                    value="24"
                    icon={CalendarDays}
                  />
                  <MiniDashboardCard
                    title={t("home.heroVisual.attendanceRate")}
                    value="91%"
                    icon={CheckCircle2}
                  />
                  <MiniDashboardCard
                    title={t("home.heroVisual.pendingPayments")}
                    value="18"
                    icon={Clock}
                  />
                  <MiniDashboardCard
                    title={t("home.heroVisual.activePlayers")}
                    value="1,204"
                    icon={Users}
                  />
                </div>

                <div className="mt-8 rounded-3xl bg-white/10 p-5 backdrop-blur">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-black">
                      {t("home.heroVisual.monthlyRevenue")}
                    </p>
                    <p className="text-sm font-black text-brand-yellow">
                      +18.4%
                    </p>
                  </div>

                  <div className="flex h-28 items-end gap-2">
                    {[40, 55, 42, 70, 64, 85, 78, 95].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 rounded-t-xl bg-brand-yellow/80"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-2 hidden rounded-3xl border border-border bg-card p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                  <Award className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-black">
                    {t("home.heroVisual.pathway")}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    {t("home.heroVisual.trackSkills")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionHeader
        eyebrow={t("home.programsSection.eyebrow")}
        title={t("home.programsSection.title")}
        description={t("home.programsSection.description")}
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {programs.map((program) => {
            const Icon = program.icon;

            return (
              <article
                key={program.title}
                className="group rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue transition group-hover:bg-brand-blue group-hover:text-white dark:bg-white/10 dark:text-brand-yellow">
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="text-xl font-black text-foreground">
                  {program.title}
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                    {program.age}
                  </span>
                  <span className="rounded-full bg-brand-yellow/20 px-3 py-1 text-xs font-bold text-brand-blue dark:text-brand-yellow">
                    {program.level}
                  </span>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {program.description}
                </p>

                <Link
                  to="/programs"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-black text-brand-blue dark:text-brand-yellow"
                >
                  {t("common.viewProgram")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-brand-blue py-16 text-white dark:bg-brand-navy lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-brand-yellow">
                {t("home.why.eyebrow")}
              </p>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                {t("home.why.title")}
              </h2>

              <p className="mt-5 text-base leading-8 text-white/75">
                {t("home.why.description")}
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
                  >
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg font-black">{feature.title}</h3>

                    <p className="mt-3 text-sm leading-7 text-white/70">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <SectionHeader
        eyebrow={t("home.coaches.eyebrow")}
        title={t("home.coaches.title")}
        description={t("home.coaches.description")}
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {coaches.map((coach, index) => (
            <article
              key={coach.name}
              className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex h-52 items-center justify-center bg-gradient-to-br from-brand-blue/10 via-brand-yellow/20 to-background dark:from-white/10 dark:via-brand-yellow/10 dark:to-brand-dark">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-blue text-3xl font-black text-white shadow-brand">
                  {index + 1}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-black">{coach.name}</h3>

                <p className="mt-1 text-sm font-black text-brand-blue dark:text-brand-yellow">
                  {coach.role}
                </p>

                <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary p-4">
                  <span className="text-xs font-bold text-muted-foreground">
                    {t("home.coaches.experience")}
                  </span>

                  <span className="text-sm font-black">
                    {coach.experience}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-1 text-brand-yellow">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SectionHeader
        eyebrow={t("home.branches.eyebrow")}
        title={t("home.branches.title")}
        description={t("home.branches.description")}
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {branches.map((branch) => (
            <article
              key={branch.city}
              className="rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                <MapPin className="h-7 w-7" />
              </div>

              <h3 className="text-xl font-black">{branch.city}</h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {branch.location}
              </p>

              <div className="mt-5 rounded-2xl bg-secondary p-4">
                <p className="text-xs font-bold text-muted-foreground">
                  {t("home.branches.trainingDays")}
                </p>

                <p className="mt-1 text-sm font-black">{branch.schedule}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <PortalCard
            icon={Users}
            title={t("home.portals.parent.title")}
            description={t("home.portals.parent.description")}
            items={[
              t("home.portals.parent.item1"),
              t("home.portals.parent.item2"),
              t("home.portals.parent.item3"),
            ]}
          />

          <PortalCard
            icon={Medal}
            title={t("home.portals.coach.title")}
            description={t("home.portals.coach.description")}
            items={[
              t("home.portals.coach.item1"),
              t("home.portals.coach.item2"),
              t("home.portals.coach.item3"),
            ]}
          />

          <PortalCard
            icon={BarChart3}
            title={t("home.portals.admin.title")}
            description={t("home.portals.admin.description")}
            items={[
              t("home.portals.admin.item1"),
              t("home.portals.admin.item2"),
              t("home.portals.admin.item3"),
            ]}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-8 text-white shadow-2xl sm:p-12 lg:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-brand-yellow px-4 py-2 text-sm font-black text-brand-blue">
                {t("home.cta.badge")}
              </p>

              <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                {t("home.cta.title")}
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                {t("home.cta.description")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/book-trial"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow px-7 py-4 text-sm font-black text-brand-blue transition hover:-translate-y-1 hover:shadow-xl"
              >
                {t("common.bookFreeTrial")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-black text-white transition hover:bg-white/10"
              >
                {t("common.contactAcademy")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface MiniDashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

function MiniDashboardCard({
  title,
  value,
  icon: Icon,
}: MiniDashboardCardProps) {
  return (
    <div className="rounded-3xl bg-white/10 p-5 backdrop-blur">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-2xl font-black">{value}</p>

      <p className="mt-1 text-xs font-bold text-white/70">{title}</p>
    </div>
  );
}

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 pt-16 text-center sm:px-6 lg:px-8 lg:pt-20">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.25em] text-brand-blue dark:text-brand-yellow">
        {eyebrow}
      </p>

      <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>

      <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-muted-foreground">
        {description}
      </p>
    </section>
  );
}

interface PortalCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
}

function PortalCard({
  icon: Icon,
  title,
  description,
  items,
}: PortalCardProps) {
  return (
    <article className="rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <Icon className="h-7 w-7" />
      </div>

      <h3 className="text-xl font-black">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {description}
      </p>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-blue dark:text-brand-yellow" />

            <span className="text-sm font-bold text-muted-foreground">
              {item}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}