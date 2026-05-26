import type { Invoice } from '@/types/finance.types';
import { seedTimestamps } from '@/data/seed/seed-utils';

export const invoicesSeed: Invoice[] = [
  {
    id: 'inv-1',
    parentId: 'p-1',
    subscriptionId: 'sub-1',
    invoiceNumber: 'INV-2025-0001',
    amount: 850,
    currency: 'AED',
    status: 'paid',
    dueDate: '2025-01-15',
    issuedAt: '2025-01-01T08:00:00Z',
    paidAt: '2025-01-05T10:00:00Z',
    ...seedTimestamps(18),
  },
  {
    id: 'inv-2',
    parentId: 'p-1',
    subscriptionId: 'sub-2',
    invoiceNumber: 'INV-2025-0002',
    amount: 750,
    currency: 'AED',
    status: 'sent',
    dueDate: '2025-02-15',
    issuedAt: '2025-02-01T08:00:00Z',
    ...seedTimestamps(19),
  },
  {
    id: 'inv-3',
    parentId: 'p-2',
    invoiceNumber: 'INV-2025-0003',
    amount: 850,
    currency: 'AED',
    status: 'overdue',
    dueDate: '2025-01-10',
    issuedAt: '2024-12-20T08:00:00Z',
    ...seedTimestamps(20),
  },
];
