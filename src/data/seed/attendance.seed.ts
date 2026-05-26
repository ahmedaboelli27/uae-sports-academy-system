import type { AttendanceRecord } from '@/types/attendance.types';
import type { Enrollment, TrainingSession } from '@/types/schedule.types';
import { seedTimestamps } from '@/data/seed/seed-utils';

export const trainingSessionsSeed: TrainingSession[] = [
  {
    id: 'ts-1',
    programId: 'prog-1',
    coachId: 'c-1',
    branchId: 'br-1',
    startAt: '2025-05-20T16:00:00Z',
    endAt: '2025-05-20T17:30:00Z',
    capacity: 24,
    status: 'scheduled',
    ...seedTimestamps(25),
  },
];

export const enrollmentsSeed: Enrollment[] = [
  {
    id: 'enr-1',
    studentId: 's-1',
    programId: 'prog-1',
    branchId: 'br-1',
    status: 'active',
    enrolledAt: '2025-01-01T08:00:00Z',
    ...seedTimestamps(14),
  },
  {
    id: 'enr-2',
    studentId: 's-2',
    programId: 'prog-2',
    branchId: 'br-1',
    status: 'active',
    enrolledAt: '2025-02-01T08:00:00Z',
    ...seedTimestamps(15),
  },
];

export const attendanceRecordsSeed: AttendanceRecord[] = [
  {
    id: 'att-1',
    sessionId: 'ts-1',
    studentId: 's-1',
    status: 'present',
    recordedAt: '2025-05-20T16:05:00Z',
    recordedByUserId: 'u-coach-1',
    ...seedTimestamps(26),
  },
  {
    id: 'att-2',
    sessionId: 'ts-1',
    studentId: 's-2',
    status: 'late',
    recordedAt: '2025-05-20T16:12:00Z',
    recordedByUserId: 'u-coach-1',
    ...seedTimestamps(26),
  },
];
