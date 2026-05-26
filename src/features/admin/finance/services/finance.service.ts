import type {
  CreateInvoiceRequestDto,
  CreatePaymentRequestDto,
  CreateSubscriptionRequestDto,
  DeleteFinanceRecordResponseDto,
  ExportFinanceReportRequestDto,
  ExportFinanceReportResponseDto,
  FinanceBranchSummaryDto,
  FinanceChartPointDto,
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
  FinanceProgramSummaryDto,
  FinanceStudentSummaryDto,
  FinanceSubscriptionDetailsDto,
  FinanceSubscriptionListItemDto,
  FinanceSummaryDto,
  UpdateInvoiceRequestDto,
  UpdatePaymentRequestDto,
  UpdateSubscriptionRequestDto
} from '../types/finance.dto';

function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const studentsMockData: FinanceStudentSummaryDto[] = [
  {
    id: 'student-001',
    studentCode: 'STU-1001',
    fullName: 'Mohammed Khaled',
    age: 9,
    parentId: 'parent-001',
    parentName: 'Khaled Ahmed',
    parentPhone: '+971 50 111 2222',
    parentEmail: 'khaled.ahmed@example.com',
  },
  {
    id: 'student-002',
    studentCode: 'STU-1002',
    fullName: 'Omar Ahmed',
    age: 10,
    parentId: 'parent-002',
    parentName: 'Ahmed Omar',
    parentPhone: '+971 50 222 3333',
    parentEmail: 'ahmed.omar@example.com',
  },
  {
    id: 'student-003',
    studentCode: 'STU-1003',
    fullName: 'Layan Omar',
    age: 7,
    parentId: 'parent-003',
    parentName: 'Omar Salem',
    parentPhone: '+971 55 111 2222',
    parentEmail: 'omar.salem@example.com',
  },
  {
    id: 'student-004',
    studentCode: 'STU-1004',
    fullName: 'Mariam Hassan',
    age: 8,
    parentId: 'parent-004',
    parentName: 'Hassan Ali',
    parentPhone: '+971 55 222 3333',
    parentEmail: 'hassan.ali@example.com',
  },
];

const programsMockData: FinanceProgramSummaryDto[] = [
  {
    id: 'program-001',
    programCode: 'PRO-1001',
    name: 'Football Academy',
    sportType: 'football',
  },
  {
    id: 'program-002',
    programCode: 'PRO-1002',
    name: 'Swimming Program',
    sportType: 'swimming',
  },
  {
    id: 'program-003',
    programCode: 'PRO-1003',
    name: 'Basketball Training',
    sportType: 'basketball',
  },
  {
    id: 'program-004',
    programCode: 'PRO-1004',
    name: 'Multi-Sport Program',
    sportType: 'multi_sport',
  },
];

const branchesMockData: FinanceBranchSummaryDto[] = [
  {
    id: 'branch-dubai',
    name: 'Dubai Branch',
    city: 'Dubai',
    area: 'Nad Al Sheba',
  },
  {
    id: 'branch-abudhabi',
    name: 'Abu Dhabi Branch',
    city: 'Abu Dhabi',
    area: 'Khalifa City',
  },
  {
    id: 'branch-sharjah',
    name: 'Sharjah Branch',
    city: 'Sharjah',
    area: 'University City',
  },
];

let subscriptionsMockData: FinanceSubscriptionListItemDto[] = [
  {
    id: 'subscription-001',
    subscriptionCode: 'SUB-1001',

    studentId: 'student-001',
    studentName: 'Mohammed Khaled',
    studentCode: 'STU-1001',

    parentId: 'parent-001',
    parentName: 'Khaled Ahmed',
    parentPhone: '+971 50 111 2222',

    programId: 'program-001',
    programName: 'Football Academy',

    branchId: 'branch-dubai',
    branchName: 'Dubai Branch',

    plan: 'monthly',
    status: 'active',

    startDate: '2026-05-01',
    endDate: '2026-05-31',

    sessionsIncluded: 12,
    sessionsUsed: 7,
    sessionsRemaining: 5,

    currency: 'AED',

    baseAmount: 1200,
    discountType: 'percentage',
    discountValue: 10,
    discountAmount: 120,

    totalAmount: 1080,
    paidAmount: 1080,
    balanceDue: 0,

    nextPaymentDueDate: '2026-06-01',

    createdAt: '2026-05-01T08:00:00.000Z',
    updatedAt: '2026-05-01T08:00:00.000Z',
  },
  {
    id: 'subscription-002',
    subscriptionCode: 'SUB-1002',

    studentId: 'student-002',
    studentName: 'Omar Ahmed',
    studentCode: 'STU-1002',

    parentId: 'parent-002',
    parentName: 'Ahmed Omar',
    parentPhone: '+971 50 222 3333',

    programId: 'program-001',
    programName: 'Football Academy',

    branchId: 'branch-dubai',
    branchName: 'Dubai Branch',

    plan: 'quarterly',
    status: 'pending',

    startDate: '2026-05-15',
    endDate: '2026-08-15',

    sessionsIncluded: 36,
    sessionsUsed: 4,
    sessionsRemaining: 32,

    currency: 'AED',

    baseAmount: 3300,
    discountType: 'fixed_amount',
    discountValue: 300,
    discountAmount: 300,

    totalAmount: 3000,
    paidAmount: 1500,
    balanceDue: 1500,

    nextPaymentDueDate: '2026-06-15',

    createdAt: '2026-05-10T08:00:00.000Z',
    updatedAt: '2026-05-16T08:00:00.000Z',
  },
  {
    id: 'subscription-003',
    subscriptionCode: 'SUB-1003',

    studentId: 'student-003',
    studentName: 'Layan Omar',
    studentCode: 'STU-1003',

    parentId: 'parent-003',
    parentName: 'Omar Salem',
    parentPhone: '+971 55 111 2222',

    programId: 'program-002',
    programName: 'Swimming Program',

    branchId: 'branch-abudhabi',
    branchName: 'Abu Dhabi Branch',

    plan: 'monthly',
    status: 'active',

    startDate: '2026-05-05',
    endDate: '2026-06-05',

    sessionsIncluded: 10,
    sessionsUsed: 6,
    sessionsRemaining: 4,

    currency: 'AED',

    baseAmount: 950,
    discountType: 'none',
    discountValue: 0,
    discountAmount: 0,

    totalAmount: 950,
    paidAmount: 950,
    balanceDue: 0,

    nextPaymentDueDate: '2026-06-05',

    createdAt: '2026-05-05T08:00:00.000Z',
    updatedAt: '2026-05-05T08:00:00.000Z',
  },
  {
    id: 'subscription-004',
    subscriptionCode: 'SUB-1004',

    studentId: 'student-004',
    studentName: 'Mariam Hassan',
    studentCode: 'STU-1004',

    parentId: 'parent-004',
    parentName: 'Hassan Ali',
    parentPhone: '+971 55 222 3333',

    programId: 'program-003',
    programName: 'Basketball Training',

    branchId: 'branch-sharjah',
    branchName: 'Sharjah Branch',

    plan: 'monthly',
    status: 'expired',

    startDate: '2026-04-01',
    endDate: '2026-04-30',

    sessionsIncluded: 12,
    sessionsUsed: 12,
    sessionsRemaining: 0,

    currency: 'AED',

    baseAmount: 850,
    discountType: 'percentage',
    discountValue: 5,
    discountAmount: 42.5,

    totalAmount: 807.5,
    paidAmount: 400,
    balanceDue: 407.5,

    nextPaymentDueDate: null,

    createdAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-05-01T08:00:00.000Z',
  },
];

let invoicesMockData: FinanceInvoiceListItemDto[] = [
  {
    id: 'invoice-001',
    invoiceNumber: 'INV-1001',

    subscriptionId: 'subscription-001',
    subscriptionCode: 'SUB-1001',

    studentId: 'student-001',
    studentName: 'Mohammed Khaled',
    studentCode: 'STU-1001',

    parentId: 'parent-001',
    parentName: 'Khaled Ahmed',
    parentPhone: '+971 50 111 2222',

    issueDate: '2026-05-01',
    dueDate: '2026-05-05',

    status: 'paid',

    currency: 'AED',

    subtotal: 1200,
    discountAmount: 120,
    taxAmount: 0,
    totalAmount: 1080,

    paidAmount: 1080,
    balanceDue: 0,

    createdAt: '2026-05-01T08:00:00.000Z',
    updatedAt: '2026-05-01T08:00:00.000Z',
  },
  {
    id: 'invoice-002',
    invoiceNumber: 'INV-1002',

    subscriptionId: 'subscription-002',
    subscriptionCode: 'SUB-1002',

    studentId: 'student-002',
    studentName: 'Omar Ahmed',
    studentCode: 'STU-1002',

    parentId: 'parent-002',
    parentName: 'Ahmed Omar',
    parentPhone: '+971 50 222 3333',

    issueDate: '2026-05-10',
    dueDate: '2026-06-15',

    status: 'partially_paid',

    currency: 'AED',

    subtotal: 3300,
    discountAmount: 300,
    taxAmount: 0,
    totalAmount: 3000,

    paidAmount: 1500,
    balanceDue: 1500,

    createdAt: '2026-05-10T08:00:00.000Z',
    updatedAt: '2026-05-16T08:00:00.000Z',
  },
  {
    id: 'invoice-003',
    invoiceNumber: 'INV-1003',

    subscriptionId: 'subscription-003',
    subscriptionCode: 'SUB-1003',

    studentId: 'student-003',
    studentName: 'Layan Omar',
    studentCode: 'STU-1003',

    parentId: 'parent-003',
    parentName: 'Omar Salem',
    parentPhone: '+971 55 111 2222',

    issueDate: '2026-05-05',
    dueDate: '2026-05-10',

    status: 'paid',

    currency: 'AED',

    subtotal: 950,
    discountAmount: 0,
    taxAmount: 0,
    totalAmount: 950,

    paidAmount: 950,
    balanceDue: 0,

    createdAt: '2026-05-05T08:00:00.000Z',
    updatedAt: '2026-05-05T08:00:00.000Z',
  },
  {
    id: 'invoice-004',
    invoiceNumber: 'INV-1004',

    subscriptionId: 'subscription-004',
    subscriptionCode: 'SUB-1004',

    studentId: 'student-004',
    studentName: 'Mariam Hassan',
    studentCode: 'STU-1004',

    parentId: 'parent-004',
    parentName: 'Hassan Ali',
    parentPhone: '+971 55 222 3333',

    issueDate: '2026-04-01',
    dueDate: '2026-04-10',

    status: 'overdue',

    currency: 'AED',

    subtotal: 850,
    discountAmount: 42.5,
    taxAmount: 0,
    totalAmount: 807.5,

    paidAmount: 400,
    balanceDue: 407.5,

    createdAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-05-01T08:00:00.000Z',
  },
];

let paymentsMockData: FinancePaymentListItemDto[] = [
  {
    id: 'payment-001',
    paymentCode: 'PAY-1001',

    invoiceId: 'invoice-001',
    invoiceNumber: 'INV-1001',

    subscriptionId: 'subscription-001',
    subscriptionCode: 'SUB-1001',

    studentId: 'student-001',
    studentName: 'Mohammed Khaled',
    studentCode: 'STU-1001',

    parentId: 'parent-001',
    parentName: 'Khaled Ahmed',
    parentPhone: '+971 50 111 2222',

    paymentDate: '2026-05-01',
    paymentMethod: 'card',
    status: 'paid',

    transactionType: 'subscription_payment',

    currency: 'AED',
    amount: 1080,

    referenceNumber: 'CARD-REF-1001',
    receivedBy: 'Admin User',

    notes: 'Full monthly subscription payment.',

    createdAt: '2026-05-01T08:00:00.000Z',
    updatedAt: '2026-05-01T08:00:00.000Z',
  },
  {
    id: 'payment-002',
    paymentCode: 'PAY-1002',

    invoiceId: 'invoice-002',
    invoiceNumber: 'INV-1002',

    subscriptionId: 'subscription-002',
    subscriptionCode: 'SUB-1002',

    studentId: 'student-002',
    studentName: 'Omar Ahmed',
    studentCode: 'STU-1002',

    parentId: 'parent-002',
    parentName: 'Ahmed Omar',
    parentPhone: '+971 50 222 3333',

    paymentDate: '2026-05-16',
    paymentMethod: 'bank_transfer',
    status: 'paid',

    transactionType: 'subscription_payment',

    currency: 'AED',
    amount: 1500,

    referenceNumber: 'BANK-TRF-1002',
    receivedBy: 'Finance Admin',

    notes: 'First installment for quarterly subscription.',

    createdAt: '2026-05-16T08:00:00.000Z',
    updatedAt: '2026-05-16T08:00:00.000Z',
  },
  {
    id: 'payment-003',
    paymentCode: 'PAY-1003',

    invoiceId: 'invoice-003',
    invoiceNumber: 'INV-1003',

    subscriptionId: 'subscription-003',
    subscriptionCode: 'SUB-1003',

    studentId: 'student-003',
    studentName: 'Layan Omar',
    studentCode: 'STU-1003',

    parentId: 'parent-003',
    parentName: 'Omar Salem',
    parentPhone: '+971 55 111 2222',

    paymentDate: '2026-05-05',
    paymentMethod: 'cash',
    status: 'paid',

    transactionType: 'subscription_payment',

    currency: 'AED',
    amount: 950,

    referenceNumber: 'CASH-1003',
    receivedBy: 'Reception',

    notes: null,

    createdAt: '2026-05-05T08:00:00.000Z',
    updatedAt: '2026-05-05T08:00:00.000Z',
  },
  {
    id: 'payment-004',
    paymentCode: 'PAY-1004',

    invoiceId: 'invoice-004',
    invoiceNumber: 'INV-1004',

    subscriptionId: 'subscription-004',
    subscriptionCode: 'SUB-1004',

    studentId: 'student-004',
    studentName: 'Mariam Hassan',
    studentCode: 'STU-1004',

    parentId: 'parent-004',
    parentName: 'Hassan Ali',
    parentPhone: '+971 55 222 3333',

    paymentDate: '2026-04-05',
    paymentMethod: 'cash',
    status: 'paid',

    transactionType: 'subscription_payment',

    currency: 'AED',
    amount: 400,

    referenceNumber: 'CASH-1004',
    receivedBy: 'Reception',

    notes: 'Partial payment.',

    createdAt: '2026-04-05T08:00:00.000Z',
    updatedAt: '2026-04-05T08:00:00.000Z',
  },
];

const invoiceLineItemsMockData: Record<string, FinanceInvoiceLineItemDto[]> = {
  'invoice-001': [
    {
      id: 'line-001',
      description: 'Football Academy - Monthly Subscription',
      quantity: 1,
      unitPrice: 1200,
      discountAmount: 120,
      taxAmount: 0,
      totalAmount: 1080,
    },
  ],
  'invoice-002': [
    {
      id: 'line-002',
      description: 'Football Academy - Quarterly Subscription',
      quantity: 1,
      unitPrice: 3300,
      discountAmount: 300,
      taxAmount: 0,
      totalAmount: 3000,
    },
  ],
  'invoice-003': [
    {
      id: 'line-003',
      description: 'Swimming Program - Monthly Subscription',
      quantity: 1,
      unitPrice: 950,
      discountAmount: 0,
      taxAmount: 0,
      totalAmount: 950,
    },
  ],
  'invoice-004': [
    {
      id: 'line-004',
      description: 'Basketball Training - Monthly Subscription',
      quantity: 1,
      unitPrice: 850,
      discountAmount: 42.5,
      taxAmount: 0,
      totalAmount: 807.5,
    },
  ],
};

function createId(prefix: string) {
  return `${prefix}-${Date.now()}`;
}

function createSubscriptionCode() {
  return `SUB-${subscriptionsMockData.length + 1001}`;
}

function createInvoiceNumber() {
  return `INV-${invoicesMockData.length + 1001}`;
}

function createPaymentCode() {
  return `PAY-${paymentsMockData.length + 1001}`;
}

function calculateDiscountAmount(
  baseAmount: number,
  discountType: FinanceDiscountType,
  discountValue: number,
) {
  if (discountType === 'percentage') {
    return Number(((baseAmount * discountValue) / 100).toFixed(2));
  }

  if (discountType === 'fixed_amount') {
    return Number(Math.min(discountValue, baseAmount).toFixed(2));
  }

  return 0;
}

function calculateBalance(totalAmount: number, paidAmount: number) {
  return Number(Math.max(totalAmount - paidAmount, 0).toFixed(2));
}

function calculateSessionsRemaining(
  sessionsIncluded: number,
  sessionsUsed: number,
) {
  return Math.max(sessionsIncluded - sessionsUsed, 0);
}

function getInvoiceStatus(
  totalAmount: number,
  paidAmount: number,
  dueDate: string,
  currentStatus?: FinanceInvoiceStatus,
): FinanceInvoiceStatus {
  if (currentStatus === 'cancelled' || currentStatus === 'draft') {
    return currentStatus;
  }

  if (paidAmount >= totalAmount) {
    return 'paid';
  }

  if (paidAmount > 0 && paidAmount < totalAmount) {
    return 'partially_paid';
  }

  const today = new Date().toISOString().slice(0, 10);

  if (dueDate < today) {
    return 'overdue';
  }

  return 'issued';
}

function normalizeSubscription(
  subscription: FinanceSubscriptionListItemDto,
): FinanceSubscriptionListItemDto {
  const discountAmount = calculateDiscountAmount(
    subscription.baseAmount,
    subscription.discountType,
    subscription.discountValue,
  );

  const totalAmount = Number(
    (subscription.baseAmount - discountAmount).toFixed(2),
  );

  const paidAmount = Number(subscription.paidAmount.toFixed(2));
  const balanceDue = calculateBalance(totalAmount, paidAmount);

  return {
    ...subscription,
    discountAmount,
    totalAmount,
    paidAmount,
    balanceDue,
    sessionsRemaining: calculateSessionsRemaining(
      subscription.sessionsIncluded,
      subscription.sessionsUsed,
    ),
  };
}

function normalizeInvoice(
  invoice: FinanceInvoiceListItemDto,
): FinanceInvoiceListItemDto {
  const totalAmount = Number(
    (invoice.subtotal - invoice.discountAmount + invoice.taxAmount).toFixed(2),
  );

  const paidAmount = Number(invoice.paidAmount.toFixed(2));
  const balanceDue = calculateBalance(totalAmount, paidAmount);

  return {
    ...invoice,
    totalAmount,
    paidAmount,
    balanceDue,
    status: getInvoiceStatus(totalAmount, paidAmount, invoice.dueDate, invoice.status),
  };
}

function findStudent(studentId: string) {
  return studentsMockData.find((student) => student.id === studentId);
}

function findProgram(programId: string) {
  return programsMockData.find((program) => program.id === programId);
}

function findBranch(branchId: string) {
  return branchesMockData.find((branch) => branch.id === branchId);
}

function getSubscriptionInvoices(subscriptionId: string) {
  return invoicesMockData
    .filter((invoice) => invoice.subscriptionId === subscriptionId)
    .map(normalizeInvoice);
}

function getSubscriptionPayments(subscriptionId: string) {
  return paymentsMockData.filter(
    (payment) => payment.subscriptionId === subscriptionId,
  );
}

function getInvoicePayments(invoiceId: string) {
  return paymentsMockData.filter((payment) => payment.invoiceId === invoiceId);
}

function matchesDateRange(date: string, dateFrom?: string, dateTo?: string) {
  const matchesFrom = !dateFrom || date >= dateFrom;
  const matchesTo = !dateTo || date <= dateTo;

  return matchesFrom && matchesTo;
}

function filterSubscriptions(
  subscriptions: FinanceSubscriptionListItemDto[],
  filters?: FinanceFiltersDto,
) {
  if (!filters) return subscriptions;

  return subscriptions.filter((subscription) => {
    const searchValue = filters.search?.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      subscription.subscriptionCode.toLowerCase().includes(searchValue) ||
      subscription.studentName.toLowerCase().includes(searchValue) ||
      subscription.studentCode.toLowerCase().includes(searchValue) ||
      subscription.parentName.toLowerCase().includes(searchValue) ||
      subscription.parentPhone.toLowerCase().includes(searchValue) ||
      subscription.programName.toLowerCase().includes(searchValue) ||
      subscription.branchName.toLowerCase().includes(searchValue);

    const matchesStatus =
      !filters.subscriptionStatus ||
      filters.subscriptionStatus === 'all' ||
      subscription.status === filters.subscriptionStatus;

    const matchesBranch =
      !filters.branchId ||
      filters.branchId === 'all' ||
      subscription.branchId === filters.branchId;

    const matchesProgram =
      !filters.programId ||
      filters.programId === 'all' ||
      subscription.programId === filters.programId;

    const matchesDate = matchesDateRange(
      subscription.startDate,
      filters.dateFrom,
      filters.dateTo,
    );

    return matchesSearch && matchesStatus && matchesBranch && matchesProgram && matchesDate;
  });
}

function filterInvoices(
  invoices: FinanceInvoiceListItemDto[],
  filters?: FinanceFiltersDto,
) {
  if (!filters) return invoices;

  return invoices.filter((invoice) => {
    const searchValue = filters.search?.trim().toLowerCase();

    const subscription = invoice.subscriptionId
      ? subscriptionsMockData.find((item) => item.id === invoice.subscriptionId)
      : null;

    const matchesSearch =
      !searchValue ||
      invoice.invoiceNumber.toLowerCase().includes(searchValue) ||
      invoice.studentName.toLowerCase().includes(searchValue) ||
      invoice.studentCode.toLowerCase().includes(searchValue) ||
      invoice.parentName.toLowerCase().includes(searchValue) ||
      invoice.parentPhone.toLowerCase().includes(searchValue) ||
      invoice.subscriptionCode?.toLowerCase().includes(searchValue) ||
      subscription?.programName.toLowerCase().includes(searchValue) ||
      subscription?.branchName.toLowerCase().includes(searchValue);

    const matchesStatus =
      !filters.invoiceStatus ||
      filters.invoiceStatus === 'all' ||
      invoice.status === filters.invoiceStatus;

    const matchesBranch =
      !filters.branchId ||
      filters.branchId === 'all' ||
      !subscription ||
      subscription.branchId === filters.branchId;

    const matchesProgram =
      !filters.programId ||
      filters.programId === 'all' ||
      !subscription ||
      subscription.programId === filters.programId;

    const matchesDate = matchesDateRange(
      invoice.issueDate,
      filters.dateFrom,
      filters.dateTo,
    );

    return matchesSearch && matchesStatus && matchesBranch && matchesProgram && matchesDate;
  });
}

function filterPayments(
  payments: FinancePaymentListItemDto[],
  filters?: FinanceFiltersDto,
) {
  if (!filters) return payments;

  return payments.filter((payment) => {
    const searchValue = filters.search?.trim().toLowerCase();

    const subscription = payment.subscriptionId
      ? subscriptionsMockData.find((item) => item.id === payment.subscriptionId)
      : null;

    const matchesSearch =
      !searchValue ||
      payment.paymentCode.toLowerCase().includes(searchValue) ||
      payment.studentName.toLowerCase().includes(searchValue) ||
      payment.studentCode.toLowerCase().includes(searchValue) ||
      payment.parentName.toLowerCase().includes(searchValue) ||
      payment.parentPhone.toLowerCase().includes(searchValue) ||
      payment.invoiceNumber?.toLowerCase().includes(searchValue) ||
      payment.subscriptionCode?.toLowerCase().includes(searchValue) ||
      payment.referenceNumber?.toLowerCase().includes(searchValue) ||
      subscription?.programName.toLowerCase().includes(searchValue) ||
      subscription?.branchName.toLowerCase().includes(searchValue);

    const matchesPaymentStatus =
      !filters.paymentStatus ||
      filters.paymentStatus === 'all' ||
      payment.status === filters.paymentStatus;

    const matchesPaymentMethod =
      !filters.paymentMethod ||
      filters.paymentMethod === 'all' ||
      payment.paymentMethod === filters.paymentMethod;

    const matchesBranch =
      !filters.branchId ||
      filters.branchId === 'all' ||
      !subscription ||
      subscription.branchId === filters.branchId;

    const matchesProgram =
      !filters.programId ||
      filters.programId === 'all' ||
      !subscription ||
      subscription.programId === filters.programId;

    const matchesDate = matchesDateRange(
      payment.paymentDate,
      filters.dateFrom,
      filters.dateTo,
    );

    return (
      matchesSearch &&
      matchesPaymentStatus &&
      matchesPaymentMethod &&
      matchesBranch &&
      matchesProgram &&
      matchesDate
    );
  });
}

function getFinanceSummary(
  subscriptions: FinanceSubscriptionListItemDto[],
  invoices: FinanceInvoiceListItemDto[],
  payments: FinancePaymentListItemDto[],
): FinanceSummaryDto {
  const totalRevenue = subscriptions.reduce(
    (total, subscription) => total + subscription.totalAmount,
    0,
  );

  const totalCollected = payments
    .filter((payment) => payment.status === 'paid')
    .reduce((total, payment) => total + payment.amount, 0);

  const totalOutstanding = invoices.reduce(
    (total, invoice) => total + invoice.balanceDue,
    0,
  );

  const totalOverdue = invoices
    .filter((invoice) => invoice.status === 'overdue')
    .reduce((total, invoice) => total + invoice.balanceDue, 0);

  const collectionRate =
    totalRevenue > 0 ? Number(((totalCollected / totalRevenue) * 100).toFixed(1)) : 0;

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalCollected: Number(totalCollected.toFixed(2)),
    totalOutstanding: Number(totalOutstanding.toFixed(2)),
    totalOverdue: Number(totalOverdue.toFixed(2)),

    activeSubscriptions: subscriptions.filter(
      (subscription) => subscription.status === 'active',
    ).length,

    expiredSubscriptions: subscriptions.filter(
      (subscription) => subscription.status === 'expired',
    ).length,

    pendingSubscriptions: subscriptions.filter(
      (subscription) => subscription.status === 'pending',
    ).length,

    paidInvoices: invoices.filter((invoice) => invoice.status === 'paid').length,

    unpaidInvoices: invoices.filter(
      (invoice) =>
        invoice.status === 'issued' || invoice.status === 'partially_paid',
    ).length,

    overdueInvoices: invoices.filter((invoice) => invoice.status === 'overdue')
      .length,

    successfulPayments: payments.filter((payment) => payment.status === 'paid')
      .length,

    failedPayments: payments.filter((payment) => payment.status === 'failed')
      .length,

    refundedPayments: payments.filter((payment) => payment.status === 'refunded')
      .length,

    currency: 'AED',
    collectionRate,
  };
}

function buildRevenueByMonth(payments: FinancePaymentListItemDto[]): FinanceChartPointDto[] {
  const monthMap = new Map<string, number>();

  payments
    .filter((payment) => payment.status === 'paid')
    .forEach((payment) => {
      const month = payment.paymentDate.slice(0, 7);
      monthMap.set(month, (monthMap.get(month) ?? 0) + payment.amount);
    });

  return Array.from(monthMap.entries()).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2)),
  }));
}

function buildRevenueByProgram(
  subscriptions: FinanceSubscriptionListItemDto[],
): FinanceChartPointDto[] {
  const programMap = new Map<string, number>();

  subscriptions.forEach((subscription) => {
    programMap.set(
      subscription.programName,
      (programMap.get(subscription.programName) ?? 0) + subscription.totalAmount,
    );
  });

  return Array.from(programMap.entries()).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2)),
  }));
}

function buildRevenueByBranch(
  subscriptions: FinanceSubscriptionListItemDto[],
): FinanceChartPointDto[] {
  const branchMap = new Map<string, number>();

  subscriptions.forEach((subscription) => {
    branchMap.set(
      subscription.branchName,
      (branchMap.get(subscription.branchName) ?? 0) + subscription.totalAmount,
    );
  });

  return Array.from(branchMap.entries()).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2)),
  }));
}

function buildPaymentMethodBreakdown(
  payments: FinancePaymentListItemDto[],
): FinanceChartPointDto[] {
  const methodMap = new Map<FinancePaymentMethod, number>();

  payments.forEach((payment) => {
    methodMap.set(
      payment.paymentMethod,
      (methodMap.get(payment.paymentMethod) ?? 0) + payment.amount,
    );
  });

  return Array.from(methodMap.entries()).map(([label, value]) => ({
    label,
    value: Number(value.toFixed(2)),
  }));
}

function createStudentSummaryFromPayload(payload: {
  studentId: string;
  studentCode: string;
  studentName: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
}): FinanceStudentSummaryDto {
  return (
    findStudent(payload.studentId) ?? {
      id: payload.studentId,
      studentCode: payload.studentCode,
      fullName: payload.studentName,
      age: 0,
      parentId: payload.parentId,
      parentName: payload.parentName,
      parentPhone: payload.parentPhone,
      parentEmail: '',
    }
  );
}

function createProgramSummaryFromSubscription(
  subscription: FinanceSubscriptionListItemDto,
): FinanceProgramSummaryDto {
  return (
    findProgram(subscription.programId) ?? {
      id: subscription.programId,
      programCode: subscription.programId.toUpperCase(),
      name: subscription.programName,
      sportType: 'other',
    }
  );
}

function createBranchSummaryFromSubscription(
  subscription: FinanceSubscriptionListItemDto,
): FinanceBranchSummaryDto {
  return (
    findBranch(subscription.branchId) ?? {
      id: subscription.branchId,
      name: subscription.branchName,
      city: '',
      area: '',
    }
  );
}

export async function getFinanceDashboard(
  filters?: FinanceFiltersDto,
): Promise<FinanceDashboardDto> {
  await mockDelay();

  const normalizedSubscriptions = subscriptionsMockData.map(normalizeSubscription);
  const normalizedInvoices = invoicesMockData.map(normalizeInvoice);

  subscriptionsMockData = normalizedSubscriptions;
  invoicesMockData = normalizedInvoices;

  const filteredSubscriptions = filterSubscriptions(normalizedSubscriptions, filters);
  const filteredInvoices = filterInvoices(normalizedInvoices, filters);
  const filteredPayments = filterPayments(paymentsMockData, filters);

  return {
    summary: getFinanceSummary(
      filteredSubscriptions,
      filteredInvoices,
      filteredPayments,
    ),

    subscriptions: filteredSubscriptions,
    invoices: filteredInvoices,
    payments: filteredPayments,

    revenueByMonth: buildRevenueByMonth(filteredPayments),
    revenueByProgram: buildRevenueByProgram(filteredSubscriptions),
    revenueByBranch: buildRevenueByBranch(filteredSubscriptions),
    paymentMethodBreakdown: buildPaymentMethodBreakdown(filteredPayments),
  };
}

export async function getFinanceSubscriptions(
  filters?: FinanceFiltersDto,
): Promise<FinanceSubscriptionListItemDto[]> {
  await mockDelay();

  const normalizedSubscriptions = subscriptionsMockData.map(normalizeSubscription);

  subscriptionsMockData = normalizedSubscriptions;

  return filterSubscriptions(normalizedSubscriptions, filters);
}

export async function getFinanceSubscriptionById(
  subscriptionId: string,
): Promise<FinanceSubscriptionDetailsDto | null> {
  await mockDelay();

  const subscription = subscriptionsMockData
    .map(normalizeSubscription)
    .find((item) => item.id === subscriptionId);

  if (!subscription) {
    return null;
  }

  return {
    ...subscription,

    student: createStudentSummaryFromPayload(subscription),
    program: createProgramSummaryFromSubscription(subscription),
    branch: createBranchSummaryFromSubscription(subscription),

    notes: null,

    invoices: getSubscriptionInvoices(subscription.id),
    payments: getSubscriptionPayments(subscription.id),
  };
}

export async function createFinanceSubscription(
  payload: CreateSubscriptionRequestDto,
): Promise<FinanceSubscriptionDetailsDto> {
  await mockDelay();

  const now = new Date().toISOString();

  const discountAmount = calculateDiscountAmount(
    payload.baseAmount,
    payload.discountType,
    payload.discountValue,
  );

  const totalAmount = Number((payload.baseAmount - discountAmount).toFixed(2));
  const paidAmount = Number((payload.paidAmount ?? 0).toFixed(2));

  const newSubscription = normalizeSubscription({
    id: createId('subscription'),
    subscriptionCode: createSubscriptionCode(),

    studentId: payload.studentId,
    studentName: payload.studentName,
    studentCode: payload.studentCode,

    parentId: payload.parentId,
    parentName: payload.parentName,
    parentPhone: payload.parentPhone,

    programId: payload.programId,
    programName: payload.programName,

    branchId: payload.branchId,
    branchName: payload.branchName,

    plan: payload.plan,
    status: payload.status ?? 'pending',

    startDate: payload.startDate,
    endDate: payload.endDate,

    sessionsIncluded: payload.sessionsIncluded,
    sessionsUsed: payload.sessionsUsed ?? 0,
    sessionsRemaining: calculateSessionsRemaining(
      payload.sessionsIncluded,
      payload.sessionsUsed ?? 0,
    ),

    currency: payload.currency,

    baseAmount: payload.baseAmount,
    discountType: payload.discountType,
    discountValue: payload.discountValue,
    discountAmount,

    totalAmount,
    paidAmount,
    balanceDue: calculateBalance(totalAmount, paidAmount),

    nextPaymentDueDate: payload.nextPaymentDueDate ?? null,

    createdAt: now,
    updatedAt: now,
  });

  subscriptionsMockData = [newSubscription, ...subscriptionsMockData];

  return {
    ...newSubscription,

    student: createStudentSummaryFromPayload(newSubscription),
    program: createProgramSummaryFromSubscription(newSubscription),
    branch: createBranchSummaryFromSubscription(newSubscription),

    notes: payload.notes ?? null,

    invoices: [],
    payments: [],
  };
}

export async function updateFinanceSubscription(
  subscriptionId: string,
  payload: UpdateSubscriptionRequestDto,
): Promise<FinanceSubscriptionDetailsDto | null> {
  await mockDelay();

  const currentSubscription = subscriptionsMockData.find(
    (subscription) => subscription.id === subscriptionId,
  );

  if (!currentSubscription) {
    return null;
  }

  const updatedSubscription = normalizeSubscription({
    ...currentSubscription,

    studentId: payload.studentId ?? currentSubscription.studentId,
    studentName: payload.studentName ?? currentSubscription.studentName,
    studentCode: payload.studentCode ?? currentSubscription.studentCode,

    parentId: payload.parentId ?? currentSubscription.parentId,
    parentName: payload.parentName ?? currentSubscription.parentName,
    parentPhone: payload.parentPhone ?? currentSubscription.parentPhone,

    programId: payload.programId ?? currentSubscription.programId,
    programName: payload.programName ?? currentSubscription.programName,

    branchId: payload.branchId ?? currentSubscription.branchId,
    branchName: payload.branchName ?? currentSubscription.branchName,

    plan: payload.plan ?? currentSubscription.plan,
    status: payload.status ?? currentSubscription.status,

    startDate: payload.startDate ?? currentSubscription.startDate,
    endDate: payload.endDate ?? currentSubscription.endDate,

    sessionsIncluded:
      payload.sessionsIncluded ?? currentSubscription.sessionsIncluded,

    sessionsUsed: payload.sessionsUsed ?? currentSubscription.sessionsUsed,

    currency: payload.currency ?? currentSubscription.currency,

    baseAmount: payload.baseAmount ?? currentSubscription.baseAmount,
    discountType: payload.discountType ?? currentSubscription.discountType,
    discountValue: payload.discountValue ?? currentSubscription.discountValue,

    paidAmount: payload.paidAmount ?? currentSubscription.paidAmount,

    nextPaymentDueDate:
      payload.nextPaymentDueDate === undefined
        ? currentSubscription.nextPaymentDueDate
        : payload.nextPaymentDueDate,

    updatedAt: new Date().toISOString(),
  });

  subscriptionsMockData = subscriptionsMockData.map((subscription) =>
    subscription.id === subscriptionId ? updatedSubscription : subscription,
  );

  return getFinanceSubscriptionById(subscriptionId);
}

export async function deleteFinanceSubscription(
  subscriptionId: string,
): Promise<DeleteFinanceRecordResponseDto> {
  await mockDelay();

  const exists = subscriptionsMockData.some(
    (subscription) => subscription.id === subscriptionId,
  );

  subscriptionsMockData = subscriptionsMockData.filter(
    (subscription) => subscription.id !== subscriptionId,
  );

  return {
    id: subscriptionId,
    deleted: exists,
  };
}

export async function getFinanceInvoices(
  filters?: FinanceFiltersDto,
): Promise<FinanceInvoiceListItemDto[]> {
  await mockDelay();

  const normalizedInvoices = invoicesMockData.map(normalizeInvoice);

  invoicesMockData = normalizedInvoices;

  return filterInvoices(normalizedInvoices, filters);
}

export async function getFinanceInvoiceById(
  invoiceId: string,
): Promise<FinanceInvoiceDetailsDto | null> {
  await mockDelay();

  const invoice = invoicesMockData
    .map(normalizeInvoice)
    .find((item) => item.id === invoiceId);

  if (!invoice) {
    return null;
  }

  const student = createStudentSummaryFromPayload(invoice);

  return {
    ...invoice,

    student,

    lineItems: invoiceLineItemsMockData[invoice.id] ?? [],

    payments: getInvoicePayments(invoice.id),

    notes: null,
    terms: 'Payment should be completed before the due date.',
  };
}

export async function createFinanceInvoice(
  payload: CreateInvoiceRequestDto,
): Promise<FinanceInvoiceDetailsDto> {
  await mockDelay();

  const now = new Date().toISOString();

  const subtotal = payload.lineItems.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );

  const discountAmount = payload.discountAmount ?? 0;
  const taxAmount = payload.taxAmount ?? 0;
  const totalAmount = Number((subtotal - discountAmount + taxAmount).toFixed(2));
  const paidAmount = Number((payload.paidAmount ?? 0).toFixed(2));

  const newInvoice = normalizeInvoice({
    id: createId('invoice'),
    invoiceNumber: createInvoiceNumber(),

    subscriptionId: payload.subscriptionId ?? null,
    subscriptionCode: payload.subscriptionCode ?? null,

    studentId: payload.studentId,
    studentName: payload.studentName,
    studentCode: payload.studentCode,

    parentId: payload.parentId,
    parentName: payload.parentName,
    parentPhone: payload.parentPhone,

    issueDate: payload.issueDate,
    dueDate: payload.dueDate,

    status: payload.status ?? 'issued',

    currency: payload.currency,

    subtotal,
    discountAmount,
    taxAmount,
    totalAmount,

    paidAmount,
    balanceDue: calculateBalance(totalAmount, paidAmount),

    createdAt: now,
    updatedAt: now,
  });

  invoicesMockData = [newInvoice, ...invoicesMockData];
  invoiceLineItemsMockData[newInvoice.id] = payload.lineItems;

  const student = createStudentSummaryFromPayload(newInvoice);

  return {
    ...newInvoice,

    student,

    lineItems: payload.lineItems,
    payments: [],

    notes: payload.notes ?? null,
    terms: payload.terms ?? null,
  };
}

export async function updateFinanceInvoice(
  invoiceId: string,
  payload: UpdateInvoiceRequestDto,
): Promise<FinanceInvoiceDetailsDto | null> {
  await mockDelay();

  const currentInvoice = invoicesMockData.find((invoice) => invoice.id === invoiceId);

  if (!currentInvoice) {
    return null;
  }

  const lineItems = payload.lineItems ?? invoiceLineItemsMockData[invoiceId] ?? [];

  const subtotal = lineItems.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );

  const updatedInvoice = normalizeInvoice({
    ...currentInvoice,

    subscriptionId:
      payload.subscriptionId === undefined
        ? currentInvoice.subscriptionId
        : payload.subscriptionId,

    subscriptionCode:
      payload.subscriptionCode === undefined
        ? currentInvoice.subscriptionCode
        : payload.subscriptionCode,

    studentId: payload.studentId ?? currentInvoice.studentId,
    studentName: payload.studentName ?? currentInvoice.studentName,
    studentCode: payload.studentCode ?? currentInvoice.studentCode,

    parentId: payload.parentId ?? currentInvoice.parentId,
    parentName: payload.parentName ?? currentInvoice.parentName,
    parentPhone: payload.parentPhone ?? currentInvoice.parentPhone,

    issueDate: payload.issueDate ?? currentInvoice.issueDate,
    dueDate: payload.dueDate ?? currentInvoice.dueDate,

    status: payload.status ?? currentInvoice.status,

    currency: payload.currency ?? currentInvoice.currency,

    subtotal,
    discountAmount: payload.discountAmount ?? currentInvoice.discountAmount,
    taxAmount: payload.taxAmount ?? currentInvoice.taxAmount,

    paidAmount: payload.paidAmount ?? currentInvoice.paidAmount,

    updatedAt: new Date().toISOString(),
  });

  invoicesMockData = invoicesMockData.map((invoice) =>
    invoice.id === invoiceId ? updatedInvoice : invoice,
  );

  invoiceLineItemsMockData[invoiceId] = lineItems;

  return getFinanceInvoiceById(invoiceId);
}

export async function deleteFinanceInvoice(
  invoiceId: string,
): Promise<DeleteFinanceRecordResponseDto> {
  await mockDelay();

  const exists = invoicesMockData.some((invoice) => invoice.id === invoiceId);

  invoicesMockData = invoicesMockData.filter((invoice) => invoice.id !== invoiceId);
  delete invoiceLineItemsMockData[invoiceId];

  return {
    id: invoiceId,
    deleted: exists,
  };
}

export async function getFinancePayments(
  filters?: FinanceFiltersDto,
): Promise<FinancePaymentListItemDto[]> {
  await mockDelay();

  return filterPayments(paymentsMockData, filters);
}

export async function getFinancePaymentById(
  paymentId: string,
): Promise<FinancePaymentDetailsDto | null> {
  await mockDelay();

  const payment = paymentsMockData.find((item) => item.id === paymentId);

  if (!payment) {
    return null;
  }

  return {
    ...payment,

    student: createStudentSummaryFromPayload(payment),

    invoice: payment.invoiceId
      ? invoicesMockData.map(normalizeInvoice).find(
        (invoice) => invoice.id === payment.invoiceId,
      ) ?? null
      : null,

    subscription: payment.subscriptionId
      ? subscriptionsMockData.map(normalizeSubscription).find(
        (subscription) => subscription.id === payment.subscriptionId,
      ) ?? null
      : null,
  };
}

export async function createFinancePayment(
  payload: CreatePaymentRequestDto,
): Promise<FinancePaymentDetailsDto> {
  await mockDelay();

  const now = new Date().toISOString();

  const newPayment: FinancePaymentListItemDto = {
    id: createId('payment'),
    paymentCode: createPaymentCode(),

    invoiceId: payload.invoiceId ?? null,
    invoiceNumber: payload.invoiceNumber ?? null,

    subscriptionId: payload.subscriptionId ?? null,
    subscriptionCode: payload.subscriptionCode ?? null,

    studentId: payload.studentId,
    studentName: payload.studentName,
    studentCode: payload.studentCode,

    parentId: payload.parentId,
    parentName: payload.parentName,
    parentPhone: payload.parentPhone,

    paymentDate: payload.paymentDate,
    paymentMethod: payload.paymentMethod,
    status: payload.status ?? 'paid',

    transactionType: payload.transactionType,

    currency: payload.currency,
    amount: payload.amount,

    referenceNumber: payload.referenceNumber ?? null,
    receivedBy: payload.receivedBy ?? null,

    notes: payload.notes ?? null,

    createdAt: now,
    updatedAt: now,
  };

  paymentsMockData = [newPayment, ...paymentsMockData];

  if (newPayment.status === 'paid') {
    if (newPayment.invoiceId) {
      invoicesMockData = invoicesMockData.map((invoice) => {
        if (invoice.id !== newPayment.invoiceId) return invoice;

        return normalizeInvoice({
          ...invoice,
          paidAmount: invoice.paidAmount + newPayment.amount,
          updatedAt: now,
        });
      });
    }

    if (newPayment.subscriptionId) {
      subscriptionsMockData = subscriptionsMockData.map((subscription) => {
        if (subscription.id !== newPayment.subscriptionId) return subscription;

        return normalizeSubscription({
          ...subscription,
          paidAmount: subscription.paidAmount + newPayment.amount,
          updatedAt: now,
        });
      });
    }
  }

  const createdPayment = await getFinancePaymentById(newPayment.id);

  if (!createdPayment) {
    throw new Error('Unable to create payment.');
  }

  return createdPayment;
}

export async function updateFinancePayment(
  paymentId: string,
  payload: UpdatePaymentRequestDto,
): Promise<FinancePaymentDetailsDto | null> {
  await mockDelay();

  const currentPayment = paymentsMockData.find((payment) => payment.id === paymentId);

  if (!currentPayment) {
    return null;
  }

  const updatedPayment: FinancePaymentListItemDto = {
    ...currentPayment,

    invoiceId:
      payload.invoiceId === undefined ? currentPayment.invoiceId : payload.invoiceId,

    invoiceNumber:
      payload.invoiceNumber === undefined
        ? currentPayment.invoiceNumber
        : payload.invoiceNumber,

    subscriptionId:
      payload.subscriptionId === undefined
        ? currentPayment.subscriptionId
        : payload.subscriptionId,

    subscriptionCode:
      payload.subscriptionCode === undefined
        ? currentPayment.subscriptionCode
        : payload.subscriptionCode,

    studentId: payload.studentId ?? currentPayment.studentId,
    studentName: payload.studentName ?? currentPayment.studentName,
    studentCode: payload.studentCode ?? currentPayment.studentCode,

    parentId: payload.parentId ?? currentPayment.parentId,
    parentName: payload.parentName ?? currentPayment.parentName,
    parentPhone: payload.parentPhone ?? currentPayment.parentPhone,

    paymentDate: payload.paymentDate ?? currentPayment.paymentDate,
    paymentMethod: payload.paymentMethod ?? currentPayment.paymentMethod,
    status: payload.status ?? currentPayment.status,

    transactionType: payload.transactionType ?? currentPayment.transactionType,

    currency: payload.currency ?? currentPayment.currency,
    amount: payload.amount ?? currentPayment.amount,

    referenceNumber:
      payload.referenceNumber === undefined
        ? currentPayment.referenceNumber
        : payload.referenceNumber,

    receivedBy:
      payload.receivedBy === undefined ? currentPayment.receivedBy : payload.receivedBy,

    notes: payload.notes === undefined ? currentPayment.notes : payload.notes,

    updatedAt: new Date().toISOString(),
  };

  paymentsMockData = paymentsMockData.map((payment) =>
    payment.id === paymentId ? updatedPayment : payment,
  );

  return getFinancePaymentById(paymentId);
}

export async function deleteFinancePayment(
  paymentId: string,
): Promise<DeleteFinanceRecordResponseDto> {
  await mockDelay();

  const exists = paymentsMockData.some((payment) => payment.id === paymentId);

  paymentsMockData = paymentsMockData.filter((payment) => payment.id !== paymentId);

  return {
    id: paymentId,
    deleted: exists,
  };
}

export async function exportFinanceReport(
  payload: ExportFinanceReportRequestDto,
): Promise<ExportFinanceReportResponseDto> {
  await mockDelay(600);

  const timestamp = new Date().toISOString();

  const extensionByFormat: Record<ExportFinanceReportRequestDto['format'], string> = {
    pdf: 'pdf',
    excel: 'xlsx',
    csv: 'csv',
  };

  const extension = extensionByFormat[payload.format];

  return {
    fileName: `${payload.reportType}-${timestamp.slice(0, 10)}.${extension}`,
    fileUrl: '#',
    generatedAt: timestamp,
  };
}