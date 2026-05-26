export type FinancePaymentStatus =
  | 'paid'
  | 'pending'
  | 'overdue'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type FinancePaymentMethod =
  | 'cash'
  | 'card'
  | 'bank_transfer'
  | 'online_payment'
  | 'wallet'
  | 'other';

export type FinanceInvoiceStatus =
  | 'draft'
  | 'issued'
  | 'paid'
  | 'partially_paid'
  | 'overdue'
  | 'cancelled';

export type FinanceSubscriptionStatus =
  | 'active'
  | 'pending'
  | 'expired'
  | 'cancelled'
  | 'paused';

export type FinanceSubscriptionPlan =
  | 'monthly'
  | 'quarterly'
  | 'semi_annual'
  | 'annual'
  | 'custom';

export type FinanceDiscountType = 'none' | 'percentage' | 'fixed_amount';

export type FinanceTransactionType =
  | 'subscription_payment'
  | 'invoice_payment'
  | 'refund'
  | 'adjustment'
  | 'discount'
  | 'late_fee';

export type FinanceCurrency = 'AED' | 'USD' | 'EGP' | 'SAR';

export interface FinanceStudentSummaryDto {
  id: string;
  studentCode: string;
  fullName: string;
  age: number;

  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
}

export interface FinanceProgramSummaryDto {
  id: string;
  programCode: string;
  name: string;
  sportType:
  | 'football'
  | 'swimming'
  | 'basketball'
  | 'multi_sport'
  | 'fitness'
  | 'martial_arts'
  | 'tennis'
  | 'other';
}

export interface FinanceBranchSummaryDto {
  id: string;
  name: string;
  city: string;
  area: string;
}

export interface FinanceSubscriptionListItemDto {
  id: string;
  subscriptionCode: string;

  studentId: string;
  studentName: string;
  studentCode: string;

  parentId: string;
  parentName: string;
  parentPhone: string;

  programId: string;
  programName: string;

  branchId: string;
  branchName: string;

  plan: FinanceSubscriptionPlan;
  status: FinanceSubscriptionStatus;

  startDate: string;
  endDate: string;

  sessionsIncluded: number;
  sessionsUsed: number;
  sessionsRemaining: number;

  currency: FinanceCurrency;

  baseAmount: number;
  discountType: FinanceDiscountType;
  discountValue: number;
  discountAmount: number;

  totalAmount: number;
  paidAmount: number;
  balanceDue: number;

  nextPaymentDueDate: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface FinanceSubscriptionDetailsDto
  extends FinanceSubscriptionListItemDto {
  student: FinanceStudentSummaryDto;
  program: FinanceProgramSummaryDto;
  branch: FinanceBranchSummaryDto;

  notes: string | null;

  invoices: FinanceInvoiceListItemDto[];
  payments: FinancePaymentListItemDto[];
}

export interface FinanceInvoiceListItemDto {
  id: string;
  invoiceNumber: string;

  subscriptionId: string | null;
  subscriptionCode: string | null;

  studentId: string;
  studentName: string;
  studentCode: string;

  parentId: string;
  parentName: string;
  parentPhone: string;

  issueDate: string;
  dueDate: string;

  status: FinanceInvoiceStatus;

  currency: FinanceCurrency;

  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;

  paidAmount: number;
  balanceDue: number;

  createdAt: string;
  updatedAt: string;
}

export interface FinanceInvoiceDetailsDto extends FinanceInvoiceListItemDto {
  student: FinanceStudentSummaryDto;

  lineItems: FinanceInvoiceLineItemDto[];
  payments: FinancePaymentListItemDto[];

  notes: string | null;
  terms: string | null;
}

export interface FinanceInvoiceLineItemDto {
  id: string;
  description: string;

  quantity: number;
  unitPrice: number;

  discountAmount: number;
  taxAmount: number;

  totalAmount: number;
}

export interface FinancePaymentListItemDto {
  id: string;
  paymentCode: string;

  invoiceId: string | null;
  invoiceNumber: string | null;

  subscriptionId: string | null;
  subscriptionCode: string | null;

  studentId: string;
  studentName: string;
  studentCode: string;

  parentId: string;
  parentName: string;
  parentPhone: string;

  paymentDate: string;
  paymentMethod: FinancePaymentMethod;
  status: FinancePaymentStatus;

  transactionType: FinanceTransactionType;

  currency: FinanceCurrency;
  amount: number;

  referenceNumber: string | null;
  receivedBy: string | null;

  notes: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface FinancePaymentDetailsDto extends FinancePaymentListItemDto {
  student: FinanceStudentSummaryDto;

  invoice: FinanceInvoiceListItemDto | null;
  subscription: FinanceSubscriptionListItemDto | null;
}

export interface FinanceSummaryDto {
  totalRevenue: number;
  totalCollected: number;
  totalOutstanding: number;
  totalOverdue: number;

  activeSubscriptions: number;
  expiredSubscriptions: number;
  pendingSubscriptions: number;

  paidInvoices: number;
  unpaidInvoices: number;
  overdueInvoices: number;

  successfulPayments: number;
  failedPayments: number;
  refundedPayments: number;

  currency: FinanceCurrency;
  collectionRate: number;
}

export interface FinanceDashboardDto {
  summary: FinanceSummaryDto;

  subscriptions: FinanceSubscriptionListItemDto[];
  invoices: FinanceInvoiceListItemDto[];
  payments: FinancePaymentListItemDto[];

  revenueByMonth: FinanceChartPointDto[];
  revenueByProgram: FinanceChartPointDto[];
  revenueByBranch: FinanceChartPointDto[];
  paymentMethodBreakdown: FinanceChartPointDto[];
}

export interface FinanceChartPointDto {
  label: string;
  value: number;
}

export interface FinanceFiltersDto {
  search?: string;

  subscriptionStatus?: FinanceSubscriptionStatus | 'all';
  invoiceStatus?: FinanceInvoiceStatus | 'all';
  paymentStatus?: FinancePaymentStatus | 'all';
  paymentMethod?: FinancePaymentMethod | 'all';

  branchId?: string | 'all';
  programId?: string | 'all';

  dateFrom?: string;
  dateTo?: string;
}

export interface CreateSubscriptionRequestDto {
  studentId: string;
  studentName: string;
  studentCode: string;

  parentId: string;
  parentName: string;
  parentPhone: string;

  programId: string;
  programName: string;

  branchId: string;
  branchName: string;

  plan: FinanceSubscriptionPlan;
  status?: FinanceSubscriptionStatus;

  startDate: string;
  endDate: string;

  sessionsIncluded: number;
  sessionsUsed?: number;

  currency: FinanceCurrency;

  baseAmount: number;
  discountType: FinanceDiscountType;
  discountValue: number;

  paidAmount?: number;
  nextPaymentDueDate?: string | null;

  notes?: string;
}

export interface UpdateSubscriptionRequestDto
  extends Partial<CreateSubscriptionRequestDto> {
  id?: string;
}

export interface CreateInvoiceRequestDto {
  subscriptionId?: string | null;
  subscriptionCode?: string | null;

  studentId: string;
  studentName: string;
  studentCode: string;

  parentId: string;
  parentName: string;
  parentPhone: string;

  issueDate: string;
  dueDate: string;

  status?: FinanceInvoiceStatus;

  currency: FinanceCurrency;

  lineItems: FinanceInvoiceLineItemDto[];

  discountAmount?: number;
  taxAmount?: number;
  paidAmount?: number;

  notes?: string;
  terms?: string;
}

export interface UpdateInvoiceRequestDto
  extends Partial<CreateInvoiceRequestDto> {
  id?: string;
}

export interface CreatePaymentRequestDto {
  invoiceId?: string | null;
  invoiceNumber?: string | null;

  subscriptionId?: string | null;
  subscriptionCode?: string | null;

  studentId: string;
  studentName: string;
  studentCode: string;

  parentId: string;
  parentName: string;
  parentPhone: string;

  paymentDate: string;
  paymentMethod: FinancePaymentMethod;
  status?: FinancePaymentStatus;

  transactionType: FinanceTransactionType;

  currency: FinanceCurrency;
  amount: number;

  referenceNumber?: string | null;
  receivedBy?: string | null;

  notes?: string | null;
}

export interface UpdatePaymentRequestDto
  extends Partial<CreatePaymentRequestDto> {
  id?: string;
}

export interface DeleteFinanceRecordResponseDto {
  id: string;
  deleted: boolean;
}

export interface ExportFinanceReportRequestDto {
  reportType:
  | 'finance_dashboard'
  | 'subscriptions'
  | 'invoices'
  | 'payments'
  | 'outstanding_balances'
  | 'overdue_invoices';

  format: 'pdf' | 'excel' | 'csv';

  filters: FinanceFiltersDto;
}

export interface ExportFinanceReportResponseDto {
  fileName: string;
  fileUrl: string;
  generatedAt: string;
}