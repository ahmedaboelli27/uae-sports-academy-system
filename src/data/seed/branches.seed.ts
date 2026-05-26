import type { Branch } from '@/types/branch.types';
import { seedTimestamps } from '@/data/seed/seed-utils';

export const branchesSeed: Branch[] = [
  {
    id: 'br-1',
    name: 'Dubai Marina Centre',
    nameAr: 'مركز دبي مارينا',
    code: 'DXB-MAR',
    city: 'Dubai',
    emirate: 'Dubai',
    address: 'Marina Walk, Dubai Marina, Dubai',
    phone: '+97144332211',
    email: 'dubai@academy.ae',
    status: 'active',
    ...seedTimestamps(3),
  },
  {
    id: 'br-2',
    name: 'Abu Dhabi Yas Hub',
    nameAr: 'مركز ياس أبوظبي',
    code: 'AUH-YAS',
    city: 'Abu Dhabi',
    emirate: 'Abu Dhabi',
    address: 'Yas Island, Abu Dhabi',
    phone: '+97124445566',
    email: 'abudhabi@academy.ae',
    status: 'active',
    ...seedTimestamps(4),
  },
];
