import type { Payment } from '@/types/finance.types';
import { seedTimestamps } from '@/data/seed/seed-utils';

export const paymentsSeed: Payment[] = [
  {
    id: 'pay-1',
    parentId: 'p-1',
    subscriptionId: 'sub-1',
    invoiceId: 'inv-1',
    amount: 850,
    currency: 'AED',
    status: 'paid',
    paidAt: '2025-01-05T10:00:00Z',
    method: 'card',
    reference: 'TXN-1001',
    ...seedTimestamps(18),
  },
  {
    id: 'pay-2',
    parentId: 'p-1',
    subscriptionId: 'sub-2',
    amount: 750,
    currency: 'AED',
    status: 'pending',
    method: 'bank_transfer',
    ...seedTimestamps(19),
  },
  {
    id: 'pay-3',
    parentId: 'p-2',
    amount: 850,
    currency: 'AED',
    status: 'pending',
    ...seedTimestamps(20),
  },
];
