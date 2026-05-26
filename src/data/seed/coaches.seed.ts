import type { Coach, CoachBranchAssignment, CoachSportAssignment } from '@/types/coach.types';
import { seedTimestamps } from '@/data/seed/seed-utils';

export const coachesSeed: Coach[] = [
  {
    id: 'c-1',
    userId: 'u-coach-1',
    status: 'active',
    bio: 'UEFA licensed coach with 10+ years experience.',
    specialties: ['Youth Development', 'Football'],
    licenseNumber: 'UAE-FB-1024',
    ...seedTimestamps(21),
  },
  {
    id: 'c-2',
    userId: 'u-coach-2',
    status: 'active',
    bio: 'National swimming coach.',
    specialties: ['Swimming', 'Aquatics'],
    licenseNumber: 'UAE-SW-2048',
    ...seedTimestamps(22),
  },
];

export const coachSportAssignmentsSeed: CoachSportAssignment[] = [
  { id: 'csa-1', coachId: 'c-1', sportId: 'sport-1', ...seedTimestamps(21) },
  { id: 'csa-2', coachId: 'c-1', sportId: 'sport-2', ...seedTimestamps(21) },
  { id: 'csa-3', coachId: 'c-2', sportId: 'sport-3', ...seedTimestamps(22) },
];

export const coachBranchAssignmentsSeed: CoachBranchAssignment[] = [
  { id: 'cba-1', coachId: 'c-1', branchId: 'br-1', ...seedTimestamps(21) },
  { id: 'cba-2', coachId: 'c-2', branchId: 'br-2', ...seedTimestamps(22) },
];
