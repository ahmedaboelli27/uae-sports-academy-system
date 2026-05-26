import { z } from 'zod';

export const createProgramSchema = z.object({
  programCode: z.string().optional(),
  sportId: z.string().min(1),
  name: z.string().min(1),
  nameAr: z.string().optional().nullable(),
  slug: z.string().min(1),
  ageGroupMin: z.number().int().optional().nullable(),
  ageGroupMax: z.number().int().optional().nullable(),
  priceMonthly: z.number().nonnegative(),
  currency: z.string().default('AED'),
  capacity: z.number().int().positive().default(20),
  description: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  branchIds: z.array(z.string()).optional(),
});

export const updateProgramSchema = createProgramSchema.partial();
