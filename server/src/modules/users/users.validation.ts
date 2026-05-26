import { z } from 'zod';

const roleCodes = ['PARENT', 'COACH', 'ACCOUNTANT', 'ADMIN'] as const;
const statuses = ['ACTIVE', 'INACTIVE', 'TRIAL', 'WITHDRAWN', 'ON_LEAVE', 'COMING_SOON'] as const;

export const usersListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  role: z.enum(roleCodes).optional(),
  status: z.enum(statuses).optional(),
});

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().min(6).max(24).optional().nullable(),
  roleCode: z.enum(roleCodes),
  roleId: z.string().optional(),
  locale: z.enum(['en', 'ar']).optional().default('en'),
  status: z.enum(statuses).optional().default('ACTIVE'),
});

export const updateUserSchema = createUserSchema
  .omit({ roleCode: true, email: true })
  .partial()
  .extend({
    roleCode: z.enum(roleCodes).optional(),
    email: z.string().email().optional(),
  });
