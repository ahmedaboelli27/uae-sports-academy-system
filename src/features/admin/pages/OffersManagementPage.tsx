import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays,
  CheckCircle2,
  Copy,
  Eye,
  FileText,
  Filter,
  Gift,
  Megaphone,
  Percent,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  Trophy,
  Users,
  WalletCards
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

type OfferStatus = 'active' | 'draft' | 'scheduled' | 'expired' | 'paused';

type OfferAudience =
  | 'all'
  | 'newParents'
  | 'existingParents'
  | 'trialLeads'
  | 'returningStudents'
  | 'siblings';

type DiscountType = 'percentage' | 'fixed' | 'freeTrial' | 'bundle';

interface OfferItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  code: string;
  status: OfferStatus;
  audience: OfferAudience;
  discountType: DiscountType;
  discountValue: string;
  startDate: string;
  endDate: string;
  program: string;
  branch: string;
  usageLimit: string;
  usedCount: number;
  visibleOnWebsite: boolean;
  highlighted: boolean;
  createdAt: string;
  notes: string;
}

const initialOffers: OfferItem[] = [
  {
    id: 'OFF-1001',
    title: 'Summer Football Trial Offer',
    subtitle: 'Book now and get 25% off first month',
    description:
      'A seasonal offer for new football registrations after completing a trial session.',
    code: 'SUMMER25',
    status: 'active',
    audience: 'trialLeads',
    discountType: 'percentage',
    discountValue: '25',
    startDate: '2026-05-25',
    endDate: '2026-06-30',
    program: 'Football Development',
    branch: 'All Branches',
    usageLimit: '150',
    usedCount: 34,
    visibleOnWebsite: true,
    highlighted: true,
    createdAt: '2026-05-25',
    notes:
      'Use this offer for new parents who complete a trial and subscribe within 7 days.',
  },
  {
    id: 'OFF-1002',
    title: 'Sibling Discount',
    subtitle: 'Save when registering more than one child',
    description:
      'A family-friendly discount for parents enrolling siblings in academy programs.',
    code: 'SIBLING15',
    status: 'active',
    audience: 'siblings',
    discountType: 'percentage',
    discountValue: '15',
    startDate: '2026-05-01',
    endDate: '2026-12-31',
    program: 'All Programs',
    branch: 'All Branches',
    usageLimit: '300',
    usedCount: 76,
    visibleOnWebsite: true,
    highlighted: false,
    createdAt: '2026-05-01',
    notes: 'Should apply only when two or more children are enrolled.',
  },
  {
    id: 'OFF-1003',
    title: 'Free Trial Week',
    subtitle: 'One free trial session for new parents',
    description:
      'A lead-generation campaign to encourage parents to book their first trial session.',
    code: 'TRIALFREE',
    status: 'scheduled',
    audience: 'newParents',
    discountType: 'freeTrial',
    discountValue: '1',
    startDate: '2026-06-01',
    endDate: '2026-06-15',
    program: 'All Programs',
    branch: 'Dubai Main Branch',
    usageLimit: '80',
    usedCount: 0,
    visibleOnWebsite: false,
    highlighted: true,
    createdAt: '2026-05-26',
    notes: 'Schedule for Eid campaign and show on homepage when active.',
  },
  {
    id: 'OFF-1004',
    title: 'Basketball Starter Bundle',
    subtitle: 'Save AED 150 on starter package',
    description:
      'Fixed-value discount for new basketball package subscriptions.',
    code: 'BASKET150',
    status: 'draft',
    audience: 'all',
    discountType: 'fixed',
    discountValue: '150',
    startDate: '2026-06-05',
    endDate: '2026-07-05',
    program: 'Basketball Skills',
    branch: 'Sharjah Branch',
    usageLimit: '60',
    usedCount: 0,
    visibleOnWebsite: false,
    highlighted: false,
    createdAt: '2026-05-26',
    notes: 'Needs pricing confirmation before publishing.',
  },
  {
    id: 'OFF-1005',
    title: 'Old Swimming Campaign',
    subtitle: 'Expired campaign for swimming registrations',
    description:
      'Past campaign kept for reporting and reference.',
    code: 'SWIM10',
    status: 'expired',
    audience: 'newParents',
    discountType: 'percentage',
    discountValue: '10',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    program: 'Swimming Academy',
    branch: 'Abu Dhabi Branch',
    usageLimit: '100',
    usedCount: 43,
    visibleOnWebsite: false,
    highlighted: false,
    createdAt: '2026-03-25',
    notes: 'Expired and should not appear publicly.',
  },
];

const emptyOffer: OfferItem = {
  id: '',
  title: '',
  subtitle: '',
  description: '',
  code: '',
  status: 'draft',
  audience: 'newParents',
  discountType: 'percentage',
  discountValue: '',
  startDate: '',
  endDate: '',
  program: 'All Programs',
  branch: 'All Branches',
  usageLimit: '100',
  usedCount: 0,
  visibleOnWebsite: false,
  highlighted: false,
  createdAt: 'Not saved yet',
  notes: '',
};

const statusOptions: Array<{ label: string; value: OfferStatus | 'all' }> = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Expired', value: 'expired' },
  { label: 'Paused', value: 'paused' },
];

const audienceOptions: Array<{ label: string; value: OfferAudience }> = [
  { label: 'All visitors', value: 'all' },
  { label: 'New parents', value: 'newParents' },
  { label: 'Existing parents', value: 'existingParents' },
  { label: 'Trial leads', value: 'trialLeads' },
  { label: 'Returning students', value: 'returningStudents' },
  { label: 'Siblings', value: 'siblings' },
];

const discountTypeOptions: Array<{ label: string; value: DiscountType }> = [
  { label: 'Percentage discount', value: 'percentage' },
  { label: 'Fixed amount', value: 'fixed' },
  { label: 'Free trial', value: 'freeTrial' },
  { label: 'Bundle offer', value: 'bundle' },
];

export default function OffersManagementPage() {
  const [offers, setOffers] = useState<OfferItem[]>(initialOffers);
  const [selectedOfferId, setSelectedOfferId] = useState(
    initialOffers[0]?.id ?? '',
  );
  const [draftOffer, setDraftOffer] = useState<OfferItem>(initialOffers[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OfferStatus | 'all'>('all');
  const [savedMessage, setSavedMessage] = useState('');

  const selectedOffer = offers.find((offer) => offer.id === selectedOfferId);

  const filteredOffers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return offers.filter((offer) => {
      const matchesSearch =
        !normalizedSearch ||
        offer.id.toLowerCase().includes(normalizedSearch) ||
        offer.title.toLowerCase().includes(normalizedSearch) ||
        offer.subtitle.toLowerCase().includes(normalizedSearch) ||
        offer.code.toLowerCase().includes(normalizedSearch) ||
        offer.program.toLowerCase().includes(normalizedSearch) ||
        offer.branch.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || offer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [offers, searchTerm, statusFilter]);

  const activeCount = offers.filter((offer) => offer.status === 'active').length;
  const scheduledCount = offers.filter(
    (offer) => offer.status === 'scheduled',
  ).length;
  const websiteCount = offers.filter((offer) => offer.visibleOnWebsite).length;
  const totalUsed = offers.reduce((total, offer) => total + offer.usedCount, 0);

  const selectOffer = (offer: OfferItem) => {
    setSelectedOfferId(offer.id);
    setDraftOffer(offer);
    setSavedMessage('');
  };

  const updateDraft = <K extends keyof OfferItem>(
    key: K,
    value: OfferItem[K],
  ) => {
    setDraftOffer((current) => ({
      ...current,
      [key]: value,
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const handleNewOffer = () => {
    const nextOffer: OfferItem = {
      ...emptyOffer,
      id: `OFF-${Math.floor(2000 + Math.random() * 7000)}`,
      code: `OFFER${Math.floor(100 + Math.random() * 800)}`,
      createdAt: new Date().toLocaleDateString(),
    };

    setSelectedOfferId(nextOffer.id);
    setDraftOffer(nextOffer);
    setSavedMessage('New offer prepared. Add details then save.');
  };

  const handleDuplicate = () => {
    if (!selectedOffer) {
      return;
    }

    const duplicated: OfferItem = {
      ...selectedOffer,
      id: `OFF-${Math.floor(2000 + Math.random() * 7000)}`,
      title: `${selectedOffer.title} Copy`,
      code: `${selectedOffer.code}-COPY`,
      status: 'draft',
      visibleOnWebsite: false,
      highlighted: false,
      usedCount: 0,
      createdAt: new Date().toLocaleDateString(),
    };

    setOffers((current) => [duplicated, ...current]);
    setSelectedOfferId(duplicated.id);
    setDraftOffer(duplicated);
    setSavedMessage('Offer duplicated locally as a draft.');
  };

  const handleSave = () => {
    if (!draftOffer.title.trim() || !draftOffer.code.trim()) {
      setSavedMessage('Please add at least an offer title and code before saving.');
      return;
    }

    const savedOffer: OfferItem = {
      ...draftOffer,
      code: draftOffer.code.trim().toUpperCase(),
      createdAt:
        draftOffer.createdAt === 'Not saved yet'
          ? new Date().toLocaleDateString()
          : draftOffer.createdAt,
    };

    setOffers((current) => {
      const exists = current.some((offer) => offer.id === savedOffer.id);

      if (exists) {
        return current.map((offer) =>
          offer.id === savedOffer.id ? savedOffer : offer,
        );
      }

      return [savedOffer, ...current];
    });

    setSelectedOfferId(savedOffer.id);
    setDraftOffer(savedOffer);
    setSavedMessage('Offer saved locally in frontend mock mode.');
  };

  const handleDelete = () => {
    if (!selectedOffer) {
      return;
    }

    const nextOffers = offers.filter((offer) => offer.id !== selectedOffer.id);
    setOffers(nextOffers);

    const nextSelected = nextOffers[0];

    if (nextSelected) {
      setSelectedOfferId(nextSelected.id);
      setDraftOffer(nextSelected);
    } else {
      setSelectedOfferId('');
      setDraftOffer(emptyOffer);
    }

    setSavedMessage('Offer removed locally. Backend delete will be connected later.');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSavedMessage('');
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <Gift className="h-4 w-4" />
              Campaign Control
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Offers Management
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Create and manage promotional offers, trial campaigns, sibling
              discounts, seasonal packages, and website-visible enrollment
              incentives from one admin-friendly screen.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-1">
            <HeroMetric icon={CheckCircle2} label="Active" value={`${activeCount}`} />
            <HeroMetric
              icon={CalendarDays}
              label="Scheduled"
              value={`${scheduledCount}`}
            />
            <HeroMetric icon={Megaphone} label="On Website" value={`${websiteCount}`} />
            <HeroMetric icon={Users} label="Used" value={`${totalUsed}`} />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-4">
        <StatusCard
          icon={Gift}
          title={`${offers.length} Offers`}
          description="Total offers available in frontend mock mode."
          tone="info"
        />
        <StatusCard
          icon={CheckCircle2}
          title={`${activeCount} Active`}
          description="Offers currently available for use."
          tone="success"
        />
        <StatusCard
          icon={Megaphone}
          title={`${websiteCount} Public`}
          description="Offers configured to appear on the public website."
          tone="warning"
        />
        <StatusCard
          icon={WalletCards}
          title={`${totalUsed} Uses`}
          description="Total simulated usage count across offers."
          tone="info"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <main className="space-y-6">
          <Panel
            icon={Gift}
            title="Offers Library"
            description="Search, filter, inspect, duplicate, and manage enrollment offers."
            actions={
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary"
                >
                  <RefreshCcw className="h-4 w-4" />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={handleNewOffer}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-blue/20 bg-card px-5 text-sm font-black text-brand-blue transition hover:bg-brand-blue/10 dark:border-brand-yellow/20 dark:text-brand-yellow dark:hover:bg-brand-yellow/10"
                >
                  <Plus className="h-4 w-4" />
                  New Offer
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            }
          >
            <div className="mb-5 grid gap-3 xl:grid-cols-[1fr_14rem]">
              <div className="relative">
                <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search title, code, program, branch..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </div>

              <FilterSelect
                icon={Filter}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as OfferStatus | 'all')}
                options={statusOptions}
              />
            </div>

            {filteredOffers.length > 0 ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    active={offer.id === selectedOfferId}
                    onClick={() => selectOffer(offer)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-border bg-background p-8 text-center dark:bg-white/[0.03]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-black">No offers found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try another search term or status filter.
                </p>
              </div>
            )}
          </Panel>
        </main>

        <aside className="space-y-6">
          <Panel
            icon={Eye}
            title="Edit Offer"
            description="Update offer content, discount rules, visibility, and campaign dates."
            actions={
              <button
                type="button"
                onClick={handleDelete}
                disabled={!selectedOffer}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 text-sm font-black text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            }
          >
            <div className="space-y-5">
              <OfferPreview offer={draftOffer} />

              <InputField
                icon={Gift}
                label="Offer title"
                value={draftOffer.title}
                onChange={(value) => updateDraft('title', value)}
              />

              <InputField
                icon={Sparkles}
                label="Subtitle"
                value={draftOffer.subtitle}
                onChange={(value) => updateDraft('subtitle', value)}
              />

              <TextareaField
                label="Description"
                value={draftOffer.description}
                onChange={(value) => updateDraft('description', value)}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  icon={Tag}
                  label="Offer code"
                  value={draftOffer.code}
                  onChange={(value) => updateDraft('code', value)}
                />

                <SelectField
                  icon={CheckCircle2}
                  label="Status"
                  value={draftOffer.status}
                  onChange={(value) =>
                    updateDraft('status', value as OfferStatus)
                  }
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Draft', value: 'draft' },
                    { label: 'Scheduled', value: 'scheduled' },
                    { label: 'Expired', value: 'expired' },
                    { label: 'Paused', value: 'paused' },
                  ]}
                />

                <SelectField
                  icon={Percent}
                  label="Discount type"
                  value={draftOffer.discountType}
                  onChange={(value) =>
                    updateDraft('discountType', value as DiscountType)
                  }
                  options={discountTypeOptions}
                />

                <InputField
                  icon={Percent}
                  label="Discount value"
                  value={draftOffer.discountValue}
                  onChange={(value) => updateDraft('discountValue', value)}
                />

                <SelectField
                  icon={Users}
                  label="Audience"
                  value={draftOffer.audience}
                  onChange={(value) =>
                    updateDraft('audience', value as OfferAudience)
                  }
                  options={audienceOptions}
                />

                <InputField
                  icon={Trophy}
                  label="Program"
                  value={draftOffer.program}
                  onChange={(value) => updateDraft('program', value)}
                />

                <InputField
                  icon={CalendarDays}
                  label="Start date"
                  type="date"
                  value={draftOffer.startDate}
                  onChange={(value) => updateDraft('startDate', value)}
                />

                <InputField
                  icon={CalendarDays}
                  label="End date"
                  type="date"
                  value={draftOffer.endDate}
                  onChange={(value) => updateDraft('endDate', value)}
                />

                <InputField
                  icon={FileText}
                  label="Branch"
                  value={draftOffer.branch}
                  onChange={(value) => updateDraft('branch', value)}
                />

                <InputField
                  icon={Users}
                  label="Usage limit"
                  type="number"
                  value={draftOffer.usageLimit}
                  onChange={(value) => updateDraft('usageLimit', value)}
                />
              </div>

              <TextareaField
                label="Internal notes"
                value={draftOffer.notes}
                onChange={(value) => updateDraft('notes', value)}
              />

              <ToggleRow
                icon={Megaphone}
                title="Visible on public website"
                description="Show this offer on public offer sections and campaigns."
                checked={draftOffer.visibleOnWebsite}
                onChange={(value) => updateDraft('visibleOnWebsite', value)}
              />

              <ToggleRow
                icon={Sparkles}
                title="Highlight this offer"
                description="Mark this offer as a featured campaign."
                checked={draftOffer.highlighted}
                onChange={(value) => updateDraft('highlighted', value)}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  disabled={!selectedOffer}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black text-foreground transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Copy className="h-4 w-4" />
                  Duplicate
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_16px_30px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <Save className="h-4 w-4" />
                  Save Offer
                </button>
              </div>
            </div>
          </Panel>
        </aside>
      </section>
    </div>
  );
}

function OfferCard({
  offer,
  active,
  onClick,
}: {
  offer: OfferItem;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-[2rem] border p-5 text-start shadow-sm transition hover:-translate-y-1',
        active
          ? 'border-brand-yellow bg-brand-yellow/10 shadow-[0_18px_45px_rgba(255,212,0,0.18)]'
          : 'border-border bg-card hover:bg-secondary/60',
      ].join(' ')}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
          <Gift className="h-6 w-6" />
        </div>

        <StatusBadge status={offer.status} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-black">{offer.title}</h3>
        {offer.highlighted ? (
          <span className="rounded-full bg-brand-yellow px-3 py-1 text-[11px] font-black text-brand-blue">
            Featured
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm font-semibold leading-7 text-muted-foreground">
        {offer.subtitle}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <MiniInfo label="Code" value={offer.code} />
        <MiniInfo
          label="Discount"
          value={`${offer.discountValue}${offer.discountType === 'percentage' ? '%' : ''}`}
        />
        <MiniInfo label="Program" value={offer.program} />
        <MiniInfo label="Used" value={`${offer.usedCount}/${offer.usageLimit}`} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-muted-foreground">
          {offer.startDate} → {offer.endDate}
        </span>

        <span
          className={[
            'rounded-full px-3 py-1 text-[11px] font-black',
            offer.visibleOnWebsite
              ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
              : 'bg-secondary text-muted-foreground',
          ].join(' ')}
        >
          {offer.visibleOnWebsite ? 'Website visible' : 'Private'}
        </span>
      </div>
    </button>
  );
}

function OfferPreview({ offer }: { offer: OfferItem }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-5 text-white">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={offer.status} />
        {offer.highlighted ? (
          <span className="rounded-full bg-brand-yellow px-3 py-1 text-[11px] font-black text-brand-blue">
            Featured
          </span>
        ) : null}
      </div>

      <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
        {offer.code || 'OFFER CODE'}
      </p>

      <h3 className="mt-3 text-2xl font-black leading-tight">
        {offer.title || 'Offer title preview'}
      </h3>

      <p className="mt-2 text-sm font-semibold text-white/72">
        {offer.subtitle || 'Offer subtitle preview'}
      </p>

      <div className="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
          Discount
        </p>
        <p className="mt-1 text-3xl font-black text-brand-yellow">
          {offer.discountValue || '0'}
          {offer.discountType === 'percentage' ? '%' : ''}
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

function FilterSelect<T extends string>({
  icon: Icon,
  value,
  onChange,
  options,
}: {
  icon: LucideIcon;
  value: T | 'all';
  onChange: (value: T | 'all') => void;
  options: Array<{ label: string; value: T | 'all' }>;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T | 'all')}
        className="h-12 w-full appearance-none rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 dark:bg-white/[0.04]">
      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 truncate text-xs font-black">{value}</p>
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
  tone: 'info' | 'warning' | 'success';
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

function StatusBadge({ status }: { status: OfferStatus }) {
  const className =
    status === 'active'
      ? 'bg-green-500/10 text-green-700 dark:text-green-300'
      : status === 'expired'
        ? 'bg-red-500/10 text-red-700 dark:text-red-300'
        : status === 'scheduled'
          ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
          : status === 'paused'
            ? 'bg-orange-500/15 text-orange-700 dark:text-orange-300'
            : 'bg-slate-500/10 text-slate-700 dark:text-slate-300';

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-black capitalize ${className}`}
    >
      {status}
    </span>
  );
}