import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  FileText,
  Filter,
  MessageSquare,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  WalletCards,
  XCircle
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'cancelled';
type InvoiceType = 'subscription' | 'registration' | 'trial' | 'makeUp';

interface InvoiceItem {
  id: string;
  invoiceNo: string;
  childId: string;
  childName: string;
  program: string;
  branch: string;
  type: InvoiceType;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate: string;
  amount: number;
  tax: number;
  discount: number;
  total: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  subscriptionCode: string;
  paymentReference: string;
  notes: string;
}

const chartColors = {
  blue: '#00129B',
  yellow: '#FFD400',
  green: '#16A34A',
  red: '#DC2626',
  orange: '#F97316',
  slate: '#64748B',
};

const invoicesData: InvoiceItem[] = [
  {
    id: 'inv-001',
    invoiceNo: 'INV-2026-0001',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    type: 'subscription',
    status: 'paid',
    issueDate: '2026-05-01',
    dueDate: '2026-05-05',
    paidDate: '2026-05-02',
    amount: 750,
    tax: 0,
    discount: 0,
    total: 750,
    paidAmount: 750,
    outstandingAmount: 0,
    currency: 'AED',
    subscriptionCode: 'SUB-2026-001',
    paymentReference: 'PAY-2026-0001',
    notes: 'Monthly football subscription invoice paid by card.',
  },
  {
    id: 'inv-002',
    invoiceNo: 'INV-2026-0002',
    childId: 'child-002',
    childName: 'Mariam Khaled',
    program: 'Swimming Academy',
    branch: 'Dubai Main Branch',
    type: 'subscription',
    status: 'pending',
    issueDate: '2026-05-25',
    dueDate: '2026-06-05',
    paidDate: '—',
    amount: 900,
    tax: 0,
    discount: 0,
    total: 900,
    paidAmount: 0,
    outstandingAmount: 900,
    currency: 'AED',
    subscriptionCode: 'SUB-2026-002',
    paymentReference: '—',
    notes: 'Swimming subscription renewal invoice awaiting payment.',
  },
  {
    id: 'inv-003',
    invoiceNo: 'INV-2026-0003',
    childId: 'child-003',
    childName: 'Yousef Khaled',
    program: 'Basketball Skills',
    branch: 'Sharjah Branch',
    type: 'subscription',
    status: 'paid',
    issueDate: '2026-05-10',
    dueDate: '2026-05-15',
    paidDate: '2026-05-11',
    amount: 1200,
    tax: 0,
    discount: 100,
    total: 1100,
    paidAmount: 1100,
    outstandingAmount: 0,
    currency: 'AED',
    subscriptionCode: 'SUB-2026-003',
    paymentReference: 'PAY-2026-0003',
    notes: 'Term basketball subscription paid with discount applied.',
  },
  {
    id: 'inv-004',
    invoiceNo: 'INV-2026-0004',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    type: 'makeUp',
    status: 'overdue',
    issueDate: '2026-04-20',
    dueDate: '2026-04-30',
    paidDate: '—',
    amount: 250,
    tax: 0,
    discount: 0,
    total: 250,
    paidAmount: 0,
    outstandingAmount: 250,
    currency: 'AED',
    subscriptionCode: 'MAKEUP-2026-001',
    paymentReference: '—',
    notes: 'Additional make-up session invoice is overdue.',
  },
];

const monthlyBillingTrend = [
  { month: 'Jan', invoiced: 600, paid: 600 },
  { month: 'Feb', invoiced: 650, paid: 650 },
  { month: 'Mar', invoiced: 700, paid: 700 },
  { month: 'Apr', invoiced: 950, paid: 700 },
  { month: 'May', invoiced: 2950, paid: 1850 },
  { month: 'Jun', invoiced: 900, paid: 0 },
];

function formatCurrency(value: number, currency = 'AED') {
  return `${value.toLocaleString('en-AE')} ${currency}`;
}

function getStatusLabel(status: InvoiceStatus) {
  const labels: Record<InvoiceStatus, string> = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
  };

  return labels[status];
}

function getTypeLabel(type: InvoiceType) {
  const labels: Record<InvoiceType, string> = {
    subscription: 'Subscription',
    registration: 'Registration',
    trial: 'Trial',
    makeUp: 'Make-up Session',
  };

  return labels[type];
}

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [childFilter, setChildFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<InvoiceType | 'all'>('all');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(
    invoicesData[0]?.id ?? '',
  );

  const children = useMemo(() => {
    return Array.from(new Set(invoicesData.map((invoice) => invoice.childName)));
  }, []);

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return invoicesData.filter((invoice) => {
      const matchesSearch =
        !normalizedSearch ||
        invoice.invoiceNo.toLowerCase().includes(normalizedSearch) ||
        invoice.childName.toLowerCase().includes(normalizedSearch) ||
        invoice.program.toLowerCase().includes(normalizedSearch) ||
        invoice.branch.toLowerCase().includes(normalizedSearch) ||
        invoice.subscriptionCode.toLowerCase().includes(normalizedSearch) ||
        invoice.paymentReference.toLowerCase().includes(normalizedSearch) ||
        invoice.notes.toLowerCase().includes(normalizedSearch);

      const matchesChild =
        childFilter === 'all' || invoice.childName === childFilter;

      const matchesStatus =
        statusFilter === 'all' || invoice.status === statusFilter;

      const matchesType = typeFilter === 'all' || invoice.type === typeFilter;

      return matchesSearch && matchesChild && matchesStatus && matchesType;
    });
  }, [childFilter, searchTerm, statusFilter, typeFilter]);

  const selectedInvoice =
    invoicesData.find((invoice) => invoice.id === selectedInvoiceId) ??
    filteredInvoices[0] ??
    invoicesData[0]!;

  const summary = useMemo(() => {
    const totalInvoiced = invoicesData.reduce(
      (total, invoice) => total + invoice.total,
      0,
    );

    const paidAmount = invoicesData.reduce(
      (total, invoice) => total + invoice.paidAmount,
      0,
    );

    const outstandingAmount = invoicesData.reduce(
      (total, invoice) => total + invoice.outstandingAmount,
      0,
    );

    const paidCount = invoicesData.filter(
      (invoice) => invoice.status === 'paid',
    ).length;

    const pendingCount = invoicesData.filter(
      (invoice) => invoice.status === 'pending',
    ).length;

    const overdueCount = invoicesData.filter(
      (invoice) => invoice.status === 'overdue',
    ).length;

    return {
      totalInvoiced,
      paidAmount,
      outstandingAmount,
      paidCount,
      pendingCount,
      overdueCount,
    };
  }, []);

  const statusBreakdown = useMemo(() => {
    return [
      {
        name: 'Paid',
        value: summary.paidCount,
        color: chartColors.green,
      },
      {
        name: 'Pending',
        value: summary.pendingCount,
        color: chartColors.orange,
      },
      {
        name: 'Overdue',
        value: summary.overdueCount,
        color: chartColors.red,
      },
    ].filter((item) => item.value > 0);
  }, [summary.overdueCount, summary.paidCount, summary.pendingCount]);

  const childBillingData = useMemo(() => {
    return children.map((childName) => {
      const childInvoices = invoicesData.filter(
        (invoice) => invoice.childName === childName,
      );

      return {
        name: childName.split(' ')[0],
        total: childInvoices.reduce((sum, invoice) => sum + invoice.total, 0),
        outstanding: childInvoices.reduce(
          (sum, invoice) => sum + invoice.outstandingAmount,
          0,
        ),
      };
    });
  }, [children]);

  const resetFilters = () => {
    setSearchTerm('');
    setChildFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <Receipt className="h-4 w-4" />
              Family Billing
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Invoices
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Review paid, pending, and overdue invoices for your children,
              download billing records, and continue payments from one organized
              parent finance workspace.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/parent/payments"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <CreditCard className="h-4 w-4" />
                Payment History
              </Link>

              <Link
                to="/parent/messages"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <MessageSquare className="h-4 w-4" />
                Contact Finance
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMetricCard
              icon={Receipt}
              label="Total Invoiced"
              value={formatCurrency(summary.totalInvoiced)}
              caption={`${invoicesData.length} invoices issued`}
              positive
            />

            <HeroMetricCard
              icon={CheckCircle2}
              label="Paid Amount"
              value={formatCurrency(summary.paidAmount)}
              caption={`${summary.paidCount} invoice(s) paid`}
              positive
            />

            <HeroMetricCard
              icon={WalletCards}
              label="Outstanding"
              value={formatCurrency(summary.outstandingAmount)}
              caption="Pending and overdue balance"
              positive={summary.outstandingAmount === 0}
            />

            <HeroMetricCard
              icon={AlertTriangle}
              label="Overdue"
              value={`${summary.overdueCount}`}
              caption="Invoices requiring action"
              positive={summary.overdueCount === 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={Receipt}
          title="Total Invoices"
          value={`${invoicesData.length}`}
          description="All family invoices issued by the academy."
          tone="blue"
        />

        <KpiCard
          icon={CheckCircle2}
          title="Paid"
          value={`${summary.paidCount}`}
          description={formatCurrency(summary.paidAmount)}
          tone="success"
        />

        <KpiCard
          icon={Clock3}
          title="Pending"
          value={`${summary.pendingCount}`}
          description="Invoices waiting for payment."
          tone={summary.pendingCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={XCircle}
          title="Overdue"
          value={`${summary.overdueCount}`}
          description="Invoices past the due date."
          tone={summary.overdueCount > 0 ? 'danger' : 'success'}
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
                  Search and filter invoices by child, status, type, program,
                  invoice number, or payment reference.
                </p>
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-black transition hover:border-brand-yellow hover:bg-brand-yellow/10"
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
                    placeholder="Search invoice, child, program, reference..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Child"
                value={childFilter}
                options={[
                  { label: 'All children', value: 'all' },
                  ...children.map((child) => ({
                    label: child,
                    value: child,
                  })),
                ]}
                onChange={setChildFilter}
              />

              <FilterSelect
                label="Status"
                value={statusFilter}
                options={[
                  { label: 'All statuses', value: 'all' },
                  { label: 'Paid', value: 'paid' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Overdue', value: 'overdue' },
                  { label: 'Cancelled', value: 'cancelled' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as InvoiceStatus | 'all')
                }
              />

              <FilterSelect
                label="Type"
                value={typeFilter}
                options={[
                  { label: 'All types', value: 'all' },
                  { label: 'Subscription', value: 'subscription' },
                  { label: 'Registration', value: 'registration' },
                  { label: 'Trial', value: 'trial' },
                  { label: 'Make-up Session', value: 'makeUp' },
                ]}
                onChange={(value) =>
                  setTypeFilter(value as InvoiceType | 'all')
                }
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black">Invoices List</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review invoice status, amount, due date, payment reference,
                  and linked subscription.
                </p>
              </div>

              <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
                {filteredInvoices.length} results
              </div>
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1100px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/60 text-start">
                    <TableHead>Invoice</TableHead>
                    <TableHead>Child</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </tr>
                </thead>

                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      onClick={() => setSelectedInvoiceId(invoice.id)}
                      className={[
                        'cursor-pointer border-b border-border last:border-b-0 hover:bg-secondary/35',
                        selectedInvoice.id === invoice.id
                          ? 'bg-brand-yellow/10'
                          : '',
                      ].join(' ')}
                    >
                      <TableCell>
                        <InvoiceIdentity invoice={invoice} />
                      </TableCell>

                      <TableCell>{invoice.childName}</TableCell>

                      <TableCell>
                        <div>
                          <p className="font-black">{invoice.program}</p>
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {invoice.branch}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-black">Issued: {invoice.issueDate}</p>
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            Due: {invoice.dueDate}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <AmountBlock invoice={invoice} />
                      </TableCell>

                      <TableCell>
                        <InvoiceStatusBadge status={invoice.status} />
                      </TableCell>

                      <TableCell>
                        <InvoiceActions invoice={invoice} />
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
                  active={selectedInvoice.id === invoice.id}
                  onSelect={() => setSelectedInvoiceId(invoice.id)}
                />
              ))}
            </div>

            {filteredInvoices.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Monthly Billing Trend"
              description="Issued invoices compared with paid amounts by month."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyBillingTrend}>
                    <defs>
                      <linearGradient
                        id="invoiceBillingGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={chartColors.blue}
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="95%"
                          stopColor={chartColors.blue}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="invoiced"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#invoiceBillingGradient)"
                    />

                    <Area
                      type="monotone"
                      dataKey="paid"
                      stroke={chartColors.green}
                      strokeWidth={4}
                      fill="transparent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Activity}
              title="Invoice Status"
              description="Paid, pending, and overdue invoice distribution."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {statusBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {statusBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={invoicesData.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <ChartCard
            icon={WalletCards}
            title="Billing by Child"
            description="Total billed and outstanding amounts for each child."
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={childBillingData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />

                  <Bar
                    dataKey="total"
                    fill={chartColors.blue}
                    radius={[10, 10, 0, 0]}
                  />

                  <Bar
                    dataKey="outstanding"
                    fill={chartColors.yellow}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <aside className="space-y-6">
          <SelectedInvoicePanel invoice={selectedInvoice} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Payment Attention</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Invoices that may require action.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {invoicesData
                .filter(
                  (invoice) =>
                    invoice.status === 'pending' ||
                    invoice.status === 'overdue',
                )
                .map((invoice) => (
                  <AttentionRow key={invoice.id} invoice={invoice} />
                ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Common billing shortcuts.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={CreditCard}
                title="Payments"
                description="Open payment history and receipts."
                href="/parent/payments"
              />

              <QuickAction
                icon={WalletCards}
                title="Subscriptions"
                description="Review active subscriptions and renewals."
                href="/parent/subscriptions"
              />

              <QuickAction
                icon={UserRound}
                title="Child Profile"
                description="Open the child linked to selected invoice."
                href={`/parent/children/${selectedInvoice.childId}`}
              />

              <QuickAction
                icon={MessageSquare}
                title="Contact Finance"
                description="Ask the academy about this invoice."
                href="/parent/messages"
              />
            </div>
          </section>
        </aside>
      </section>
    </main>
  );
}

function HeroMetricCard({
  icon: Icon,
  label,
  value,
  caption,
  positive,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  positive: boolean;
}) {
  return (
    <article className="rounded-[1.75rem] bg-white/10 p-4 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={[
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black',
            positive
              ? 'bg-green-400/15 text-green-200'
              : 'bg-red-400/15 text-red-200',
          ].join(' ')}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
          Live
        </span>
      </div>

      <p className="text-xs font-black uppercase tracking-[0.15em] text-white/55">
        {label}
      </p>

      <h3 className="mt-2 line-clamp-1 text-xl font-black text-white">
        {value}
      </h3>

      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-white/60">
        {caption}
      </p>
    </article>
  );
}

function KpiCard({
  icon: Icon,
  title,
  value,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
  tone: 'blue' | 'success' | 'warning' | 'danger';
}) {
  const toneClasses = {
    blue: 'bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue',
    success:
      'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    warning:
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  };

  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="absolute -end-10 -top-10 h-24 w-24 rounded-full bg-brand-yellow/10 blur-2xl" />

      <div
        className={`relative flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <p className="relative mt-5 text-sm font-bold text-muted-foreground">
        {title}
      </p>

      <p className="relative mt-2 text-3xl font-black text-brand-blue dark:text-white">
        {value}
      </p>

      <p className="relative mt-2 text-xs font-semibold leading-5 text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

function InvoiceIdentity({ invoice }: { invoice: InvoiceItem }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <Receipt className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{invoice.invoiceNo}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {getTypeLabel(invoice.type)}
        </p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {invoice.subscriptionCode}
        </p>
      </div>
    </div>
  );
}

function AmountBlock({ invoice }: { invoice: InvoiceItem }) {
  return (
    <div>
      <p className="font-black text-brand-blue dark:text-brand-yellow">
        {formatCurrency(invoice.total, invoice.currency)}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        Paid: {formatCurrency(invoice.paidAmount, invoice.currency)}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        Due: {formatCurrency(invoice.outstandingAmount, invoice.currency)}
      </p>
    </div>
  );
}

function InvoiceActions({ invoice }: { invoice: InvoiceItem }) {
  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Link
        to="/parent/payments"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="Pay or view payment"
      >
        <CreditCard className="h-4 w-4" />
      </Link>

      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={`Download ${invoice.invoiceNo}`}
      >
        <Download className="h-4 w-4" />
      </button>
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
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine label="Child" value={invoice.childName} />
        <InfoLine label="Program" value={invoice.program} />
        <InfoLine label="Due Date" value={invoice.dueDate} />
        <InfoLine label="Total" value={formatCurrency(invoice.total, invoice.currency)} />
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-muted-foreground">
        {invoice.notes}
      </p>

      <div className="mt-5 flex gap-2">
        <InvoiceActions invoice={invoice} />
      </div>
    </article>
  );
}

function SelectedInvoicePanel({ invoice }: { invoice: InvoiceItem }) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <Receipt className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Invoice
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {invoice.invoiceNo}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {invoice.childName} · {invoice.program}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <InvoiceStatusBadge status={invoice.status} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {formatCurrency(invoice.total, invoice.currency)}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={UserRound} label="Child" value={invoice.childName} />
        <DetailLine icon={FileText} label="Type" value={getTypeLabel(invoice.type)} />
        <DetailLine icon={CalendarDays} label="Issue / Due" value={`${invoice.issueDate} → ${invoice.dueDate}`} />
        <DetailLine icon={WalletCards} label="Amount" value={formatCurrency(invoice.amount, invoice.currency)} />
        <DetailLine icon={WalletCards} label="Discount / Tax" value={`${formatCurrency(invoice.discount, invoice.currency)} discount · ${formatCurrency(invoice.tax, invoice.currency)} tax`} />
        <DetailLine icon={Receipt} label="Total" value={formatCurrency(invoice.total, invoice.currency)} />
        <DetailLine icon={CreditCard} label="Payment Reference" value={invoice.paymentReference} />
        <DetailLine icon={ShieldCheck} label="Notes" value={invoice.notes} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/parent/payments"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <CreditCard className="h-4 w-4" />
            Pay
          </Link>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </aside>
  );
}

function AttentionRow({ invoice }: { invoice: InvoiceItem }) {
  return (
    <article className="rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue dark:text-brand-yellow">
      <div className="flex items-start gap-3">
        {invoice.status === 'overdue' ? (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        )}

        <div>
          <p className="text-sm font-black">{invoice.invoiceNo}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {invoice.childName} has{' '}
            {formatCurrency(invoice.outstandingAmount, invoice.currency)} due.
            Due date: {invoice.dueDate}.
          </p>
        </div>
      </div>
    </article>
  );
}

function ChartCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="absolute -end-12 -top-12 h-32 w-32 rounded-full bg-brand-yellow/10 blur-3xl" />

      <div className="relative mb-5 flex gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-xl font-black">{title}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="relative">{children}</div>
    </section>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow/10 hover:shadow-sm dark:bg-white/[0.04]"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue text-white transition group-hover:scale-105 dark:bg-brand-yellow dark:text-brand-blue">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-black">{title}</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
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

function DistributionRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border bg-background p-3 dark:bg-white/[0.04]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: color }}
          />

          <span className="truncate text-sm font-black">{label}</span>
        </div>

        <span className="text-xs font-black text-muted-foreground">
          {value}
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>

      <p className="mt-1 text-xs font-bold text-muted-foreground">
        {percentage}% of invoices
      </p>
    </div>
  );
}

function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const className =
    status === 'paid'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'pending'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : status === 'overdue'
          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}>
      {getStatusLabel(status)}
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

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary text-muted-foreground">
        <Receipt className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No invoices found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, child, invoice status, or invoice type.
      </p>
    </div>
  );
}