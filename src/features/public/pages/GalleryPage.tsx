import type { LucideIcon } from 'lucide-react';
import {
  ArrowRight,
  Camera,
  Film,
  Image as ImageIcon,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Video
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ROUTE_PATHS } from '@/app/router/route-paths';
import {
  loadPublicGalleryContent,
  publicGalleryFallbackContent,
} from '@/features/public/services/public-data.service';
import type {
  PublicGalleryContentDto,
  PublicGalleryMediaItemDto,
  PublicGalleryMediaType,
} from '@/features/public/types/public-content.dto';

export default function GalleryPage() {
  const [content, setContent] = useState<PublicGalleryContentDto>(
    publicGalleryFallbackContent,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | PublicGalleryMediaType>(
    'all',
  );
  const [tagFilter, setTagFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadPublicGalleryContent()
      .then((data) => {
        if (isMounted) {
          setContent(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setContent(publicGalleryFallbackContent);
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

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return content.items.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.title.toLowerCase().includes(normalizedSearch) ||
        item.description.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch) ||
        item.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));

      const matchesCategory =
        categoryFilter === 'all' || item.category === categoryFilter;

      const matchesMediaType =
        mediaTypeFilter === 'all' || item.mediaType === mediaTypeFilter;

      const matchesTag =
        tagFilter === 'all' || item.tags.includes(tagFilter);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMediaType &&
        matchesTag
      );
    });
  }, [
    categoryFilter,
    content.items,
    mediaTypeFilter,
    searchTerm,
    tagFilter,
  ]);

  const featuredItems = content.items.filter((item) => item.featured).slice(0, 3);

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
                      Media Library
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      {content.items.length} Media Items
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                    <Camera className="h-7 w-7" />
                  </div>
                </div>

                <div className="grid gap-3">
                  {(featuredItems.length > 0
                    ? featuredItems
                    : content.items.slice(0, 3)
                  ).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-border bg-secondary/45 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h3 className="truncate text-sm font-black">
                          {item.title}
                        </h3>

                        <span className="shrink-0 rounded-full bg-brand-yellow px-2.5 py-1 text-xs font-black text-brand-blue">
                          {item.mediaType === 'video' ? 'Video' : 'Photo'}
                        </span>
                      </div>

                      <p className="truncate text-xs font-bold text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-bold text-white/70 backdrop-blur">
                Loading live gallery data...
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
                  placeholder="Search photos, videos, programs, coaches, branches..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </div>
            </label>

            <FilterSelect
              label="Category"
              value={categoryFilter}
              options={[
                { label: 'All categories', value: 'all' },
                ...content.filters.categories.map((item) => ({
                  label: item,
                  value: item,
                })),
              ]}
              onChange={setCategoryFilter}
            />

            <FilterSelect
              label="Media Type"
              value={mediaTypeFilter}
              options={[
                { label: 'All media', value: 'all' },
                { label: 'Images', value: 'image' },
                { label: 'Videos', value: 'video' },
              ]}
              onChange={(value) =>
                setMediaTypeFilter(value as 'all' | PublicGalleryMediaType)
              }
            />

            <FilterSelect
              label="Tag"
              value={tagFilter}
              options={[
                { label: 'All tags', value: 'all' },
                ...content.filters.tags.map((item) => ({
                  label: item,
                  value: item,
                })),
              ]}
              onChange={setTagFilter}
            />
          </div>
        </div>
      </section>

      <section className="bg-background px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-brand-blue dark:text-brand-yellow">
                Gallery
              </p>

              <h2 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
                Academy photos and videos
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                Each card includes a real visual slot. When media URLs are added
                later from CMS/database records, images and videos will appear
                directly here.
              </p>
            </div>

            <span className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
              {filteredItems.length} item(s)
            </span>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
                <Search className="h-8 w-8" />
              </div>

              <h3 className="text-xl font-black">No gallery items found</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Try changing the search term, category, media type, or tag.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-secondary/40 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <FeatureCard
            icon={ImageIcon}
            title="Image-ready cards"
            description="Each gallery item has an image slot prepared for future CMS or database media URLs."
          />

          <FeatureCard
            icon={Video}
            title="Video-ready sections"
            description="Video cards can show embedded training clips, coach intros, or branch highlights."
          />

          <FeatureCard
            icon={ShieldCheck}
            title="Database-ready structure"
            description="The page currently derives items from programs, coaches, and branches, and can later move to a dedicated gallery table."
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

function MediaCard({ item }: { item: PublicGalleryMediaItemDto }) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark">
        {item.mediaType === 'image' && item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}

        {item.mediaType === 'video' && item.videoUrl ? (
          <video
            src={item.videoUrl}
            poster={item.thumbnailUrl}
            controls
            className="h-full w-full object-cover"
          />
        ) : null}

        {(!item.imageUrl && item.mediaType === 'image') ||
          (!item.videoUrl && item.mediaType === 'video') ? (
          <div className="flex h-full w-full items-center justify-center p-6 text-center text-white">
            <div>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/12 text-brand-yellow backdrop-blur">
                {item.mediaType === 'video' ? (
                  <Film className="h-8 w-8" />
                ) : (
                  <ImageIcon className="h-8 w-8" />
                )}
              </div>

              <p className="text-sm font-black uppercase tracking-[0.14em] text-white/70">
                {item.mediaType === 'video'
                  ? 'Video Placeholder'
                  : 'Image Placeholder'}
              </p>

              <p className="mt-2 text-xs font-bold leading-5 text-white/58">
                Add media URL later from CMS or database.
              </p>
            </div>
          </div>
        ) : null}

        <div className="absolute start-4 top-4 rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
          {item.mediaType === 'video' ? 'Video' : 'Photo'}
        </div>

        {item.mediaType === 'video' ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur">
              <Play className="h-7 w-7 fill-current" />
            </div>
          </div>
        ) : null}
      </div>

      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
            {item.category}
          </span>

          {item.featured ? (
            <span className="rounded-full bg-brand-yellow px-3 py-1 text-xs font-black text-brand-blue">
              Featured
            </span>
          ) : null}
        </div>

        <h3 className="text-xl font-black text-brand-blue dark:text-white">
          {item.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {item.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
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