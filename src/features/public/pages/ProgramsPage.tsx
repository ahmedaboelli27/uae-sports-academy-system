import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  Medal,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTE_PATHS } from '@/app/router/route-paths';
import {
  loadPublicProgramsContent,
  publicProgramsFallbackContent,
} from '@/features/public/services/public-data.service';
import type {
  PublicProgramCardDto,
  PublicProgramsContentDto,
} from '@/features/public/types/public-content.dto';

const programIcons: LucideIcon[] = [
  Trophy,
  Dumbbell,
  Medal,
  Target,
  ShieldCheck,
  CalendarCheck,
];

export default function ProgramsPage() {
  const [content, setContent] = useState<PublicProgramsContentDto>(
    publicProgramsFallbackContent,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadPublicProgramsContent()
      .then((data) => {
        if (isMounted) {
          setContent(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setContent(publicProgramsFallbackContent);
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
  }, []);

  const filteredPrograms = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return content.programs.filter((program) => {
      const matchesSearch =
        !normalizedSearch ||
        program.title.toLowerCase().includes(normalizedSearch) ||
        program.description.toLowerCase().includes(normalizedSearch) ||
        program.age.toLowerCase().includes(normalizedSearch) ||
        program.level.toLowerCase().includes(normalizedSearch) ||
        program.sportName.toLowerCase().includes(normalizedSearch);

      const matchesSport =
        sportFilter === 'all' || program.sportName === sportFilter;

      const matchesLevel =
        levelFilter === 'all' || program.level === levelFilter;

      return matchesSearch && matchesSport && matchesLevel;
    });
  }, [content.programs, levelFilter, searchTerm, sportFilter]);

  return (
    <main className="overflow-hidden">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_34%)]" />
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
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
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                {content.hero.secondaryAction}
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-brand-yellow/20 blur-3xl" />

            <div className="relative rounded-[2.5rem] border border-white/15 bg-white/10 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="rounded-[2rem] bg-white p-5 text-brand-blue shadow-2xl dark:bg-card dark:text-white">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                      Live Program Catalog
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      {content.programs.length} Active Programs
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                    <Trophy className="h-7 w-7" />
                  </div>
                </div>

                <div className="grid gap-3">
                  {content.programs.slice(0, 3).map((program, index) => {
                    const Icon = programIcons[index % programIcons.length];

                    return (
                      <div
                        key={program.id}
                        className="rounded-2xl border border-border bg-secondary/45 p-4"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <Icon className="h-4 w-4 text-brand-blue dark:text-brand-yellow" />
                          <h3 className="line-clamp-1 text-sm font-black">
                            {program.title}
                          </h3>
                        </div>

                        <p className="line-clamp-2 text-sm font-semibold leading-6 text-muted-foreground">
                          {program.age} · {program.level}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white/70 backdrop-blur">
                Loading live program data...
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
            <label className="block">
              <span className="mb-2 block text-sm font-black">Search</span>

              <div className="relative">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by program, sport, age, or level..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </div>
            </label>

            <FilterSelect
              label="Sport"
              value={sportFilter}
              options={[
                { label: 'All sports', value: 'all' },
                ...content.filters.sports.map((sport) => ({
                  label: sport,
                  value: sport,
                })),
              ]}
              onChange={setSportFilter}
            />

            <FilterSelect
              label="Level"
              value={levelFilter}
              options={[
                { label: 'All levels', value: 'all' },
                ...content.filters.levels.map((level) => ({
                  label: level,
                  value: level,
                })),
              ]}
              onChange={setLevelFilter}
            />
          </div>
        </div>
      </section>

      <section className="bg-background px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-brand-blue dark:text-brand-yellow">
                Program Catalog
              </p>

              <h2 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
                Choose the right training path
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Programs are loaded through the public data service and can be
                switched to database mode through the existing API configuration.
              </p>
            </div>

            <span className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
              {filteredPrograms.length} program(s)
            </span>
          </div>

          {filteredPrograms.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredPrograms.map((program, index) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  icon={programIcons[index % programIcons.length]}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
                <Search className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-black">No programs found</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Try changing the search term, sport, or level filter.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <FeatureCard
            icon={ShieldCheck}
            title="Safe progression"
            description="Programs are designed to match age, ability, and training intensity."
          />

          <FeatureCard
            icon={UsersRound}
            title="Family visibility"
            description="Parents can follow attendance, progress, documents, and payments from the portal."
          />

          <FeatureCard
            icon={BadgeCheck}
            title="Database-ready catalog"
            description="Program cards can be managed from real academy records through the backend."
          />
        </div>
      </section>

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
                to={ROUTE_PATHS.public.bookTrial}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                {content.cta.primaryAction}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to={ROUTE_PATHS.public.registerChild}
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

function ProgramCard({
  program,
  icon: Icon,
}: {
  program: PublicProgramCardDto;
  icon: LucideIcon;
}) {
  const priceLabel =
    program.priceMonthly !== null
      ? `${program.priceMonthly} ${program.currency}/mo`
      : 'Price on request';

  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg">
      <div className="absolute -end-12 -top-12 h-28 w-28 rounded-full bg-brand-yellow/10 blur-3xl" />

      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white transition group-hover:scale-105 dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-7 w-7" />
        </div>

        <span className="rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
          {program.sportName}
        </span>
      </div>

      <h3 className="relative text-xl font-black text-brand-blue dark:text-white">
        {program.title}
      </h3>

      <p className="relative mt-3 line-clamp-3 text-sm font-semibold leading-7 text-muted-foreground">
        {program.description}
      </p>

      <div className="relative mt-5 grid gap-3">
        <MiniInfo icon={UsersRound} label="Age" value={program.age} />
        <MiniInfo icon={Target} label="Level" value={program.level} />
        <MiniInfo icon={CreditCard} label="Price" value={priceLabel} />
        <MiniInfo
          icon={CalendarCheck}
          label="Capacity"
          value={
            program.capacity !== null
              ? `${program.capacity} students`
              : 'Flexible capacity'
          }
        />
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          to={ROUTE_PATHS.public.programDetails(program.slug)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
        >
          View Details
        </Link>

        <Link
          to={ROUTE_PATHS.public.bookTrial}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
        >
          Book Trial
        </Link>
      </div>
    </article>
  );
}

function MiniInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="text-sm font-black">{value}</p>
    </div>
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

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
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
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}