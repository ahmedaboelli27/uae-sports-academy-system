import type { Student } from '@/types/student.types';
import { seedTimestamps } from '@/data/seed/seed-utils';

export const studentsSeed: Student[] = [
  {
    id: 's-1',
    parentId: 'p-1',
    firstName: 'Yousef',
    lastName: 'Al Mansoori',
    dateOfBirth: '2015-03-12',
    gender: 'male',
    programId: 'prog-1',
    branchId: 'br-1',
    status: 'active',
    ...seedTimestamps(12),
  },
  {
    id: 's-2',
    parentId: 'p-1',
    firstName: 'Mariam',
    lastName: 'Al Mansoori',
    dateOfBirth: '2017-08-22',
    gender: 'female',
    programId: 'prog-2',
    branchId: 'br-1',
    status: 'active',
    ...seedTimestamps(13),
  },
  {
    id: 's-3',
    parentId: 'p-2',
    firstName: 'Ali',
    lastName: 'Mohammed',
    dateOfBirth: '2014-11-05',
    gender: 'male',
    programId: 'prog-1',
    branchId: 'br-2',
    status: 'trial',
    ...seedTimestamps(14),
  },
];
