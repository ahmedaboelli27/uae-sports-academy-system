import { z } from 'zod';

export const createBranchSchema = z.object({
  branchCode: z.string().optional(),
  name: z.string().min(1),
  nameAr: z.string().optional().nullable(),
  city: z.string().min(1),
  emirate: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'COMING_SOON']).optional().default('ACTIVE'),
});

export const updateBranchSchema = createBranchSchema.partial();
