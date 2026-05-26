import type { Parent } from '@/types/parent.types';
import { seedTimestamps } from '@/data/seed/seed-utils';

export const parentsSeed: Parent[] = [
  {
    id: 'p-1',
    userId: 'u-parent-1',
    status: 'active',
    emergencyContact: '+971509876543',
    address: 'Dubai Marina, Dubai, UAE',
    city: 'Dubai',
    emirate: 'Dubai',
    ...seedTimestamps(11),
  },
  {
    id: 'p-2',
    userId: 'u-parent-2',
    status: 'active',
    emergencyContact: '+971501112233',
    address: 'Yas Island, Abu Dhabi, UAE',
    city: 'Abu Dhabi',
    emirate: 'Abu Dhabi',
    ...seedTimestamps(12),
  },
];
