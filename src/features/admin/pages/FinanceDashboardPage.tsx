import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  BadgeDollarSign,
  Banknote,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Pencil,
  Percent,
  PlusCircle,
  Receipt,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Users,
  WalletCards
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  exportFinanceReport,
  getFinanceDashboard,
} from '@/features/admin/finance/services/finance-data.service';
import type {
  FinanceChartPointDto,
  FinanceCurrency,
  FinanceDashboardDto,
  FinanceFiltersDto,
  FinanceInvoiceListItemDto,
  FinanceInvoiceStatus,
  FinancePaymentListItemDto,
  FinancePaymentMethod,
  FinancePaymentStatus,
  FinanceSubscriptionListItemDto,
  FinanceSubscriptionStatus,
} from '@/features/admin/finance/types/finance.dto';

type FinanceDashboardTab = 'subscriptions' | 'invoices' | 'payments';
const initialFilters: FinanceFiltersDto = {
  search: '',
  subscriptionStatus: 'all',
  invoiceStatus: 'all',
  paymentStatus: 'all',
  paymentMethod: 'all',
  branchId: 'all',
  programId: 'all',
  dateFrom: '',
  dateTo: '',
};

function formatMoney(amount: number, currency: FinanceCurrency) {
  return `${amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function getSubscriptionStatusLabelKey(status: FinanceSubscriptionStatus) {
  return `financePage.subscriptionStatus.${status}`;
}

function getInvoiceStatusLabelKey(status: FinanceInvoiceStatus) {
  return `financePage.invoiceStatus.${status}`;
}

function getPaymentStatusLabelKey(status: FinancePaymentStatus) {
  return `financePage.paymentStatus.${status}`;
}

function getPaymentMethodLabelKey(method: FinancePaymentMethod) {
  return `financePage.paymentMethod.${method}`;
}

export default function FinanceDashboardPage() {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<FinanceFiltersDto>(initialFilters);
  const [activeTab, setActiveTab] =
    useState<FinanceDashboardTab>('subscriptions');
  const [data, setData] = useState<FinanceDashboardDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadFinance = async () => {
      setIsLoading(true);

      try {
        const response = await getFinanceDashboard(filters);

        if (isMounted) {
          setData(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadFinance();

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const updateFilter = <K extends keyof FinanceFiltersDto>(
    key: K,
    value: FinanceFiltersDto[K],
  ) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setExportMessage('');
  };

  const applyQuickStatusFilter = (
    tab: FinanceDashboardTab,
    nextFilters: FinanceFiltersDto,
  ) => {
    setActiveTab(tab);
    setExportMessage('');

    setFilters({
      ...initialFilters,
      ...nextFilters,
    });
  };

  const refreshFinance = async () => {
    setIsLoading(true);

    try {
      const response = await getFinanceDashboard(filters);
      setData(response);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    setExportMessage('');

    try {
      const response = await exportFinanceReport({
        reportType: 'finance_dashboard',
        format,
        filters,
      });

      setExportMessage(
        t('financePage.export.successMessage', {
          fileName: response.fileName,
        }),
      );
    } finally {
      setIsExporting(false);
    }
  };

  function FinanceTabButton({
    isActive,
    icon: Icon,
    label,
    count,
    onClick,
  }: {
    isActive: boolean;
    icon: LucideIcon;
    label: string;
    count: number;
    onClick: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-between gap-4 rounded-[1.5rem] px-5 py-4 text-start transition ${isActive
          ? 'bg-brand-blue text-white shadow-brand dark:bg-brand-yellow dark:text-brand-blue'
          : 'bg-background text-foreground hover:bg-secondary'
          }`}
      >
        <span className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isActive
              ? 'bg-white/15 text-white dark:bg-brand-blue/10 dark:text-brand-blue'
              : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow'
              }`}
          >
            <Icon className="h-5 w-5" />
          </span>

          <span className="text-sm font-black">{label}</span>
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${isActive
            ? 'bg-white/15 text-white dark:bg-brand-blue/10 dark:text-brand-blue'
            : 'bg-secondary text-secondary-foreground'
            }`}
        >
          {count}
        </span>
      </button>
    );
  }

  function EmptyFinanceRecordsState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
  }: {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  }) {
    return (
      <div className="p-6">
        <div className="rounded-[2rem] border border-dashed border-border bg-background p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow">
            <Icon className="h-8 w-8" />
          </div>

          <h3 className="text-xl font-black">{title}</h3>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          {actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
            >
              <RefreshCw className="h-4 w-4" />
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  function QuickStatusCard({
    icon: Icon,
    title,
    description,
    value,
    onClick,
  }: {
    icon: LucideIcon;
    title: string;
    description: string;
    value: string;
    onClick: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group rounded-[2rem] border border-border bg-card p-5 text-start shadow-sm transition hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white transition group-hover:scale-105 dark:bg-brand-yellow dark:text-brand-blue">
            <Icon className="h-6 w-6" />
          </div>

          <div className="rounded-full bg-secondary px-3 py-1 text-sm font-black text-secondary-foreground">
            {value}
          </div>
        </div>

        <h3 className="mt-5 text-lg font-black text-brand-blue dark:text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </button>
    );
  }

  return (
    <main className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-4 py-2 text-sm font-black text-brand-blue dark:border-brand-yellow/20 dark:bg-brand-yellow/10 dark:text-brand-yellow">
            <WalletCards className="h-4 w-4" />
            {t('financePage.badge')}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {t('financePage.title')}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t('financePage.description')}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/admin/finance/subscriptions/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
          >
            <PlusCircle className="h-4 w-4" />
            {t('financePage.actions.createSubscription')}
          </Link>

          <Link
            to="/admin/finance/invoices/new"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
          >
            <Receipt className="h-4 w-4" />
            {t('financePage.actions.createInvoice')}
          </Link>

          <Link
            to="/admin/finance/payments/new"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
          >
            <CreditCard className="h-4 w-4" />
            {t('financePage.actions.createPayment')}
          </Link>

          <button
            type="button"
            onClick={refreshFinance}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow"
          >
            <RefreshCw className="h-4 w-4" />
            {t('financePage.actions.refresh')}
          </button>

          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {isExporting
              ? t('financePage.actions.exporting')
              : t('financePage.actions.exportPdf')}
          </button>
        </div>
      </section>

      {exportMessage ? (
        <section className="rounded-[2rem] border border-green-200 bg-green-50 p-5 text-green-800 shadow-sm dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />

            <div>
              <h2 className="text-lg font-black">
                {t('financePage.export.successTitle')}
              </h2>

              <p className="mt-1 text-sm font-semibold leading-6">
                {exportMessage}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-black">
              <SlidersHorizontal className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
              {t('financePage.filters.title')}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {t('financePage.filters.description')}
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 text-sm font-black transition hover:border-brand-yellow"
          >
            <Filter className="h-4 w-4" />
            {t('financePage.filters.reset')}
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <label className="block">
            <span className="mb-2 block text-sm font-black">
              {t('financePage.filters.search')}
            </span>

            <div className="relative">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

              <input
                value={filters.search ?? ''}
                onChange={(event) => updateFilter('search', event.target.value)}
                placeholder={t('financePage.filters.searchPlaceholder')}
                className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
              />
            </div>
          </label>

          <FilterSelect
            label={t('financePage.filters.subscriptionStatus')}
            value={filters.subscriptionStatus ?? 'all'}
            allLabel={t('financePage.filters.allSubscriptionStatuses')}
            options={[
              {
                value: 'active',
                label: t('financePage.subscriptionStatus.active'),
              },
              {
                value: 'pending',
                label: t('financePage.subscriptionStatus.pending'),
              },
              {
                value: 'expired',
                label: t('financePage.subscriptionStatus.expired'),
              },
              {
                value: 'cancelled',
                label: t('financePage.subscriptionStatus.cancelled'),
              },
              {
                value: 'paused',
                label: t('financePage.subscriptionStatus.paused'),
              },
            ]}
            onChange={(value) =>
              updateFilter(
                'subscriptionStatus',
                value as FinanceSubscriptionStatus | 'all',
              )
            }
          />

          <FilterSelect
            label={t('financePage.filters.invoiceStatus')}
            value={filters.invoiceStatus ?? 'all'}
            allLabel={t('financePage.filters.allInvoiceStatuses')}
            options={[
              {
                value: 'draft',
                label: t('financePage.invoiceStatus.draft'),
              },
              {
                value: 'issued',
                label: t('financePage.invoiceStatus.issued'),
              },
              {
                value: 'paid',
                label: t('financePage.invoiceStatus.paid'),
              },
              {
                value: 'partially_paid',
                label: t('financePage.invoiceStatus.partially_paid'),
              },
              {
                value: 'overdue',
                label: t('financePage.invoiceStatus.overdue'),
              },
              {
                value: 'cancelled',
                label: t('financePage.invoiceStatus.cancelled'),
              },
            ]}
            onChange={(value) =>
              updateFilter('invoiceStatus', value as FinanceInvoiceStatus | 'all')
            }
          />

          <FilterSelect
            label={t('financePage.filters.paymentStatus')}
            value={filters.paymentStatus ?? 'all'}
            allLabel={t('financePage.filters.allPaymentStatuses')}
            options={[
              {
                value: 'paid',
                label: t('financePage.paymentStatus.paid'),
              },
              {
                value: 'pending',
                label: t('financePage.paymentStatus.pending'),
              },
              {
                value: 'overdue',
                label: t('financePage.paymentStatus.overdue'),
              },
              {
                value: 'failed',
                label: t('financePage.paymentStatus.failed'),
              },
              {
                value: 'refunded',
                label: t('financePage.paymentStatus.refunded'),
              },
              {
                value: 'cancelled',
                label: t('financePage.paymentStatus.cancelled'),
              },
            ]}
            onChange={(value) =>
              updateFilter('paymentStatus', value as FinancePaymentStatus | 'all')
            }
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-4">
          <FilterSelect
            label={t('financePage.filters.paymentMethod')}
            value={filters.paymentMethod ?? 'all'}
            allLabel={t('financePage.filters.allPaymentMethods')}
            options={[
              {
                value: 'cash',
                label: t('financePage.paymentMethod.cash'),
              },
              {
                value: 'card',
                label: t('financePage.paymentMethod.card'),
              },
              {
                value: 'bank_transfer',
                label: t('financePage.paymentMethod.bank_transfer'),
              },
              {
                value: 'online_payment',
                label: t('financePage.paymentMethod.online_payment'),
              },
              {
                value: 'wallet',
                label: t('financePage.paymentMethod.wallet'),
              },
              {
                value: 'other',
                label: t('financePage.paymentMethod.other'),
              },
            ]}
            onChange={(value) =>
              updateFilter('paymentMethod', value as FinancePaymentMethod | 'all')
            }
          />

          <FilterSelect
            label={t('financePage.filters.branch')}
            value={filters.branchId ?? 'all'}
            allLabel={t('financePage.filters.allBranches')}
            options={[
              {
                value: 'branch-dubai',
                label: t('financePage.branches.dubai'),
              },
              {
                value: 'branch-abudhabi',
                label: t('financePage.branches.abuDhabi'),
              },
              {
                value: 'branch-sharjah',
                label: t('financePage.branches.sharjah'),
              },
            ]}
            onChange={(value) => updateFilter('branchId', value)}
          />

          <DateInput
            label={t('financePage.filters.dateFrom')}
            value={filters.dateFrom ?? ''}
            onChange={(value) => updateFilter('dateFrom', value)}
          />

          <DateInput
            label={t('financePage.filters.dateTo')}
            value={filters.dateTo ?? ''}
            onChange={(value) => updateFilter('dateTo', value)}
          />
        </div>
      </section>

      {isLoading ? (
        <FinanceLoadingState />
      ) : data ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              icon={BadgeDollarSign}
              label={t('financePage.summary.totalRevenue')}
              value={formatMoney(data.summary.totalRevenue, data.summary.currency)}
              tone="blue"
            />

            <SummaryCard
              icon={Banknote}
              label={t('financePage.summary.totalCollected')}
              value={formatMoney(
                data.summary.totalCollected,
                data.summary.currency,
              )}
              tone="green"
            />

            <SummaryCard
              icon={Receipt}
              label={t('financePage.summary.totalOutstanding')}
              value={formatMoney(
                data.summary.totalOutstanding,
                data.summary.currency,
              )}
              tone="yellow"
            />

            <SummaryCard
              icon={AlertCircle}
              label={t('financePage.summary.totalOverdue')}
              value={formatMoney(data.summary.totalOverdue, data.summary.currency)}
              tone="red"
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-4">
            <MetricCard
              icon={Percent}
              title={t('financePage.metrics.collectionRate')}
              value={`${data.summary.collectionRate}%`}
              description={t('financePage.metrics.collectionRateDescription')}
            />

            <MetricCard
              icon={Users}
              title={t('financePage.metrics.activeSubscriptions')}
              value={`${data.summary.activeSubscriptions}`}
              description={t('financePage.metrics.activeSubscriptionsDescription')}
            />

            <MetricCard
              icon={FileText}
              title={t('financePage.metrics.unpaidInvoices')}
              value={`${data.summary.unpaidInvoices}`}
              description={t('financePage.metrics.unpaidInvoicesDescription')}
            />

            <MetricCard
              icon={CreditCard}
              title={t('financePage.metrics.successfulPayments')}
              value={`${data.summary.successfulPayments}`}
              description={t('financePage.metrics.successfulPaymentsDescription')}
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-4">
            <ChartCard
              title={t('financePage.charts.revenueByMonth')}
              data={data.revenueByMonth}
              currency={data.summary.currency}
            />

            <ChartCard
              title={t('financePage.charts.revenueByProgram')}
              data={data.revenueByProgram}
              currency={data.summary.currency}
            />

            <ChartCard
              title={t('financePage.charts.revenueByBranch')}
              data={data.revenueByBranch}
              currency={data.summary.currency}
            />

            <ChartCard
              title={t('financePage.charts.paymentMethodBreakdown')}
              data={data.paymentMethodBreakdown}
              currency={data.summary.currency}
              translateLabel={(label) =>
                t(`financePage.paymentMethod.${label}`, {
                  defaultValue: label,
                })
              }
            />
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <QuickStatusCard
              icon={WalletCards}
              title={t('financePage.quickStatus.activeSubscriptions.title')}
              description={t('financePage.quickStatus.activeSubscriptions.description')}
              value={`${data.summary.activeSubscriptions}`}
              onClick={() =>
                applyQuickStatusFilter('subscriptions', {
                  subscriptionStatus: 'active',
                })
              }
            />

            <QuickStatusCard
              icon={AlertCircle}
              title={t('financePage.quickStatus.overdueInvoices.title')}
              description={t('financePage.quickStatus.overdueInvoices.description')}
              value={`${data.summary.overdueInvoices}`}
              onClick={() =>
                applyQuickStatusFilter('invoices', {
                  invoiceStatus: 'overdue',
                })
              }
            />

            <QuickStatusCard
              icon={CheckCircle2}
              title={t('financePage.quickStatus.successfulPayments.title')}
              description={t('financePage.quickStatus.successfulPayments.description')}
              value={`${data.summary.successfulPayments}`}
              onClick={() =>
                applyQuickStatusFilter('payments', {
                  paymentStatus: 'paid',
                })
              }
            />
          </section>
          <section className="space-y-5">

            <div className="rounded-[2rem] border border-border bg-card p-3 shadow-sm">
              <div className="grid gap-3 md:grid-cols-3">
                <FinanceTabButton
                  isActive={activeTab === 'subscriptions'}
                  icon={WalletCards}
                  label={t('financePage.tabs.subscriptions')}
                  count={data.subscriptions.length}
                  onClick={() => setActiveTab('subscriptions')}
                />

                <FinanceTabButton
                  isActive={activeTab === 'invoices'}
                  icon={Receipt}
                  label={t('financePage.tabs.invoices')}
                  count={data.invoices.length}
                  onClick={() => setActiveTab('invoices')}
                />

                <FinanceTabButton
                  isActive={activeTab === 'payments'}
                  icon={CreditCard}
                  label={t('financePage.tabs.payments')}
                  count={data.payments.length}
                  onClick={() => setActiveTab('payments')}
                />
              </div>
            </div>

            {activeTab === 'subscriptions' ? (
              <DataPanel
                icon={WalletCards}
                title={t('financePage.subscriptions.title')}
                description={t('financePage.subscriptions.description')}
                count={data.subscriptions.length}
              >
                {data.subscriptions.length > 0 ? (
                  <SubscriptionsTable
                    rows={data.subscriptions}
                    currency={data.summary.currency}
                  />
                ) : (
                  <EmptyFinanceRecordsState
                    icon={WalletCards}
                    title={t('financePage.emptyStates.subscriptions.title')}
                    description={t('financePage.emptyStates.subscriptions.description')}
                    actionLabel={t('financePage.emptyStates.clearFilters')}
                    onAction={resetFilters}
                  />
                )}
              </DataPanel>
            ) : null}

            {activeTab === 'invoices' ? (

              <DataPanel
                icon={Receipt}
                title={t('financePage.invoices.title')}
                description={t('financePage.invoices.description')}
                count={data.invoices.length}
              >
                {data.invoices.length > 0 ? (
                  <InvoicesTable rows={data.invoices} currency={data.summary.currency} />
                ) : (
                  <EmptyFinanceRecordsState
                    icon={Receipt}
                    title={t('financePage.emptyStates.invoices.title')}
                    description={t('financePage.emptyStates.invoices.description')}
                    actionLabel={t('financePage.emptyStates.clearFilters')}
                    onAction={resetFilters}
                  />
                )}
              </DataPanel>
            ) : null}

            {activeTab === 'payments' ? (
              <DataPanel
                icon={CreditCard}
                title={t('financePage.payments.title')}
                description={t('financePage.payments.description')}
                count={data.payments.length}
              >
                {data.payments.length > 0 ? (
                  <PaymentsTable rows={data.payments} currency={data.summary.currency} />
                ) : (
                  <EmptyFinanceRecordsState
                    icon={CreditCard}
                    title={t('financePage.emptyStates.payments.title')}
                    description={t('financePage.emptyStates.payments.description')}
                    actionLabel={t('financePage.emptyStates.clearFilters')}
                    onAction={resetFilters}
                  />
                )}
              </DataPanel>
            ) : null}

          </section>



          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <FileSpreadsheet className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  {t('financePage.export.title')}
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {t('financePage.export.description')}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <ExportButton
                  label={t('financePage.export.pdf')}
                  icon={FileText}
                  disabled={isExporting}
                  onClick={() => handleExport('pdf')}
                />

                <ExportButton
                  label={t('financePage.export.excel')}
                  icon={FileSpreadsheet}
                  disabled={isExporting}
                  onClick={() => handleExport('excel')}
                />

                <ExportButton
                  label={t('financePage.export.csv')}
                  icon={Download}
                  disabled={isExporting}
                  onClick={() => handleExport('csv')}
                />
              </div>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}

interface FilterSelectProps {
  label: string;
  value: string;
  allLabel: string;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
}

function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      >
        <option value="all">{allLabel}</option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DateInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black">{label}</span>

      <input
        type="date"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
      />
    </label>
  );
}

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tone: 'blue' | 'green' | 'yellow' | 'red';
}

function SummaryCard({ icon: Icon, label, value, tone }: SummaryCardProps) {
  const toneClasses: Record<SummaryCardProps['tone'], string> = {
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

      <p className="mt-2 text-2xl font-black text-brand-blue dark:text-white">
        {value}
      </p>
    </article>
  );
}

interface MetricCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
}

function MetricCard({ icon: Icon, title, value, description }: MetricCardProps) {
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

function ChartCard({
  title,
  data,
  currency,
  translateLabel,
}: {
  title: string;
  data: FinanceChartPointDto[];
  currency: FinanceCurrency;
  translateLabel?: (label: string) => string;
}) {
  const { t } = useTranslation();

  const maxValue = Math.max(...data.map((point) => point.value), 1);

  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-black">{title}</h2>

      {data.length > 0 ? (
        <div className="mt-5 space-y-4">
          {data.map((point) => {
            const width = `${Math.max((point.value / maxValue) * 100, 4)}%`;

            return (
              <div key={point.label}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-black">
                    {translateLabel ? translateLabel(point.label) : point.label}
                  </p>

                  <p className="text-sm font-black text-brand-blue dark:text-brand-yellow">
                    {formatMoney(point.value, currency)}
                  </p>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-brand-blue dark:bg-brand-yellow"
                    style={{ width }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-5 text-center text-sm font-semibold text-muted-foreground">
          {t('financePage.charts.noData')}
        </div>
      )}
    </section>
  );
}

interface DataPanelProps {
  icon: LucideIcon;
  title: string;
  description: string;
  count: number;
  children: ReactNode;
}

function DataPanel({
  icon: Icon,
  title,
  description,
  count,
  children,
}: DataPanelProps) {
  return (
    <section className="rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <Icon className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-xl font-black">{title}</h2>

            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
          {count}
        </div>
      </div>

      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function SubscriptionsTable({
  rows,
  currency,
}: {
  rows: FinanceSubscriptionListItemDto[];
  currency: FinanceCurrency;
}) {
  const { t } = useTranslation();

  return (
    <table className="w-full min-w-[1250px] border-collapse">
      <thead>
        <tr className="border-b border-border bg-secondary/60">
          <TableHead>{t('financePage.table.subscription')}</TableHead>
          <TableHead>{t('financePage.table.student')}</TableHead>
          <TableHead>{t('financePage.table.program')}</TableHead>
          <TableHead>{t('financePage.table.branch')}</TableHead>
          <TableHead>{t('financePage.table.plan')}</TableHead>
          <TableHead>{t('financePage.table.period')}</TableHead>
          <TableHead>{t('financePage.table.sessions')}</TableHead>
          <TableHead>{t('financePage.table.amount')}</TableHead>
          <TableHead>{t('financePage.table.balance')}</TableHead>
          <TableHead>{t('financePage.table.status')}</TableHead>
          <TableHead>{t('financePage.table.actions')}</TableHead>
        </tr>
      </thead>



      <tbody>
        {rows.map((subscription) => (
          <tr
            key={subscription.id}
            className="border-b border-border last:border-b-0 hover:bg-secondary/35"
          >
            <TableCell>
              <div>
                <Link
                  to={`/admin/finance/subscriptions/${subscription.id}`}
                  className="font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
                >
                  {subscription.subscriptionCode}
                </Link>

                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {subscription.parentName}
                </p>
              </div>
            </TableCell>

            <TableCell>
              <div>
                <p className="font-black">{subscription.studentName}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {subscription.studentCode}
                </p>
              </div>
            </TableCell>

            <TableCell>{subscription.programName}</TableCell>
            <TableCell>{subscription.branchName}</TableCell>
            <TableCell>
              {t(`financePage.plan.${subscription.plan}`)}
            </TableCell>
            <TableCell>
              {subscription.startDate} → {subscription.endDate}
            </TableCell>
            <TableCell>
              {subscription.sessionsUsed}/{subscription.sessionsIncluded}
            </TableCell>
            <TableCell>
              {formatMoney(subscription.totalAmount, currency)}
            </TableCell>
            <TableCell>
              {formatMoney(subscription.balanceDue, currency)}
            </TableCell>
            <TableCell>
              <SubscriptionStatusBadge status={subscription.status} />
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                <RowActionLink
                  to={`/admin/finance/subscriptions/${subscription.id}`}
                  icon={Eye}
                  label={t('financePage.rowActions.viewDetails')}
                />

                <RowActionLink
                  to={`/admin/finance/subscriptions/${subscription.id}/edit`}
                  icon={Pencil}
                  label={t('financePage.rowActions.edit')}
                />
              </div>
            </TableCell>

          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InvoicesTable({
  rows,
  currency,
}: {
  rows: FinanceInvoiceListItemDto[];
  currency: FinanceCurrency;
}) {
  const { t } = useTranslation();

  return (
    <table className="w-full min-w-[1100px] border-collapse">
      <thead>
        <tr className="border-b border-border bg-secondary/60">
          <TableHead>{t('financePage.table.invoice')}</TableHead>
          <TableHead>{t('financePage.table.student')}</TableHead>
          <TableHead>{t('financePage.table.issueDate')}</TableHead>
          <TableHead>{t('financePage.table.dueDate')}</TableHead>
          <TableHead>{t('financePage.table.total')}</TableHead>
          <TableHead>{t('financePage.table.paid')}</TableHead>
          <TableHead>{t('financePage.table.balance')}</TableHead>
          <TableHead>{t('financePage.table.status')}</TableHead>
          <TableHead>{t('financePage.table.actions')}</TableHead>
        </tr>
      </thead>

      <tbody>
        {rows.map((invoice) => (
          <tr
            key={invoice.id}
            className="border-b border-border last:border-b-0 hover:bg-secondary/35"
          >
            <TableCell>
              <div>
                <Link
                  to={`/admin/finance/invoices/${invoice.id}`}
                  className="font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
                >
                  {invoice.invoiceNumber}
                </Link>

                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {invoice.subscriptionCode ??
                    t('financePage.common.notAvailable')}
                </p>
              </div>
            </TableCell>

            <TableCell>
              <div>
                <p className="font-black">{invoice.studentName}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {invoice.parentName}
                </p>
              </div>
            </TableCell>

            <TableCell>{invoice.issueDate}</TableCell>
            <TableCell>{invoice.dueDate}</TableCell>
            <TableCell>{formatMoney(invoice.totalAmount, currency)}</TableCell>
            <TableCell>{formatMoney(invoice.paidAmount, currency)}</TableCell>
            <TableCell>{formatMoney(invoice.balanceDue, currency)}</TableCell>
            <TableCell>
              <InvoiceStatusBadge status={invoice.status} />
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                <RowActionLink
                  to={`/admin/finance/invoices/${invoice.id}`}
                  icon={Eye}
                  label={t('financePage.rowActions.viewDetails')}
                />

                <RowActionLink
                  to={`/admin/finance/invoices/${invoice.id}/edit`}
                  icon={Pencil}
                  label={t('financePage.rowActions.edit')}
                />
              </div>
            </TableCell>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PaymentsTable({
  rows,
  currency,
}: {
  rows: FinancePaymentListItemDto[];
  currency: FinanceCurrency;
}) {
  const { t } = useTranslation();

  return (
    <table className="w-full min-w-[1200px] border-collapse">
      <thead>
        <tr className="border-b border-border bg-secondary/60">
          <TableHead>{t('financePage.table.payment')}</TableHead>
          <TableHead>{t('financePage.table.student')}</TableHead>
          <TableHead>{t('financePage.table.date')}</TableHead>
          <TableHead>{t('financePage.table.method')}</TableHead>
          <TableHead>{t('financePage.table.amount')}</TableHead>
          <TableHead>{t('financePage.table.reference')}</TableHead>
          <TableHead>{t('financePage.table.receivedBy')}</TableHead>
          <TableHead>{t('financePage.table.status')}</TableHead>
          <TableHead>{t('financePage.table.actions')}</TableHead>
        </tr>
      </thead>

      <tbody>
        {rows.map((payment) => (
          <tr
            key={payment.id}
            className="border-b border-border last:border-b-0 hover:bg-secondary/35"
          >
            <TableCell>
              <div>
                <Link
                  to={`/admin/finance/payments/${payment.id}`}
                  className="font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
                >
                  {payment.paymentCode}
                </Link>

                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {payment.invoiceNumber ??
                    payment.subscriptionCode ??
                    t('financePage.common.notAvailable')}
                </p>
              </div>
            </TableCell>

            <TableCell>
              <div>
                <p className="font-black">{payment.studentName}</p>
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {payment.parentName}
                </p>
              </div>
            </TableCell>

            <TableCell>{payment.paymentDate}</TableCell>
            <TableCell>{t(getPaymentMethodLabelKey(payment.paymentMethod))}</TableCell>
            <TableCell>{formatMoney(payment.amount, currency)}</TableCell>
            <TableCell>
              {payment.referenceNumber ?? t('financePage.common.notAvailable')}
            </TableCell>
            <TableCell>
              {payment.receivedBy ?? t('financePage.common.notAvailable')}
            </TableCell>
            <TableCell>
              <PaymentStatusBadge status={payment.status} />
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-2">
                <RowActionLink
                  to={`/admin/finance/payments/${payment.id}`}
                  icon={Eye}
                  label={t('financePage.rowActions.viewDetails')}
                />

                <RowActionLink
                  to={`/admin/finance/payments/${payment.id}/edit`}
                  icon={Pencil}
                  label={t('financePage.rowActions.edit')}
                />
              </div>
            </TableCell>

          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RowActionLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3 py-2 text-xs font-black transition hover:border-brand-yellow hover:text-brand-blue dark:hover:text-brand-yellow"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Link>
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
  return <td className="px-5 py-4 align-middle text-sm font-semibold">{children}</td>;
}

function SubscriptionStatusBadge({
  status,
}: {
  status: FinanceSubscriptionStatus;
}) {
  const { t } = useTranslation();

  return (
    <StatusBadge
      label={t(getSubscriptionStatusLabelKey(status))}
      tone={
        status === 'active'
          ? 'green'
          : status === 'pending'
            ? 'yellow'
            : status === 'expired'
              ? 'red'
              : 'slate'
      }
    />
  );
}

function InvoiceStatusBadge({ status }: { status: FinanceInvoiceStatus }) {
  const { t } = useTranslation();

  return (
    <StatusBadge
      label={t(getInvoiceStatusLabelKey(status))}
      tone={
        status === 'paid'
          ? 'green'
          : status === 'partially_paid'
            ? 'yellow'
            : status === 'overdue'
              ? 'red'
              : 'slate'
      }
    />
  );
}

function PaymentStatusBadge({ status }: { status: FinancePaymentStatus }) {
  const { t } = useTranslation();

  return (
    <StatusBadge
      label={t(getPaymentStatusLabelKey(status))}
      tone={
        status === 'paid'
          ? 'green'
          : status === 'pending'
            ? 'yellow'
            : status === 'failed' || status === 'overdue'
              ? 'red'
              : 'slate'
      }
    />
  );
}

function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: 'green' | 'yellow' | 'red' | 'slate';
}) {
  const toneClasses: Record<typeof tone, string> = {
    green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    yellow:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}

function ExportButton({
  label,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-black shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function FinanceLoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-[2rem] bg-secondary"
          />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-[2rem] bg-secondary"
          />
        ))}
      </div>

      <div className="h-96 animate-pulse rounded-[2rem] bg-secondary" />
    </div>
  );
}