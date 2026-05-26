import { z } from 'zod';

export const createCoachSchema = z.object({
  userId: z.string().min(1),
  coachCode: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE']).optional().default('ACTIVE'),
  bio: z.string().optional().nullable(),
  specialties: z.array(z.string()).default([]),
  licenseNumber: z.string().optional().nullable(),
  branchIds: z.array(z.string()).optional(),
  programIds: z.array(z.string()).optional(),
});

export const updateCoachSchema = createCoachSchema.partial().omit({ userId: true });
