import { z } from 'zod';

export const createAttendanceSchema = z.object({
  sessionId: z.string().min(1),
  studentId: z.string().min(1),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  recordedAt: z.string().optional(),
  recordedByUserId: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateAttendanceSchema = createAttendanceSchema.partial().omit({
  sessionId: true,
  studentId: true,
});
