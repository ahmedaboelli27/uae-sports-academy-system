import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  Eye,
  FileText,
  Filter,
  Mail,
  Pencil,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  WalletCards,
  XCircle,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type InvoiceStatus =
  | 'draft'
  | 'issued'
  | 'sent'
  | 'paid'
  | 'partiallyPaid'
  | 'overdue'
  | 'void'
  | 'cancelled'
  | 'refunded';

type PaymentStatus = 'unpaid' | 'paid' | 'partial' | 'overdue' | 'refunded';

type InvoiceType =
  | 'subscription'
  | 'trial'
  | 'registration'
  | 'equipment'
  | 'adjustment';

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  studentName: string;
  studentCode: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  programName: string;
  branchName: string;
  subscriptionCode: string;
  status: InvoiceStatus;
  paymentStatus: PaymentStatus;
  issueDate: string;
  dueDate: string;
  paidDate: string;
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  couponCode: string;
  paymentMethod: string;
  createdAt: string;
  notes: string;
}

const initialInvoices: InvoiceItem[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV-2026-0001',
    invoiceType: 'subscription',
    studentName: 'Omar Khaled',
    studentCode: 'STU-1001',
    parentName: 'Khaled Hassan',
    parentPhone: '+971 50 123 4567',
    parentEmail: 'khaled.parent@example.com',
    programName: 'Football Development',
    branchName: 'Dubai Main Branch',
    subscriptionCode: 'SUB-2026-001',
    status: 'paid',
    paymentStatus: 'paid',
    issueDate: '2026-05-01',
    dueDate: '2026-05-05',
    paidDate: '2026-05-02',
    subtotal: 850,
    discount: 100,
    tax: 0,
    totalAmount: 750,
    paidAmount: 750,
    outstandingAmount: 0,
    currency: 'AED',
    couponCode: 'WELCOME20',
    paymentMethod: 'Card',
    createdAt: '2026-05-01',
    notes: 'Monthly subscription invoice paid successfully.',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'INV-2026-0002',
    invoiceType: 'subscription',
    studentName: 'Mariam Ali',
    studentCode: 'STU-1002',
    parentName: 'Ali Mansour',
    parentPhone: '+971 55 222 8844',
    parentEmail: 'ali.mansour@example.com',
    programName: 'Swimming Academy',
    branchName: 'Abu Dhabi Branch',
    subscriptionCode: 'SUB-2026-002',
    status: 'sent',
    paymentStatus: 'unpaid',
    issueDate: '2026-05-26',
    dueDate: '2026-06-05',
    paidDate: '—',
    subtotal: 900,
    discount: 0,
    tax: 0,
    totalAmount: 900,
    paidAmount: 0,
    outstandingAmount: 900,
    currency: 'AED',
    couponCode: '—',
    paymentMethod: 'Not paid',
    createdAt: '2026-05-26',
    notes: 'Renewal invoice sent to parent. Awaiting payment.',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'INV-2026-0003',
    invoiceType: 'subscription',
    studentName: 'Yousef Ahmed',
    studentCode: 'STU-1003',
    parentName: 'Ahmed Nasser',
    parentPhone: '+971 52 987 1100',
    parentEmail: 'ahmed.nasser@example.com',
    programName: 'Basketball Skills',
    branchName: 'Sharjah Branch',
    subscriptionCode: 'SUB-2026-003',
    status: 'partiallyPaid',
    paymentStatus: 'partial',
    issueDate: '2026-05-20',
    dueDate: '2026-05-27',
    paidDate: '2026-05-21',
    subtotal: 2400,
    discount: 150,
    tax: 0,
    totalAmount: 2250,
    paidAmount: 1200,
    outstandingAmount: 1050,
    currency: 'AED',
    couponCode: 'BASKET150',
    paymentMethod: 'Bank Transfer',
    createdAt: '2026-05-20',
    notes: 'Partial payment received. Remaining balance still pending.',
  },
  {
    id: 'inv-004',
    invoiceNumber: 'INV-2026-0004',
    invoiceType: 'registration',
    studentName: 'Sara Mohamed',
    studentCode: 'STU-1004',
    parentName: 'Mohamed Sami',
    parentPhone: '+971 58 300 9090',
    parentEmail: 'm.sami@example.com',
    programName: 'Fitness & Movement',
    branchName: 'Dubai Main Branch',
    subscriptionCode: 'SUB-2026-004',
    status: 'paid',
    paymentStatus: 'paid',
    issueDate: '2026-05-15',
    dueDate: '2026-05-18',
    paidDate: '2026-05-15',
    subtotal: 650,
    discount: 0,
    tax: 0,
    totalAmount: 650,
    paidAmount: 650,
    outstandingAmount: 0,
    currency: 'AED',
    couponCode: '—',
    paymentMethod: 'Cash',
    createdAt: '2026-05-15',
    notes: 'Registration and first month invoice paid at branch.',
  },
  {
    id: 'inv-005',
    invoiceNumber: 'INV-2026-0005',
    invoiceType: 'subscription',
    studentName: 'Hamdan Saeed',
    studentCode: 'STU-1005',
    parentName: 'Saeed Al Nuaimi',
    parentPhone: '+971 56 777 3131',
    parentEmail: 'saeed@example.com',
    programName: 'Advanced Football Pathway',
    branchName: 'Al Ain Branch',
    subscriptionCode: 'SUB-2026-005',
    status: 'overdue',
    paymentStatus: 'overdue',
    issueDate: '2026-04-01',
    dueDate: '2026-04-10',
    paidDate: '—',
    subtotal: 1100,
    discount: 0,
    tax: 0,
    totalAmount: 1100,
    paidAmount: 0,
    outstandingAmount: 1100,
    currency: 'AED',
    couponCode: '—',
    paymentMethod: 'Not paid',
    createdAt: '2026-04-01',
    notes: 'Overdue invoice. Parent needs finance follow-up.',
  },
];

const invoiceStatusOptions: Array<{ label: string; value: InvoiceStatus | 'all' }> = [
  { label: 'All invoice statuses', value: 'all' },
  { label: 'Draft', value: 'draft' },
  { label: 'Issued', value: 'issued' },
  { label: 'Sent', value: 'sent' },
  { label: 'Paid', value: 'paid' },
  { label: 'Partially Paid', value: 'partiallyPaid' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Void', value: 'void' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
];

const paymentStatusOptions: Array<{ label: string; value: PaymentStatus | 'all' }> = [
  { label: 'All payment statuses', value: 'all' },
  { label: 'Unpaid', value: 'unpaid' },
  { label: 'Paid', value: 'paid' },
  { label: 'Partial', value: 'partial' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Refunded', value: 'refunded' },
];

const invoiceTypeOptions: Array<{ label: string; value: InvoiceType | 'all' }> = [
  { label: 'All invoice types', value: 'all' },
  { label: 'Subscription', value: 'subscription' },
  { label: 'Trial', value: 'trial' },
  { label: 'Registration', value: 'registration' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Adjustment', value: 'adjustment' },
];

export default function FinanceInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(initialInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(
    initialInvoices[0]?.id ?? '',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] =
    useState<InvoiceStatus | 'all'>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] =
    useState<PaymentStatus | 'all'>('all');
  const [invoiceTypeFilter, setInvoiceTypeFilter] =
    useState<InvoiceType | 'all'>('all');
  const [savedMessage, setSavedMessage] = useState('');

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        !normalizedSearch ||
        invoice.invoiceNumber.toLowerCase().includes(normalizedSearch) ||
        invoice.studentName.toLowerCase().includes(normalizedSearch) ||
        invoice.studentCode.toLowerCase().includes(normalizedSearch) ||
        invoice.parentName.toLowerCase().includes(normalizedSearch) ||
        invoice.parentPhone.toLowerCase().includes(normalizedSearch) ||
        invoice.parentEmail.toLowerCase().includes(normalizedSearch) ||
        invoice.programName.toLowerCase().includes(normalizedSearch) ||
        invoice.branchName.toLowerCase().includes(normalizedSearch) ||
        invoice.subscriptionCode.toLowerCase().includes(normalizedSearch) ||
        invoice.couponCode.toLowerCase().includes(normalizedSearch);

      const matchesInvoiceStatus =
        invoiceStatusFilter === 'all' || invoice.status === invoiceStatusFilter;

      const matchesPaymentStatus =
        paymentStatusFilter === 'all' ||
        invoice.paymentStatus === paymentStatusFilter;

      const matchesInvoiceType =
        invoiceTypeFilter === 'all' || invoice.invoiceType === invoiceTypeFilter;

      return (
        matchesSearch &&
        matchesInvoiceStatus &&
        matchesPaymentStatus &&
        matchesInvoiceType
      );
    });
  }, [
    invoices,
    invoiceStatusFilter,
    invoiceTypeFilter,
    paymentStatusFilter,
    searchTerm,
  ]);

  const selectedInvoice =
    invoices.find((invoice) => invoice.id === selectedInvoiceId) ??
    filteredInvoices[0] ??
    invoices[0];

  const paidCount = invoices.filter((invoice) => invoice.status === 'paid').length;
  const overdueCount = invoices.filter(
    (invoice) => invoice.status === 'overdue' || invoice.paymentStatus === 'overdue',
  ).length;
  const pendingCount = invoices.filter(
    (invoice) =>
      invoice.paymentStatus === 'unpaid' || invoice.paymentStatus === 'partial',
  ).length;

  const totalRevenue = invoices.reduce(
    (total, invoice) => total + invoice.paidAmount,
    0,
  );

  const totalOutstanding = invoices.reduce(
    (total, invoice) => total + invoice.outstandingAmount,
    0,
  );

  const totalDiscount = invoices.reduce(
    (total, invoice) => total + invoice.discount,
    0,
  );

  const currency = invoices[0]?.currency ?? 'AED';

  const updateInvoice = (
    id: string,
    status: InvoiceStatus,
    paymentStatus: PaymentStatus,
  ) => {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === id
          ? {
            ...invoice,
            status,
            paymentStatus,
            paidDate:
              paymentStatus === 'paid'
                ? new Date().toISOString().slice(0, 10)
                : invoice.paidDate,
            paidAmount:
              paymentStatus === 'paid' ? invoice.totalAmount : invoice.paidAmount,
            outstandingAmount:
              paymentStatus === 'paid' ? 0 : invoice.outstandingAmount,
          }
          : invoice,
      ),
    );

    setSavedMessage(`Invoice ${id} updated successfully.`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setInvoiceStatusFilter('all');
    setPaymentStatusFilter('all');
    setInvoiceTypeFilter('all');
    setSavedMessage('');
  };

  const refreshInvoices = () => {
    setInvoices(initialInvoices);
    setSelectedInvoiceId(initialInvoices[0]?.id ?? '');
    setSavedMessage('Invoices restored to the frontend mock dataset.');
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <Receipt className="h-4 w-4" />
              Finance Billing
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Invoices Management
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Manage academy invoices, billing status, due dates, outstanding
              balances, paid amounts, parent reminders, and financial follow-up
              from one professional finance workspace.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refreshInvoices}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <Link
                to="/admin/finance/invoices/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                New Invoice
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric icon={Receipt} label="Total Invoices" value={`${invoices.length}`} />
            <HeroMetric icon={CheckCircle2} label="Paid" value={`${paidCount}`} />
            <HeroMetric icon={Clock3} label="Pending" value={`${pendingCount}`} />
            <HeroMetric icon={AlertTriangle} label="Overdue" value={`${overdueCount}`} />
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
        <SummaryCard icon={Receipt} label="Total Invoices" value={invoices.length} tone="blue" />
        <SummaryCard icon={CheckCircle2} label="Paid Invoices" value={paidCount} tone="green" />
        <SummaryCard icon={Clock3} label="Pending / Partial" value={pendingCount} tone="yellow" />
        <SummaryCard icon={AlertTriangle} label="Overdue Invoices" value={overdueCount} tone="red" />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          icon={WalletCards}
          title="Collected Revenue"
          value={`${totalRevenue} ${currency}`}
          description="Total paid amount from the current invoice list."
        />

        <MetricCard
          icon={CreditCard}
          title="Outstanding Amount"
          value={`${totalOutstanding} ${currency}`}
          description="Total unpaid, partial, or overdue invoice balance."
        />

        <MetricCard
          icon={Sparkles}
          title="Discounts Applied"
          value={`${totalDiscount} ${currency}`}
          description="Total invoice discounts from coupons or manual adjustments."
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Invoice Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter invoices by parent, student, subscription,
                  program, invoice status, payment status, and invoice type.
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
                    placeholder="Search invoice, student, parent, phone, program..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Invoice Status"
                value={invoiceStatusFilter}
                options={invoiceStatusOptions}
                onChange={(value) =>
                  setInvoiceStatusFilter(value as InvoiceStatus | 'all')
                }
              />

              <FilterSelect
                label="Payment Status"
                value={paymentStatusFilter}
                options={paymentStatusOptions}
                onChange={(value) =>
                  setPaymentStatusFilter(value as PaymentStatus | 'all')
                }
              />

              <FilterSelect
                label="Invoice Type"
                value={invoiceTypeFilter}
                options={invoiceTypeOptions}
                onChange={(value) =>
                  setInvoiceTypeFilter(value as InvoiceType | 'all')
                }
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black">Invoices List</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review invoice status, billing dates, payment status, and
                  outstanding balances.
                </p>
              </div>

              <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
                {filteredInvoices.length} results
              </div>
            </div>

            {filteredInvoices.length > 0 ? (
              <>
                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full min-w-[1320px] border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-secondary/60 text-start">
                        <TableHead>Invoice</TableHead>
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
                      {filteredInvoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          onClick={() => {
                            setSelectedInvoiceId(invoice.id);
                            setSavedMessage('');
                          }}
                          className={[
                            'cursor-pointer border-b border-border last:border-b-0 hover:bg-secondary/35',
                            selectedInvoice?.id === invoice.id
                              ? 'bg-brand-yellow/10'
                              : '',
                          ].join(' ')}
                        >
                          <TableCell>
                            <InvoiceIdentity invoice={invoice} />
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">{invoice.studentName}</p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {invoice.studentCode}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">{invoice.parentName}</p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {invoice.parentPhone}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">{invoice.programName}</p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {invoice.branchName}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">
                                Issued: {invoice.issueDate}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                Due: {invoice.dueDate}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <InvoiceStatusBadge status={invoice.status} />
                          </TableCell>

                          <TableCell>
                            <PaymentStatusBadge status={invoice.paymentStatus} />
                          </TableCell>

                          <TableCell>
                            <AmountBlock invoice={invoice} />
                          </TableCell>

                          <TableCell>
                            <InvoiceActions invoiceId={invoice.id} />
                          </TableCell>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-4 p-5 xl:hidden">
                  {filteredInvoices.map((invoice) => (
                    <InvoiceMobileCard
                      key={invoice.id}
                      invoice={invoice}
                      active={selectedInvoice?.id === invoice.id}
                      onSelect={() => {
                        setSelectedInvoiceId(invoice.id);
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
          <InvoiceDetailsPanel
            invoice={selectedInvoice}
            onMarkPaid={() => updateInvoice(selectedInvoice.id, 'paid', 'paid')}
            onMarkOverdue={() =>
              updateInvoice(selectedInvoice.id, 'overdue', 'overdue')
            }
            onSendReminder={() => {
              setSavedMessage(`Reminder prepared for ${selectedInvoice.parentName}.`);
            }}
            onVoid={() => updateInvoice(selectedInvoice.id, 'void', 'unpaid')}
          />

          <StatusCard
            icon={ShieldCheck}
            title="Billing Ready"
            description="This screen is currently frontend mock mode. Later it can connect to finance invoice endpoints without changing the page structure."
            tone="success"
          />

          <StatusCard
            icon={Clock3}
            title="Finance Attention"
            description={`${overdueCount} invoices are overdue and ${pendingCount} invoices are unpaid or partially paid.`}
            tone="warning"
          />
        </aside>
      </section>
    </main>
  );
}

function InvoiceIdentity({ invoice }: { invoice: InvoiceItem }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <Receipt className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{invoice.invoiceNumber}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {formatInvoiceType(invoice.invoiceType)}
        </p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {invoice.subscriptionCode}
        </p>
      </div>
    </div>
  );
}

function InvoiceMobileCard({
  invoice,
  active,
  onSelect,
}: {
  invoice: InvoiceItem;
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
        <InvoiceIdentity invoice={invoice} />
        <InvoiceActions invoiceId={invoice.id} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine label="Student" value={invoice.studentName} />
        <InfoLine label="Parent" value={invoice.parentName} />
        <InfoLine label="Program" value={invoice.programName} />
        <InfoLine label="Due Date" value={invoice.dueDate} />
        <InfoLine
          label="Total"
          value={`${invoice.totalAmount} ${invoice.currency}`}
        />
        <InfoLine
          label="Outstanding"
          value={`${invoice.outstandingAmount} ${invoice.currency}`}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <InvoiceStatusBadge status={invoice.status} />
        <PaymentStatusBadge status={invoice.paymentStatus} />
      </div>
    </article>
  );
}

function InvoiceDetailsPanel({
  invoice,
  onMarkPaid,
  onMarkOverdue,
  onSendReminder,
  onVoid,
}: {
  invoice: InvoiceItem;
  onMarkPaid: () => void;
  onMarkOverdue: () => void;
  onSendReminder: () => void;
  onVoid: () => void;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Receipt className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          {invoice.invoiceNumber}
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {invoice.studentName}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {invoice.programName} • {invoice.branchName} • Due {invoice.dueDate}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <InvoiceStatusBadge status={invoice.status} />
          <PaymentStatusBadge status={invoice.paymentStatus} />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={UserRound}
          label="Student"
          value={`${invoice.studentName} • ${invoice.studentCode}`}
        />

        <DetailLine
          icon={Users}
          label="Parent"
          value={`${invoice.parentName} • ${invoice.parentPhone}`}
        />

        <DetailLine
          icon={Mail}
          label="Parent Email"
          value={invoice.parentEmail}
        />

        <DetailLine
          icon={FileText}
          label="Subscription"
          value={invoice.subscriptionCode}
        />

        <DetailLine
          icon={CalendarDays}
          label="Dates"
          value={`Issued ${invoice.issueDate} • Due ${invoice.dueDate} • Paid ${invoice.paidDate}`}
        />

        <DetailLine
          icon={WalletCards}
          label="Invoice Total"
          value={`${invoice.totalAmount} ${invoice.currency}`}
        />

        <DetailLine
          icon={Sparkles}
          label="Discount / Coupon"
          value={`${invoice.discount} ${invoice.currency} • ${invoice.couponCode}`}
        />

        <DetailLine
          icon={CreditCard}
          label="Paid / Outstanding"
          value={`${invoice.paidAmount} paid • ${invoice.outstandingAmount} outstanding`}
        />

        <DetailLine
          icon={FileText}
          label="Notes"
          value={invoice.notes}
        />

        <div className="grid gap-3">
          <button
            type="button"
            onClick={onMarkPaid}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark Paid
          </button>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onSendReminder}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
            >
              <Send className="h-4 w-4" />
              Reminder
            </button>

            <button
              type="button"
              onClick={onMarkOverdue}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 text-sm font-black text-orange-700 transition hover:bg-orange-500 hover:text-white dark:text-orange-300"
            >
              <AlertTriangle className="h-4 w-4" />
              Overdue
            </button>
          </div>

          <button
            type="button"
            onClick={onVoid}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 text-sm font-black text-red-600 transition hover:bg-red-500 hover:text-white dark:text-red-300"
          >
            <XCircle className="h-4 w-4" />
            Void Invoice
          </button>
        </div>
      </div>
    </aside>
  );
}

function AmountBlock({ invoice }: { invoice: InvoiceItem }) {
  return (
    <div>
      <p className="font-black text-brand-blue dark:text-brand-yellow">
        {invoice.totalAmount} {invoice.currency}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        Paid: {invoice.paidAmount} {invoice.currency}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        Due: {invoice.outstandingAmount} {invoice.currency}
      </p>
    </div>
  );
}

function InvoiceActions({ invoiceId }: { invoiceId: string }) {
  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Link
        to={`/admin/finance/invoices/${invoiceId}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="View"
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/finance/invoices/${invoiceId}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </Link>

      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="Download"
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const className =
    status === 'paid'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'issued' || status === 'sent'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
        : status === 'partiallyPaid'
          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
          : status === 'overdue' || status === 'void' || status === 'cancelled'
            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {formatInvoiceStatus(status)}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const className =
    status === 'paid'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'unpaid'
        ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
        : status === 'partial'
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
          : status === 'overdue'
            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';

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

      <h3 className="text-xl font-black">No invoices found</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Try another search term, invoice status, payment status, or invoice type.
      </p>
    </div>
  );
}

function formatInvoiceStatus(status: InvoiceStatus) {
  const labels: Record<InvoiceStatus, string> = {
    draft: 'Draft',
    issued: 'Issued',
    sent: 'Sent',
    paid: 'Paid',
    partiallyPaid: 'Partially Paid',
    overdue: 'Overdue',
    void: 'Void',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };

  return labels[status];
}

function formatPaymentStatus(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    unpaid: 'Unpaid',
    paid: 'Paid',
    partial: 'Partial',
    overdue: 'Overdue',
    refunded: 'Refunded',
  };

  return labels[status];
}

function formatInvoiceType(type: InvoiceType) {
  const labels: Record<InvoiceType, string> = {
    subscription: 'Subscription',
    trial: 'Trial',
    registration: 'Registration',
    equipment: 'Equipment',
    adjustment: 'Adjustment',
  };

  return labels[type];
}