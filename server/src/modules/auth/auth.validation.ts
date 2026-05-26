import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerBaseSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(6).max(24).optional(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must include uppercase')
    .regex(/[a-z]/, 'Must include lowercase')
    .regex(/[0-9]/, 'Must include number')
    .regex(/[^A-Za-z0-9]/, 'Must include special char'),
});

export const registerSchema = registerBaseSchema.extend({
  role: z.enum(['PARENT', 'COACH']).optional().default('PARENT'),
});

export const registerParentSchema = registerBaseSchema.extend({
  role: z.literal('PARENT').optional().default('PARENT'),
});

export const registerCoachRequestSchema = registerBaseSchema.extend({
  role: z.literal('COACH').optional().default('COACH'),
});
