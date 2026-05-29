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
  Pencil,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Undo2,
  UserRound,
  Users,
  WalletCards,
  XCircle,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

type PaymentStatus =
  | 'successful'
  | 'pending'
  | 'failed'
  | 'refunded'
  | 'partiallyRefunded'
  | 'cancelled';

type PaymentMethod =
  | 'cash'
  | 'card'
  | 'bankTransfer'
  | 'onlinePayment'
  | 'wallet'
  | 'cheque';

type PaymentSource =
  | 'invoice'
  | 'subscription'
  | 'registration'
  | 'trial'
  | 'manual';

interface PaymentItem {
  id: string;
  paymentReference: string;
  receiptNumber: string;
  invoiceNumber: string;
  subscriptionCode: string;
  studentName: string;
  studentCode: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  programName: string;
  branchName: string;
  status: PaymentStatus;
  method: PaymentMethod;
  source: PaymentSource;
  paymentDate: string;
  settlementDate: string;
  amount: number;
  refundedAmount: number;
  netAmount: number;
  currency: string;
  processedBy: string;
  gatewayReference: string;
  notes: string;
}

const initialPayments: PaymentItem[] = [
  {
    id: 'pay-001',
    paymentReference: 'PAY-2026-0001',
    receiptNumber: 'REC-2026-0001',
    invoiceNumber: 'INV-2026-0001',
    subscriptionCode: 'SUB-2026-001',
    studentName: 'Omar Khaled',
    studentCode: 'STU-1001',
    parentName: 'Khaled Hassan',
    parentPhone: '+971 50 123 4567',
    parentEmail: 'khaled.parent@example.com',
    programName: 'Football Development',
    branchName: 'Dubai Main Branch',
    status: 'successful',
    method: 'card',
    source: 'invoice',
    paymentDate: '2026-05-02',
    settlementDate: '2026-05-03',
    amount: 750,
    refundedAmount: 0,
    netAmount: 750,
    currency: 'AED',
    processedBy: 'Finance Admin',
    gatewayReference: 'CARD-TXN-893221',
    notes: 'Card payment received for monthly football subscription.',
  },
  {
    id: 'pay-002',
    paymentReference: 'PAY-2026-0002',
    receiptNumber: 'REC-2026-0002',
    invoiceNumber: 'INV-2026-0003',
    subscriptionCode: 'SUB-2026-003',
    studentName: 'Yousef Ahmed',
    studentCode: 'STU-1003',
    parentName: 'Ahmed Nasser',
    parentPhone: '+971 52 987 1100',
    parentEmail: 'ahmed.nasser@example.com',
    programName: 'Basketball Skills',
    branchName: 'Sharjah Branch',
    status: 'successful',
    method: 'bankTransfer',
    source: 'invoice',
    paymentDate: '2026-05-21',
    settlementDate: '2026-05-22',
    amount: 1200,
    refundedAmount: 0,
    netAmount: 1200,
    currency: 'AED',
    processedBy: 'Finance Admin',
    gatewayReference: 'BT-REF-778210',
    notes: 'Partial bank transfer received. Remaining invoice balance still pending.',
  },
  {
    id: 'pay-003',
    paymentReference: 'PAY-2026-0003',
    receiptNumber: 'REC-2026-0003',
    invoiceNumber: 'INV-2026-0004',
    subscriptionCode: 'SUB-2026-004',
    studentName: 'Sara Mohamed',
    studentCode: 'STU-1004',
    parentName: 'Mohamed Sami',
    parentPhone: '+971 58 300 9090',
    parentEmail: 'm.sami@example.com',
    programName: 'Fitness & Movement',
    branchName: 'Dubai Main Branch',
    status: 'successful',
    method: 'cash',
    source: 'registration',
    paymentDate: '2026-05-15',
    settlementDate: '2026-05-15',
    amount: 650,
    refundedAmount: 0,
    netAmount: 650,
    currency: 'AED',
    processedBy: 'Branch Reception',
    gatewayReference: 'CASH-BRANCH-001',
    notes: 'Cash payment collected at Dubai branch.',
  },
  {
    id: 'pay-004',
    paymentReference: 'PAY-2026-0004',
    receiptNumber: 'REC-2026-0004',
    invoiceNumber: 'INV-2026-0002',
    subscriptionCode: 'SUB-2026-002',
    studentName: 'Mariam Ali',
    studentCode: 'STU-1002',
    parentName: 'Ali Mansour',
    parentPhone: '+971 55 222 8844',
    parentEmail: 'ali.mansour@example.com',
    programName: 'Swimming Academy',
    branchName: 'Abu Dhabi Branch',
    status: 'pending',
    method: 'onlinePayment',
    source: 'invoice',
    paymentDate: '2026-05-26',
    settlementDate: 'Pending',
    amount: 900,
    refundedAmount: 0,
    netAmount: 0,
    currency: 'AED',
    processedBy: 'Online Gateway',
    gatewayReference: 'ONLINE-PENDING-9120',
    notes: 'Online payment started but not confirmed yet.',
  },
  {
    id: 'pay-005',
    paymentReference: 'PAY-2026-0005',
    receiptNumber: 'REC-2026-0005',
    invoiceNumber: 'INV-2026-0006',
    subscriptionCode: 'SUB-2026-006',
    studentName: 'Lina Kareem',
    studentCode: 'STU-1006',
    parentName: 'Kareem Fawzy',
    parentPhone: '+971 54 111 6677',
    parentEmail: 'kareem@example.com',
    programName: 'Swimming Academy',
    branchName: 'Dubai Main Branch',
    status: 'refunded',
    method: 'card',
    source: 'trial',
    paymentDate: '2026-05-10',
    settlementDate: '2026-05-11',
    amount: 300,
    refundedAmount: 300,
    netAmount: 0,
    currency: 'AED',
    processedBy: 'Finance Admin',
    gatewayReference: 'REFUND-CARD-3321',
    notes: 'Trial booking payment refunded after parent cancellation.',
  },
  {
    id: 'pay-006',
    paymentReference: 'PAY-2026-0006',
    receiptNumber: 'REC-2026-0006',
    invoiceNumber: 'INV-2026-0007',
    subscriptionCode: 'SUB-2026-007',
    studentName: 'Hamdan Saeed',
    studentCode: 'STU-1005',
    parentName: 'Saeed Al Nuaimi',
    parentPhone: '+971 56 777 3131',
    parentEmail: 'saeed@example.com',
    programName: 'Advanced Football Pathway',
    branchName: 'Al Ain Branch',
    status: 'failed',
    method: 'card',
    source: 'invoice',
    paymentDate: '2026-05-18',
    settlementDate: 'Failed',
    amount: 1100,
    refundedAmount: 0,
    netAmount: 0,
    currency: 'AED',
    processedBy: 'Online Gateway',
    gatewayReference: 'FAILED-CARD-1002',
    notes: 'Card payment failed. Parent should be contacted for another payment method.',
  },
];

const statusOptions: Array<{ label: string; value: PaymentStatus | 'all' }> = [
  { label: 'All statuses', value: 'all' },
  { label: 'Successful', value: 'successful' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Partially Refunded', value: 'partiallyRefunded' },
  { label: 'Cancelled', value: 'cancelled' },
];

const methodOptions: Array<{ label: string; value: PaymentMethod | 'all' }> = [
  { label: 'All methods', value: 'all' },
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'Bank Transfer', value: 'bankTransfer' },
  { label: 'Online Payment', value: 'onlinePayment' },
  { label: 'Wallet', value: 'wallet' },
  { label: 'Cheque', value: 'cheque' },
];

const sourceOptions: Array<{ label: string; value: PaymentSource | 'all' }> = [
  { label: 'All sources', value: 'all' },
  { label: 'Invoice', value: 'invoice' },
  { label: 'Subscription', value: 'subscription' },
  { label: 'Registration', value: 'registration' },
  { label: 'Trial', value: 'trial' },
  { label: 'Manual', value: 'manual' },
];

export default function FinancePaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    initialPayments[0]?.id ?? '',
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<PaymentSource | 'all'>('all');
  const [savedMessage, setSavedMessage] = useState('');

  const filteredPayments = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !normalizedSearch ||
        payment.paymentReference.toLowerCase().includes(normalizedSearch) ||
        payment.receiptNumber.toLowerCase().includes(normalizedSearch) ||
        payment.invoiceNumber.toLowerCase().includes(normalizedSearch) ||
        payment.subscriptionCode.toLowerCase().includes(normalizedSearch) ||
        payment.studentName.toLowerCase().includes(normalizedSearch) ||
        payment.studentCode.toLowerCase().includes(normalizedSearch) ||
        payment.parentName.toLowerCase().includes(normalizedSearch) ||
        payment.parentPhone.toLowerCase().includes(normalizedSearch) ||
        payment.parentEmail.toLowerCase().includes(normalizedSearch) ||
        payment.programName.toLowerCase().includes(normalizedSearch) ||
        payment.branchName.toLowerCase().includes(normalizedSearch) ||
        payment.gatewayReference.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' || payment.status === statusFilter;

      const matchesMethod =
        methodFilter === 'all' || payment.method === methodFilter;

      const matchesSource =
        sourceFilter === 'all' || payment.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesMethod && matchesSource;
    });
  }, [methodFilter, payments, searchTerm, sourceFilter, statusFilter]);

  const selectedPayment =
    payments.find((payment) => payment.id === selectedPaymentId) ??
    filteredPayments[0] ??
    payments[0];

  const successfulCount = payments.filter(
    (payment) => payment.status === 'successful',
  ).length;

  const pendingCount = payments.filter(
    (payment) => payment.status === 'pending',
  ).length;

  const failedCount = payments.filter(
    (payment) => payment.status === 'failed',
  ).length;

  const refundedCount = payments.filter(
    (payment) =>
      payment.status === 'refunded' || payment.status === 'partiallyRefunded',
  ).length;

  const collectedAmount = payments.reduce(
    (total, payment) => total + payment.netAmount,
    0,
  );

  const refundedAmount = payments.reduce(
    (total, payment) => total + payment.refundedAmount,
    0,
  );

  const grossAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0,
  );

  const currency = payments[0]?.currency ?? 'AED';

  const updatePaymentStatus = (id: string, status: PaymentStatus) => {
    setPayments((current) =>
      current.map((payment) => {
        if (payment.id !== id) {
          return payment;
        }

        if (status === 'successful') {
          return {
            ...payment,
            status,
            settlementDate: new Date().toISOString().slice(0, 10),
            netAmount: payment.amount - payment.refundedAmount,
          };
        }

        if (status === 'failed' || status === 'cancelled') {
          return {
            ...payment,
            status,
            settlementDate: status === 'failed' ? 'Failed' : payment.settlementDate,
            netAmount: 0,
          };
        }

        return {
          ...payment,
          status,
        };
      }),
    );

    setSavedMessage(`Payment ${id} updated to ${formatPaymentStatus(status)}.`);
  };

  const refundPayment = (id: string) => {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === id
          ? {
            ...payment,
            status: 'refunded',
            refundedAmount: payment.amount,
            netAmount: 0,
            settlementDate: new Date().toISOString().slice(0, 10),
          }
          : payment,
      ),
    );

    setSavedMessage(`Payment ${id} marked as refunded.`);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMethodFilter('all');
    setSourceFilter('all');
    setSavedMessage('');
  };

  const refreshPayments = () => {
    setPayments(initialPayments);
    setSelectedPaymentId(initialPayments[0]?.id ?? '');
    setSavedMessage('Payments restored to the frontend mock dataset.');
  };

  return (
    <main className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white shadow-2xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.24),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_32%)]" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-brand-blue shadow-xl">
              <CreditCard className="h-4 w-4" />
              Finance Transactions
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Payments Management
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
              Track incoming payments, receipts, payment methods, refunds,
              gateway references, invoice links, settlement dates, and finance
              follow-up from one professional payment workspace.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={refreshPayments}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>

              <Link
                to="/admin/finance/payments/new"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue shadow-[0_18px_35px_rgba(255,212,0,0.25)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                <Plus className="h-4 w-4" />
                New Payment
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <HeroMetric
              icon={CreditCard}
              label="Total Payments"
              value={`${payments.length}`}
            />
            <HeroMetric
              icon={CheckCircle2}
              label="Successful"
              value={`${successfulCount}`}
            />
            <HeroMetric icon={Clock3} label="Pending" value={`${pendingCount}`} />
            <HeroMetric icon={Undo2} label="Refunded" value={`${refundedCount}`} />
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
          icon={CreditCard}
          label="Total Payments"
          value={payments.length}
          tone="blue"
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Successful"
          value={successfulCount}
          tone="green"
        />

        <SummaryCard
          icon={Clock3}
          label="Pending"
          value={pendingCount}
          tone="yellow"
        />

        <SummaryCard
          icon={XCircle}
          label="Failed"
          value={failedCount}
          tone="red"
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <MetricCard
          icon={WalletCards}
          title="Collected Net Amount"
          value={`${collectedAmount} ${currency}`}
          description="Total net amount received after refunds."
        />

        <MetricCard
          icon={Undo2}
          title="Refunded Amount"
          value={`${refundedAmount} ${currency}`}
          description="Total amount refunded to parents or customers."
        />

        <MetricCard
          icon={Sparkles}
          title="Gross Payment Volume"
          value={`${grossAmount} ${currency}`}
          description="Total original payment value before refunds."
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
                  Search and filter payments by receipt, invoice, parent,
                  student, method, source, and transaction status.
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
                    placeholder="Search payment, receipt, invoice, parent, student..."
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10"
                  />
                </div>
              </label>

              <FilterSelect
                label="Payment Status"
                value={statusFilter}
                options={statusOptions}
                onChange={(value) =>
                  setStatusFilter(value as PaymentStatus | 'all')
                }
              />

              <FilterSelect
                label="Payment Method"
                value={methodFilter}
                options={methodOptions}
                onChange={(value) =>
                  setMethodFilter(value as PaymentMethod | 'all')
                }
              />

              <FilterSelect
                label="Payment Source"
                value={sourceFilter}
                options={sourceOptions}
                onChange={(value) =>
                  setSourceFilter(value as PaymentSource | 'all')
                }
              />
            </div>
          </section>

          <section className="rounded-[2rem] border border-border bg-card shadow-sm">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black">Payments List</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review payment status, receipt references, settlement dates,
                  payment methods, and linked invoices.
                </p>
              </div>

              <div className="rounded-full bg-secondary px-4 py-2 text-sm font-black text-secondary-foreground">
                {filteredPayments.length} results
              </div>
            </div>

            {filteredPayments.length > 0 ? (
              <>
                <div className="hidden overflow-x-auto xl:block">
                  <table className="w-full min-w-[1320px] border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-secondary/60 text-start">
                        <TableHead>Payment</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Parent</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          onClick={() => {
                            setSelectedPaymentId(payment.id);
                            setSavedMessage('');
                          }}
                          className={[
                            'cursor-pointer border-b border-border last:border-b-0 hover:bg-secondary/35',
                            selectedPayment?.id === payment.id
                              ? 'bg-brand-yellow/10'
                              : '',
                          ].join(' ')}
                        >
                          <TableCell>
                            <PaymentIdentity payment={payment} />
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">{payment.studentName}</p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {payment.studentCode}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">{payment.parentName}</p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {payment.parentPhone}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">{payment.invoiceNumber}</p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {payment.subscriptionCode}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">
                                {formatPaymentMethod(payment.method)}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                {formatPaymentSource(payment.source)}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <PaymentStatusBadge status={payment.status} />
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-black">
                                Paid: {payment.paymentDate}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                                Settled: {payment.settlementDate}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <AmountBlock payment={payment} />
                          </TableCell>

                          <TableCell>
                            <PaymentActions paymentId={payment.id} />
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
                      active={selectedPayment?.id === payment.id}
                      onSelect={() => {
                        setSelectedPaymentId(payment.id);
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
          {selectedPayment ? (
            <PaymentDetailsPanel
              payment={selectedPayment}
              onMarkSuccessful={() =>
                updatePaymentStatus(selectedPayment.id, 'successful')
              }
              onMarkFailed={() =>
                updatePaymentStatus(selectedPayment.id, 'failed')
              }
              onCancel={() =>
                updatePaymentStatus(selectedPayment.id, 'cancelled')
              }
              onRefund={() => refundPayment(selectedPayment.id)}
            />
          ) : null}

          <StatusCard
            icon={ShieldCheck}
            title="Payment Tracking Ready"
            description="This screen is currently frontend mock mode. Later it can connect to payment and receipt endpoints without changing the structure."
            tone="success"
          />

          <StatusCard
            icon={Clock3}
            title="Finance Attention"
            description={`${pendingCount} payments are pending, ${failedCount} failed, and ${refundedCount} refunded or partially refunded.`}
            tone="warning"
          />
        </aside>
      </section>
    </main>
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
          {payment.receiptNumber}
        </p>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {payment.gatewayReference}
        </p>
      </div>
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
        <PaymentActions paymentId={payment.id} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoLine label="Student" value={payment.studentName} />
        <InfoLine label="Parent" value={payment.parentName} />
        <InfoLine label="Invoice" value={payment.invoiceNumber} />
        <InfoLine label="Method" value={formatPaymentMethod(payment.method)} />
        <InfoLine label="Paid Date" value={payment.paymentDate} />
        <InfoLine
          label="Net Amount"
          value={`${payment.netAmount} ${payment.currency}`}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <PaymentStatusBadge status={payment.status} />
        <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-black text-secondary-foreground">
          {formatPaymentSource(payment.source)}
        </span>
      </div>
    </article>
  );
}

function PaymentDetailsPanel({
  payment,
  onMarkSuccessful,
  onMarkFailed,
  onCancel,
  onRefund,
}: {
  payment: PaymentItem;
  onMarkSuccessful: () => void;
  onMarkFailed: () => void;
  onCancel: () => void;
  onRefund: () => void;
}) {
  return (
    <aside className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
      <div className="bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
          <CreditCard className="h-7 w-7" />
        </div>

        <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-yellow">
          {payment.paymentReference}
        </p>

        <h2 className="mt-2 text-2xl font-black leading-tight">
          {payment.parentName}
        </h2>

        <p className="mt-3 text-sm font-semibold leading-7 text-white/72">
          {payment.studentName} • {payment.invoiceNumber} •{' '}
          {formatPaymentMethod(payment.method)}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <PaymentStatusBadge status={payment.status} />
          <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">
            {formatPaymentSource(payment.source)}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <DetailLine
          icon={Receipt}
          label="Receipt / Gateway"
          value={`${payment.receiptNumber} • ${payment.gatewayReference}`}
        />

        <DetailLine
          icon={FileText}
          label="Invoice / Subscription"
          value={`${payment.invoiceNumber} • ${payment.subscriptionCode}`}
        />

        <DetailLine
          icon={UserRound}
          label="Student"
          value={`${payment.studentName} • ${payment.studentCode}`}
        />

        <DetailLine
          icon={Users}
          label="Parent"
          value={`${payment.parentName} • ${payment.parentPhone}`}
        />

        <DetailLine
          icon={CalendarDays}
          label="Payment / Settlement"
          value={`${payment.paymentDate} • ${payment.settlementDate}`}
        />

        <DetailLine
          icon={WalletCards}
          label="Amount"
          value={`${payment.amount} ${payment.currency}`}
        />

        <DetailLine
          icon={Undo2}
          label="Refunded / Net"
          value={`${payment.refundedAmount} refunded • ${payment.netAmount} net`}
        />

        <DetailLine
          icon={ShieldCheck}
          label="Processed By"
          value={payment.processedBy}
        />

        <DetailLine icon={FileText} label="Notes" value={payment.notes} />

        <div className="grid gap-3">
          <button
            type="button"
            onClick={onMarkSuccessful}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-black text-brand-blue transition hover:bg-white"
          >
            <CheckCircle2 className="h-4 w-4" />
            Mark Successful
          </button>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onRefund}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 text-sm font-black text-blue-700 transition hover:bg-blue-500 hover:text-white dark:text-blue-300"
            >
              <Undo2 className="h-4 w-4" />
              Refund
            </button>

            <button
              type="button"
              onClick={onMarkFailed}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 text-sm font-black text-orange-700 transition hover:bg-orange-500 hover:text-white dark:text-orange-300"
            >
              <AlertTriangle className="h-4 w-4" />
              Mark Failed
            </button>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-5 text-sm font-black text-red-600 transition hover:bg-red-500 hover:text-white dark:text-red-300"
          >
            <XCircle className="h-4 w-4" />
            Cancel Payment
          </button>
        </div>
      </div>
    </aside>
  );
}

function AmountBlock({ payment }: { payment: PaymentItem }) {
  return (
    <div>
      <p className="font-black text-brand-blue dark:text-brand-yellow">
        {payment.amount} {payment.currency}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        Net: {payment.netAmount} {payment.currency}
      </p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        Refunded: {payment.refundedAmount} {payment.currency}
      </p>
    </div>
  );
}

function PaymentActions({ paymentId }: { paymentId: string }) {
  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
    >
      <Link
        to={`/admin/finance/payments/${paymentId}`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="View"
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        to={`/admin/finance/payments/${paymentId}/edit`}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="Edit"
      >
        <Pencil className="h-4 w-4" />
      </Link>

      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background transition hover:border-brand-yellow"
        title="Download Receipt"
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}

function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const className =
    status === 'successful'
      ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
      : status === 'pending'
        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'
        : status === 'failed' || status === 'cancelled'
          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
          : status === 'refunded' || status === 'partiallyRefunded'
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${className}`}
    >
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

      <h3 className="text-xl font-black">No payments found</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Try another search term, payment status, payment method, or source.
      </p>
    </div>
  );
}

function formatPaymentStatus(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    successful: 'Successful',
    pending: 'Pending',
    failed: 'Failed',
    refunded: 'Refunded',
    partiallyRefunded: 'Partially Refunded',
    cancelled: 'Cancelled',
  };

  return labels[status];
}

function formatPaymentMethod(method: PaymentMethod) {
  const labels: Record<PaymentMethod, string> = {
    cash: 'Cash',
    card: 'Card',
    bankTransfer: 'Bank Transfer',
    onlinePayment: 'Online Payment',
    wallet: 'Wallet',
    cheque: 'Cheque',
  };

  return labels[method];
}

function formatPaymentSource(source: PaymentSource) {
  const labels: Record<PaymentSource, string> = {
    invoice: 'Invoice',
    subscription: 'Subscription',
    registration: 'Registration',
    trial: 'Trial',
    manual: 'Manual',
  };

  return labels[source];
}