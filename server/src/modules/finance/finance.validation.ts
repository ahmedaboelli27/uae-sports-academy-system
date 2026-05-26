import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  studentId: z.string().min(1),
  parentId: z.string().min(1),
  branchId: z.string().min(1),
  programId: z.string().min(1),
  subscriptionCode: z.string().optional(),
  plan: z.enum(['MONTHLY', 'QUARTERLY', 'ANNUAL', 'CUSTOM']).default('MONTHLY'),
  status: z.enum(['ACTIVE', 'EXPIRED', 'PENDING', 'CANCELLED']).default('PENDING'),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: z.string().default('AED'),
});

export const updateSubscriptionSchema = createSubscriptionSchema.partial();

export const createInvoiceSchema = z.object({
  parentId: z.string().min(1),
  studentId: z.string().optional().nullable(),
  subscriptionId: z.string().optional().nullable(),
  invoiceNumber: z.string().optional(),
  amount: z.number().nonnegative(),
  currency: z.string().default('AED'),
  status: z
    .enum(['DRAFT', 'SENT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'])
    .default('DRAFT'),
  dueDate: z.string().min(1),
  issuedAt: z.string().min(1),
  lineItems: z
    .array(
      z.object({
        description: z.string(),
        quantity: z.number().int().positive().default(1),
        unitPrice: z.number().nonnegative(),
        discount: z.number().nonnegative().default(0),
        tax: z.number().nonnegative().default(0),
      }),
    )
    .optional(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export const createPaymentSchema = z.object({
  parentId: z.string().min(1),
  studentId: z.string().optional().nullable(),
  invoiceId: z.string().optional().nullable(),
  subscriptionId: z.string().optional().nullable(),
  paymentCode: z.string().optional(),
  amount: z.number().nonnegative(),
  currency: z.string().default('AED'),
  status: z.enum(['PAID', 'PENDING', 'FAILED', 'REFUNDED']).default('PENDING'),
  method: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE', 'OTHER']).optional(),
  transactionType: z
    .enum(['SUBSCRIPTION_PAYMENT', 'INVOICE_PAYMENT', 'REFUND', 'ADJUSTMENT', 'OTHER'])
    .default('SUBSCRIPTION_PAYMENT'),
  paidAt: z.string().optional().nullable(),
  reference: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updatePaymentSchema = createPaymentSchema.partial();
