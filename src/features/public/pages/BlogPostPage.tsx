import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Tags,
  Trophy,
  UserRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ROUTE_PATHS } from '@/app/router/route-paths';
import {
  loadPublicBlogPostContent,
  publicBlogPostFallbackContent,
} from '@/features/public/services/public-data.service';
import type {
  PublicBlogPostCardDto,
  PublicBlogPostContentDto,
  PublicBlogPostSourceType,
} from '@/features/public/types/public-content.dto';

const sourceTypeIcons: Record<PublicBlogPostSourceType, LucideIcon> = {
  program: Trophy,
  coach: GraduationCap,
  branch: ShieldCheck,
  academy: Newspaper,
};

export default function BlogPostPage() {
  const { postId } = useParams<{ postId: string }>();

  const [content, setContent] = useState<PublicBlogPostContentDto>(
    publicBlogPostFallbackContent,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadPublicBlogPostContent(postId ?? '')
      .then((data) => {
        if (isMounted) {
          setContent(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setContent(publicBlogPostFallbackContent);
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
  }, [postId]);

  const SourceIcon = sourceTypeIcons[content.post.sourceType];

  return (
    <main className="overflow-hidden">
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_34%)]" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Link
              to={ROUTE_PATHS.public.blog}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-white/85 backdrop-blur transition hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
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

            <div className="mt-6 flex flex-wrap gap-3 text-sm font-black text-white/80">
              <MetaPill icon={UserRound} label={content.post.authorName} />
              <MetaPill icon={CalendarDays} label={content.post.publishedAt} />
              <MetaPill icon={BookOpenText} label={content.post.readTime} />
            </div>

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
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                {content.hero.secondaryAction}
              </Link>
            </div>

            {isLoading ? (
              <p className="mt-5 text-sm font-bold text-white/65">
                Loading live article content...
              </p>
            ) : null}
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] bg-brand-yellow/20 blur-3xl" />

            <div className="relative rounded-[2.5rem] border border-white/15 bg-white/10 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              <div className="rounded-[2rem] bg-white p-5 text-brand-blue shadow-2xl dark:bg-card dark:text-white">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
                      Article Snapshot
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      {content.post.category}
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
                    <SourceIcon className="h-7 w-7" />
                  </div>
                </div>

                <div className="grid gap-3">
                  <SnapshotItem
                    icon={UserRound}
                    label="Author"
                    value={content.post.authorName}
                  />
                  <SnapshotItem
                    icon={CalendarDays}
                    label="Published"
                    value={content.post.publishedAt}
                  />
                  <SnapshotItem
                    icon={BookOpenText}
                    label="Read Time"
                    value={content.post.readTime}
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {content.post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground"
                    >
                      <Tags className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <article className="bg-background px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.72fr_0.28fr] lg:items-start">
          <div className="rounded-[2.5rem] border border-border bg-card p-6 shadow-sm sm:p-8">
            <p className="text-lg font-semibold leading-9 text-muted-foreground">
              {content.article.intro}
            </p>

            <div className="mt-10 space-y-10">
              {content.article.sections.map((section) => (
                <section key={section.id}>
                  <h2 className="text-2xl font-black text-brand-blue dark:text-white">
                    {section.title}
                  </h2>

                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base font-semibold leading-8 text-muted-foreground"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-[2rem] border border-border bg-secondary/50 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <h2 className="text-2xl font-black text-brand-blue dark:text-white">
                Final thought
              </h2>

              <p className="mt-4 text-base font-semibold leading-8 text-muted-foreground">
                {content.article.conclusion}
              </p>
            </div>
          </div>

          <aside className="rounded-[2.5rem] border border-border bg-card p-5 shadow-sm lg:sticky lg:top-28">
            <h3 className="text-xl font-black text-brand-blue dark:text-white">
              Article info
            </h3>

            <div className="mt-5 grid gap-3">
              <SnapshotItem
                icon={Newspaper}
                label="Category"
                value={content.post.category}
              />
              <SnapshotItem
                icon={UserRound}
                label="Author"
                value={content.post.authorName}
              />
              <SnapshotItem
                icon={BookOpenText}
                label="Read"
                value={content.post.readTime}
              />
            </div>

            <Link
              to={ROUTE_PATHS.public.bookTrial}
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
            >
              Book Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </article>

      {content.relatedPosts.length > 0 ? (
        <section className="bg-secondary/40 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-brand-blue dark:text-brand-yellow">
                Related Articles
              </p>

              <h2 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
                Continue reading
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {content.relatedPosts.map((post) => (
                <RelatedPostCard key={post.id} post={post} />
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

function MetaPill({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
      <Icon className="h-4 w-4" />
      {label}
    </span>
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

function RelatedPostCard({ post }: { post: PublicBlogPostCardDto }) {
  const Icon = sourceTypeIcons[post.sourceType];

  return (
    <article className="rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-xl font-black text-brand-blue dark:text-white">
        {post.title}
      </h3>

      <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 text-muted-foreground">
        {post.excerpt}
      </p>

      <Link
        to={ROUTE_PATHS.public.blogPost(post.slug)}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
      >
        Read Article
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}