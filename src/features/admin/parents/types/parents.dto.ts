export type ParentStatus = "active" | "inactive" | "blocked" | "archived";

export type ParentPaymentStatus = "paid" | "pending" | "overdue" | "mixed";

export type ParentContactPreference = "phone" | "whatsapp" | "email";

export interface ParentChildSummaryDto {
  id: string;
  studentCode: string;
  fullName: string;
  age: number;
  programName: string;
  branchName: string;
  subscriptionStatus: "active" | "expired" | "expiring_soon" | "not_started";
  paymentStatus: "paid" | "pending" | "overdue" | "refunded";
}

export interface ParentListItemDto {
  id: string;

  fullName: string;
  phone: string;
  email: string;
  city: string;

  status: ParentStatus;
  paymentStatus: ParentPaymentStatus;
  preferredContactMethod: ParentContactPreference;

  childrenCount: number;
  activeSubscriptionsCount: number;
  pendingPaymentsCount: number;
  overduePaymentsCount: number;

  totalPaidAmount: number;
  totalOutstandingAmount: number;
  currency: "AED";

  lastContactDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ParentDetailsDto extends ParentListItemDto {
  address: string | null;
  notes: string | null;

  emergencyContactName: string | null;
  emergencyContactPhone: string | null;

  children: ParentChildSummaryDto[];
  recentPayments: ParentPaymentDto[];
  communicationHistory: ParentCommunicationDto[];
}

export interface ParentPaymentDto {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  amount: number;
  currency: "AED";
  status: "paid" | "pending" | "overdue" | "refunded";
  dueDate: string;
  paidAt: string | null;
}

export interface ParentCommunicationDto {
  id: string;
  type: "call" | "whatsapp" | "email" | "meeting";
  title: string;
  description: string;
  date: string;
  handledBy: string;
}

export interface ParentsSummaryDto {
  totalParents: number;
  activeParents: number;
  inactiveParents: number;
  parentsWithPendingPayments: number;
  parentsWithOverduePayments: number;
  parentsWithMultipleChildren: number;
  totalOutstandingAmount: number;
  currency: "AED";
}

export interface ParentsFiltersDto {
  search?: string;
  city?: string;
  status?: ParentStatus | "all";
  paymentStatus?: ParentPaymentStatus | "all";
  preferredContactMethod?: ParentContactPreference | "all";
}

export interface FilterOptionDto {
  value: string;
  label: string;
}

export interface ParentsListResponseDto {
  summary: ParentsSummaryDto;
  parents: ParentListItemDto[];
  filters: {
    cities: FilterOptionDto[];
  };
}

export interface CreateParentRequestDto {
  fullName: string;
  phone: string;
  email: string;
  city: string;

  status?: ParentStatus;
  preferredContactMethod: ParentContactPreference;

  address?: string;
  notes?: string;

  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface UpdateParentRequestDto extends Partial<CreateParentRequestDto> {
  paymentStatus?: ParentPaymentStatus;
}

export interface DeleteParentResponseDto {
  id: string;
  deleted: boolean;
}