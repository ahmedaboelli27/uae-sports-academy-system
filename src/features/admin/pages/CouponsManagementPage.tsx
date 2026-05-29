import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  Filter,
  Gift,
  Hash,
  Percent,
  Plus,
  RefreshCcw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  TicketPercent,
  Trash2,
  Trophy,
  UserCheck,
  Users,
  WalletCards
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';

type CouponStatus = 'active' | 'draft' | 'scheduled' | 'expired' | 'paused';

type CouponType =
  | 'percentage'
  | 'fixed'
  | 'freeTrial'
  | 'sessionCredit'
  | 'registrationFee';

type CouponAudience =
  | 'all'
  | 'newParents'
  | 'existingParents'
  | 'trialLeads'
  | 'siblings'
  | 'returningStudents';

interface CouponItem {
  id: string;
  code: string;
  title: string;
  description: string;
  status: CouponStatus;
  couponType: CouponType;
  value: string;
  audience: CouponAudience;
  program: string;
  branch: string;
  startDate: string;
  endDate: string;
  usageLimit: string;
  usedCount: number;
  perUserLimit: string;
  minimumSpend: string;
  maximumDiscount: string;
  stackable: boolean;
  publicCode: boolean;
  autoApply: boolean;
  createdAt: string;
  notes: string;
}

const initialCoupons: CouponItem[] = [
  {
    id: 'CPN-1001',
    code: 'WELCOME20',
    title: 'New Parent Welcome Coupon',
    description:
      'A welcome discount for new parents after completing registration or booking a trial.',
    status: 'active',
    couponType: 'percentage',
    value: '20',
    audience: 'newParents',
    program: 'All Programs',
    branch: 'All Branches',
    startDate: '2026-05-01',
    endDate: '2026-06-30',
    usageLimit: '250',
    usedCount: 89,
    perUserLimit: '1',
    minimumSpend: '500',
    maximumDiscount: '300',
    stackable: false,
    publicCode: true,
    autoApply: false,
    createdAt: '2026-05-01',
    notes: 'Use for first subscription only. Not valid for renewals.',
  },
  {
    id: 'CPN-1002',
    code: 'SIBLING10',
    title: 'Sibling Coupon',
    description:
      'A percentage discount for families enrolling more than one child.',
    status: 'active',
    couponType: 'percentage',
    value: '10',
    audience: 'siblings',
    program: 'All Programs',
    branch: 'All Branches',
    startDate: '2026-05-01',
    endDate: '2026-12-31',
    usageLimit: '500',
    usedCount: 132,
    perUserLimit: '3',
    minimumSpend: '0',
    maximumDiscount: '500',
    stackable: false,
    publicCode: false,
    autoApply: true,
    createdAt: '2026-05-01',
    notes: 'Should be applied only after family/children relationship is verified.',
  },
  {
    id: 'CPN-1003',
    code: 'FOOTBALL150',
    title: 'Football Starter Coupon',
    description:
      'Fixed AED discount for new football development subscriptions.',
    status: 'scheduled',
    couponType: 'fixed',
    value: '150',
    audience: 'trialLeads',
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    startDate: '2026-06-01',
    endDate: '2026-06-20',
    usageLimit: '100',
    usedCount: 0,
    perUserLimit: '1',
    minimumSpend: '700',
    maximumDiscount: '150',
    stackable: false,
    publicCode: true,
    autoApply: false,
    createdAt: '2026-05-26',
    notes: 'Scheduled for next football campaign.',
  },
  {
    id: 'CPN-1004',
    code: 'FREETRIAL',
    title: 'Free Trial Coupon',
    description:
      'Allows a free trial session for selected programs and branches.',
    status: 'draft',
    couponType: 'freeTrial',
    value: '1',
    audience: 'newParents',
    program: 'All Programs',
    branch: 'All Branches',
    startDate: '2026-06-05',
    endDate: '2026-07-05',
    usageLimit: '120',
    usedCount: 0,
    perUserLimit: '1',
    minimumSpend: '0',
    maximumDiscount: '0',
    stackable: false,
    publicCode: true,
    autoApply: false,
    createdAt: '2026-05-26',
    notes: 'Review before publishing publicly.',
  },
  {
    id: 'CPN-1005',
    code: 'OLDAPRIL10',
    title: 'Expired April Coupon',
    description:
      'Historical coupon kept for reporting and usage reference.',
    status: 'expired',
    couponType: 'percentage',
    value: '10',
    audience: 'all',
    program: 'Swimming Academy',
    branch: 'Abu Dhabi Branch',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    usageLimit: '100',
    usedCount: 57,
    perUserLimit: '1',
    minimumSpend: '400',
    maximumDiscount: '150',
    stackable: false,
    publicCode: false,
    autoApply: false,
    createdAt: '2026-03-28',
    notes: 'Expired coupon. Do not reactivate without finance approval.',
  },
];

const emptyCoupon: CouponItem = {
  id: '',
  code: '',
  title: '',
  description: '',
  status: 'draft',
  couponType: 'percentage',
  value: '',
  audience: 'newParents',
  program: 'All Programs',
  branch: 'All Branches',
  startDate: '',
  endDate: '',
  usageLimit: '100',
  usedCount: 0,
  perUserLimit: '1',
  minimumSpend: '0',
  maximumDiscount: '0',
  stackable: false,
  publicCode: false,
  autoApply: false,
  createdAt: 'Not saved yet',
  notes: '',
};

const statusOptions: Array<{ label: string; value: CouponStatus | 'all' }> = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Expired', value: 'expired' },
  { label: 'Paused', value: 'paused' },
];

const couponTypeOptions: Array<{ label: string; value: CouponType }> = [
  { label: 'Percentage discount', value: 'percentage' },
  { label: 'Fixed amount', value: 'fixed' },
  { label: 'Free trial', value: 'freeTrial' },
  { label: 'Session credit', value: 'sessionCredit' },
  { label: 'Registration fee discount', value: 'registrationFee' },
];

const audienceOptions: Array<{ label: string; value: CouponAudience }> = [
  { label: 'All users', value: 'all' },
  { label: 'New parents', value: 'newParents' },
  { label: 'Existing parents', value: 'existingParents' },
  { label: 'Trial leads', value: 'trialLeads' },
  { label: 'Siblings', value: 'siblings' },
  { label: 'Returning students', value: 'returningStudents' },
];

export default function CouponsManagementPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>(initialCoupons);
  const [selectedCouponId, setSelectedCouponId] = useState(
    initialCoupons[0]?.id ?? '',
  );
  const [draftCoupon, setDraftCoupon] = useState<CouponItem>(initialCoupons[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<CouponStatus | 'all'>('all');
  const [savedMessage, setSavedMessage] = useState('');

  const selectedCoupon = coupons.find((coupon) => coupon.id === selectedCouponId);

  const filteredCoupons = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const matchesSearch =
        !normalizedSearch ||
        coupon.id.toLowerCase().includes(normalizedSearch) ||
        coupon.code.toLowerCase().includes(normalizedSearch) ||
        coupon.title.toLowerCase().includes(normalizedSearch) ||
        coupon.description.toLowerCase().includes(normalizedSearch) ||
        coupon.program.toLowerCase().includes(normalizedSearch) ||
        coupon.branch.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || coupon.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchTerm, statusFilter]);

  const activeCount = coupons.filter((coupon) => coupon.status === 'active').length;
  const scheduledCount = coupons.filter(
    (coupon) => coupon.status === 'scheduled',
  ).length;
  const publicCount = coupons.filter((coupon) => coupon.publicCode).length;
  const autoApplyCount = coupons.filter((coupon) => coupon.autoApply).length;
  const totalUsed = coupons.reduce((total, coupon) => total + coupon.usedCount, 0);

  const selectCoupon = (coupon: CouponItem) => {
    setSelectedCouponId(coupon.id);
    setDraftCoupon(coupon);
    setSavedMessage('');
  };

  const updateDraft = <K extends keyof CouponItem>(
    key: K,
    value: CouponItem[K],
  ) => {
    setDraftCoupon((current) => ({
      ...current,
      [key]: value,
    }));

    if (savedMessage) {
      setSavedMessage('');
    }
  };

  const handleNewCoupon = () => {
    const nextCoupon: CouponItem = {
      ...emptyCoupon,
      id: `CPN-${Math.floor(2000 + Math.random() * 7000)}`,
      code: `CODE${Math.floor(100 + Math.random() * 800)}`,
      createdAt: new Date().toLocaleDateString(),
    };

    setSelectedCouponId(nextCoupon.id);
    setDraftCoupon(nextCoupon);
    setSavedMessage('New coupon prepared. Add details then save.');
  };

  const handleDuplicate = () => {
    if (!selectedCoupon) {
      return;
    }

    const duplicated: CouponItem = {
      ...selectedCoupon,
      id: `CPN-${Math.floor(2000 + Math.random() * 7000)}`,
      code: `${selectedCoupon.code}-COPY`,
      title: `${selectedCoupon.title} Copy`,
      status: 'draft',
      usedCount: 0,
      publicCode: false,
      autoApply: false,
      createdAt: new Date().toLocaleDateString(),
    };

    setCoupons((current) => [duplicated, ...current]);
    setSelectedCouponId(duplicated.id);
    setDraftCoupon(duplicated);
    setSavedMessage('Coupon duplicated locally as a draft.');
  };

  const handleSave = () => {
    if (!draftCoupon.title.trim() || !draftCoupon.code.trim()) {
      setSavedMessage('Please add at least a coupon title and code before saving.');
      return;
    }

    const savedCoupon: CouponItem = {
      ...draftCoupon,
      code: draftCoupon.code.trim().toUpperCase(),
      createdAt:
        draftCoupon.createdAt === 'Not saved yet'
          ? new Date().toLocaleDateString()
          : draftCoupon.createdAt,
    };

    setCoupons((current) => {
      const exists = current.some((coupon) => coupon.id === savedCoupon.id);

      if (exists) {
        return current.map((coupon) =>
          coupon.id === savedCoupon.id ? savedCoupon : coupon,
        );
      }

      return [savedCoupon, ...current];
    });

    setSelectedCouponId(savedCoupon.id);
    setDraftCoupon(savedCoupon);
    setSavedMessage('Coupon saved locally in frontend mock mode.');
  };

  const handleDelete = () => {
    if (!selectedCoupon) {
      return;
    }

    const nextCoupons = coupons.filter(
      (coupon) => coupon.id !== selectedCoupon.id,
    );

    setCoupons(nextCoupons);

    const nextSelected = nextCoupons[0];

    if (nextSelected) {
      setSelectedCouponId(nextSelected.id);
      setDraftCoupon(nextSelected);
    } else {
      setSelectedCouponId('');
      setDraftCoupon(emptyCoupon);
    }

    setSavedMessage('Coupon removed locally. Backend delete will be connected later.');
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
              <TicketPercent className="h-4 w-4" />
              Discount Code Control
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Coupons Management
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Create, manage, track, and control discount coupons for academy
              subscriptions, free trials, sibling discounts, registration fees,
              program campaigns, and special enrollment workflows.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-5 lg:grid-cols-1">
            <HeroMetric icon={CheckCircle2} label="Active" value={`${activeCount}`} />
            <HeroMetric
              icon={CalendarDays}
              label="Scheduled"
              value={`${scheduledCount}`}
            />
            <HeroMetric icon={Gift} label="Public" value={`${publicCount}`} />
            <HeroMetric
              icon={Sparkles}
              label="Auto Apply"
              value={`${autoApplyCount}`}
            />
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
          icon={TicketPercent}
          title={`${coupons.length} Coupons`}
          description="Total coupon codes available in frontend mock mode."
          tone="info"
        />
        <StatusCard
          icon={CheckCircle2}
          title={`${activeCount} Active`}
          description="Coupons currently valid for use."
          tone="success"
        />
        <StatusCard
          icon={Sparkles}
          title={`${autoApplyCount} Auto Apply`}
          description="Coupons that can be automatically applied by rules."
          tone="warning"
        />
        <StatusCard
          icon={WalletCards}
          title={`${totalUsed} Uses`}
          description="Total simulated coupon usage count."
          tone="info"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <main className="space-y-6">
          <Panel
            icon={TicketPercent}
            title="Coupons Library"
            description="Search, filter, inspect, duplicate, and manage academy coupon codes."
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
                  onClick={handleNewCoupon}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-brand-blue/20 bg-card px-5 text-sm font-black text-brand-blue transition hover:bg-brand-blue/10 dark:border-brand-yellow/20 dark:text-brand-yellow dark:hover:bg-brand-yellow/10"
                >
                  <Plus className="h-4 w-4" />
                  New Coupon
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
                  placeholder="Search code, title, program, branch..."
                  className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:bg-white/[0.04] dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                />
              </div>

              <FilterSelect
                icon={Filter}
                value={statusFilter}
                onChange={(value) =>
                  setStatusFilter(value as CouponStatus | 'all')
                }
                options={statusOptions}
              />
            </div>

            {filteredCoupons.length > 0 ? (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredCoupons.map((coupon) => (
                  <CouponCard
                    key={coupon.id}
                    coupon={coupon}
                    active={coupon.id === selectedCouponId}
                    onClick={() => selectCoupon(coupon)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-border bg-background p-8 text-center dark:bg-white/[0.03]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-black">No coupons found</h3>
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
            title="Edit Coupon"
            description="Update coupon code, discount rules, limits, visibility, and validity dates."
            actions={
              <button
                type="button"
                onClick={handleDelete}
                disabled={!selectedCoupon}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 text-sm font-black text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            }
          >
            <div className="space-y-5">
              <CouponPreview coupon={draftCoupon} />

              <InputField
                icon={TicketPercent}
                label="Coupon title"
                value={draftCoupon.title}
                onChange={(value) => updateDraft('title', value)}
              />

              <TextareaField
                label="Description"
                value={draftCoupon.description}
                onChange={(value) => updateDraft('description', value)}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  icon={Hash}
                  label="Coupon code"
                  value={draftCoupon.code}
                  onChange={(value) => updateDraft('code', value)}
                />

                <SelectField
                  icon={CheckCircle2}
                  label="Status"
                  value={draftCoupon.status}
                  onChange={(value) =>
                    updateDraft('status', value as CouponStatus)
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
                  label="Coupon type"
                  value={draftCoupon.couponType}
                  onChange={(value) =>
                    updateDraft('couponType', value as CouponType)
                  }
                  options={couponTypeOptions}
                />

                <InputField
                  icon={Percent}
                  label="Value"
                  value={draftCoupon.value}
                  onChange={(value) => updateDraft('value', value)}
                />

                <SelectField
                  icon={Users}
                  label="Audience"
                  value={draftCoupon.audience}
                  onChange={(value) =>
                    updateDraft('audience', value as CouponAudience)
                  }
                  options={audienceOptions}
                />

                <InputField
                  icon={Trophy}
                  label="Program"
                  value={draftCoupon.program}
                  onChange={(value) => updateDraft('program', value)}
                />

                <InputField
                  icon={Tag}
                  label="Branch"
                  value={draftCoupon.branch}
                  onChange={(value) => updateDraft('branch', value)}
                />

                <InputField
                  icon={Users}
                  label="Usage limit"
                  type="number"
                  value={draftCoupon.usageLimit}
                  onChange={(value) => updateDraft('usageLimit', value)}
                />

                <InputField
                  icon={UserCheck}
                  label="Per-user limit"
                  type="number"
                  value={draftCoupon.perUserLimit}
                  onChange={(value) => updateDraft('perUserLimit', value)}
                />

                <InputField
                  icon={WalletCards}
                  label="Minimum spend"
                  type="number"
                  value={draftCoupon.minimumSpend}
                  onChange={(value) => updateDraft('minimumSpend', value)}
                />

                <InputField
                  icon={WalletCards}
                  label="Maximum discount"
                  type="number"
                  value={draftCoupon.maximumDiscount}
                  onChange={(value) => updateDraft('maximumDiscount', value)}
                />

                <InputField
                  icon={CalendarDays}
                  label="Start date"
                  type="date"
                  value={draftCoupon.startDate}
                  onChange={(value) => updateDraft('startDate', value)}
                />

                <InputField
                  icon={CalendarDays}
                  label="End date"
                  type="date"
                  value={draftCoupon.endDate}
                  onChange={(value) => updateDraft('endDate', value)}
                />

                <InputField
                  icon={Clock3}
                  label="Created at"
                  value={draftCoupon.createdAt}
                  onChange={(value) => updateDraft('createdAt', value)}
                />
              </div>

              <TextareaField
                label="Internal notes"
                value={draftCoupon.notes}
                onChange={(value) => updateDraft('notes', value)}
              />

              <ToggleRow
                icon={Gift}
                title="Public coupon code"
                description="Allow this coupon code to be visible or shared publicly."
                checked={draftCoupon.publicCode}
                onChange={(value) => updateDraft('publicCode', value)}
              />

              <ToggleRow
                icon={Sparkles}
                title="Auto-apply coupon"
                description="Allow the system to apply this coupon automatically when conditions match."
                checked={draftCoupon.autoApply}
                onChange={(value) => updateDraft('autoApply', value)}
              />

              <ToggleRow
                icon={AlertTriangle}
                title="Stackable with other discounts"
                description="Allow this coupon to be used together with offers or other discounts."
                checked={draftCoupon.stackable}
                onChange={(value) => updateDraft('stackable', value)}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  disabled={!selectedCoupon}
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
                  Save Coupon
                </button>
              </div>
            </div>
          </Panel>
        </aside>
      </section>
    </div>
  );
}

function CouponCard({
  coupon,
  active,
  onClick,
}: {
  coupon: CouponItem;
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
          <TicketPercent className="h-6 w-6" />
        </div>

        <StatusBadge status={coupon.status} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-base font-black">{coupon.title}</h3>
        {coupon.autoApply ? (
          <span className="rounded-full bg-brand-yellow px-3 py-1 text-[11px] font-black text-brand-blue">
            Auto
          </span>
        ) : null}
      </div>

      <p className="mt-2 text-sm font-semibold leading-7 text-muted-foreground">
        {coupon.description}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <MiniInfo label="Code" value={coupon.code} />
        <MiniInfo label="Value" value={formatCouponValue(coupon)} />
        <MiniInfo label="Program" value={coupon.program} />
        <MiniInfo label="Used" value={`${coupon.usedCount}/${coupon.usageLimit}`} />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-muted-foreground">
          {coupon.startDate} → {coupon.endDate}
        </span>

        <span
          className={[
            'rounded-full px-3 py-1 text-[11px] font-black',
            coupon.publicCode
              ? 'bg-brand-yellow/20 text-brand-blue dark:text-brand-yellow'
              : 'bg-secondary text-muted-foreground',
          ].join(' ')}
        >
          {coupon.publicCode ? 'Public code' : 'Private code'}
        </span>
      </div>
    </button>
  );
}

function CouponPreview({ coupon }: { coupon: CouponItem }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-5 text-white">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={coupon.status} />
        {coupon.publicCode ? (
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-black text-white">
            Public
          </span>
        ) : null}
        {coupon.autoApply ? (
          <span className="rounded-full bg-brand-yellow px-3 py-1 text-[11px] font-black text-brand-blue">
            Auto Apply
          </span>
        ) : null}
      </div>

      <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
        Coupon Code
      </p>

      <div className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
        <p className="text-3xl font-black tracking-[0.18em] text-white">
          {coupon.code || 'CODE'}
        </p>
      </div>

      <h3 className="mt-5 text-2xl font-black leading-tight">
        {coupon.title || 'Coupon title preview'}
      </h3>

      <p className="mt-2 text-sm font-semibold text-white/72">
        {coupon.description || 'Coupon description preview.'}
      </p>

      <div className="mt-5 rounded-2xl bg-white/10 p-4 backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
          Discount Value
        </p>
        <p className="mt-1 text-3xl font-black text-brand-yellow">
          {formatCouponValue(coupon)}
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

function StatusBadge({ status }: { status: CouponStatus }) {
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

function formatCouponValue(coupon: CouponItem) {
  if (!coupon.value) {
    return '0';
  }

  if (coupon.couponType === 'percentage') {
    return `${coupon.value}%`;
  }

  if (coupon.couponType === 'fixed') {
    return `AED ${coupon.value}`;
  }

  if (coupon.couponType === 'freeTrial') {
    return `${coupon.value} free trial`;
  }

  if (coupon.couponType === 'sessionCredit') {
    return `${coupon.value} sessions`;
  }

  return `AED ${coupon.value}`;
}