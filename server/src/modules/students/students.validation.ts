import { z } from 'zod';

export const createStudentSchema = z.object({
  parentId: z.string().min(1),
  branchId: z.string().optional().nullable(),
  programId: z.string().optional().nullable(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().min(1),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable(),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'TRIAL', 'WITHDRAWN'])
    .optional()
    .default('ACTIVE'),
  medicalNotes: z.string().optional().nullable(),
  studentCode: z.string().optional(),
});

export const updateStudentSchema = createStudentSchema.partial();
