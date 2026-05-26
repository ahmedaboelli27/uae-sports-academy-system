import type { Subscription } from '@/types/finance.types';
import { seedTimestamps } from '@/data/seed/seed-utils';

export const subscriptionsSeed: Subscription[] = [
  {
    id: 'sub-1',
    studentId: 's-1',
    programId: 'prog-1',
    parentId: 'p-1',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    amount: 850,
    currency: 'AED',
    ...seedTimestamps(15),
  },
  {
    id: 'sub-2',
    studentId: 's-2',
    programId: 'prog-2',
    parentId: 'p-1',
    status: 'active',
    startDate: '2025-02-01',
    endDate: '2026-01-31',
    amount: 750,
    currency: 'AED',
    ...seedTimestamps(16),
  },
  {
    id: 'sub-3',
    studentId: 's-3',
    programId: 'prog-1',
    parentId: 'p-2',
    status: 'expired',
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    amount: 850,
    currency: 'AED',
    ...seedTimestamps(17),
  },
];
