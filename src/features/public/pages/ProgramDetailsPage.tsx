import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  CreditCard,
  Dumbbell,
  Medal,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ROUTE_PATHS } from '@/app/router/route-paths';
import {
  loadPublicProgramDetails,
  publicProgramDetailsFallbackContent,
} from '@/features/public/services/public-data.service';
import type {
  PublicProgramCardDto,
  PublicProgramDetailsContentDto,
} from '@/features/public/types/public-content.dto';

const relatedIcons: LucideIcon[] = [Trophy, Dumbbell, Medal];

export default function ProgramDetailsPage() {
  const { programId } = useParams<{ programId: string }>();

  const [content, setContent] = useState<PublicProgramDetailsContentDto>(
    publicProgramDetailsFallbackContent,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadPublicProgramDetails(programId ?? '')
      .then((data) => {
        if (isMounted) {
          setContent(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setContent(publicProgramDetailsFallbackContent);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [programId]);

  const priceLabel =
    content.program.priceMonthly !== null
      ? `${content.program.priceMonthly} ${content.program.currency}/mo`
      : 'Price on request';

  return (
    <main className="overflow-hidden">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_34%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Link
              to={ROUTE_PATHS.public.programs}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-white/85 backdrop-blur transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Programs
            </Link>

            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <Sparkles className="h-4 w-4" />
              {content.hero.badge}
            </div>

            <h1 className="max-w-5xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {content.hero.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-white/76 sm:text-lg">
              {content.hero.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={ROUTE_PATHS.public.registerChild}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                {content.hero.primaryAction}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to={ROUTE_PATHS.public.bookTrial}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                {content.hero.secondaryAction}
              </Link>
            </div>

            {isLoading ? (
              <p className="mt-5 text-sm font-bold text-white/65">
                Loading live program details...
              </p>
            ) : null}
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-brand-yellow/20 blur-3xl" />

            <div className="relative rounded-[2.5rem] border border-white/15 bg-white/10 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="rounded-[2rem] bg-white p-5 text-brand-blue shadow-2xl dark:bg-card dark:text-white">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                      Program Snapshot
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      {content.program.title}
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                    <Trophy className="h-7 w-7" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <SnapshotItem
                    icon={UsersRound}
                    label="Age"
                    value={content.program.age}
                  />
                  <SnapshotItem
                    icon={Target}
                    label="Level"
                    value={content.program.level}
                  />
                  <SnapshotItem
                    icon={CreditCard}
                    label="Price"
                    value={priceLabel}
                  />
                  <SnapshotItem
                    icon={CalendarCheck}
                    label="Capacity"
                    value={
                      content.program.capacity !== null
                        ? `${content.program.capacity} students`
                        : 'Flexible capacity'
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionShell
        title={content.overview.title}
        description={content.overview.description}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {content.overview.items.map((item) => (
            <FeatureCard
              key={item.id}
              icon={CheckCircle2}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </SectionShell>

      <section className="bg-secondary/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-brand-blue dark:text-brand-yellow">
              Player Pathway
            </p>

            <h2 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
              {content.pathway.title}
            </h2>

            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              {content.pathway.description}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {content.pathway.steps.map((step, index) => (
              <article
                key={step.id}
                className="rounded-[2rem] border border-border bg-background p-6 shadow-sm dark:bg-white/[0.04]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-lg font-black text-white dark:bg-brand-yellow dark:text-brand-blue">
                  {index + 1}
                </div>

                <h3 className="text-xl font-black">{step.title}</h3>

                <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SectionShell
        title={content.safety.title}
        description={content.safety.description}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {content.safety.items.map((item) => (
            <FeatureCard
              key={item.id}
              icon={ShieldCheck}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </SectionShell>

      {content.relatedPrograms.length > 0 ? (
        <section className="bg-secondary/40 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-brand-blue dark:text-brand-yellow">
                Related Programs
              </p>

              <h2 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
                Explore more training options
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                These programs are loaded from the same public program catalog.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {content.relatedPrograms.map((program, index) => (
                <RelatedProgramCard
                  key={program.id}
                  program={program}
                  icon={relatedIcons[index % relatedIcons.length]}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-8 text-white shadow-[0_30px_90px_rgba(0,18,155,0.24)] lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-blue">
                <Sparkles className="h-4 w-4" />
                {content.cta.badge}
              </div>

              <h2 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
                {content.cta.title}
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-white/72 sm:text-base">
                {content.cta.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to={ROUTE_PATHS.public.registerChild}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                {content.cta.primaryAction}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to={ROUTE_PATHS.public.bookTrial}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                {content.cta.secondaryAction}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function SectionShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-brand-blue dark:text-brand-yellow">
            Program Experience
          </p>

          <h2 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {title}
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-[2rem] border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-xl font-black">{title}</h3>

      <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

function SnapshotItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-secondary/45 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="text-sm font-black">{value}</p>
    </div>
  );
}

function RelatedProgramCard({
  program,
  icon: Icon,
}: {
  program: PublicProgramCardDto;
  icon: LucideIcon;
}) {
  return (
    <article className="rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-xl font-black text-brand-blue dark:text-white">
        {program.title}
      </h3>

      <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-muted-foreground">
        {program.description}
      </p>

      <Link
        to={ROUTE_PATHS.public.programDetails(program.slug)}
        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
      >
        View Program
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}