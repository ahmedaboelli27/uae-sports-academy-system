import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { RecordStatus, UserRole } from '@prisma/client';
import { env } from '../../config/env.js';
import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import type { loginSchema, registerSchema } from './auth.validation.js';
import type { z } from 'zod';

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findFirst({
    where: {
      email: input.email.toLowerCase(),
      deletedAt: null,
    },
    include: { role: true },
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);

  if (!valid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.roleCode },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.roleCode,
      locale: user.locale,
    },
  };
}

async function resolveRole(roleCode: UserRole) {
  const role = await prisma.role.findFirst({
    where: { code: roleCode, deletedAt: null },
  });
  if (!role) throw ApiError.badRequest('Invalid role');
  return role;
}

export async function registerUser(input: RegisterInput, mode: 'general' | 'parent' | 'coach-request' = 'general') {
  const roleCode = input.role ?? 'PARENT';
  if (mode === 'parent' && roleCode !== 'PARENT') {
    throw ApiError.badRequest('Parent registration only accepts parent role');
  }
  if (mode === 'coach-request' && roleCode !== 'COACH') {
    throw ApiError.badRequest('Coach request registration only accepts coach role');
  }

  const email = input.email.toLowerCase().trim();
  const [existingEmail, existingPhone, role] = await Promise.all([
    prisma.user.findFirst({ where: { email, deletedAt: null } }),
    input.phone ? prisma.user.findFirst({ where: { phone: input.phone, deletedAt: null } }) : Promise.resolve(null),
    resolveRole(roleCode),
  ]);

  if (existingEmail) throw ApiError.conflict('Email already in use');
  if (existingPhone) throw ApiError.conflict('Phone already in use');

  const passwordHash = await bcrypt.hash(input.password, 10);
  const status: RecordStatus = mode === 'coach-request' ? 'INACTIVE' : 'ACTIVE';

  const user = await prisma.user.create({
    data: {
      id: `u-${Date.now()}`,
      email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone ?? null,
      roleId: role.id,
      roleCode,
      locale: 'en',
      status,
    },
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.roleCode,
    locale: user.locale,
    status: user.status,
  };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: { role: true, parent: true, coach: true },
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.roleCode,
    locale: user.locale,
    status: user.status,
    parentId: user.parent?.id ?? null,
    coachId: user.coach?.id ?? null,
  };
}
