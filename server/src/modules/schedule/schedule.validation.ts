import { z } from 'zod';

export const createSessionSchema = z.object({
  branchId: z.string().min(1),
  programId: z.string().min(1),
  coachId: z.string().min(1),
  startAt: z.string().min(1),
  endAt: z.string().min(1),
  capacity: z.number().int().positive().default(20),
  status: z
    .enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .optional()
    .default('SCHEDULED'),
  notes: z.string().optional().nullable(),
});

export const updateSessionSchema = createSessionSchema.partial();
