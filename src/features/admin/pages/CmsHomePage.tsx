import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  Eye,
  FileText,
  GalleryHorizontalEnd,
  Home,
  Image,
  Link2,
  MapPin,
  Megaphone,
  Monitor,
  Palette,
  RefreshCcw,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Wand2
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

type HomeTab = 'hero' | 'stats' | 'programs' | 'gallery' | 'contact';

interface KpiItem {
  label: string;
  value: string;
  description: string;
  icon: string;
  visible: boolean;
}

interface ProgramCard {
  title: string;
  category: string;
  description: string;
  ageRange: string;
  imageUrl: string;
  visible: boolean;
}

interface GalleryItem {
  title: string;
  description: string;
  imageUrl: string;
  visible: boolean;
}

interface HomeContentState {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroImageUrl: string;
  heroOverlayOpacity: string;

  sectionEyebrow: string;
  programsTitle: string;
  programsDescription: string;

  journeyTitle: string;
  journeyDescription: string;

  galleryTitle: string;
  galleryDescription: string;

  contactTitle: string;
  contactDescription: string;
  contactPhone: string;
  contactWhatsapp: string;
  contactEmail: string;
  contactLocation: string;

  showStats: boolean;
  showPrograms: boolean;
  showJourney: boolean;
  showGallery: boolean;
  showContact: boolean;

  kpis: KpiItem[];
  programs: ProgramCard[];
  gallery: GalleryItem[];
}

const initialHomeContent: HomeContentState = {
  heroBadge: 'AspireX Sports Academy',
  heroTitle: 'Train smarter. Grow stronger. Play with confidence.',
  heroDescription:
    'A premium sports academy experience for young athletes, combining professional coaching, structured programs, parent communication, attendance tracking, and performance progress.',
  heroPrimaryCta: 'Book a free trial',
  heroSecondaryCta: 'Explore programs',
  heroImageUrl:
    'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1600&q=90',
  heroOverlayOpacity: '72',

  sectionEyebrow: 'Academy Experience',
  programsTitle: 'Sports programs for every player level',
  programsDescription:
    'Choose from structured programs designed for beginners, developing athletes, and competitive young players.',

  journeyTitle: 'A complete development journey',
  journeyDescription:
    'From trial booking to enrollment, attendance, skills tracking, payments, and parent communication — the academy journey is designed to be smooth and professional.',

  galleryTitle: 'Training atmosphere',
  galleryDescription:
    'Showcase real training sessions, events, camps, and academy activities. Replace these temporary image links later with official academy photos.',

  contactTitle: 'Ready to start your child’s sports journey?',
  contactDescription:
    'Speak with our team to choose the right program, branch, schedule, and trial session.',
  contactPhone: '+971 50 000 0000',
  contactWhatsapp: 'https://wa.me/971500000000',
  contactEmail: 'info@academy.ae',
  contactLocation: 'Dubai, United Arab Emirates',

  showStats: true,
  showPrograms: true,
  showJourney: true,
  showGallery: true,
  showContact: true,

  kpis: [
    {
      label: 'Active Players',
      value: '1,200+',
      description: 'Young athletes enrolled across programs.',
      icon: 'users',
      visible: true,
    },
    {
      label: 'Professional Coaches',
      value: '35+',
      description: 'Certified coaches across different sports.',
      icon: 'trophy',
      visible: true,
    },
    {
      label: 'Academy Branches',
      value: '8',
      description: 'Training locations across the UAE.',
      icon: 'map',
      visible: true,
    },
    {
      label: 'Weekly Sessions',
      value: '240+',
      description: 'Structured weekly sessions and programs.',
      icon: 'calendar',
      visible: true,
    },
  ],

  programs: [
    {
      title: 'Football Development',
      category: 'Team Sports',
      description:
        'Technical skills, game intelligence, discipline, teamwork, and confidence building.',
      ageRange: 'Ages 5–16',
      imageUrl:
        'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=90',
      visible: true,
    },
    {
      title: 'Swimming Academy',
      category: 'Aquatics',
      description:
        'Water confidence, technique, safety, endurance, and structured progression.',
      ageRange: 'Ages 4–14',
      imageUrl:
        'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=90',
      visible: true,
    },
    {
      title: 'Basketball Skills',
      category: 'Team Sports',
      description:
        'Ball handling, shooting, agility, passing, movement, and match confidence.',
      ageRange: 'Ages 7–16',
      imageUrl:
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=90',
      visible: true,
    },
    {
      title: 'Fitness & Movement',
      category: 'Performance',
      description:
        'Coordination, strength foundations, balance, speed, and athletic movement.',
      ageRange: 'Ages 6–15',
      imageUrl:
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=90',
      visible: true,
    },
  ],

  gallery: [
    {
      title: 'Focused training',
      description: 'Small-group sessions designed for technical improvement.',
      imageUrl:
        'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=90',
      visible: true,
    },
    {
      title: 'Team energy',
      description: 'A positive environment that builds confidence and discipline.',
      imageUrl:
        'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=90',
      visible: true,
    },
    {
      title: 'Coach guidance',
      description: 'Professional coaching with structured progress feedback.',
      imageUrl:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=90',
      visible: true,
    },
    {
      title: 'Academy events',
      description: 'Camps, events, competitions, and family sports days.',
      imageUrl:
        'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=90',
      visible: true,
    },
  ],
};

const tabs: Array<{
  key: HomeTab;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
    {
      key: 'hero',
      title: 'Hero',
      description: 'Main headline, image, CTA buttons, and first impression.',
      icon: Home,
    },
    {
      key: 'stats',
      title: 'Stats',
      description: 'Homepage KPI cards and visible academy numbers.',
      icon: BarChart3,
    },
    {
      key: 'programs',
      title: 'Programs',
      description: 'Program cards shown on the public homepage.',
      icon: Trophy,
    },
    {
      key: 'gallery',
      title: 'Gallery',
      description: 'Homepage images and training atmosphere blocks.',
      icon: GalleryHorizontalEnd,
    },
    {
      key: 'contact',
      title: 'Contact CTA',
      description: 'Final conversion section and contact information.',
      icon: Megaphone,
    },
  ];

export default function CmsHomePage() {
  const [activeTab, setActiveTab] = useState<HomeTab>('hero');
  const [content, setContent] = useState<HomeContentState>(initialHomeContent);
  const [savedMessage, setSavedMessage] = useState('');

  const visibleKpis = useMemo(
    () => content.kpis.filter((item) => item.visible),
    [content.kpis],
  );

  const visiblePrograms = useMemo(
    () => content.programs.filter((program) => program.visible),
    [content.programs],
  );

  const visibleGallery = useMemo(
    () => content.gallery.filter((item) => item.visible),
    [content.gallery],
  );

  const updateContent = <K extends keyof HomeContentState>(
    key: K,
    value: HomeContentState[K],
  ) => {
    setContent((current) => ({
      ...current,
      [key]: value,
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const updateKpi = <K extends keyof KpiItem>(
    index: number,
    key: K,
    value: KpiItem[K],
  ) => {
    setContent((current) => ({
      ...current,
      kpis: current.kpis.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const updateProgram = <K extends keyof ProgramCard>(
    index: number,
    key: K,
    value: ProgramCard[K],
  ) => {
    setContent((current) => ({
      ...current,
      programs: current.programs.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const updateGalleryItem = <K extends keyof GalleryItem>(
    index: number,
    key: K,
    value: GalleryItem[K],
  ) => {
    setContent((current) => ({
      ...current,
      gallery: current.gallery.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const handleSave = () => {
    setSavedMessage(
      'Homepage CMS changes saved locally in frontend mock mode. Backend persistence will be connected later.',
    );
  };

  const handleReset = () => {
    setContent(initialHomeContent);
    setActiveTab('hero');
    setSavedMessage('Homepage CMS restored to the default frontend content.');
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <Home className="h-4 w-4" />
              Homepage Builder
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              CMS — Home
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Edit the public homepage content from one professional admin
              screen: hero text, KPI cards, programs, gallery images, contact
              section, visibility controls, and preview state.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <HeroMetric
              icon={BarChart3}
              label="Visible KPIs"
              value={`${visibleKpis.length}`}
            />
            <HeroMetric
              icon={Trophy}
              label="Programs"
              value={`${visiblePrograms.length}`}
            />
            <HeroMetric
              icon={Image}
              label="Gallery Items"
              value={`${visibleGallery.length}`}
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
        {tabs.map((tab) => {
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

      <section className="grid gap-6 xl:grid-cols-[1fr_25rem]">
        <main className="space-y-6">
          <Panel
            icon={tabs.find((tab) => tab.key === activeTab)?.icon ?? Settings}
            title={tabs.find((tab) => tab.key === activeTab)?.title ?? 'Homepage'}
            description={
              tabs.find((tab) => tab.key === activeTab)?.description ??
              'Edit homepage content.'
            }
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
                  onClick={handleSave}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Save className="h-4 w-4" />
                  Save Homepage
                </button>
              </div>
            }
          >
            {activeTab === 'hero' ? (
              <div className="space-y-6">
                <SectionTitle
                  icon={Sparkles}
                  title="Hero Content"
                  description="Control the first section visitors see on the website."
                />

                <div className="grid gap-5 lg:grid-cols-2">
                  <InputField
                    icon={Sparkles}
                    label="Hero badge"
                    value={content.heroBadge}
                    onChange={(value) => updateContent('heroBadge', value)}
                  />

                  <InputField
                    icon={Image}
                    label="Hero background image URL"
                    value={content.heroImageUrl}
                    onChange={(value) => updateContent('heroImageUrl', value)}
                  />
                </div>

                <InputField
                  icon={Home}
                  label="Hero title"
                  value={content.heroTitle}
                  onChange={(value) => updateContent('heroTitle', value)}
                />

                <TextareaField
                  label="Hero description"
                  value={content.heroDescription}
                  onChange={(value) => updateContent('heroDescription', value)}
                  rows={5}
                />

                <div className="grid gap-5 lg:grid-cols-3">
                  <InputField
                    icon={Link2}
                    label="Primary CTA"
                    value={content.heroPrimaryCta}
                    onChange={(value) => updateContent('heroPrimaryCta', value)}
                  />

                  <InputField
                    icon={Link2}
                    label="Secondary CTA"
                    value={content.heroSecondaryCta}
                    onChange={(value) =>
                      updateContent('heroSecondaryCta', value)
                    }
                  />

                  <InputField
                    icon={Palette}
                    label="Overlay opacity %"
                    type="number"
                    value={content.heroOverlayOpacity}
                    onChange={(value) =>
                      updateContent('heroOverlayOpacity', value)
                    }
                  />
                </div>
              </div>
            ) : null}

            {activeTab === 'stats' ? (
              <div className="space-y-6">
                <SectionTitle
                  icon={BarChart3}
                  title="Homepage KPI Cards"
                  description="Edit the numbers displayed under the hero section."
                />

                <ToggleRow
                  icon={BarChart3}
                  title="Show KPI section"
                  description="Display academy numbers and achievements on the homepage."
                  checked={content.showStats}
                  onChange={(value) => updateContent('showStats', value)}
                />

                <div className="grid gap-5 lg:grid-cols-2">
                  {content.kpis.map((item, index) => (
                    <EditableCard
                      key={`${item.label}-${index}`}
                      icon={BarChart3}
                      title={`KPI Card ${index + 1}`}
                      visible={item.visible}
                      onVisibleChange={(value) =>
                        updateKpi(index, 'visible', value)
                      }
                    >
                      <InputField
                        icon={FileText}
                        label="Label"
                        value={item.label}
                        onChange={(value) => updateKpi(index, 'label', value)}
                      />
                      <InputField
                        icon={Sparkles}
                        label="Value"
                        value={item.value}
                        onChange={(value) => updateKpi(index, 'value', value)}
                      />
                      <TextareaField
                        label="Description"
                        value={item.description}
                        onChange={(value) =>
                          updateKpi(index, 'description', value)
                        }
                        rows={3}
                      />
                    </EditableCard>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTab === 'programs' ? (
              <div className="space-y-6">
                <SectionTitle
                  icon={Trophy}
                  title="Homepage Programs"
                  description="Edit the program cards used in the public homepage."
                />

                <ToggleRow
                  icon={Trophy}
                  title="Show programs section"
                  description="Display featured programs on the homepage."
                  checked={content.showPrograms}
                  onChange={(value) => updateContent('showPrograms', value)}
                />

                <div className="grid gap-5 lg:grid-cols-2">
                  <InputField
                    icon={Sparkles}
                    label="Section eyebrow"
                    value={content.sectionEyebrow}
                    onChange={(value) => updateContent('sectionEyebrow', value)}
                  />

                  <InputField
                    icon={Trophy}
                    label="Programs title"
                    value={content.programsTitle}
                    onChange={(value) => updateContent('programsTitle', value)}
                  />
                </div>

                <TextareaField
                  label="Programs description"
                  value={content.programsDescription}
                  onChange={(value) =>
                    updateContent('programsDescription', value)
                  }
                  rows={4}
                />

                <div className="grid gap-5">
                  {content.programs.map((program, index) => (
                    <EditableCard
                      key={`${program.title}-${index}`}
                      icon={Trophy}
                      title={`Program Card ${index + 1}`}
                      visible={program.visible}
                      onVisibleChange={(value) =>
                        updateProgram(index, 'visible', value)
                      }
                    >
                      <div className="grid gap-5 lg:grid-cols-2">
                        <InputField
                          icon={Trophy}
                          label="Program title"
                          value={program.title}
                          onChange={(value) =>
                            updateProgram(index, 'title', value)
                          }
                        />
                        <InputField
                          icon={Sparkles}
                          label="Category"
                          value={program.category}
                          onChange={(value) =>
                            updateProgram(index, 'category', value)
                          }
                        />
                        <InputField
                          icon={Users}
                          label="Age range"
                          value={program.ageRange}
                          onChange={(value) =>
                            updateProgram(index, 'ageRange', value)
                          }
                        />
                        <InputField
                          icon={Image}
                          label="Image URL"
                          value={program.imageUrl}
                          onChange={(value) =>
                            updateProgram(index, 'imageUrl', value)
                          }
                        />
                      </div>

                      <TextareaField
                        label="Description"
                        value={program.description}
                        onChange={(value) =>
                          updateProgram(index, 'description', value)
                        }
                        rows={3}
                      />
                    </EditableCard>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTab === 'gallery' ? (
              <div className="space-y-6">
                <SectionTitle
                  icon={GalleryHorizontalEnd}
                  title="Homepage Gallery"
                  description="Manage temporary images and text used in the gallery section."
                />

                <ToggleRow
                  icon={GalleryHorizontalEnd}
                  title="Show gallery section"
                  description="Display gallery cards on the homepage."
                  checked={content.showGallery}
                  onChange={(value) => updateContent('showGallery', value)}
                />

                <InputField
                  icon={GalleryHorizontalEnd}
                  label="Gallery title"
                  value={content.galleryTitle}
                  onChange={(value) => updateContent('galleryTitle', value)}
                />

                <TextareaField
                  label="Gallery description"
                  value={content.galleryDescription}
                  onChange={(value) =>
                    updateContent('galleryDescription', value)
                  }
                  rows={4}
                />

                <div className="grid gap-5 lg:grid-cols-2">
                  {content.gallery.map((item, index) => (
                    <EditableCard
                      key={`${item.title}-${index}`}
                      icon={Image}
                      title={`Gallery Item ${index + 1}`}
                      visible={item.visible}
                      onVisibleChange={(value) =>
                        updateGalleryItem(index, 'visible', value)
                      }
                    >
                      <InputField
                        icon={Image}
                        label="Image URL"
                        value={item.imageUrl}
                        onChange={(value) =>
                          updateGalleryItem(index, 'imageUrl', value)
                        }
                      />
                      <InputField
                        icon={FileText}
                        label="Title"
                        value={item.title}
                        onChange={(value) =>
                          updateGalleryItem(index, 'title', value)
                        }
                      />
                      <TextareaField
                        label="Description"
                        value={item.description}
                        onChange={(value) =>
                          updateGalleryItem(index, 'description', value)
                        }
                        rows={3}
                      />
                    </EditableCard>
                  ))}
                </div>
              </div>
            ) : null}

            {activeTab === 'contact' ? (
              <div className="space-y-6">
                <SectionTitle
                  icon={Megaphone}
                  title="Final Contact CTA"
                  description="Control the final conversion section at the bottom of the homepage."
                />

                <ToggleRow
                  icon={Megaphone}
                  title="Show contact section"
                  description="Display the final contact and trial-booking call-to-action."
                  checked={content.showContact}
                  onChange={(value) => updateContent('showContact', value)}
                />

                <InputField
                  icon={Megaphone}
                  label="Contact title"
                  value={content.contactTitle}
                  onChange={(value) => updateContent('contactTitle', value)}
                />

                <TextareaField
                  label="Contact description"
                  value={content.contactDescription}
                  onChange={(value) =>
                    updateContent('contactDescription', value)
                  }
                  rows={4}
                />

                <div className="grid gap-5 lg:grid-cols-2">
                  <InputField
                    icon={Link2}
                    label="Phone"
                    value={content.contactPhone}
                    onChange={(value) => updateContent('contactPhone', value)}
                  />
                  <InputField
                    icon={Link2}
                    label="WhatsApp URL"
                    value={content.contactWhatsapp}
                    onChange={(value) =>
                      updateContent('contactWhatsapp', value)
                    }
                  />
                  <InputField
                    icon={Link2}
                    label="Email"
                    value={content.contactEmail}
                    onChange={(value) => updateContent('contactEmail', value)}
                  />
                  <InputField
                    icon={MapPin}
                    label="Location"
                    value={content.contactLocation}
                    onChange={(value) =>
                      updateContent('contactLocation', value)
                    }
                  />
                </div>

                <ToggleRow
                  icon={Sparkles}
                  title="Show journey section"
                  description="Display the academy development journey before the final contact section."
                  checked={content.showJourney}
                  onChange={(value) => updateContent('showJourney', value)}
                />

                <InputField
                  icon={Sparkles}
                  label="Journey title"
                  value={content.journeyTitle}
                  onChange={(value) => updateContent('journeyTitle', value)}
                />

                <TextareaField
                  label="Journey description"
                  value={content.journeyDescription}
                  onChange={(value) =>
                    updateContent('journeyDescription', value)
                  }
                  rows={4}
                />
              </div>
            ) : null}
          </Panel>
        </main>

        <aside className="space-y-6">
          <HomepagePreview
            content={content}
            visibleKpis={visibleKpis}
            visiblePrograms={visiblePrograms}
            visibleGallery={visibleGallery}
          />

          <StatusCard
            icon={ShieldCheck}
            title="Admin CMS"
            description="Only trusted admins should control homepage publishing."
            tone="success"
          />

          <StatusCard
            icon={Monitor}
            title="Frontend Mock"
            description="This builder is UI-ready now. Database persistence comes later."
            tone="warning"
          />
        </aside>
      </section>
    </div>
  );
}

function HomepagePreview({
  content,
  visibleKpis,
  visiblePrograms,
  visibleGallery,
}: {
  content: HomeContentState;
  visibleKpis: KpiItem[];
  visiblePrograms: ProgramCard[];
  visibleGallery: GalleryItem[];
}) {
  return (
    <aside className="sticky top-24 rounded-[2rem] border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <Eye className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-black">Live Preview</h2>
            <p className="text-xs font-bold text-muted-foreground">
              Homepage simulation
            </p>
          </div>
        </div>

        <RouterLink
          to="/"
          target="_blank"
          className="inline-flex h-10 items-center justify-center rounded-full bg-brand-yellow px-4 text-xs font-black text-brand-blue transition hover:bg-white"
        >
          Open
        </RouterLink>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-border bg-brand-dark text-white">
        <div
          className="bg-cover bg-center p-4"
          style={{ backgroundImage: `url(${content.heroImageUrl})` }}
        >
          <div
            className="rounded-[1.25rem] p-4 backdrop-blur-xl"
            style={{
              backgroundColor: `rgba(5, 8, 22, ${Number(content.heroOverlayOpacity || 72) / 100
                })`,
            }}
          >
            <span className="rounded-full bg-brand-yellow px-3 py-1 text-[10px] font-black text-brand-blue">
              {content.heroBadge || 'Hero badge'}
            </span>

            <h3 className="mt-4 text-xl font-black leading-tight">
              {content.heroTitle || 'Hero title'}
            </h3>

            <p className="mt-3 text-xs font-semibold leading-6 text-white/72">
              {content.heroDescription || 'Hero description'}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-brand-yellow px-3 py-1.5 text-[10px] font-black text-brand-blue">
                {content.heroPrimaryCta || 'Primary CTA'}
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-black text-white">
                {content.heroSecondaryCta || 'Secondary CTA'}
              </span>
            </div>
          </div>
        </div>

        {content.showStats ? (
          <div className="grid grid-cols-2 gap-2 bg-brand-dark p-4">
            {visibleKpis.slice(0, 4).map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-white/8 p-3 ring-1 ring-white/10"
              >
                <p className="text-base font-black text-brand-yellow">
                  {item.value}
                </p>
                <p className="mt-1 text-[10px] font-bold text-white/70">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {content.showPrograms ? (
          <div className="bg-white p-4 text-brand-dark dark:bg-[#071033] dark:text-white">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-blue dark:text-brand-yellow">
              {content.sectionEyebrow}
            </p>
            <h4 className="mt-2 text-base font-black">
              {content.programsTitle}
            </h4>
            <div className="mt-3 space-y-2">
              {visiblePrograms.slice(0, 2).map((program) => (
                <div
                  key={program.title}
                  className="rounded-2xl bg-slate-100 p-3 dark:bg-white/8"
                >
                  <p className="text-xs font-black">{program.title}</p>
                  <p className="mt-1 text-[10px] font-bold text-muted-foreground">
                    {program.ageRange}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {content.showGallery ? (
          <div className="grid grid-cols-2 gap-2 bg-brand-dark p-4">
            {visibleGallery.slice(0, 4).map((item) => (
              <div
                key={item.title}
                className="min-h-20 rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${item.imageUrl})` }}
              />
            ))}
          </div>
        ) : null}
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

function EditableCard({
  icon: Icon,
  title,
  visible,
  onVisibleChange,
  children,
}: {
  icon: LucideIcon;
  title: string;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
  children: ReactNode;
}) {
  return (
    <article className="space-y-4 rounded-[2rem] border border-border bg-background/70 p-5 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-black">{title}</h3>
        </div>

        <button
          type="button"
          onClick={() => onVisibleChange(!visible)}
          className={[
            'rounded-full px-4 py-2 text-xs font-black transition',
            visible
              ? 'bg-brand-yellow text-brand-blue'
              : 'bg-secondary text-muted-foreground',
          ].join(' ')}
        >
          {visible ? 'Visible' : 'Hidden'}
        </button>
      </div>

      <div className="space-y-4">{children}</div>
    </article>
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
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block text-sm font-bold">
      <span className="mb-2 block">{label}</span>

      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
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
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        'flex items-start gap-4 rounded-2xl border p-4 text-start transition',
        checked
          ? 'border-brand-yellow/40 bg-brand-yellow/10'
          : 'border-border bg-background hover:bg-secondary dark:bg-white/[0.03]',
      ].join(' ')}
    >
      <span
        className={[
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
          checked
            ? 'bg-brand-yellow text-brand-blue'
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
          checked ? 'bg-brand-blue dark:bg-brand-yellow' : 'bg-muted-foreground/25',
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
  tone: 'success' | 'warning';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-green-500/25 bg-green-500/10 text-green-700 dark:text-green-300'
      : 'border-brand-yellow/40 bg-brand-yellow/10 text-brand-blue dark:text-brand-yellow';

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