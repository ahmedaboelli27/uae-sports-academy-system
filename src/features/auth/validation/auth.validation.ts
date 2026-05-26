import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email(),
    phone: z.string().min(8).max(24).regex(/^\+?[0-9\s-]{8,24}$/),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[^A-Za-z0-9]/),
    confirmPassword: z.string().min(8),
    role: z.enum(['parent', 'coach']).default('parent'),
    terms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.terms, {
    message: 'Terms must be accepted',
    path: ['terms'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
