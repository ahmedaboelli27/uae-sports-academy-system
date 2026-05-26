import type { Sport } from '@/types/sport.types';
import { seedTimestamps } from '@/data/seed/seed-utils';

export const sportsSeed: Sport[] = [
  {
    id: 'sport-1',
    name: 'Football',
    nameAr: 'كرة القدم',
    slug: 'football',
    status: 'active',
    ...seedTimestamps(5),
  },
  {
    id: 'sport-2',
    name: 'Basketball',
    nameAr: 'كرة السلة',
    slug: 'basketball',
    status: 'active',
    ...seedTimestamps(6),
  },
  {
    id: 'sport-3',
    name: 'Swimming',
    nameAr: 'السباحة',
    slug: 'swimming',
    status: 'active',
    ...seedTimestamps(7),
  },
];
