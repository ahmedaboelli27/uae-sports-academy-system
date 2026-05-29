import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  Pencil,
  Plus,
  RefreshCw,
  Repeat,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
  XCircle
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type SubscriptionStatus =
  | 'active'
  | 'pending'
  | 'expiringSoon'
  | 'expired'
  | 'cancelled'
  | 'paused';

type PaymentStatus = 'paid' | 'pending' | 'overdue' | 'partial' | 'refunded';

type BillingCycle = 'monthly' | 'quarterly' | 'semiAnnual' | 'annual';

interface SubscriptionItem {
  id: string;
  subscriptionCode: string;
  studentName: string;
  studentCode: string;
  parentName: string;
  parentPhone: string;
  programName: string;
  branchName: string;
  coachName: string;
  status: SubscriptionStatus;
  paymentStatus: PaymentStatus;
  billingCycle: BillingCycle;
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  amount: number;
  discount: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  couponCode: string;
  sessionsPerWeek: number;
  remainingSessions: number;
  createdAt: string;
  notes: string;
}

const initialSubscriptions: SubscriptionItem[] = [
  {
    id: 'sub-001',
    subscriptionCode: 'SUB-2026-001',
    studentName: 'Omar Khaled',
    studentCode: 'STU-1001',
    parentName: 'Khaled Hassan',
    parentPhone: '+971 50 123 4567',
    programName: 'Football Development',
    branchName: 'Dubai Main Branch',
    coachName: 'Coach Omar',
    status: 'active',
    paymentStatus: 'paid',
    billingCycle: 'monthly',
    startDate: '2026-05-01',
    endDate: '2026-05-31',
    nextBillingDate: '2026-06-01',
    amount: 850,
    discount: 100,
    paidAmount: 750,
    outstandingAmount: 0,
    currency: 'AED',
    couponCode: 'WELCOME20',
    sessionsPerWeek: 3,
    remainingSessions: 7,
    createdAt: '2026-05-01',
    notes: 'Active monthly football subscription. Discount applied from welcome coupon.',
  },
  {
    id: 'sub-002',
    subscriptionCode: 'SUB-2026-002',
    studentName: 'Mariam Ali',
    studentCode: 'STU-1002',
    parentName: 'Ali Mansour',
    parentPhone: '+971 55 222 8844',
    programName: 'Swimming Academy',
    branchName: 'Abu Dhabi Branch',
    coachName: 'Coach Sara',
    status: 'expiringSoon',
    paymentStatus: 'pending',
    billingCycle: 'monthly',
    startDate: '2026-05-05',
    endDate: '2026-06-04',
    nextBillingDate: '2026-06-05',
    amount: 900,
    discount: 0,
    paidAmount: 0,
    outstandingAmount: 900,
    currency: 'AED',
    couponCode: '—',
    sessionsPerWeek: 2,
    remainingSessions: 2,
    createdAt: '2026-05-05',
    notes: 'Subscription close to expiry. Parent should be reminded before renewal.',
  },
  {
    id: 'sub-003',
    subscriptionCode: 'SUB-2026-003',
    studentName: 'Yousef Ahmed',
    studentCode: 'STU-1003',
    parentName: 'Ahmed Nasser',
    parentPhone: '+971 52 987 1100',
    programName: 'Basketball Skills',
    branchName: 'Sharjah Branch',
    coachName: 'Coach Kareem',
    status: 'pending',
    paymentStatus: 'partial',
    billingCycle: 'quarterly',
    startDate: '2026-05-20',
    endDate: '2026-08-20',
    nextBillingDate: '2026-06-20',
    amount: 2400,
    discount: 150,
    paidAmount: 1200,
    outstandingAmount: 1050,
    currency: 'AED',
    couponCode: 'BASKET150',
    sessionsPerWeek: 3,
    remainingSessions: 26,
    createdAt: '2026-05-20',
    notes: 'Quarterly subscription pending full payment confirmation.',
  },
  {
    id: 'sub-004',
    subscriptionCode: 'SUB-2026-004',
    studentName: 'Sara Mohamed',
    studentCode: 'STU-1004',
    parentName: 'Mohamed Sami',
    parentPhone: '+971 58 300 9090',
    programName: 'Fitness & Movement',
    branchName: 'Dubai Main Branch',
    coachName: 'Coach Lina',
    status: 'active',
    paymentStatus: 'paid',
    billingCycle: 'monthly',
    startDate: '2026-05-15',
    endDate: '2026-06-14',
    nextBillingDate: '2026-06-15',
    amount: 650,
    discount: 0,
    paidAmount: 650,
    outstandingAmount: 0,
    currency: 'AED',
    couponCode: '—',
    sessionsPerWeek: 2,
    remainingSessions: 5,
    createdAt: '2026-05-15',
    notes: 'Beginner movement subscription. Parent prefers WhatsApp reminders.',
  },
  {
    id: 'sub-005',
    subscriptionCode: 'SUB-2026-005',
    studentName: 'Hamdan Saeed',
    studentCode: 'STU-1005',
    parentName: 'Saeed Al Nuaimi',
    parentPhone: '+971 56 777 3131',
    programName: 'Advanced Football Pathway',
    branchName: 'Al Ain Branch',
    coachName: 'Coach Nasser',
    status: 'expired',
    paymentStatus: 'overdue',
    billingCycle: 'monthly',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    nextBillingDate: '2026-05-01',
    amount: 1100,
    discount: 0,
    paidAmount: 0,
    outstandingAmount: 1100,
    currency: 'AED',
    couponCode: '—',
    sessionsPerWeek: 4,
    remainingSessions: 0,
    createdAt: '2026-04-01',
    notes: 'Expired subscription with overdue amount. Needs finance follow-up.',
  },
];

const statusOptions: Array<{ label: string; value: SubscriptionStatus | 'all' }> = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Expiring Soon', value: 'expiringSoon' },
  { label: 'Expired', value: 'expired' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Paused', value: 'paused' },
];

const paymentOptions: Array<{ label: string; value: PaymentStatus | 'all' }> = [
  { label: 'All payments', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Partial', value: 'partial' },
  { label: 'Refunded', value: 'refunded' },
];

const billingOptions: Array<{ label: string; value: BillingCycle | 'all' }> = [
  { label: 'All billing cycles', value: 'all' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Semi Annual', value: 'semiAnnual' },
  { label: 'Annual', value: 'annual' },
];

export default function FinanceSubscriptionsPage() {
  const [subscriptions, setSubscriptions] =
    useState<SubscriptionItem[]>(initialSubscriptions);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(
    initialSubscriptions[0]?.id ?? '',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<SubscriptionStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | 'all'>('all');
  const [billingFilter, setBillingFilter] = useState<BillingCycle | 'all'>('all');
  const [savedMessage, setSavedMessage] = useState('');

  const filteredSubscriptions = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return subscriptions.filter((subscription) => {
      const matchesSearch =
        !normalizedSearch ||
        subscription.subscriptionCode.toLowerCase().includes(normalizedSearch) ||
        subscription.studentName.toLowerCase().includes(normalizedSearch) ||
        subscription.studentCode.toLowerCase().includes(normalizedSearch) ||
        subscription.parentName.toLowerCase().includes(normalizedSearch) ||
        subscription.parentPhone.toLowerCase().includes(normalizedSearch) ||
        subscription.programName.toLowerCase().includes(normalizedSearch) ||
        subscription.branchName.toLowerCase().includes(normalizedSearch) ||
        subscription.coachName.toLowerCase().includes(normalizedSearch) ||
        subscription.couponCode.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || subscription.status === statusFilter;

      const matchesPayment =
        paymentFilter === 'all' || subscription.paymentStatus === paymentFilter;

      const matchesBilling =
        billingFilter === 'all' || subscription.billingCycle === billingFilter;

      return matchesSearch && matchesStatus && matchesPayment && matchesBilling;
    });
  }, [billingFilter, paymentFilter, searchTerm, statusFilter, subscriptions]);

  const selectedSubscription =
    subscriptions.find(
      (subscription) => subscription.id === selectedSubscriptionId,
    ) ??
    filteredSubscriptions[0] ??
    subscriptions[0];

  const activeCount = subscriptions.filter(
    (subscription) => subscription.status === 'active',
  ).length;

  const expiringSoonCount = subscriptions.filter(
    (subscription) => subscription.status === 'expiringSoon',
  ).length;

  const overdueCount = subscriptions.filter(
    (subscription) => subscription.paymentStatus === 'overdue',
  ).length;

  const totalRevenue = subscriptions.reduce(
    (total, subscription) => total + subscription.paidAmount,
    0,
  );

  const totalOutstanding = subscriptions.reduce(
    (total, subscription) => total + subscription.outstandingAmount,
    0,
  );

  const currency = subscriptions[0]?.currency ?? 'AED';

  const updateSubscriptionStatus = (
    id: string,
    status: SubscriptionStatus,
  ) => {
    setSubscriptions((current) =>
      current.map((subscription) =>
        subscription.id === id
          ? {
            ...subscription,
            status,
          }
          : subscription,
      ),
    );

    setSavedMessage(`Subscription ${id} updated to ${status}.`);
  };

  const updatePaymentStatus = (id: string, paymentStatus: PaymentStatus) => {
    setSubscriptions((current) =>
      current.map((subscription) =>
        subscription.id === id
          ? {
            ...subscription,
            paymentStatus,
          }
          : subscription,
      ),
    );

    setSavedMessage(`Payment status for ${id} updated to ${paymentStatus}.`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setBillingFilter('all');
    setSavedMessage('');
  };

  const refreshSubscriptions = () => {
    setSubscriptions(initialSubscriptions);
    setSelectedSubscriptionId(initialSubscriptions[0]?.id ?? '');
    setSavedMessage('Subscriptions restored to the frontend mock dataset.');
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <Repeat className="h-4 w-4" />
              Finance Core
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Subscriptions Management
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Manage academy subscriptions, renewal cycles, payment status,
              student enrollment plans, discounts, billing dates, and financial
              follow-up from one operational finance screen.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refreshSubscriptions}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <Link
                to="/admin/finance/subscriptions/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                New Subscription
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric
              icon={Repeat}
              label="Total"
              value={`${subscriptions.length}`}
            />
            <HeroMetric
              icon={CheckCircle2}
              label="Active"
              value={`${activeCount}`}
            />
            <HeroMetric
              icon={Clock3}
              label="Expiring Soon"
              value={`${expiringSoonCount}`}
            />
            <HeroMetric
              icon={AlertTriangle}
              label="Overdue"
              value={`${overdueCount}`}
            />
          </div>
        </div>
      </section>

      {savedMessage ? (
        <div className="flex items-start gap-3 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-4 text-sm font-bold leading-6 text-brand-blue dark:text-brand-yellow">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Repeat}
          label="Total Subscriptions"
          value={subscriptions.length}
          tone="blue"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Active Subscriptions"
          value={activeCount}
          tone="green"
        />

        <SummaryCard
          icon={Clock3}
          label="Expiring Soon"
          value={expiringSoonCount}
          tone="yellow"
        />

        <SummaryCard
          icon={AlertTriangle}
          label="Overdue Payments"
          value={overdueCount}
          tone="red"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          icon={WalletCards}
          title="Collected Revenue"
          value={`${totalRevenue} ${currency}`}
          description="Total paid amount from the current subscription list."
        />

        <MetricCard
          icon={CreditCard}
          title="Outstanding Amount"
          value={`${totalOutstanding} ${currency}`}
          description="Amount still pending, partial, or overdue."
        />

        <MetricCard
          icon={Sparkles}
          title="Discounts Applied"
          value={`${subscriptions.reduce(
            (total, subscription) => total + subscription.discount,
            0,
          )} ${currency}`}
          description="Total discounts applied across active mock subscriptions."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Subscription Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter subscriptions by student, parent, program,
                  branch, payment status, and renewal cycle.
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Filters
              </button>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.35fr_repeat(3,1fr)]">
              <label className="block">
                <span className="mb-2 block text-sm font-black">Search</span>

                <div className="relative">
                  <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search subscription, student, parent, phone, program..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Subscription Status"
                value={statusFilter}
                options={statusOptions}
                onChange={(value) =>
                  setStatusFilter(value as SubscriptionStatus | 'all')
                }
              />

              <FilterSelect
                label="Payment Status"
                value={paymentFilter}
                options={paymentOptions}
                onChange={(value) =>
                  setPaymentFilter(value as PaymentStatus | 'all')
                }
              />

              <FilterSelect
                label="Billing Cycle"
                value={billingFilter}
                options={billingOptions}
                onChange={(value) =>
                  setBillingFilter(value as BillingCycle | 'all')
                }
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black">Subscriptions List</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review subscription plans, payment states, renewal dates, and
                  linked student accounts.
                </p>
              </div>

              <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
                {filteredSubscriptions.length} results
              </div>
            </div>

            {filteredSubscriptions.length > 0 ? (
              <>
                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full min-w-[1280px] border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-secondary/60 text-start">
                        <TableHead>Subscription</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredSubscriptions.map((subscription) => (
                        <tr
                          key={subscription.id}
                          onClick={() => {
                            setSelectedSubscriptionId(subscription.id);
                            setSavedMessage('');
                          }}
                          className={[
                            'cursor-pointer border-b border-border last:border-b-0 hover:bg-secondary/35',
                            selectedSubscription?.id === subscription.id
                              ? 'bg-brand-yellow/10'
                              : '',
                          ].join(' ')}
                        >
                          <TableCell>
                            <SubscriptionIdentity subscription={subscription} />
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">
                                {subscription.studentName}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {subscription.studentCode}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">
                                {subscription.parentName}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {subscription.parentPhone}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">
                                {subscription.programName}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {subscription.branchName}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">
                                {subscription.startDate} → {subscription.endDate}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                Next: {subscription.nextBillingDate}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <SubscriptionStatusBadge
                              status={subscription.status}
                            />
                          </TableCell>

                          <TableCell>
                            <PaymentStatusBadge
                              status={subscription.paymentStatus}
                            />
                          </TableCell>

                          <TableCell>
                            <AmountBlock subscription={subscription} />
                          </TableCell>

                          <TableCell>
                            <SubscriptionActions
                              subscriptionId={subscription.id}
                            />
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 p-5 xl:hidden">
                  {filteredSubscriptions.map((subscription) => (
                    <SubscriptionMobileCard
                      key={subscription.id}
                      subscription={subscription}
                      active={selectedSubscription?.id === subscription.id}
                      onSelect={() => {
                        setSelectedSubscriptionId(subscription.id);
                        setSavedMessage('');
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <SubscriptionDetailsPanel
            subscription={selectedSubscription}
            onActivate={() =>
              updateSubscriptionStatus(selectedSubscription.id, 'active')
            }
            onPause={() =>
              updateSubscriptionStatus(selectedSubscription.id, 'paused')
            }
            onCancel={() =>
              updateSubscriptionStatus(selectedSubscription.id, 'cancelled')
            }
            onMarkPaid={() =>
              updatePaymentStatus(selectedSubscription.id, 'paid')
            }
            onMarkOverdue={() =>
              updatePaymentStatus(selectedSubscription.id, 'overdue')
            }
          />

          <StatusCard
            icon={ShieldCheck}
            title="Finance Integration Ready"
            description="This screen is currently frontend mock mode. Later it can connect to REST finance endpoints without changing the page structure."
            tone="success"
          />

          <StatusCard
            icon={Clock3}
            title="Renewal Attention"
            description={`${expiringSoonCount} subscriptions are expiring soon and ${overdueCount} have overdue payments.`}
            tone="warning"
          />
        </aside>
      </section>
    </main>
  );
}

function SubscriptionIdentity({
  subscription,
}: {
  subscription: SubscriptionItem;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <Repeat className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{subscription.subscriptionCode}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {formatBillingCycle(subscription.billingCycle)}
        </p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {subscription.sessionsPerWeek} sessions/week
        </p>
      </div>
    </div>
  );
}

function SubscriptionMobileCard({
  subscription,
  active,
  onSelect,
}: {
  subscription: SubscriptionItem;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      onClick={onSelect}
      className={[
        'cursor-pointer rounded-[2rem] border p-5 transition',
        active
          ? 'border-brand-yellow bg-brand-yellow/10'
          : 'border-border bg-background hover:bg-secondary/60',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <SubscriptionIdentity subscription={subscription} />
        <SubscriptionActions subscriptionId={subscription.id} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine label="Student" value={subscription.studentName} />
        <InfoLine label="Parent" value={subscription.parentName} />
        <InfoLine label="Program" value={subscription.programName} />
        <InfoLine label="Branch" value={subscription.branchName} />
        <InfoLine
          label="Period"
          value={`${subscription.startDate} → ${subscription.endDate}`}
        />
        <InfoLine
          label="Outstanding"
          value={`${subscription.outstandingAmount} ${subscription.currency}`}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <SubscriptionStatusBadge status={subscription.status} />
        <PaymentStatusBadge status={subscription.paymentStatus} />
      </div>
    </article>
  );
}

function SubscriptionDetailsPanel({
  subscription,
  onActivate,
  onPause,
  onCancel,
  onMarkPaid,
  onMarkOverdue,
}: {
  subscription: SubscriptionItem;
  onActivate: () => void;
  onPause: () => void;
  onCancel: () => void;
  onMarkPaid: () => void;
  onMarkOverdue: () => void;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Repeat className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          {subscription.subscriptionCode}
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {subscription.studentName}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {subscription.programName} • {subscription.branchName} •{' '}
          {formatBillingCycle(subscription.billingCycle)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <SubscriptionStatusBadge status={subscription.status} />
          <PaymentStatusBadge status={subscription.paymentStatus} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={GraduationCap}
          label="Student"
          value={`${subscription.studentName} • ${subscription.studentCode}`}
        />

        <DetailLine
          icon={UserRound}
          label="Parent"
          value={`${subscription.parentName} • ${subscription.parentPhone}`}
        />

        <DetailLine
          icon={Layers}
          label="Program / Branch"
          value={`${subscription.programName} • ${subscription.branchName}`}
        />

        <DetailLine
          icon={CalendarDays}
          label="Subscription Period"
          value={`${subscription.startDate} → ${subscription.endDate}`}
        />

        <DetailLine
          icon={Clock3}
          label="Next Billing"
          value={subscription.nextBillingDate}
        />

        <DetailLine
          icon={WalletCards}
          label="Amount"
          value={`${subscription.amount} ${subscription.currency}`}
        />

        <DetailLine
          icon={Sparkles}
          label="Discount / Coupon"
          value={`${subscription.discount} ${subscription.currency} • ${subscription.couponCode}`}
        />

        <DetailLine
          icon={CreditCard}
          label="Paid / Outstanding"
          value={`${subscription.paidAmount} paid • ${subscription.outstandingAmount} outstanding`}
        />

        <DetailLine
          icon={FileText}
          label="Notes"
          value={subscription.notes}
        />

        <div className="grid gap-3">
          <button
            type="button"
            onClick={onActivate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 text-sm font-black text-green-700 transition hover:bg-green-500 hover:text-white dark:text-green-300"
          >
            <CheckCircle2 className="h-4 w-4" />
            Activate
          </button>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onMarkPaid}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
            >
              <CreditCard className="h-4 w-4" />
              Mark Paid
            </button>

            <button
              type="button"
              onClick={onMarkOverdue}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 text-sm font-black text-orange-700 transition hover:bg-orange-500 hover:text-white dark:text-orange-300"
            >
              <AlertTriangle className="h-4 w-4" />
              Mark Overdue
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onPause}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
            >
              <Clock3 className="h-4 w-4" />
              Pause
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 text-sm font-black text-red-600 transition hover:bg-red-500 hover:text-white dark:text-red-300"
            >
              <XCircle className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AmountBlock({ subscription }: { subscription: SubscriptionItem }) {
  return (
    <div>
      <p className="font-black text-brand-blue dark:text-brand-yellow">
        {subscription.amount} {subscription.currency}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        Paid: {subscription.paidAmount} {subscription.currency}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        Due: {subscription.outstandingAmount} {subscription.currency}
      </p>
    </div>
  );
}

function SubscriptionActions({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Link
        to={`/admin/finance/subscriptions/${subscriptionId}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="View"
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/finance/subscriptions/${subscriptionId}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </Link>
    </div>
  );
}

function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const className =
    status === 'active'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'pending'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : status === 'expiringSoon'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
          : status === 'expired' || status === 'cancelled'
            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {formatSubscriptionStatus(status)}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const className =
    status === 'paid'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'pending'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : status === 'overdue'
          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
          : status === 'partial'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {formatPaymentStatus(status)}
    </span>
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

function SummaryCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  tone: 'blue' | 'green' | 'yellow' | 'red';
}) {
  const toneClasses = {
    blue: 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue',
    green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    yellow:
      'bg-brand-yellow text-brand-blue dark:bg-brand-yellow dark:text-brand-blue',
    red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  };

  return (
    <article className="rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <p className="mt-5 text-sm font-bold text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-black text-brand-blue dark:text-white">
        {value}
      </p>
    </article>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  description,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <article className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-bold text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-black text-brand-blue dark:text-white">
            {value}
          </p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return (
    <th className="px-5 py-4 text-start text-xs font-black uppercase tracking-wide text-muted-foreground">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="px-5 py-4 align-middle text-sm">{children}</td>;
}

function DetailLine({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <p className="break-words text-sm font-black">{value}</p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-sm font-black">{value}</p>
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <FileText className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No subscriptions found</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Try another search term, status, payment filter, or billing cycle.
      </p>
    </div>
  );
}

function formatSubscriptionStatus(status: SubscriptionStatus) {
  const labels: Record<SubscriptionStatus, string> = {
    active: 'Active',
    pending: 'Pending',
    expiringSoon: 'Expiring Soon',
    expired: 'Expired',
    cancelled: 'Cancelled',
    paused: 'Paused',
  };

  return labels[status];
}

function formatPaymentStatus(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    partial: 'Partial',
    refunded: 'Refunded',
  };

  return labels[status];
}

function formatBillingCycle(cycle: BillingCycle) {
  const labels: Record<BillingCycle, string> = {
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    semiAnnual: 'Semi Annual',
    annual: 'Annual',
  };

  return labels[cycle];
}