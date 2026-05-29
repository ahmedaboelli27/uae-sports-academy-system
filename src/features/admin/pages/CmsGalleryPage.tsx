import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Filter,
  GalleryHorizontalEnd,
  Grid3X3,
  Image,
  Link2,
  Monitor,
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  Wand2
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

type GalleryStatus = 'published' | 'draft' | 'hidden';
type GalleryCategory = 'all' | 'training' | 'matches' | 'events' | 'facilities' | 'coaches';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: Exclude<GalleryCategory, 'all'>;
  status: GalleryStatus;
  featured: boolean;
  visibleOnHome: boolean;
  sortOrder: string;
  altText: string;
  updatedAt: string;
}

const initialGalleryItems: GalleryItem[] = [
  {
    id: 'gal-001',
    title: 'Football development session',
    description: 'Focused technical training with small groups and coach guidance.',
    imageUrl:
      'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=90',
    category: 'training',
    status: 'published',
    featured: true,
    visibleOnHome: true,
    sortOrder: '1',
    altText: 'Young football players during academy training',
    updatedAt: 'Today 08:40 PM',
  },
  {
    id: 'gal-002',
    title: 'Swimming confidence program',
    description: 'Structured swimming lessons focused on safety, technique, and confidence.',
    imageUrl:
      'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=90',
    category: 'training',
    status: 'published',
    featured: true,
    visibleOnHome: true,
    sortOrder: '2',
    altText: 'Swimming academy training session',
    updatedAt: 'Today 07:15 PM',
  },
  {
    id: 'gal-003',
    title: 'Basketball skills practice',
    description: 'Ball handling, agility, teamwork, and shooting drills.',
    imageUrl:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=90',
    category: 'matches',
    status: 'draft',
    featured: false,
    visibleOnHome: true,
    sortOrder: '3',
    altText: 'Basketball players practicing on court',
    updatedAt: 'Yesterday 05:30 PM',
  },
  {
    id: 'gal-004',
    title: 'Academy sports day',
    description: 'Family-friendly sports activities, team games, and academy community moments.',
    imageUrl:
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=90',
    category: 'events',
    status: 'published',
    featured: false,
    visibleOnHome: false,
    sortOrder: '4',
    altText: 'Academy sports event and family day',
    updatedAt: 'May 25, 2026',
  },
  {
    id: 'gal-005',
    title: 'Coach-led performance drills',
    description: 'Professional coaching with technical instruction and player feedback.',
    imageUrl:
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=90',
    category: 'coaches',
    status: 'published',
    featured: true,
    visibleOnHome: false,
    sortOrder: '5',
    altText: 'Coach guiding young athletes during training',
    updatedAt: 'May 24, 2026',
  },
  {
    id: 'gal-006',
    title: 'Training facilities',
    description: 'Modern training environment prepared for safe and structured sessions.',
    imageUrl:
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=90',
    category: 'facilities',
    status: 'hidden',
    featured: false,
    visibleOnHome: false,
    sortOrder: '6',
    altText: 'Academy training facility',
    updatedAt: 'May 23, 2026',
  },
];

const categoryOptions: Array<{
  value: GalleryCategory;
  label: string;
  icon: LucideIcon;
}> = [
    { value: 'all', label: 'All Media', icon: Grid3X3 },
    { value: 'training', label: 'Training', icon: Sparkles },
    { value: 'matches', label: 'Matches', icon: Star },
    { value: 'events', label: 'Events', icon: CalendarDays },
    { value: 'facilities', label: 'Facilities', icon: Monitor },
    { value: 'coaches', label: 'Coaches', icon: ShieldCheck },
  ];

const emptyItem: GalleryItem = {
  id: '',
  title: '',
  description: '',
  imageUrl: '',
  category: 'training',
  status: 'draft',
  featured: false,
  visibleOnHome: false,
  sortOrder: '1',
  altText: '',
  updatedAt: 'Not saved yet',
};

export default function CmsGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [statusFilter, setStatusFilter] = useState<GalleryStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string>('gal-001');
  const [draftItem, setDraftItem] = useState<GalleryItem>(initialGalleryItems[0]);
  const [savedMessage, setSavedMessage] = useState('');

  const selectedItem = items.find((item) => item.id === selectedItemId);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesCategory =
          activeCategory === 'all' || item.category === activeCategory;

        const matchesStatus =
          statusFilter === 'all' || item.status === statusFilter;

        const matchesSearch =
          !normalizedSearch ||
          item.title.toLowerCase().includes(normalizedSearch) ||
          item.description.toLowerCase().includes(normalizedSearch) ||
          item.category.toLowerCase().includes(normalizedSearch) ||
          item.altText.toLowerCase().includes(normalizedSearch);

        return matchesCategory && matchesStatus && matchesSearch;
      })
      .sort((a, b) => Number(a.sortOrder) - Number(b.sortOrder));
  }, [items, activeCategory, statusFilter, searchTerm]);

  const publishedCount = items.filter((item) => item.status === 'published').length;
  const draftCount = items.filter((item) => item.status === 'draft').length;
  const featuredCount = items.filter((item) => item.featured).length;
  const homeCount = items.filter((item) => item.visibleOnHome).length;

  const selectItem = (item: GalleryItem) => {
    setSelectedItemId(item.id);
    setDraftItem(item);
    setSavedMessage('');
  };

  const updateDraft = <K extends keyof GalleryItem>(
    key: K,
    value: GalleryItem[K],
  ) => {
    setDraftItem((current) => ({
      ...current,
      [key]: value,
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const handleNewItem = () => {
    const nextOrder = String(items.length + 1);
    const newItem: GalleryItem = {
      ...emptyItem,
      id: `gal-${Math.floor(1000 + Math.random() * 8000)}`,
      sortOrder: nextOrder,
      updatedAt: 'Not saved yet',
    };

    setSelectedItemId(newItem.id);
    setDraftItem(newItem);
    setSavedMessage('New gallery item prepared. Add details then save.');
  };

  const handleSave = () => {
    if (!draftItem.title.trim() || !draftItem.imageUrl.trim()) {
      setSavedMessage('Please add at least a title and image URL before saving.');
      return;
    }

    const savedItem: GalleryItem = {
      ...draftItem,
      updatedAt: new Date().toLocaleString(),
    };

    setItems((current) => {
      const exists = current.some((item) => item.id === savedItem.id);

      if (exists) {
        return current.map((item) =>
          item.id === savedItem.id ? savedItem : item,
        );
      }

      return [savedItem, ...current];
    });

    setSelectedItemId(savedItem.id);
    setDraftItem(savedItem);
    setSavedMessage('Gallery item saved locally in frontend mock mode.');
  };

  const handleDelete = () => {
    if (!selectedItem) {
      return;
    }

    const nextItems = items.filter((item) => item.id !== selectedItem.id);
    setItems(nextItems);

    const nextSelected = nextItems[0];

    if (nextSelected) {
      setSelectedItemId(nextSelected.id);
      setDraftItem(nextSelected);
    } else {
      setSelectedItemId('');
      setDraftItem(emptyItem);
    }

    setSavedMessage('Gallery item removed locally. Backend delete will be connected later.');
  };

  const handleReset = () => {
    setItems(initialGalleryItems);
    setActiveCategory('all');
    setStatusFilter('all');
    setSearchTerm('');
    setSelectedItemId(initialGalleryItems[0].id);
    setDraftItem(initialGalleryItems[0]);
    setSavedMessage('Gallery restored to the default frontend configuration.');
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <GalleryHorizontalEnd className="h-4 w-4" />
              Media Studio
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              CMS — Gallery
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Manage public gallery media, homepage image blocks, categories,
              featured photos, alt text, and visibility controls. This page is
              frontend-ready now and backend-ready for the media module later.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-5 lg:grid-cols-1">
            <HeroMetric icon={Image} label="Total Images" value={`${items.length}`} />

            <HeroMetric
              icon={CheckCircle2}
              label="Published"
              value={`${publishedCount}`}
            />

            <HeroMetric
              icon={FileText}
              label="Drafts"
              value={`${draftCount}`}
            />

            <HeroMetric icon={Star} label="Featured" value={`${featuredCount}`} />

            <HeroMetric icon={HomeIcon} label="On Home" value={`${homeCount}`} />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
          <Wand2 className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-6">
        {categoryOptions.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.value;

          const count =
            category.value === 'all'
              ? items.length
              : items.filter((item) => item.category === category.value).length;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => setActiveCategory(category.value)}
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

              <h2 className="text-sm font-black">{category.label}</h2>
              <p
                className={[
                  'mt-2 text-xs font-semibold',
                  isActive ? 'text-brand-blue/75' : 'text-muted-foreground',
                ].join(' ')}
              >
                {count} items
              </p>
            </button>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_26rem]">
        <main className="space-y-6">
          <Panel
            icon={GalleryHorizontalEnd}
            title="Gallery Library"
            description="Search, filter, preview, and select gallery items for editing."
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
                  onClick={handleNewItem}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-blue/20 bg-card px-5 text-sm font-black text-brand-blue transition hover:bg-brand-blue/10 dark:border-brand-yellow/20 dark:text-brand-yellow dark:hover:bg-brand-yellow/10"
                >
                  <Plus className="h-4 w-4" />
                  New Item
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Save className="h-4 w-4" />
                  Save Item
                </button>
              </div>
            }
          >
            <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_14rem]">
              <div className="relative">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search title, description, category, or alt text..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as GalleryStatus | 'all')
                  }
                  className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                >
                  <option value="all">All statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredItems.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    active={item.id === selectedItemId}
                    onClick={() => selectItem(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-border bg-background p-8 text-center dark:bg-white/[0.03]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                  <Search className="h-7 w-7" />
                </div>

                <h3 className="text-lg font-black">No gallery items found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try changing the search term, category, or status filter.
                </p>
              </div>
            )}
          </Panel>
        </main>

        <aside className="space-y-6">
          <Panel
            icon={Pencil}
            title="Edit Selected Item"
            description="Update image details, visibility, status, and homepage usage."
            actions={
              <button
                type="button"
                onClick={handleDelete}
                disabled={!selectedItem}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 text-sm font-black text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            }
          >
            <div className="space-y-5">
              <ImagePreview item={draftItem} />

              <InputField
                icon={FileText}
                label="Title"
                value={draftItem.title}
                onChange={(value) => updateDraft('title', value)}
              />

              <TextareaField
                label="Description"
                value={draftItem.description}
                onChange={(value) => updateDraft('description', value)}
              />

              <InputField
                icon={Link2}
                label="Image URL"
                value={draftItem.imageUrl}
                onChange={(value) => updateDraft('imageUrl', value)}
              />

              <InputField
                icon={Tag}
                label="Alt text"
                value={draftItem.altText}
                onChange={(value) => updateDraft('altText', value)}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  icon={GalleryHorizontalEnd}
                  label="Category"
                  value={draftItem.category}
                  onChange={(value) =>
                    updateDraft(
                      'category',
                      value as GalleryItem['category'],
                    )
                  }
                  options={[
                    { label: 'Training', value: 'training' },
                    { label: 'Matches', value: 'matches' },
                    { label: 'Events', value: 'events' },
                    { label: 'Facilities', value: 'facilities' },
                    { label: 'Coaches', value: 'coaches' },
                  ]}
                />

                <SelectField
                  icon={CheckCircle2}
                  label="Status"
                  value={draftItem.status}
                  onChange={(value) =>
                    updateDraft('status', value as GalleryStatus)
                  }
                  options={[
                    { label: 'Published', value: 'published' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Hidden', value: 'hidden' },
                  ]}
                />

                <InputField
                  icon={Grid3X3}
                  label="Sort order"
                  type="number"
                  value={draftItem.sortOrder}
                  onChange={(value) => updateDraft('sortOrder', value)}
                />

                <InputField
                  icon={CalendarDays}
                  label="Updated at"
                  value={draftItem.updatedAt}
                  onChange={(value) => updateDraft('updatedAt', value)}
                />
              </div>

              <ToggleRow
                icon={Star}
                title="Featured image"
                description="Highlight this image as one of the main gallery assets."
                checked={draftItem.featured}
                onChange={(value) => updateDraft('featured', value)}
              />

              <ToggleRow
                icon={HomeIcon}
                title="Show on homepage"
                description="Allow this image to appear in the homepage gallery preview."
                checked={draftItem.visibleOnHome}
                onChange={(value) => updateDraft('visibleOnHome', value)}
              />

              <StatusCard
                icon={ShieldCheck}
                title="Frontend CMS"
                description="Changes are local now. Media upload and database persistence come later."
                tone="warning"
              />
            </div>
          </Panel>
        </aside>
      </section>
    </div>
  );
}

function GalleryCard({
  item,
  active,
  onClick,
}: {
  item: GalleryItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'overflow-hidden rounded-[2rem] border text-start shadow-sm transition hover:-translate-y-1',
        active
          ? 'border-brand-yellow bg-brand-yellow/10 shadow-[0_18px_45px_rgba(255,212,0,0.18)]'
          : 'border-border bg-card hover:bg-secondary/60',
      ].join(' ')}
    >
      <div
        className="relative min-h-56 bg-cover bg-center"
        style={{ backgroundImage: `url(${item.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/15 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <StatusBadge status={item.status} />
          {item.featured ? (
            <span className="rounded-full bg-brand-yellow px-3 py-1 text-[11px] font-black text-brand-blue">
              Featured
            </span>
          ) : null}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
            {item.category}
          </p>
          <h3 className="mt-1 text-lg font-black">{item.title}</h3>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <p className="text-sm font-semibold leading-7 text-muted-foreground">
          {item.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-muted-foreground">
            Updated: {item.updatedAt}
          </span>

          <span
            className={[
              'rounded-full px-3 py-1 text-[11px] font-black',
              item.visibleOnHome
                ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
                : 'bg-secondary text-muted-foreground',
            ].join(' ')}
          >
            {item.visibleOnHome ? 'Home visible' : 'Gallery only'}
          </span>
        </div>
      </div>
    </button>
  );
}

function ImagePreview({ item }: { item: GalleryItem }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background dark:bg-white/[0.03]">
      <div
        className="min-h-52 bg-cover bg-center"
        style={{
          backgroundImage: item.imageUrl ? `url(${item.imageUrl})` : undefined,
        }}
      >
        {!item.imageUrl ? (
          <div className="flex min-h-52 items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Upload className="mx-auto mb-3 h-8 w-8" />
              <p className="text-sm font-black">Image preview</p>
              <p className="mt-1 text-xs font-bold">Add an image URL</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={item.status} />
          {item.featured ? (
            <span className="rounded-full bg-brand-yellow/20 px-3 py-1 text-[11px] font-black text-brand-blue dark:text-brand-yellow">
              Featured
            </span>
          ) : null}
        </div>

        <h3 className="text-base font-black">
          {item.title || 'Untitled gallery item'}
        </h3>
        <p className="mt-2 text-xs font-semibold leading-6 text-muted-foreground">
          {item.description || 'No description added yet.'}
        </p>
      </div>
    </div>
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
        rows={4}
        className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold leading-7 outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      />
    </label>
  );
}

function SelectField({
  icon: Icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="block text-sm font-bold">
      <span className="mb-2 block">{label}</span>

      <div className="relative">
        <Icon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
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

function StatusBadge({ status }: { status: GalleryStatus }) {
  const className =
    status === 'published'
      ? 'bg-green-500/10 text-green-700 dark:text-green-300'
      : status === 'hidden'
        ? 'bg-red-500/10 text-red-700 dark:text-red-300'
        : 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow';

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-black capitalize ${className}`}>
      {status}
    </span>
  );
}

const HomeIcon = GalleryHorizontalEnd;