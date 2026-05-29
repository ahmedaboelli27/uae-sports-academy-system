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
  Eye,
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
  XCircle,
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

type PaymentStatus = 'successful' | 'pending' | 'failed' | 'refunded';
type PaymentMethod = 'card' | 'cash' | 'bankTransfer' | 'online';

interface PaymentItem {
  id: string;
  paymentReference: string;
  invoiceNo: string;
  childId: string;
  childName: string;
  program: string;
  branch: string;
  method: PaymentMethod;
  status: PaymentStatus;
  paymentDate: string;
  amount: number;
  currency: string;
  paidBy: string;
  transactionId: string;
  receiptNo: string;
  notes: string;
}

const chartColors = {
  blue: '#00129B',
  yellow: '#FFD400',
  green: '#16A34A',
  red: '#DC2626',
  orange: '#F97316',
  slate: '#64748B',
  purple: '#7C3AED',
};

const paymentsData: PaymentItem[] = [
  {
    id: 'pay-001',
    paymentReference: 'PAY-2026-0001',
    invoiceNo: 'INV-2026-0001',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    method: 'card',
    status: 'successful',
    paymentDate: '2026-05-02',
    amount: 750,
    currency: 'AED',
    paidBy: 'Parent Account',
    transactionId: 'TXN-CARD-58291',
    receiptNo: 'RCT-2026-0001',
    notes: 'Monthly football subscription paid successfully by card.',
  },
  {
    id: 'pay-002',
    paymentReference: 'PAY-2026-0002',
    invoiceNo: 'INV-2026-0005',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    method: 'cash',
    status: 'successful',
    paymentDate: '2026-04-15',
    amount: 300,
    currency: 'AED',
    paidBy: 'Reception Desk',
    transactionId: 'CASH-APR-015',
    receiptNo: 'RCT-2026-0002',
    notes: 'Cash payment received at the academy reception.',
  },
  {
    id: 'pay-003',
    paymentReference: 'PAY-2026-0003',
    invoiceNo: 'INV-2026-0003',
    childId: 'child-003',
    childName: 'Yousef Khaled',
    program: 'Basketball Skills',
    branch: 'Sharjah Branch',
    method: 'bankTransfer',
    status: 'successful',
    paymentDate: '2026-05-11',
    amount: 1100,
    currency: 'AED',
    paidBy: 'Bank Transfer',
    transactionId: 'BNK-TRF-88912',
    receiptNo: 'RCT-2026-0003',
    notes: 'Term basketball subscription paid by bank transfer with discount applied.',
  },
  {
    id: 'pay-004',
    paymentReference: 'PAY-2026-0004',
    invoiceNo: 'INV-2026-0002',
    childId: 'child-002',
    childName: 'Mariam Khaled',
    program: 'Swimming Academy',
    branch: 'Dubai Main Branch',
    method: 'online',
    status: 'pending',
    paymentDate: '2026-06-01',
    amount: 900,
    currency: 'AED',
    paidBy: 'Online Gateway',
    transactionId: 'ONLINE-PENDING-7710',
    receiptNo: 'Pending',
    notes: 'Online payment is still pending gateway confirmation.',
  },
  {
    id: 'pay-005',
    paymentReference: 'PAY-2026-0005',
    invoiceNo: 'INV-2026-0004',
    childId: 'child-001',
    childName: 'Omar Khaled',
    program: 'Football Development',
    branch: 'Dubai Main Branch',
    method: 'card',
    status: 'failed',
    paymentDate: '2026-04-29',
    amount: 250,
    currency: 'AED',
    paidBy: 'Parent Account',
    transactionId: 'TXN-FAILED-1290',
    receiptNo: '—',
    notes: 'Card payment failed. Invoice remains unpaid.',
  },
];

const monthlyPaymentTrend = [
  { month: 'Jan', paid: 600, count: 1 },
  { month: 'Feb', paid: 650, count: 1 },
  { month: 'Mar', paid: 700, count: 1 },
  { month: 'Apr', paid: 300, count: 1 },
  { month: 'May', paid: 1850, count: 2 },
  { month: 'Jun', paid: 0, count: 0 },
];

function formatCurrency(value: number, currency = 'AED') {
  return `${value.toLocaleString('en-AE')} ${currency}`;
}

function getStatusLabel(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    successful: 'Successful',
    pending: 'Pending',
    failed: 'Failed',
    refunded: 'Refunded',
  };

  return labels[status];
}

function getMethodLabel(method: PaymentMethod) {
  const labels: Record<PaymentMethod, string> = {
    card: 'Card',
    cash: 'Cash',
    bankTransfer: 'Bank Transfer',
    online: 'Online Gateway',
  };

  return labels[method];
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [childFilter, setChildFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all');
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    paymentsData[0]?.id ?? '',
  );

  const children = useMemo(() => {
    return Array.from(new Set(paymentsData.map((payment) => payment.childName)));
  }, []);

  const filteredPayments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return paymentsData.filter((payment) => {
      const matchesSearch =
        !normalizedSearch ||
        payment.paymentReference.toLowerCase().includes(normalizedSearch) ||
        payment.invoiceNo.toLowerCase().includes(normalizedSearch) ||
        payment.childName.toLowerCase().includes(normalizedSearch) ||
        payment.program.toLowerCase().includes(normalizedSearch) ||
        payment.branch.toLowerCase().includes(normalizedSearch) ||
        payment.transactionId.toLowerCase().includes(normalizedSearch) ||
        payment.receiptNo.toLowerCase().includes(normalizedSearch) ||
        payment.notes.toLowerCase().includes(normalizedSearch);

      const matchesChild =
        childFilter === 'all' || payment.childName === childFilter;

      const matchesStatus =
        statusFilter === 'all' || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === 'all' || payment.method === methodFilter;

      return matchesSearch && matchesChild && matchesStatus && matchesMethod;
    });
  }, [childFilter, methodFilter, searchTerm, statusFilter]);

  const selectedPayment =
    paymentsData.find((payment) => payment.id === selectedPaymentId) ??
    filteredPayments[0] ??
    paymentsData[0]!;

  const summary = useMemo(() => {
    const successfulPayments = paymentsData.filter(
      (payment) => payment.status === 'successful',
    );

    const pendingPayments = paymentsData.filter(
      (payment) => payment.status === 'pending',
    );

    const failedPayments = paymentsData.filter(
      (payment) => payment.status === 'failed',
    );

    const refundedPayments = paymentsData.filter(
      (payment) => payment.status === 'refunded',
    );

    const totalPaid = successfulPayments.reduce(
      (total, payment) => total + payment.amount,
      0,
    );

    const pendingAmount = pendingPayments.reduce(
      (total, payment) => total + payment.amount,
      0,
    );

    return {
      totalPaid,
      pendingAmount,
      successfulCount: successfulPayments.length,
      pendingCount: pendingPayments.length,
      failedCount: failedPayments.length,
      refundedCount: refundedPayments.length,
    };
  }, []);

  const statusBreakdown = useMemo(() => {
    return [
      {
        name: 'Successful',
        value: summary.successfulCount,
        color: chartColors.green,
      },
      {
        name: 'Pending',
        value: summary.pendingCount,
        color: chartColors.orange,
      },
      {
        name: 'Failed',
        value: summary.failedCount,
        color: chartColors.red,
      },
      {
        name: 'Refunded',
        value: summary.refundedCount,
        color: chartColors.slate,
      },
    ].filter((item) => item.value > 0);
  }, [summary.failedCount, summary.pendingCount, summary.refundedCount, summary.successfulCount]);

  const methodBreakdown = useMemo(() => {
    const methods: PaymentMethod[] = ['card', 'cash', 'bankTransfer', 'online'];

    return methods
      .map((method) => ({
        name: getMethodLabel(method),
        value: paymentsData.filter((payment) => payment.method === method).length,
        color:
          method === 'card'
            ? chartColors.blue
            : method === 'cash'
              ? chartColors.green
              : method === 'bankTransfer'
                ? chartColors.purple
                : chartColors.yellow,
      }))
      .filter((item) => item.value > 0);
  }, []);

  const childPaymentData = useMemo(() => {
    return children.map((childName) => {
      const childPayments = paymentsData.filter(
        (payment) => payment.childName === childName,
      );

      return {
        name: childName.split(' ')[0],
        paid: childPayments
          .filter((payment) => payment.status === 'successful')
          .reduce((sum, payment) => sum + payment.amount, 0),
        pending: childPayments
          .filter((payment) => payment.status === 'pending')
          .reduce((sum, payment) => sum + payment.amount, 0),
      };
    });
  }, [children]);

  const resetFilters = () => {
    setSearchTerm('');
    setChildFilter('all');
    setStatusFilter('all');
    setMethodFilter('all');
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-[0_30px_90px_rgba(0,18,155,0.28)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.26),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_34%)]" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/45 to-transparent" />

        <div className="relative z-10 grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-[0_14px_35px_rgba(255,212,0,0.26)]">
              <CreditCard className="h-4 w-4" />
              Payment Center
            </div>

            <h1 className="max-w-4xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Payments
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Review payment history, receipts, transaction references, payment
              methods, linked invoices, and payment status across your family
              account.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/parent/invoices"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Receipt className="h-4 w-4" />
                View Invoices
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
              icon={WalletCards}
              label="Total Paid"
              value={formatCurrency(summary.totalPaid)}
              caption={`${summary.successfulCount} successful payment(s)`}
              positive
            />

            <HeroMetricCard
              icon={Clock3}
              label="Pending Amount"
              value={formatCurrency(summary.pendingAmount)}
              caption={`${summary.pendingCount} payment(s) pending`}
              positive={summary.pendingAmount === 0}
            />

            <HeroMetricCard
              icon={CheckCircle2}
              label="Successful"
              value={`${summary.successfulCount}`}
              caption="Completed transactions"
              positive
            />

            <HeroMetricCard
              icon={XCircle}
              label="Failed"
              value={`${summary.failedCount}`}
              caption="Transactions needing attention"
              positive={summary.failedCount === 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={CreditCard}
          title="Total Payments"
          value={`${paymentsData.length}`}
          description="All payment attempts and successful transactions."
          tone="blue"
        />

        <KpiCard
          icon={CheckCircle2}
          title="Successful"
          value={`${summary.successfulCount}`}
          description={formatCurrency(summary.totalPaid)}
          tone="success"
        />

        <KpiCard
          icon={Clock3}
          title="Pending"
          value={`${summary.pendingCount}`}
          description={formatCurrency(summary.pendingAmount)}
          tone={summary.pendingCount > 0 ? 'warning' : 'success'}
        />

        <KpiCard
          icon={XCircle}
          title="Failed"
          value={`${summary.failedCount}`}
          description="Failed payment attempts."
          tone={summary.failedCount > 0 ? 'danger' : 'success'}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_27rem]">
        <div className="space-y-6">
          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-black">
                  <Filter className="h-5 w-5 text-brand-blue dark:text-brand-yellow" />
                  Payment Filters
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Search and filter by child, payment status, method, invoice,
                  transaction ID, or receipt number.
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
                    placeholder="Search payment, invoice, child, transaction..."
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
                  { label: 'Successful', value: 'successful' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Failed', value: 'failed' },
                  { label: 'Refunded', value: 'refunded' },
                ]}
                onChange={(value) =>
                  setStatusFilter(value as PaymentStatus | 'all')
                }
              />

              <FilterSelect
                label="Method"
                value={methodFilter}
                options={[
                  { label: 'All methods', value: 'all' },
                  { label: 'Card', value: 'card' },
                  { label: 'Cash', value: 'cash' },
                  { label: 'Bank Transfer', value: 'bankTransfer' },
                  { label: 'Online Gateway', value: 'online' },
                ]}
                onChange={(value) =>
                  setMethodFilter(value as PaymentMethod | 'all')
                }
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black">Payments List</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review payment date, method, amount, linked invoice, receipt,
                  and transaction reference.
                </p>
              </div>

              <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
                {filteredPayments.length} results
              </div>
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full min-w-[1120px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/60 text-start">
                    <TableHead>Payment</TableHead>
                    <TableHead>Child</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Date / Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      onClick={() => setSelectedPaymentId(payment.id)}
                      className={[
                        'cursor-pointer border-b border-border last:border-b-0 hover:bg-secondary/35',
                        selectedPayment.id === payment.id
                          ? 'bg-brand-yellow/10'
                          : '',
                      ].join(' ')}
                    >
                      <TableCell>
                        <PaymentIdentity payment={payment} />
                      </TableCell>

                      <TableCell>{payment.childName}</TableCell>

                      <TableCell>
                        <div>
                          <p className="font-black">{payment.program}</p>
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {payment.branch}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-black">{payment.paymentDate}</p>
                          <p className="mt-1 text-xs font-semibold text-muted-foreground">
                            {getMethodLabel(payment.method)}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <p className="font-black text-brand-blue dark:text-brand-yellow">
                          {formatCurrency(payment.amount, payment.currency)}
                        </p>
                      </TableCell>

                      <TableCell>
                        <PaymentStatusBadge status={payment.status} />
                      </TableCell>

                      <TableCell>
                        <PaymentActions payment={payment} />
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-5 xl:hidden">
              {filteredPayments.map((payment) => (
                <PaymentMobileCard
                  key={payment.id}
                  payment={payment}
                  active={selectedPayment.id === payment.id}
                  onSelect={() => setSelectedPaymentId(payment.id)}
                />
              ))}
            </div>

            {filteredPayments.length === 0 ? <EmptyState /> : null}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <ChartCard
              icon={BarChart3}
              title="Monthly Payment Trend"
              description="Monthly paid amount and payment count."
            >
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyPaymentTrend}>
                    <defs>
                      <linearGradient
                        id="paymentsTrendGradient"
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
                      dataKey="paid"
                      stroke={chartColors.blue}
                      strokeWidth={4}
                      fill="url(#paymentsTrendGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              icon={Activity}
              title="Payment Status"
              description="Successful, pending, failed, and refunded transactions."
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
                      total={paymentsData.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <ChartCard
              icon={WalletCards}
              title="Payment Methods"
              description="How payments are distributed by payment method."
            >
              <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={methodBreakdown}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={66}
                        outerRadius={104}
                        paddingAngle={5}
                      >
                        {methodBreakdown.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {methodBreakdown.map((item) => (
                    <DistributionRow
                      key={item.name}
                      label={item.name}
                      value={item.value}
                      total={paymentsData.length}
                      color={item.color}
                    />
                  ))}
                </div>
              </div>
            </ChartCard>

            <ChartCard
              icon={UserRound}
              title="Payments by Child"
              description="Paid and pending amounts by child."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={childPaymentData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />

                    <Bar
                      dataKey="paid"
                      fill={chartColors.green}
                      radius={[10, 10, 0, 0]}
                    />

                    <Bar
                      dataKey="pending"
                      fill={chartColors.yellow}
                      radius={[10, 10, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>
        </div>

        <aside className="space-y-6">
          <SelectedPaymentPanel payment={selectedPayment} />

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Payment Attention</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Payments that may require follow-up.
                </p>
              </div>

              <AlertTriangle className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="space-y-3">
              {paymentsData
                .filter(
                  (payment) =>
                    payment.status === 'pending' || payment.status === 'failed',
                )
                .map((payment) => (
                  <AttentionRow key={payment.id} payment={payment} />
                ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">Quick Actions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Common payment shortcuts.
                </p>
              </div>

              <Sparkles className="h-6 w-6 text-brand-yellow" />
            </div>

            <div className="grid gap-3">
              <QuickAction
                icon={Receipt}
                title="Invoices"
                description="Open linked invoices and billing details."
                href="/parent/invoices"
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
                description="Open child linked to selected payment."
                href={`/parent/children/${selectedPayment.childId}`}
              />

              <QuickAction
                icon={MessageSquare}
                title="Contact Finance"
                description="Ask the academy about this payment."
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

function PaymentIdentity({ payment }: { payment: PaymentItem }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
        <CreditCard className="h-6 w-6" />
      </div>

      <div>
        <p className="font-black">{payment.paymentReference}</p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {payment.invoiceNo}
        </p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {payment.receiptNo}
        </p>
      </div>
    </div>
  );
}

function PaymentActions({ payment }: { payment: PaymentItem }) {
  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Link
        to="/parent/invoices"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="View invoice"
      >
        <Eye className="h-4 w-4" />
      </Link>

      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title={`Download ${payment.receiptNo}`}
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}

function PaymentMobileCard({
  payment,
  active,
  onSelect,
}: {
  payment: PaymentItem;
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
        <PaymentIdentity payment={payment} />
        <PaymentStatusBadge status={payment.status} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine label="Child" value={payment.childName} />
        <InfoLine label="Method" value={getMethodLabel(payment.method)} />
        <InfoLine label="Date" value={payment.paymentDate} />
        <InfoLine
          label="Amount"
          value={formatCurrency(payment.amount, payment.currency)}
        />
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-muted-foreground">
        {payment.notes}
      </p>

      <div className="mt-5 flex gap-2">
        <PaymentActions payment={payment} />
      </div>
    </article>
  );
}

function SelectedPaymentPanel({ payment }: { payment: PaymentItem }) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          Selected Payment
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {payment.paymentReference}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {payment.childName} · {payment.program}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <PaymentStatusBadge status={payment.status} />

          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {formatCurrency(payment.amount, payment.currency)}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine icon={Receipt} label="Invoice" value={payment.invoiceNo} />
        <DetailLine icon={UserRound} label="Child" value={payment.childName} />
        <DetailLine icon={FileText} label="Program" value={payment.program} />
        <DetailLine icon={CalendarDays} label="Payment Date" value={payment.paymentDate} />
        <DetailLine icon={WalletCards} label="Method" value={getMethodLabel(payment.method)} />
        <DetailLine icon={CreditCard} label="Transaction ID" value={payment.transactionId} />
        <DetailLine icon={Receipt} label="Receipt No." value={payment.receiptNo} />
        <DetailLine icon={ShieldCheck} label="Notes" value={payment.notes} />

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            to="/parent/invoices"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-black transition hover:bg-secondary"
          >
            <Receipt className="h-4 w-4" />
            Invoice
          </Link>

          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <Download className="h-4 w-4" />
            Receipt
          </button>
        </div>
      </div>
    </aside>
  );
}

function AttentionRow({ payment }: { payment: PaymentItem }) {
  return (
    <article className="rounded-2xl border border-brand-yellow/35 bg-brand-yellow/10 p-4 text-brand-blue dark:text-brand-yellow">
      <div className="flex items-start gap-3">
        {payment.status === 'failed' ? (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        )}

        <div>
          <p className="text-sm font-black">{payment.paymentReference}</p>

          <p className="mt-1 text-xs font-semibold leading-5">
            {payment.childName} · {formatCurrency(payment.amount, payment.currency)} ·{' '}
            {getStatusLabel(payment.status)}.
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
        {percentage}% of payments
      </p>
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const className =
    status === 'successful'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'pending'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : status === 'failed'
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
        <CreditCard className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-black">No payments found</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Try changing the search term, child, payment status, or payment method.
      </p>
    </div>
  );
}