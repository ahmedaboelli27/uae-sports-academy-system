import { z } from 'zod';

export const createParentSchema = z.object({
  userId: z.string().min(1),
  parentCode: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  emergencyContact: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  emirate: z.string().optional().nullable(),
});

export const updateParentSchema = createParentSchema.partial().omit({ userId: true });
