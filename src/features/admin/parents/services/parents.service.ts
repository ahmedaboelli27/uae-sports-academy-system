import type {
  CreateParentRequestDto,
  DeleteParentResponseDto,
  FilterOptionDto,
  ParentDetailsDto,
  ParentListItemDto,
  ParentsFiltersDto,
  ParentsListResponseDto,
  ParentsSummaryDto,
  UpdateParentRequestDto,
} from "../types/parents.dto";

function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

const cities: FilterOptionDto[] = [
  { value: "Dubai", label: "Dubai" },
  { value: "Abu Dhabi", label: "Abu Dhabi" },
  { value: "Sharjah", label: "Sharjah" },
  { value: "Ajman", label: "Ajman" },
];

let parentsMockData: ParentDetailsDto[] = [
  {
    id: "parent-001",
    fullName: "Khaled Hassan",
    phone: "+971 50 123 4567",
    email: "khaled@example.com",
    city: "Dubai",

    status: "active",
    paymentStatus: "paid",
    preferredContactMethod: "whatsapp",

    childrenCount: 1,
    activeSubscriptionsCount: 1,
    pendingPaymentsCount: 0,
    overduePaymentsCount: 0,

    totalPaidAmount: 1250,
    totalOutstandingAmount: 0,
    currency: "AED",

    lastContactDate: "2026-05-23",
    createdAt: "2026-05-01T08:00:00.000Z",
    updatedAt: "2026-05-23T08:00:00.000Z",

    address: "Dubai, Nad Al Sheba",
    notes: "Prefers WhatsApp communication after 5 PM.",
    emergencyContactName: "Khaled Hassan",
    emergencyContactPhone: "+971 50 123 4567",

    children: [
      {
        id: "student-001",
        studentCode: "ASP-1001",
        fullName: "Omar Khaled",
        age: 10,
        programName: "Football Academy",
        branchName: "Dubai Branch",
        subscriptionStatus: "active",
        paymentStatus: "paid",
      },
    ],

    recentPayments: [
      {
        id: "pay-001",
        invoiceNumber: "INV-1001",
        studentId: "student-001",
        studentName: "Omar Khaled",
        amount: 1250,
        currency: "AED",
        status: "paid",
        dueDate: "2026-05-01",
        paidAt: "2026-05-01T12:00:00.000Z",
      },
    ],

    communicationHistory: [
      {
        id: "comm-001",
        type: "whatsapp",
        title: "Welcome message sent",
        description: "Parent received registration confirmation and schedule details.",
        date: "2026-05-01",
        handledBy: "Admin Demo",
      },
    ],
  },
  {
    id: "parent-002",
    fullName: "Ali Mohamed",
    phone: "+971 55 222 3344",
    email: "ali@example.com",
    city: "Abu Dhabi",

    status: "active",
    paymentStatus: "pending",
    preferredContactMethod: "phone",

    childrenCount: 1,
    activeSubscriptionsCount: 1,
    pendingPaymentsCount: 1,
    overduePaymentsCount: 0,

    totalPaidAmount: 0,
    totalOutstandingAmount: 950,
    currency: "AED",

    lastContactDate: "2026-05-22",
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-05-22T08:00:00.000Z",

    address: "Abu Dhabi, Khalifa City",
    notes: "Needs follow-up for pending swimming subscription payment.",
    emergencyContactName: "Ali Mohamed",
    emergencyContactPhone: "+971 55 222 3344",

    children: [
      {
        id: "student-002",
        studentCode: "ASP-1002",
        fullName: "Mariam Ali",
        age: 8,
        programName: "Swimming Program",
        branchName: "Abu Dhabi Branch",
        subscriptionStatus: "expiring_soon",
        paymentStatus: "pending",
      },
    ],

    recentPayments: [
      {
        id: "pay-002",
        invoiceNumber: "INV-1002",
        studentId: "student-002",
        studentName: "Mariam Ali",
        amount: 950,
        currency: "AED",
        status: "pending",
        dueDate: "2026-05-28",
        paidAt: null,
      },
    ],

    communicationHistory: [
      {
        id: "comm-002",
        type: "call",
        title: "Payment follow-up call",
        description: "Parent asked to receive payment link again by WhatsApp.",
        date: "2026-05-22",
        handledBy: "Accountant Demo",
      },
    ],
  },
  {
    id: "parent-003",
    fullName: "James Smith",
    phone: "+971 52 778 9000",
    email: "james@example.com",
    city: "Sharjah",

    status: "active",
    paymentStatus: "overdue",
    preferredContactMethod: "email",

    childrenCount: 1,
    activeSubscriptionsCount: 0,
    pendingPaymentsCount: 0,
    overduePaymentsCount: 1,

    totalPaidAmount: 0,
    totalOutstandingAmount: 1100,
    currency: "AED",

    lastContactDate: "2026-05-18",
    createdAt: "2026-02-01T08:00:00.000Z",
    updatedAt: "2026-05-18T08:00:00.000Z",

    address: "Sharjah, University City",
    notes: "Subscription expired. Requires renewal and overdue payment follow-up.",
    emergencyContactName: "James Smith",
    emergencyContactPhone: "+971 52 778 9000",

    children: [
      {
        id: "student-003",
        studentCode: "ASP-1003",
        fullName: "Noah Smith",
        age: 12,
        programName: "Basketball Training",
        branchName: "Sharjah Branch",
        subscriptionStatus: "expired",
        paymentStatus: "overdue",
      },
    ],

    recentPayments: [
      {
        id: "pay-003",
        invoiceNumber: "INV-1003",
        studentId: "student-003",
        studentName: "Noah Smith",
        amount: 1100,
        currency: "AED",
        status: "overdue",
        dueDate: "2026-05-01",
        paidAt: null,
      },
    ],

    communicationHistory: [
      {
        id: "comm-003",
        type: "email",
        title: "Overdue payment reminder",
        description: "Email reminder sent for overdue basketball subscription invoice.",
        date: "2026-05-18",
        handledBy: "Accountant Demo",
      },
    ],
  },
  {
    id: "parent-004",
    fullName: "Hassan Nabil",
    phone: "+971 56 111 2233",
    email: "hassan@example.com",
    city: "Dubai",

    status: "inactive",
    paymentStatus: "mixed",
    preferredContactMethod: "whatsapp",

    childrenCount: 2,
    activeSubscriptionsCount: 1,
    pendingPaymentsCount: 1,
    overduePaymentsCount: 0,

    totalPaidAmount: 800,
    totalOutstandingAmount: 650,
    currency: "AED",

    lastContactDate: "2026-05-20",
    createdAt: "2026-05-15T08:00:00.000Z",
    updatedAt: "2026-05-20T08:00:00.000Z",

    address: "Dubai, Mirdif",
    notes: "Has two children registered. One subscription not started yet.",
    emergencyContactName: "Hassan Nabil",
    emergencyContactPhone: "+971 56 111 2233",

    children: [
      {
        id: "student-004",
        studentCode: "ASP-1004",
        fullName: "Layla Hassan",
        age: 7,
        programName: "Multi-Sport Program",
        branchName: "Dubai Branch",
        subscriptionStatus: "not_started",
        paymentStatus: "refunded",
      },
      {
        id: "student-005",
        studentCode: "ASP-1005",
        fullName: "Yousef Hassan",
        age: 11,
        programName: "Football Academy",
        branchName: "Dubai Branch",
        subscriptionStatus: "active",
        paymentStatus: "pending",
      },
    ],

    recentPayments: [
      {
        id: "pay-004",
        invoiceNumber: "INV-1004",
        studentId: "student-004",
        studentName: "Layla Hassan",
        amount: 800,
        currency: "AED",
        status: "refunded",
        dueDate: "2026-06-01",
        paidAt: null,
      },
      {
        id: "pay-005",
        invoiceNumber: "INV-1005",
        studentId: "student-005",
        studentName: "Yousef Hassan",
        amount: 650,
        currency: "AED",
        status: "pending",
        dueDate: "2026-06-10",
        paidAt: null,
      },
    ],

    communicationHistory: [
      {
        id: "comm-004",
        type: "whatsapp",
        title: "Schedule confirmation",
        description: "Parent confirmed preferred training days for both children.",
        date: "2026-05-20",
        handledBy: "Admin Demo",
      },
    ],
  },
];

function toListItem(parent: ParentDetailsDto): ParentListItemDto {
  return {
    id: parent.id,

    fullName: parent.fullName,
    phone: parent.phone,
    email: parent.email,
    city: parent.city,

    status: parent.status,
    paymentStatus: parent.paymentStatus,
    preferredContactMethod: parent.preferredContactMethod,

    childrenCount: parent.childrenCount,
    activeSubscriptionsCount: parent.activeSubscriptionsCount,
    pendingPaymentsCount: parent.pendingPaymentsCount,
    overduePaymentsCount: parent.overduePaymentsCount,

    totalPaidAmount: parent.totalPaidAmount,
    totalOutstandingAmount: parent.totalOutstandingAmount,
    currency: parent.currency,

    lastContactDate: parent.lastContactDate,
    createdAt: parent.createdAt,
    updatedAt: parent.updatedAt,
  };
}

function getParentsSummary(parents: ParentDetailsDto[]): ParentsSummaryDto {
  return {
    totalParents: parents.length,
    activeParents: parents.filter((parent) => parent.status === "active").length,
    inactiveParents: parents.filter((parent) => parent.status === "inactive")
      .length,
    parentsWithPendingPayments: parents.filter(
      (parent) => parent.pendingPaymentsCount > 0,
    ).length,
    parentsWithOverduePayments: parents.filter(
      (parent) => parent.overduePaymentsCount > 0,
    ).length,
    parentsWithMultipleChildren: parents.filter(
      (parent) => parent.childrenCount > 1,
    ).length,
    totalOutstandingAmount: parents.reduce(
      (total, parent) => total + parent.totalOutstandingAmount,
      0,
    ),
    currency: "AED",
  };
}

function filterParents(
  parents: ParentDetailsDto[],
  filters?: ParentsFiltersDto,
): ParentDetailsDto[] {
  if (!filters) return parents;

  return parents.filter((parent) => {
    const searchValue = filters.search?.trim().toLowerCase();

    const matchesSearch =
      !searchValue ||
      parent.fullName.toLowerCase().includes(searchValue) ||
      parent.phone.toLowerCase().includes(searchValue) ||
      parent.email.toLowerCase().includes(searchValue) ||
      parent.children.some((child) =>
        child.fullName.toLowerCase().includes(searchValue),
      );

    const matchesCity =
      !filters.city || filters.city === "all" || parent.city === filters.city;

    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      parent.status === filters.status;

    const matchesPaymentStatus =
      !filters.paymentStatus ||
      filters.paymentStatus === "all" ||
      parent.paymentStatus === filters.paymentStatus;

    const matchesContactMethod =
      !filters.preferredContactMethod ||
      filters.preferredContactMethod === "all" ||
      parent.preferredContactMethod === filters.preferredContactMethod;

    return (
      matchesSearch &&
      matchesCity &&
      matchesStatus &&
      matchesPaymentStatus &&
      matchesContactMethod
    );
  });
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}`;
}

export async function getParentsList(
  filters?: ParentsFiltersDto,
): Promise<ParentsListResponseDto> {
  await mockDelay();

  const filteredParents = filterParents(parentsMockData, filters);

  return {
    summary: getParentsSummary(parentsMockData),
    parents: filteredParents.map(toListItem),
    filters: {
      cities,
    },
  };
}

export async function getParentById(
  parentId: string,
): Promise<ParentDetailsDto | null> {
  await mockDelay();

  return parentsMockData.find((parent) => parent.id === parentId) ?? null;
}

export async function createParent(
  payload: CreateParentRequestDto,
): Promise<ParentDetailsDto> {
  await mockDelay();

  const now = new Date().toISOString();

  const newParent: ParentDetailsDto = {
    id: createId("parent"),

    fullName: payload.fullName,
    phone: payload.phone,
    email: payload.email,
    city: payload.city,

    status: payload.status ?? "active",
    paymentStatus: "paid",
    preferredContactMethod: payload.preferredContactMethod,

    childrenCount: 0,
    activeSubscriptionsCount: 0,
    pendingPaymentsCount: 0,
    overduePaymentsCount: 0,

    totalPaidAmount: 0,
    totalOutstandingAmount: 0,
    currency: "AED",

    lastContactDate: null,
    createdAt: now,
    updatedAt: now,

    address: payload.address ?? null,
    notes: payload.notes ?? null,

    emergencyContactName: payload.emergencyContactName ?? null,
    emergencyContactPhone: payload.emergencyContactPhone ?? null,

    children: [],
    recentPayments: [],
    communicationHistory: [],
  };

  parentsMockData = [newParent, ...parentsMockData];

  return newParent;
}

export async function updateParent(
  parentId: string,
  payload: UpdateParentRequestDto,
): Promise<ParentDetailsDto | null> {
  await mockDelay();

  const parentIndex = parentsMockData.findIndex(
    (parent) => parent.id === parentId,
  );

  if (parentIndex === -1) {
    return null;
  }

  const currentParent = parentsMockData[parentIndex];
  const now = new Date().toISOString();

  const updatedParent: ParentDetailsDto = {
    ...currentParent,

    fullName: payload.fullName ?? currentParent.fullName,
    phone: payload.phone ?? currentParent.phone,
    email: payload.email ?? currentParent.email,
    city: payload.city ?? currentParent.city,

    status: payload.status ?? currentParent.status,
    paymentStatus: payload.paymentStatus ?? currentParent.paymentStatus,
    preferredContactMethod:
      payload.preferredContactMethod ?? currentParent.preferredContactMethod,

    address: payload.address ?? currentParent.address,
    notes: payload.notes ?? currentParent.notes,

    emergencyContactName:
      payload.emergencyContactName ?? currentParent.emergencyContactName,
    emergencyContactPhone:
      payload.emergencyContactPhone ?? currentParent.emergencyContactPhone,

    updatedAt: now,
  };

  parentsMockData = parentsMockData.map((parent) =>
    parent.id === parentId ? updatedParent : parent,
  );

  return updatedParent;
}

export async function deleteParent(
  parentId: string,
): Promise<DeleteParentResponseDto> {
  await mockDelay();

  const exists = parentsMockData.some((parent) => parent.id === parentId);

  parentsMockData = parentsMockData.filter((parent) => parent.id !== parentId);

  return {
    id: parentId,
    deleted: exists,
  };
}