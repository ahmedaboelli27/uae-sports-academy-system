import type { BaseEntity } from '@/types/api.types';

export type SubscriptionStatus = 'active' | 'expired' | 'pending' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Subscription extends BaseEntity {
  studentId: string;
  programId: string;
  parentId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  amount: number;
  currency: 'AED';
}

export interface Payment extends BaseEntity {
  parentId: string;
  subscriptionId?: string | null;
  invoiceId?: string | null;
  amount: number;
  currency: 'AED';
  status: PaymentStatus;
  paidAt?: string | null;
  method?: string | null;
  reference?: string | null;
}

export interface Invoice extends BaseEntity {
  parentId: string;
  subscriptionId?: string | null;
  invoiceNumber: string;
  amount: number;
  currency: 'AED';
  status: InvoiceStatus;
  dueDate: string;
  issuedAt: string;
  paidAt?: string | null;
}

export interface Offer extends BaseEntity {
  title: string;
  description?: string | null;
  discountPercent?: number | null;
  validFrom: string;
  validTo: string;
  active: boolean;
}

export interface Coupon extends BaseEntity {
  code: string;
  offerId: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface Event extends BaseEntity {
  title: string;
  type: 'event' | 'camp';
  startDate: string;
  endDate: string;
  branchId?: string | null;
  description?: string | null;
  status: 'draft' | 'published' | 'cancelled';
}
