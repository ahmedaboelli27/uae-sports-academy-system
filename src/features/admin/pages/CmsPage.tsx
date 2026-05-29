import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Eye,
  Facebook,
  FileText,
  GalleryHorizontalEnd,
  Globe2,
  Home,
  Image,
  Instagram,
  LayoutTemplate,
  Link2,
  Megaphone,
  Monitor,
  RefreshCcw,
  Save,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Tags,
  Upload,
  Wand2
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

type CmsTab = 'overview' | 'homepage' | 'seo' | 'navigation' | 'publishing';

type ContentStatus = 'published' | 'draft' | 'needsReview';

interface CmsSettings {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroImageUrl: string;

  programsTitle: string;
  programsDescription: string;
  galleryTitle: string;
  galleryDescription: string;
  contactTitle: string;
  contactDescription: string;

  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  keywords: string;

  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappUrl: string;

  showOffers: boolean;
  showGallery: boolean;
  showPrograms: boolean;
  showCoaches: boolean;
  showLocations: boolean;
  enablePublicSite: boolean;
  maintenanceMode: boolean;
  requireReviewBeforePublish: boolean;
}

interface ContentBlock {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  lastUpdated: string;
  icon: LucideIcon;
  route?: string;
}

interface TabItem {
  key: CmsTab;
  title: string;
  description: string;
  icon: LucideIcon;
}

const initialCmsSettings: CmsSettings = {
  heroBadge: 'Complete sports academy in the UAE',
  heroTitle:
    'Build confident young athletes with elite coaching and smart academy operations',
  heroDescription:
    'A premium sports academy experience combining professional coaching, attendance tracking, subscriptions, payments, performance reports, and smooth parent communication.',
  heroPrimaryCta: 'Book a free trial',
  heroSecondaryCta: 'Explore programs',
  heroImageUrl:
    'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1600&q=90',

  programsTitle: 'Sports programs designed for every player and age group',
  programsDescription:
    'Choose the right program for your child across football, swimming, basketball, fitness, and movement-based training.',
  galleryTitle: 'Training atmosphere',
  galleryDescription:
    'Temporary images can be replaced later with real academy training photos.',
  contactTitle: 'Ready to start your child’s sports journey?',
  contactDescription:
    'Contact us now to learn about available programs, nearest branch, training schedules, or to book a free trial.',

  metaTitle: 'AspireX Sports Academy',
  metaDescription:
    'AspireX Sports Academy Management System — programs, coaching, and academy operations.',
  ogImageUrl: '/logo.png',
  keywords: 'sports academy, UAE academy, football training, swimming, kids sports',

  facebookUrl: 'https://www.facebook.com/your-academy',
  instagramUrl: 'https://www.instagram.com/your-academy',
  tiktokUrl: 'https://www.tiktok.com/@your-academy',
  whatsappUrl: 'https://wa.me/971500000000',

  showOffers: true,
  showGallery: true,
  showPrograms: true,
  showCoaches: true,
  showLocations: true,
  enablePublicSite: true,
  maintenanceMode: false,
  requireReviewBeforePublish: true,
};

const cmsTabs: TabItem[] = [
  {
    key: 'overview',
    title: 'Overview',
    description: 'Website content status and quick controls.',
    icon: LayoutTemplate,
  },
  {
    key: 'homepage',
    title: 'Homepage',
    description: 'Hero, sections, CTAs, and public content blocks.',
    icon: Home,
  },
  {
    key: 'seo',
    title: 'SEO & Social',
    description: 'Meta title, descriptions, preview image, and social links.',
    icon: Globe2,
  },
  {
    key: 'navigation',
    title: 'Navigation',
    description: 'Public website menu visibility and key sections.',
    icon: Link2,
  },
  {
    key: 'publishing',
    title: 'Publishing',
    description: 'Publishing rules, review mode, and maintenance controls.',
    icon: Upload,
  },
];

const contentBlocks: ContentBlock[] = [
  {
    id: 'home',
    title: 'Homepage',
    description: 'Hero, KPI cards, programs, gallery, journey, and contact blocks.',
    status: 'published',
    lastUpdated: 'Today 08:35 PM',
    icon: Home,
    route: '/admin/cms/home',
  },
  {
    id: 'gallery',
    title: 'Gallery',
    description: 'Training images, captions, public media blocks, and placeholders.',
    status: 'draft',
    lastUpdated: 'Today 07:10 PM',
    icon: GalleryHorizontalEnd,
    route: '/admin/cms/gallery',
  },
  {
    id: 'programs',
    title: 'Programs Content',
    description: 'Public descriptions, feature highlights, and enrollment messages.',
    status: 'published',
    lastUpdated: 'Yesterday 04:25 PM',
    icon: Sparkles,
  },
  {
    id: 'offers',
    title: 'Offers Section',
    description: 'Seasonal offers, homepage banners, coupons, and campaign highlights.',
    status: 'needsReview',
    lastUpdated: 'Yesterday 02:00 PM',
    icon: Megaphone,
  },
  {
    id: 'seo',
    title: 'SEO Metadata',
    description: 'Search engine title, description, keywords, and social sharing image.',
    status: 'published',
    lastUpdated: 'May 25, 2026',
    icon: Tags,
  },
];

export default function CmsPage() {
  const [activeTab, setActiveTab] = useState<CmsTab>('overview');
  const [settings, setSettings] = useState<CmsSettings>(initialCmsSettings);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const filteredBlocks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return contentBlocks;
    }

    return contentBlocks.filter(
      (block) =>
        block.title.toLowerCase().includes(normalizedSearch) ||
        block.description.toLowerCase().includes(normalizedSearch) ||
        block.status.toLowerCase().includes(normalizedSearch),
    );
  }, [searchTerm]);

  const publishedCount = contentBlocks.filter(
    (block) => block.status === 'published',
  ).length;
  const draftCount = contentBlocks.filter((block) => block.status === 'draft').length;
  const reviewCount = contentBlocks.filter(
    (block) => block.status === 'needsReview',
  ).length;

  const updateSetting = <K extends keyof CmsSettings>(
    key: K,
    value: CmsSettings[K],
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const handleSave = () => {
    setSavedMessage(
      'CMS changes saved locally in frontend mock mode. Backend persistence will be connected later.',
    );
  };

  const handleReset = () => {
    setSettings(initialCmsSettings);
    setSearchTerm('');
    setSavedMessage('CMS settings restored to the default frontend configuration.');
  };

  const handlePublish = () => {
    setSavedMessage(
      settings.maintenanceMode
        ? 'Publishing is blocked while maintenance mode is enabled.'
        : 'Publishing simulated locally. Real publish workflow will be connected to the backend later.',
    );
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <LayoutTemplate className="h-4 w-4" />
              Website Content Studio
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Website CMS
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Manage public website content, homepage sections, SEO metadata,
              social links, publishing controls, and website visibility from one
              admin-friendly content center.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroMetric
              icon={CheckCircle2}
              label="Published Blocks"
              value={`${publishedCount}`}
            />
            <HeroMetric icon={FileText} label="Draft Blocks" value={`${draftCount}`} />
            <HeroMetric
              icon={AlertTriangle}
              label="Needs Review"
              value={`${reviewCount}`}
            />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
          <Wand2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-5">
        {cmsTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                'rounded-[2rem] border p-5 text-start transition',
                isActive
                  ? 'border-brand-yellow bg-brand-yellow text-brand-blue shadow-[0_18px_45px_rgba(255,212,0,0.20)]'
                  : 'border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground',
              ].join(' ')}
            >
              <div
                className={[
                  'mb-4 flex h-12 w-12 items-center justify-center rounded-2xl',
                  isActive
                    ? 'bg-brand-blue/10 text-brand-blue'
                    : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
                ].join(' ')}
              >
                <Icon className="h-6 w-6" />
              </div>

              <h2 className="text-sm font-black">{tab.title}</h2>
              <p
                className={[
                  'mt-2 text-xs font-semibold leading-6',
                  isActive ? 'text-brand-blue/75' : 'text-muted-foreground',
                ].join(' ')}
              >
                {tab.description}
              </p>
            </button>
          );
        })}
      </section>

      {activeTab === 'overview' ? (
        <section className="grid gap-6 xl:grid-cols-[1fr_24rem]">
          <main className="space-y-6">
            <Panel
              icon={LayoutTemplate}
              title="Content Overview"
              description="Review website content blocks, publishing status, and edit entry points."
              actions={
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={handlePublish}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
                  >
                    <Upload className="h-4 w-4" />
                    Publish Site
                  </button>
                </div>
              }
            >
              <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search content blocks..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>

                <RouterLink
                  to="/"
                  target="_blank"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-brand-blue/20 bg-card px-5 text-sm font-black text-brand-blue transition hover:bg-brand-blue/10 dark:border-brand-yellow/20 dark:text-brand-yellow dark:hover:bg-brand-yellow/10"
                >
                  <Eye className="h-4 w-4" />
                  Preview Website
                </RouterLink>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {filteredBlocks.map((block) => (
                  <ContentBlockCard key={block.id} block={block} />
                ))}
              </div>
            </Panel>
          </main>

          <aside className="space-y-6">
            <WebsitePreview settings={settings} />

            <StatusCard
              icon={ShieldCheck}
              title="Admin Controlled"
              description="CMS access should remain limited to trusted admin users."
              tone="success"
            />

            <StatusCard
              icon={Monitor}
              title="Frontend Mock"
              description="The CMS UI is ready now; database persistence comes later."
              tone="warning"
            />
          </aside>
        </section>
      ) : null}

      {activeTab === 'homepage' ? (
        <section className="grid gap-6 xl:grid-cols-[1fr_24rem]">
          <Panel
            icon={Home}
            title="Homepage Content"
            description="Edit the main public homepage copy, call-to-actions, and section descriptions."
            actions={
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Save className="h-4 w-4" />
                Save Homepage
              </button>
            }
          >
            <div className="space-y-6">
              <SectionTitle
                icon={Sparkles}
                title="Hero Section"
                description="The first section visitors see on the public website."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <InputField
                  icon={Sparkles}
                  label="Hero badge"
                  value={settings.heroBadge}
                  onChange={(value) => updateSetting('heroBadge', value)}
                />
                <InputField
                  icon={Image}
                  label="Hero image URL"
                  value={settings.heroImageUrl}
                  onChange={(value) => updateSetting('heroImageUrl', value)}
                />
              </div>

              <InputField
                icon={Home}
                label="Hero title"
                value={settings.heroTitle}
                onChange={(value) => updateSetting('heroTitle', value)}
              />

              <TextareaField
                label="Hero description"
                value={settings.heroDescription}
                onChange={(value) => updateSetting('heroDescription', value)}
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <InputField
                  icon={Link2}
                  label="Primary CTA"
                  value={settings.heroPrimaryCta}
                  onChange={(value) => updateSetting('heroPrimaryCta', value)}
                />
                <InputField
                  icon={Link2}
                  label="Secondary CTA"
                  value={settings.heroSecondaryCta}
                  onChange={(value) => updateSetting('heroSecondaryCta', value)}
                />
              </div>

              <SectionTitle
                icon={LayoutTemplate}
                title="Homepage Sections"
                description="Main visible section copy used across the landing page."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <InputField
                  icon={Sparkles}
                  label="Programs section title"
                  value={settings.programsTitle}
                  onChange={(value) => updateSetting('programsTitle', value)}
                />
                <InputField
                  icon={GalleryHorizontalEnd}
                  label="Gallery section title"
                  value={settings.galleryTitle}
                  onChange={(value) => updateSetting('galleryTitle', value)}
                />
              </div>

              <TextareaField
                label="Programs description"
                value={settings.programsDescription}
                onChange={(value) =>
                  updateSetting('programsDescription', value)
                }
              />

              <TextareaField
                label="Gallery description"
                value={settings.galleryDescription}
                onChange={(value) =>
                  updateSetting('galleryDescription', value)
                }
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <InputField
                  icon={Megaphone}
                  label="Contact section title"
                  value={settings.contactTitle}
                  onChange={(value) => updateSetting('contactTitle', value)}
                />
                <TextareaField
                  label="Contact description"
                  value={settings.contactDescription}
                  onChange={(value) =>
                    updateSetting('contactDescription', value)
                  }
                />
              </div>
            </div>
          </Panel>

          <aside>
            <WebsitePreview settings={settings} />
          </aside>
        </section>
      ) : null}

      {activeTab === 'seo' ? (
        <Panel
          icon={Globe2}
          title="SEO & Social Sharing"
          description="Control search engine metadata and public social links."
          actions={
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <Save className="h-4 w-4" />
              Save SEO
            </button>
          }
        >
          <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
            <div className="space-y-6">
              <div className="grid gap-5 lg:grid-cols-2">
                <InputField
                  icon={Tags}
                  label="Meta title"
                  value={settings.metaTitle}
                  onChange={(value) => updateSetting('metaTitle', value)}
                />

                <InputField
                  icon={Image}
                  label="Open Graph image URL"
                  value={settings.ogImageUrl}
                  onChange={(value) => updateSetting('ogImageUrl', value)}
                />
              </div>

              <TextareaField
                label="Meta description"
                value={settings.metaDescription}
                onChange={(value) => updateSetting('metaDescription', value)}
              />

              <TextareaField
                label="SEO keywords"
                value={settings.keywords}
                onChange={(value) => updateSetting('keywords', value)}
              />

              <SectionTitle
                icon={Share2}
                title="Social Links"
                description="These links will be used in the public footer and contact areas."
              />

              <div className="grid gap-5 lg:grid-cols-2">
                <InputField
                  icon={Facebook}
                  label="Facebook URL"
                  value={settings.facebookUrl}
                  onChange={(value) => updateSetting('facebookUrl', value)}
                />

                <InputField
                  icon={Instagram}
                  label="Instagram URL"
                  value={settings.instagramUrl}
                  onChange={(value) => updateSetting('instagramUrl', value)}
                />

                <InputField
                  icon={Megaphone}
                  label="TikTok URL"
                  value={settings.tiktokUrl}
                  onChange={(value) => updateSetting('tiktokUrl', value)}
                />

                <InputField
                  icon={Link2}
                  label="WhatsApp URL"
                  value={settings.whatsappUrl}
                  onChange={(value) => updateSetting('whatsappUrl', value)}
                />
              </div>
            </div>

            <SeoPreview settings={settings} />
          </div>
        </Panel>
      ) : null}

      {activeTab === 'navigation' ? (
        <Panel
          icon={Link2}
          title="Website Navigation"
          description="Choose which public sections are visible to visitors."
          actions={
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <Save className="h-4 w-4" />
              Save Navigation
            </button>
          }
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <ToggleRow
              icon={Sparkles}
              title="Show Programs"
              description="Display programs in the public website navigation and homepage."
              checked={settings.showPrograms}
              onChange={(value) => updateSetting('showPrograms', value)}
            />
            <ToggleRow
              icon={ShieldCheck}
              title="Show Coaches"
              description="Display coach profile pages and coaching team sections."
              checked={settings.showCoaches}
              onChange={(value) => updateSetting('showCoaches', value)}
            />
            <ToggleRow
              icon={Globe2}
              title="Show Locations"
              description="Display branches and location pages publicly."
              checked={settings.showLocations}
              onChange={(value) => updateSetting('showLocations', value)}
            />
            <ToggleRow
              icon={GalleryHorizontalEnd}
              title="Show Gallery"
              description="Display gallery media and training atmosphere sections."
              checked={settings.showGallery}
              onChange={(value) => updateSetting('showGallery', value)}
            />
            <ToggleRow
              icon={Megaphone}
              title="Show Offers"
              description="Display promotional offers and seasonal campaign blocks."
              checked={settings.showOffers}
              onChange={(value) => updateSetting('showOffers', value)}
            />
          </div>
        </Panel>
      ) : null}

      {activeTab === 'publishing' ? (
        <Panel
          icon={Upload}
          title="Publishing Controls"
          description="Control public website visibility, review mode, and maintenance state."
          actions={
            <button
              type="button"
              onClick={handlePublish}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <Upload className="h-4 w-4" />
              Publish Changes
            </button>
          }
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <ToggleRow
              icon={Globe2}
              title="Enable Public Website"
              description="Allow visitors to access public pages."
              checked={settings.enablePublicSite}
              onChange={(value) => updateSetting('enablePublicSite', value)}
            />
            <ToggleRow
              icon={AlertTriangle}
              title="Maintenance Mode"
              description="Temporarily hide the public website during major updates."
              checked={settings.maintenanceMode}
              onChange={(value) => updateSetting('maintenanceMode', value)}
              danger
            />
            <ToggleRow
              icon={ShieldCheck}
              title="Require Review Before Publish"
              description="Keep CMS changes in draft until reviewed by an admin."
              checked={settings.requireReviewBeforePublish}
              onChange={(value) =>
                updateSetting('requireReviewBeforePublish', value)
              }
            />
          </div>
        </Panel>
      ) : null}
    </div>
  );
}

function ContentBlockCard({ block }: { block: ContentBlock }) {
  const Icon = block.icon;

  return (
    <article className="rounded-[2rem] border border-border bg-background/70 p-5 shadow-sm transition hover:-translate-y-1 hover:bg-secondary/70 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <Icon className="h-6 w-6" />
        </div>

        <StatusBadge status={block.status} />
      </div>

      <h3 className="text-base font-black">{block.title}</h3>
      <p className="mt-2 text-sm font-semibold leading-7 text-muted-foreground">
        {block.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold text-muted-foreground">
          Updated: {block.lastUpdated}
        </p>

        {block.route ? (
          <RouterLink
            to={block.route}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-xs font-black text-brand-blue transition hover:bg-white"
          >
            <Settings className="h-4 w-4" />
            Open
          </RouterLink>
        ) : (
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-xs font-black text-muted-foreground"
          >
            <Clock3 className="h-4 w-4" />
            Backend Later
          </button>
        )}
      </div>
    </article>
  );
}

function WebsitePreview({ settings }: { settings: CmsSettings }) {
  return (
    <aside className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Monitor className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-lg font-black">Live Preview</h2>
          <p className="text-xs font-bold text-muted-foreground">
            Homepage hero simulation
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-border bg-brand-dark text-white">
        <div
          className="min-h-64 bg-cover bg-center p-5"
          style={{ backgroundImage: `url(${settings.heroImageUrl})` }}
        >
          <div className="rounded-[1.5rem] bg-brand-dark/72 p-5 backdrop-blur-xl">
            <span className="rounded-full bg-brand-yellow px-3 py-1 text-[11px] font-black text-brand-blue">
              {settings.heroBadge || 'Hero badge'}
            </span>

            <h3 className="mt-4 text-2xl font-black leading-tight">
              {settings.heroTitle || 'Hero title preview'}
            </h3>

            <p className="mt-3 text-sm font-semibold leading-7 text-white/70">
              {settings.heroDescription || 'Hero description preview.'}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-yellow px-4 py-2 text-xs font-black text-brand-blue">
                {settings.heroPrimaryCta || 'Primary CTA'}
              </span>
              <span className="rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white">
                {settings.heroSecondaryCta || 'Secondary CTA'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function SeoPreview({ settings }: { settings: CmsSettings }) {
  return (
    <aside className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Globe2 className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-lg font-black">Search Preview</h2>
          <p className="text-xs font-bold text-muted-foreground">
            How your site may appear
          </p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border bg-background p-5 dark:bg-white/[0.04]">
        <p className="text-xs font-bold text-green-700 dark:text-green-300">
          aspirex-academy.com
        </p>
        <h3 className="mt-2 text-lg font-black text-brand-blue dark:text-brand-yellow">
          {settings.metaTitle || 'Meta title preview'}
        </h3>
        <p className="mt-2 text-sm font-semibold leading-7 text-muted-foreground">
          {settings.metaDescription || 'Meta description preview.'}
        </p>
        <div className="mt-4 rounded-2xl bg-secondary p-3 text-xs font-bold text-muted-foreground">
          Keywords: {settings.keywords || 'No keywords added'}
        </div>
      </div>
    </aside>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  actions,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-5 border-b border-border bg-gradient-to-r from-brand-blue/[0.06] via-card to-brand-yellow/10 p-5 dark:from-white/[0.04] dark:via-card dark:to-brand-yellow/10 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <Icon className="h-7 w-7" />
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight">{title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {actions}
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function InputField({
  icon: Icon,
  label,
  value,
  onChange,
  type = 'text',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block text-sm font-bold">
      <span className="mb-2 block">{label}</span>

      <div className="relative">
        <Icon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
        />
      </div>
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block text-sm font-bold">
      <span className="mb-2 block">{label}</span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-7 outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      />
    </label>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  danger = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        'flex items-start gap-4 rounded-2xl border p-4 text-start transition',
        checked
          ? danger
            ? 'border-red-500/30 bg-red-500/10'
            : 'border-brand-yellow/40 bg-brand-yellow/10'
          : 'border-border bg-background hover:bg-secondary dark:bg-white/[0.03]',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
          checked
            ? danger
              ? 'bg-red-500 text-white'
              : 'bg-brand-yellow text-brand-blue'
            : 'bg-secondary text-muted-foreground',
        ].join(' ')}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black">{title}</span>
        <span className="mt-1 block text-xs font-semibold leading-5 text-muted-foreground">
          {description}
        </span>
      </span>

      <span
        className={[
          'relative mt-1 h-6 w-11 shrink-0 rounded-full transition',
          checked
            ? danger
              ? 'bg-red-500'
              : 'bg-brand-blue dark:bg-brand-yellow'
            : 'bg-muted-foreground/25',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-1 h-4 w-4 rounded-full bg-white shadow transition',
            checked ? 'start-6' : 'start-1',
          ].join(' ')}
        />
      </span>
    </button>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-background/70 p-4 dark:bg-white/[0.03]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h3 className="text-sm font-black">{title}</h3>
        <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function HeroMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/55">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: 'success' | 'warning' | 'info';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
      : tone === 'warning'
        ? 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-blue dark:text-brand-yellow'
        : 'border-brand-blue/20 bg-brand-blue/10 text-brand-blue dark:text-blue-300';

  return (
    <article className={`rounded-[2rem] border p-5 ${toneClass}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-current dark:bg-white/10">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="text-sm font-black">{title}</h3>
      <p className="mt-2 text-xs font-bold leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

function StatusBadge({ status }: { status: ContentStatus }) {
  const className =
    status === 'published'
      ? 'bg-green-500/10 text-green-700 dark:text-green-300'
      : status === 'needsReview'
        ? 'bg-orange-500/15 text-orange-700 dark:text-orange-300'
        : 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow';

  const label =
    status === 'published'
      ? 'Published'
      : status === 'needsReview'
        ? 'Needs Review'
        : 'Draft';

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-black ${className}`}>
      {label}
    </span>
  );
}