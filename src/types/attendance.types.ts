import type { BaseEntity } from '@/types/api.types';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord extends BaseEntity {
  sessionId: string;
  studentId: string;
  status: AttendanceStatus;
  recordedAt: string;
  recordedByUserId?: string | null;
  notes?: string | null;
}
