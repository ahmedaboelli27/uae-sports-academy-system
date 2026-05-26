import type {
  CreateInvoiceRequestDto,
  CreatePaymentRequestDto,
  CreateSubscriptionRequestDto,
  FinanceBranchSummaryDto,
  FinanceChartPointDto,
  FinanceCurrency,
  FinanceDashboardDto,
  FinanceDiscountType,
  FinanceFiltersDto,
  FinanceInvoiceDetailsDto,
  FinanceInvoiceLineItemDto,
  FinanceInvoiceListItemDto,
  FinanceInvoiceStatus,
  FinancePaymentDetailsDto,
  FinancePaymentListItemDto,
  FinancePaymentMethod,
  FinancePaymentStatus,
  FinanceProgramSummaryDto,
  FinanceStudentSummaryDto,
  FinanceSubscriptionDetailsDto,
  FinanceSubscriptionListItemDto,
  FinanceSubscriptionPlan,
  FinanceSubscriptionStatus,
  FinanceSummaryDto,
  FinanceTransactionType,
  UpdateInvoiceRequestDto,
  UpdatePaymentRequestDto,
  UpdateSubscriptionRequestDto,
} from '../types/finance.dto';

type DecimalLike = number | string | { toString(): string };

export interface BackendUser {
  firstName: string;
  lastName: string;
  phone?: string | null;
  email: string;
}

export interface BackendParent {
  id: string;
  parentCode?: string;
  user?: BackendUser;
}

export interface BackendStudent {
  id: string;
  studentCode: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  parentId: string;
  parent?: BackendParent;
}

export interface BackendBranch {
  id: string;
  name: string;
  city: string;
  branchCode?: string;
  address?: string;
}

export interface BackendProgram {
  id: string;
  name: string;
  programCode?: string;
  sport?: { sportType?: string; slug?: string };
}

export interface BackendSubscription {
  id: string;
  subscriptionCode: string;
  studentId: string;
  parentId: string;
  branchId: string;
  programId: string;
  plan: string;
  status: string;
  startDate: string | Date;
  endDate: string | Date;
  amount: DecimalLike;
  currency: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  student?: BackendStudent;
  parent?: BackendParent;
  branch?: BackendBranch;
  program?: BackendProgram;
  invoices?: BackendInvoice[];
  payments?: BackendPayment[];
}

export interface BackendInvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: DecimalLike;
  discount: DecimalLike;
  tax: DecimalLike;
  total: DecimalLike;
}

export interface BackendInvoice {
  id: string;
  invoiceNumber: string;
  parentId: string;
  studentId?: string | null;
  subscriptionId?: string | null;
  amount: DecimalLike;
  currency: string;
  status: string;
  dueDate: string | Date;
  issuedAt: string | Date;
  paidAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  student?: BackendStudent;
  parent?: BackendParent;
  subscription?: BackendSubscription;
  lineItems?: BackendInvoiceLineItem[];
  payments?: BackendPayment[];
}

export interface BackendPayment {
  id: string;
  paymentCode: string;
  parentId: string;
  studentId?: string | null;
  invoiceId?: string | null;
  subscriptionId?: string | null;
  amount: DecimalLike;
  currency: string;
  status: string;
  method?: string | null;
  transactionType: string;
  paidAt?: string | Date | null;
  reference?: string | null;
  notes?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  student?: BackendStudent;
  parent?: BackendParent;
  invoice?: BackendInvoice;
  subscription?: BackendSubscription;
}

export function toNumber(value: DecimalLike | null | undefined): number {
  if (value == null) return 0;
  return Number(value);
}

function toIsoDate(value: string | Date): string {
  const d = typeof value === 'string' ? value : value.toISOString();
  return d.slice(0, 10);
}

function toIsoDateTime(value: string | Date): string {
  return typeof value === 'string' ? value : value.toISOString();
}

function fullName(first?: string, last?: string): string {
  return [first, last].filter(Boolean).join(' ').trim() || '—';
}

function calcAge(dateOfBirth: string | Date): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return Math.max(age, 0);
}

function parentDisplay(parent?: BackendParent) {
  const user = parent?.user;
  return {
    parentName: user ? fullName(user.firstName, user.lastName) : '—',
    parentPhone: user?.phone ?? '—',
    parentEmail: user?.email ?? '',
  };
}

export function mapSubscriptionStatusFromApi(status: string): FinanceSubscriptionStatus {
  const map: Record<string, FinanceSubscriptionStatus> = {
    ACTIVE: 'active',
    PENDING: 'pending',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
  };
  return map[status] ?? 'pending';
}

export function mapSubscriptionStatusToApi(
  status: FinanceSubscriptionStatus,
): 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELLED' {
  const map: Record<FinanceSubscriptionStatus, 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELLED'> = {
    active: 'ACTIVE',
    pending: 'PENDING',
    expired: 'EXPIRED',
    cancelled: 'CANCELLED',
    paused: 'PENDING',
  };
  return map[status];
}

export function mapSubscriptionPlanFromApi(plan: string): FinanceSubscriptionPlan {
  const map: Record<string, FinanceSubscriptionPlan> = {
    MONTHLY: 'monthly',
    QUARTERLY: 'quarterly',
    ANNUAL: 'annual',
    CUSTOM: 'custom',
  };
  return map[plan] ?? 'monthly';
}

export function mapSubscriptionPlanToApi(
  plan: FinanceSubscriptionPlan,
): 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM' {
  const map: Record<FinanceSubscriptionPlan, 'MONTHLY' | 'QUARTERLY' | 'ANNUAL' | 'CUSTOM'> = {
    monthly: 'MONTHLY',
    quarterly: 'QUARTERLY',
    semi_annual: 'QUARTERLY',
    annual: 'ANNUAL',
    custom: 'CUSTOM',
  };
  return map[plan];
}

export function mapInvoiceStatusFromApi(status: string): FinanceInvoiceStatus {
  const map: Record<string, FinanceInvoiceStatus> = {
    DRAFT: 'draft',
    SENT: 'issued',
    ISSUED: 'issued',
    PARTIALLY_PAID: 'partially_paid',
    PAID: 'paid',
    OVERDUE: 'overdue',
    CANCELLED: 'cancelled',
  };
  return map[status] ?? 'draft';
}

export function mapInvoiceStatusToApi(
  status: FinanceInvoiceStatus,
): 'DRAFT' | 'SENT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED' {
  const map: Record<
    FinanceInvoiceStatus,
    'DRAFT' | 'SENT' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED'
  > = {
    draft: 'DRAFT',
    issued: 'ISSUED',
    paid: 'PAID',
    partially_paid: 'PARTIALLY_PAID',
    overdue: 'OVERDUE',
    cancelled: 'CANCELLED',
  };
  return map[status];
}

export function mapPaymentStatusFromApi(status: string): FinancePaymentStatus {
  const map: Record<string, FinancePaymentStatus> = {
    PAID: 'paid',
    PENDING: 'pending',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  };
  return map[status] ?? 'pending';
}

export function mapPaymentStatusToApi(
  status: FinancePaymentStatus,
): 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED' {
  const map: Record<FinancePaymentStatus, 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED'> = {
    paid: 'PAID',
    pending: 'PENDING',
    failed: 'FAILED',
    refunded: 'REFUNDED',
    overdue: 'PENDING',
    cancelled: 'PENDING',
  };
  return map[status];
}

export function mapPaymentMethodFromApi(method?: string | null): FinancePaymentMethod {
  if (!method) return 'other';
  const map: Record<string, FinancePaymentMethod> = {
    CASH: 'cash',
    CARD: 'card',
    BANK_TRANSFER: 'bank_transfer',
    ONLINE: 'online_payment',
    OTHER: 'other',
  };
  return map[method] ?? 'other';
}

export function mapPaymentMethodToApi(
  method: FinancePaymentMethod,
): 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'ONLINE' | 'OTHER' {
  const map: Record<FinancePaymentMethod, 'CASH' | 'CARD' | 'BANK_TRANSFER' | 'ONLINE' | 'OTHER'> = {
    cash: 'CASH',
    card: 'CARD',
    bank_transfer: 'BANK_TRANSFER',
    online_payment: 'ONLINE',
    wallet: 'ONLINE',
    other: 'OTHER',
  };
  return map[method];
}

export function mapTransactionTypeFromApi(type: string): FinanceTransactionType {
  const map: Record<string, FinanceTransactionType> = {
    SUBSCRIPTION_PAYMENT: 'subscription_payment',
    INVOICE_PAYMENT: 'invoice_payment',
    REFUND: 'refund',
    ADJUSTMENT: 'adjustment',
    OTHER: 'adjustment',
  };
  return map[type] ?? 'subscription_payment';
}

export function mapTransactionTypeToApi(
  type: FinanceTransactionType,
): 'SUBSCRIPTION_PAYMENT' | 'INVOICE_PAYMENT' | 'REFUND' | 'ADJUSTMENT' | 'OTHER' {
  const map: Record<
    FinanceTransactionType,
    'SUBSCRIPTION_PAYMENT' | 'INVOICE_PAYMENT' | 'REFUND' | 'ADJUSTMENT' | 'OTHER'
  > = {
    subscription_payment: 'SUBSCRIPTION_PAYMENT',
    invoice_payment: 'INVOICE_PAYMENT',
    refund: 'REFUND',
    adjustment: 'ADJUSTMENT',
    discount: 'ADJUSTMENT',
    late_fee: 'ADJUSTMENT',
  };

  return map[type] ?? 'OTHER';
}

function sumPaidPayments(payments: BackendPayment[] | undefined, subscriptionId?: string) {
  return (payments ?? [])
    .filter(
      (p) =>
        p.status === 'PAID' &&
        (!subscriptionId || p.subscriptionId === subscriptionId),
    )
    .reduce((sum, p) => sum + toNumber(p.amount), 0);
}

export function mapStudentSummary(student?: BackendStudent, parent?: BackendParent): FinanceStudentSummaryDto {
  const parentInfo = parentDisplay(parent ?? student?.parent);
  return {
    id: student?.id ?? '',
    studentCode: student?.studentCode ?? '',
    fullName: student ? fullName(student.firstName, student.lastName) : '—',
    age: student ? calcAge(student.dateOfBirth) : 0,
    parentId: student?.parentId ?? parent?.id ?? '',
    parentName: parentInfo.parentName,
    parentPhone: parentInfo.parentPhone,
    parentEmail: parentInfo.parentEmail,
  };
}

function mapProgramSummary(program?: BackendProgram): FinanceProgramSummaryDto {
  const sportSlug = program?.sport?.slug ?? 'other';
  const sportTypeMap: FinanceProgramSummaryDto['sportType'] =
    sportSlug === 'football'
      ? 'football'
      : sportSlug === 'swimming'
        ? 'swimming'
        : sportSlug === 'basketball'
          ? 'basketball'
          : 'other';

  return {
    id: program?.id ?? '',
    programCode: program?.programCode ?? program?.id ?? '',
    name: program?.name ?? '—',
    sportType: sportTypeMap,
  };
}

function mapBranchSummary(branch?: BackendBranch): FinanceBranchSummaryDto {
  return {
    id: branch?.id ?? '',
    name: branch?.name ?? '—',
    city: branch?.city ?? '',
    area: branch?.address?.split(',')[0] ?? branch?.city ?? '',
  };
}

export function mapSubscriptionListItem(
  sub: BackendSubscription,
  allPayments?: BackendPayment[],
): FinanceSubscriptionListItemDto {
  const student = sub.student;
  const parentInfo = parentDisplay(sub.parent);
  const baseAmount = toNumber(sub.amount);
  const paidAmount = sumPaidPayments(allPayments ?? sub.payments, sub.id);
  const totalAmount = baseAmount;
  const balanceDue = Math.max(totalAmount - paidAmount, 0);

  return {
    id: sub.id,
    subscriptionCode: sub.subscriptionCode,
    studentId: sub.studentId,
    studentName: student ? fullName(student.firstName, student.lastName) : '—',
    studentCode: student?.studentCode ?? '',
    parentId: sub.parentId,
    parentName: parentInfo.parentName,
    parentPhone: parentInfo.parentPhone,
    programId: sub.programId,
    programName: sub.program?.name ?? '—',
    branchId: sub.branchId,
    branchName: sub.branch?.name ?? '—',
    plan: mapSubscriptionPlanFromApi(sub.plan),
    status: mapSubscriptionStatusFromApi(sub.status),
    startDate: toIsoDate(sub.startDate),
    endDate: toIsoDate(sub.endDate),
    sessionsIncluded: 12,
    sessionsUsed: 0,
    sessionsRemaining: 12,
    currency: (sub.currency as FinanceCurrency) || 'AED',
    baseAmount,
    discountType: 'none',
    discountValue: 0,
    discountAmount: 0,
    totalAmount,
    paidAmount,
    balanceDue,
    nextPaymentDueDate: null,
    createdAt: toIsoDateTime(sub.createdAt),
    updatedAt: toIsoDateTime(sub.updatedAt),
  };
}

export function mapSubscriptionDetails(
  sub: BackendSubscription,
  allPayments?: BackendPayment[],
): FinanceSubscriptionDetailsDto {
  const listItem = mapSubscriptionListItem(sub, allPayments);
  return {
    ...listItem,
    student: mapStudentSummary(sub.student, sub.parent),
    program: mapProgramSummary(sub.program),
    branch: mapBranchSummary(sub.branch),
    notes: null,
    invoices: (sub.invoices ?? []).map((inv) => mapInvoiceListItem(inv)),
    payments: (sub.payments ?? []).map((pay) => mapPaymentListItem(pay)),
  };
}

export function mapInvoiceListItem(inv: BackendInvoice): FinanceInvoiceListItemDto {
  const student = inv.student;
  const parentInfo = parentDisplay(inv.parent);
  const lineItems = inv.lineItems ?? [];
  const subtotal = lineItems.length
    ? lineItems.reduce((s, li) => s + toNumber(li.unitPrice) * li.quantity, 0)
    : toNumber(inv.amount);
  const discountAmount = lineItems.reduce((s, li) => s + toNumber(li.discount), 0);
  const taxAmount = lineItems.reduce((s, li) => s + toNumber(li.tax), 0);
  const totalAmount = lineItems.length
    ? lineItems.reduce((s, li) => s + toNumber(li.total), 0)
    : toNumber(inv.amount);
  const paidAmount = (inv.payments ?? [])
    .filter((p) => p.status === 'PAID')
    .reduce((s, p) => s + toNumber(p.amount), 0);

  return {
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    subscriptionId: inv.subscriptionId ?? null,
    subscriptionCode: inv.subscription?.subscriptionCode ?? null,
    studentId: inv.studentId ?? student?.id ?? '',
    studentName: student ? fullName(student.firstName, student.lastName) : '—',
    studentCode: student?.studentCode ?? '',
    parentId: inv.parentId,
    parentName: parentInfo.parentName,
    parentPhone: parentInfo.parentPhone,
    issueDate: toIsoDate(inv.issuedAt),
    dueDate: toIsoDate(inv.dueDate),
    status: mapInvoiceStatusFromApi(inv.status),
    currency: (inv.currency as FinanceCurrency) || 'AED',
    subtotal,
    discountAmount,
    taxAmount,
    totalAmount,
    paidAmount,
    balanceDue: Math.max(totalAmount - paidAmount, 0),
    createdAt: toIsoDateTime(inv.createdAt),
    updatedAt: toIsoDateTime(inv.updatedAt),
  };
}

export function mapInvoiceDetails(inv: BackendInvoice): FinanceInvoiceDetailsDto {
  return {
    ...mapInvoiceListItem(inv),
    student: mapStudentSummary(inv.student, inv.parent),
    lineItems: (inv.lineItems ?? []).map(mapInvoiceLineItem),
    payments: (inv.payments ?? []).map((p) => mapPaymentListItem(p)),
    notes: null,
    terms: 'Payment should be completed before the due date.',
  };
}

export function mapInvoiceLineItem(li: BackendInvoiceLineItem): FinanceInvoiceLineItemDto {
  return {
    id: li.id,
    description: li.description,
    quantity: li.quantity,
    unitPrice: toNumber(li.unitPrice),
    discountAmount: toNumber(li.discount),
    taxAmount: toNumber(li.tax),
    totalAmount: toNumber(li.total),
  };
}

export function mapPaymentListItem(pay: BackendPayment): FinancePaymentListItemDto {
  const student = pay.student;
  const parentInfo = parentDisplay(pay.parent);

  return {
    id: pay.id,
    paymentCode: pay.paymentCode,
    invoiceId: pay.invoiceId ?? null,
    invoiceNumber: pay.invoice?.invoiceNumber ?? null,
    subscriptionId: pay.subscriptionId ?? null,
    subscriptionCode: pay.subscription?.subscriptionCode ?? null,
    studentId: pay.studentId ?? student?.id ?? '',
    studentName: student ? fullName(student.firstName, student.lastName) : '—',
    studentCode: student?.studentCode ?? '',
    parentId: pay.parentId,
    parentName: parentInfo.parentName,
    parentPhone: parentInfo.parentPhone,
    paymentDate: pay.paidAt ? toIsoDate(pay.paidAt) : toIsoDate(pay.createdAt),
    paymentMethod: mapPaymentMethodFromApi(pay.method),
    status: mapPaymentStatusFromApi(pay.status),
    transactionType: mapTransactionTypeFromApi(pay.transactionType),
    currency: (pay.currency as FinanceCurrency) || 'AED',
    amount: toNumber(pay.amount),
    referenceNumber: pay.reference ?? null,
    receivedBy: null,
    notes: pay.notes ?? null,
    createdAt: toIsoDateTime(pay.createdAt),
    updatedAt: toIsoDateTime(pay.updatedAt),
  };
}

export function mapPaymentDetails(
  pay: BackendPayment,
  subscriptionList?: FinanceSubscriptionListItemDto,
): FinancePaymentDetailsDto {
  return {
    ...mapPaymentListItem(pay),
    student: mapStudentSummary(pay.student, pay.parent),
    invoice: pay.invoice ? mapInvoiceListItem(pay.invoice) : null,
    subscription:
      subscriptionList ??
      (pay.subscription ? mapSubscriptionListItem(pay.subscription) : null),
  };
}

export function buildFinanceQueryParams(
  filters: FinanceFiltersDto | undefined,
  entity: 'subscription' | 'invoice' | 'payment',
): Record<string, string | number | undefined> {
  const params: Record<string, string | number | undefined> = {
    page: 1,
    limit: 500,
    search: filters?.search?.trim() || undefined,
    branchId: filters?.branchId && filters.branchId !== 'all' ? filters.branchId : undefined,
    programId: filters?.programId && filters.programId !== 'all' ? filters.programId : undefined,
    dateFrom: filters?.dateFrom || undefined,
    dateTo: filters?.dateTo || undefined,
  };

  if (entity === 'subscription' && filters?.subscriptionStatus && filters.subscriptionStatus !== 'all') {
    params.status = mapSubscriptionStatusToApi(filters.subscriptionStatus);
  }
  if (entity === 'invoice' && filters?.invoiceStatus && filters.invoiceStatus !== 'all') {
    params.status = mapInvoiceStatusToApi(filters.invoiceStatus);
  }
  if (entity === 'payment' && filters?.paymentStatus && filters.paymentStatus !== 'all') {
    params.status = mapPaymentStatusToApi(filters.paymentStatus);
  }

  return params;
}

export function filterPaymentsByMethod(
  payments: FinancePaymentListItemDto[],
  filters?: FinanceFiltersDto,
): FinancePaymentListItemDto[] {
  if (!filters?.paymentMethod || filters.paymentMethod === 'all') {
    return payments;
  }

  return payments.filter((p) => p.paymentMethod === filters.paymentMethod);
}

function getFinanceSummary(
  subscriptions: FinanceSubscriptionListItemDto[],
  invoices: FinanceInvoiceListItemDto[],
  payments: FinancePaymentListItemDto[],
): FinanceSummaryDto {
  const totalRevenue = subscriptions.reduce((t, s) => t + s.totalAmount, 0);
  const totalCollected = payments
    .filter((p) => p.status === 'paid')
    .reduce((t, p) => t + p.amount, 0);
  const totalOutstanding = invoices.reduce((t, i) => t + i.balanceDue, 0);
  const totalOverdue = invoices
    .filter((i) => i.status === 'overdue')
    .reduce((t, i) => t + i.balanceDue, 0);
  const collectionRate =
    totalRevenue > 0 ? Number(((totalCollected / totalRevenue) * 100).toFixed(1)) : 0;

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalCollected: Number(totalCollected.toFixed(2)),
    totalOutstanding: Number(totalOutstanding.toFixed(2)),
    totalOverdue: Number(totalOverdue.toFixed(2)),
    activeSubscriptions: subscriptions.filter((s) => s.status === 'active').length,
    expiredSubscriptions: subscriptions.filter((s) => s.status === 'expired').length,
    pendingSubscriptions: subscriptions.filter((s) => s.status === 'pending').length,
    paidInvoices: invoices.filter((i) => i.status === 'paid').length,
    unpaidInvoices: invoices.filter(
      (i) => i.status === 'issued' || i.status === 'partially_paid',
    ).length,
    overdueInvoices: invoices.filter((i) => i.status === 'overdue').length,
    successfulPayments: payments.filter((p) => p.status === 'paid').length,
    failedPayments: payments.filter((p) => p.status === 'failed').length,
    refundedPayments: payments.filter((p) => p.status === 'refunded').length,
    currency: 'AED',
    collectionRate,
  };
}

function buildRevenueByMonth(payments: FinancePaymentListItemDto[]): FinanceChartPointDto[] {
  const monthMap = new Map<string, number>();
  payments
    .filter((p) => p.status === 'paid')
    .forEach((p) => {
      const month = p.paymentDate.slice(0, 7);
      monthMap.set(month, (monthMap.get(month) ?? 0) + p.amount);
    });
  return Array.from(monthMap.entries()).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2)),
  }));
}

function buildRevenueByProgram(subscriptions: FinanceSubscriptionListItemDto[]): FinanceChartPointDto[] {
  const programMap = new Map<string, number>();
  subscriptions.forEach((s) => {
    programMap.set(s.programName, (programMap.get(s.programName) ?? 0) + s.totalAmount);
  });
  return Array.from(programMap.entries()).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2)),
  }));
}

function buildRevenueByBranch(subscriptions: FinanceSubscriptionListItemDto[]): FinanceChartPointDto[] {
  const branchMap = new Map<string, number>();
  subscriptions.forEach((s) => {
    branchMap.set(s.branchName, (branchMap.get(s.branchName) ?? 0) + s.totalAmount);
  });
  return Array.from(branchMap.entries()).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2)),
  }));
}

function buildPaymentMethodBreakdown(payments: FinancePaymentListItemDto[]): FinanceChartPointDto[] {
  const methodMap = new Map<FinancePaymentMethod, number>();
  payments.forEach((p) => {
    methodMap.set(p.paymentMethod, (methodMap.get(p.paymentMethod) ?? 0) + p.amount);
  });
  return Array.from(methodMap.entries()).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2)),
  }));
}

export function buildFinanceDashboardDto(
  subscriptions: FinanceSubscriptionListItemDto[],
  invoices: FinanceInvoiceListItemDto[],
  payments: FinancePaymentListItemDto[],
): FinanceDashboardDto {
  return {
    summary: getFinanceSummary(subscriptions, invoices, payments),
    subscriptions,
    invoices,
    payments,
    revenueByMonth: buildRevenueByMonth(payments),
    revenueByProgram: buildRevenueByProgram(subscriptions),
    revenueByBranch: buildRevenueByBranch(subscriptions),
    paymentMethodBreakdown: buildPaymentMethodBreakdown(payments),
  };
}

export function mapCreateSubscriptionPayload(payload: CreateSubscriptionRequestDto) {
  const discountAmount =
    payload.discountType === 'percentage'
      ? (payload.baseAmount * payload.discountValue) / 100
      : payload.discountType === 'fixed_amount'
        ? Math.min(payload.discountValue, payload.baseAmount)
        : 0;

  return {
    studentId: payload.studentId,
    parentId: payload.parentId,
    branchId: payload.branchId,
    programId: payload.programId,
    plan: mapSubscriptionPlanToApi(payload.plan),
    status: mapSubscriptionStatusToApi(payload.status ?? 'pending'),
    startDate: payload.startDate,
    endDate: payload.endDate,
    amount: Number((payload.baseAmount - discountAmount).toFixed(2)),
    currency: payload.currency,
  };
}

export function mapUpdateSubscriptionPayload(payload: UpdateSubscriptionRequestDto) {
  const body: Record<string, unknown> = {};
  if (payload.studentId) body.studentId = payload.studentId;
  if (payload.parentId) body.parentId = payload.parentId;
  if (payload.branchId) body.branchId = payload.branchId;
  if (payload.programId) body.programId = payload.programId;
  if (payload.plan) body.plan = mapSubscriptionPlanToApi(payload.plan);
  if (payload.status) body.status = mapSubscriptionStatusToApi(payload.status);
  if (payload.startDate) body.startDate = payload.startDate;
  if (payload.endDate) body.endDate = payload.endDate;
  if (payload.currency) body.currency = payload.currency;
  if (payload.baseAmount != null) {
    const discountAmount =
      payload.discountType === 'percentage'
        ? (payload.baseAmount * (payload.discountValue ?? 0)) / 100
        : payload.discountType === 'fixed_amount'
          ? Math.min(payload.discountValue ?? 0, payload.baseAmount)
          : 0;
    body.amount = Number((payload.baseAmount - discountAmount).toFixed(2));
  }
  return body;
}

export function mapCreateInvoicePayload(payload: CreateInvoiceRequestDto) {
  const subtotal = payload.lineItems.reduce(
    (t, li) => t + li.quantity * li.unitPrice,
    0,
  );
  const discountAmount = payload.discountAmount ?? 0;
  const taxAmount = payload.taxAmount ?? 0;
  const totalAmount = subtotal - discountAmount + taxAmount;

  return {
    parentId: payload.parentId,
    studentId: payload.studentId,
    subscriptionId: payload.subscriptionId ?? null,
    amount: totalAmount,
    currency: payload.currency,
    status: mapInvoiceStatusToApi(payload.status ?? 'issued'),
    dueDate: payload.dueDate,
    issuedAt: payload.issueDate,
    lineItems: payload.lineItems.map((li) => ({
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
      discount: li.discountAmount,
      tax: li.taxAmount,
    })),
  };
}

export function mapUpdateInvoicePayload(payload: UpdateInvoiceRequestDto) {
  const body: Record<string, unknown> = {};
  if (payload.parentId) body.parentId = payload.parentId;
  if (payload.studentId !== undefined) body.studentId = payload.studentId;
  if (payload.subscriptionId !== undefined) body.subscriptionId = payload.subscriptionId;
  if (payload.currency) body.currency = payload.currency;
  if (payload.status) body.status = mapInvoiceStatusToApi(payload.status);
  if (payload.dueDate) body.dueDate = payload.dueDate;
  if (payload.issueDate) body.issuedAt = payload.issueDate;
  if (payload.lineItems) {
    const subtotal = payload.lineItems.reduce((t, li) => t + li.quantity * li.unitPrice, 0);
    const discountAmount = payload.discountAmount ?? 0;
    const taxAmount = payload.taxAmount ?? 0;
    body.amount = subtotal - discountAmount + taxAmount;
    body.lineItems = payload.lineItems.map((li) => ({
      description: li.description,
      quantity: li.quantity,
      unitPrice: li.unitPrice,
      discount: li.discountAmount,
      tax: li.taxAmount,
    }));
  }
  return body;
}

export function mapCreatePaymentPayload(payload: CreatePaymentRequestDto) {
  return {
    parentId: payload.parentId,
    studentId: payload.studentId,
    invoiceId: payload.invoiceId ?? null,
    subscriptionId: payload.subscriptionId ?? null,
    amount: payload.amount,
    currency: payload.currency,
    status: mapPaymentStatusToApi(payload.status ?? 'paid'),
    method: mapPaymentMethodToApi(payload.paymentMethod),
    transactionType: mapTransactionTypeToApi(payload.transactionType),
    paidAt: payload.paymentDate,
    reference: payload.referenceNumber ?? null,
    notes: payload.notes ?? null,
  };
}

export function mapUpdatePaymentPayload(payload: UpdatePaymentRequestDto) {
  const body: Record<string, unknown> = {};
  if (payload.parentId) body.parentId = payload.parentId;
  if (payload.studentId !== undefined) body.studentId = payload.studentId;
  if (payload.invoiceId !== undefined) body.invoiceId = payload.invoiceId;
  if (payload.subscriptionId !== undefined) body.subscriptionId = payload.subscriptionId;
  if (payload.amount != null) body.amount = payload.amount;
  if (payload.currency) body.currency = payload.currency;
  if (payload.status) body.status = mapPaymentStatusToApi(payload.status);
  if (payload.paymentMethod) body.method = mapPaymentMethodToApi(payload.paymentMethod);
  if (payload.transactionType) {
    body.transactionType = mapTransactionTypeToApi(payload.transactionType);
  }
  if (payload.paymentDate) body.paidAt = payload.paymentDate;
  if (payload.referenceNumber !== undefined) body.reference = payload.referenceNumber;
  if (payload.notes !== undefined) body.notes = payload.notes;
  return body;
}
