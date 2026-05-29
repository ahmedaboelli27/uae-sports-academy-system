import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTE_PATHS } from '@/app/router/route-paths';
import {
  loadPublicLocationsContent,
  publicLocationsFallbackContent,
} from '@/features/public/services/public-data.service';
import type {
  PublicLocationDto,
  PublicLocationsContentDto,
} from '@/features/public/types/public-content.dto';

export default function LocationsPage() {
  const [content, setContent] = useState<PublicLocationsContentDto>(
    publicLocationsFallbackContent,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [emirateFilter, setEmirateFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadPublicLocationsContent()
      .then((data) => {
        if (isMounted) {
          setContent(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setContent(publicLocationsFallbackContent);
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

  const filteredLocations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return content.locations.filter((location) => {
      const matchesSearch =
        !normalizedSearch ||
        location.name.toLowerCase().includes(normalizedSearch) ||
        location.city.toLowerCase().includes(normalizedSearch) ||
        location.emirate.toLowerCase().includes(normalizedSearch) ||
        location.address.toLowerCase().includes(normalizedSearch) ||
        location.programs.some((item) =>
          item.toLowerCase().includes(normalizedSearch),
        ) ||
        location.coaches.some((item) =>
          item.toLowerCase().includes(normalizedSearch),
        );

      const matchesCity =
        cityFilter === 'all' || location.city === cityFilter;

      const matchesEmirate =
        emirateFilter === 'all' || location.emirate === emirateFilter;

      const matchesProgram =
        programFilter === 'all' || location.programs.includes(programFilter);

      return (
        matchesSearch &&
        matchesCity &&
        matchesEmirate &&
        matchesProgram
      );
    });
  }, [
    cityFilter,
    content.locations,
    emirateFilter,
    programFilter,
    searchTerm,
  ]);

  return (
    <main className="overflow-hidden">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_34%)]" />

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
                to={ROUTE_PATHS.public.bookTrial}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                {content.hero.primaryAction}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to={ROUTE_PATHS.public.programs}
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
                      Branch Network
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      {content.locations.length} Active Locations
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                    <Building2 className="h-7 w-7" />
                  </div>
                </div>

                <div className="grid gap-3">
                  {content.locations.slice(0, 3).map((location) => (
                    <div
                      key={location.id}
                      className="rounded-2xl border border-border bg-secondary/45 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-brand-blue dark:text-brand-yellow" />
                        <h3 className="truncate text-sm font-black">
                          {location.name}
                        </h3>
                      </div>

                      <p className="truncate text-xs font-bold text-muted-foreground">
                        {location.city}, {location.emirate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white/70 backdrop-blur">
                Loading live branch data...
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <label className="block">
              <span className="mb-2 block text-sm font-black">Search</span>

              <div className="relative">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search branch, city, emirate, program, or coach..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </div>
            </label>

            <FilterSelect
              label="City"
              value={cityFilter}
              options={[
                { label: 'All cities', value: 'all' },
                ...content.filters.cities.map((item) => ({
                  label: item,
                  value: item,
                })),
              ]}
              onChange={setCityFilter}
            />

            <FilterSelect
              label="Emirate"
              value={emirateFilter}
              options={[
                { label: 'All emirates', value: 'all' },
                ...content.filters.emirates.map((item) => ({
                  label: item,
                  value: item,
                })),
              ]}
              onChange={setEmirateFilter}
            />

            <FilterSelect
              label="Program"
              value={programFilter}
              options={[
                { label: 'All programs', value: 'all' },
                ...content.filters.programs.map((item) => ({
                  label: item,
                  value: item,
                })),
              ]}
              onChange={setProgramFilter}
            />
          </div>
        </div>
      </section>

      <section className="bg-background px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-brand-blue dark:text-brand-yellow">
                Branch Directory
              </p>

              <h2 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
                Choose the most convenient training branch
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Branch cards are loaded through the public data service and are
                ready to switch to live database records.
              </p>
            </div>

            <span className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
              {filteredLocations.length} location(s)
            </span>
          </div>

          {filteredLocations.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {filteredLocations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
                <Search className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-black">No locations found</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Try changing the search term, city, emirate, or program.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <FeatureCard
            icon={MapPin}
            title="UAE branch network"
            description="Branches can be managed from database records and displayed here automatically."
          />

          <FeatureCard
            icon={ShieldCheck}
            title="Family-friendly locations"
            description="Each location can show address, contact, programs, coaches, and schedule availability."
          />

          <FeatureCard
            icon={CalendarCheck}
            title="Connected schedules"
            description="Upcoming sessions can be connected directly from the schedule module."
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

function LocationCard({ location }: { location: PublicLocationDto }) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg">
      <div className="absolute -end-12 -top-12 h-28 w-28 rounded-full bg-brand-yellow/10 blur-3xl" />

      <div className="relative mb-5 flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white transition group-hover:scale-105 dark:bg-brand-yellow dark:text-brand-blue">
          <Building2 className="h-7 w-7" />
        </div>

        <span className="rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
          {location.emirate}
        </span>
      </div>

      <h3 className="relative text-xl font-black text-brand-blue dark:text-white">
        {location.name}
      </h3>

      <p className="relative mt-2 flex items-start gap-2 text-sm font-semibold leading-7 text-muted-foreground">
        <MapPin className="mt-1 h-4 w-4 shrink-0 text-brand-blue dark:text-brand-yellow" />
        <span>
          {location.address} · {location.city}
        </span>
      </p>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
        <MiniInfo
          icon={UsersRound}
          label="Students"
          value={`${location.studentsCount}`}
        />
        <MiniInfo
          icon={Trophy}
          label="Programs"
          value={`${location.programsCount}`}
        />
        <MiniInfo
          icon={ShieldCheck}
          label="Coaches"
          value={`${location.coachesCount}`}
        />
        <MiniInfo
          icon={CalendarCheck}
          label="Sessions"
          value={`${location.sessionsCount}`}
        />
      </div>

      <div className="relative mt-5 grid gap-3">
        <InfoLine
          icon={CalendarCheck}
          label={location.nextSession ?? 'Schedule available on request'}
        />

        {location.phone ? <InfoLine icon={Phone} label={location.phone} /> : null}
        {location.email ? <InfoLine icon={Mail} label={location.email} /> : null}
      </div>

      <TagGroup title="Programs" items={location.programs} fallback="Programs available on request" />
      <TagGroup title="Coaches" items={location.coaches} fallback="Coach assignment available on request" />

      <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          to={ROUTE_PATHS.public.bookTrial}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
        >
          Book Trial
        </Link>

        <Link
          to={ROUTE_PATHS.public.contact}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
        >
          Contact Branch
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

function InfoLine({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-background p-3 text-sm font-bold text-muted-foreground dark:bg-white/[0.04]">
      <Icon className="h-4 w-4 text-brand-blue dark:text-brand-yellow" />
      <span>{label}</span>
    </div>
  );
}

function TagGroup({
  title,
  items,
  fallback,
}: {
  title: string;
  items: string[];
  fallback: string;
}) {
  return (
    <div className="relative mt-5">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {(items.length > 0 ? items : [fallback]).map((item) => (
          <span
            key={item}
            className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground"
          >
            {item}
          </span>
        ))}
      </div>
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