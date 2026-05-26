import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import type { loginSchema } from './auth.validation.js';
import type { z } from 'zod';

type LoginInput = z.infer<typeof loginSchema>;

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
