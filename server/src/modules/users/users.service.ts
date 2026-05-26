import bcrypt from 'bcrypt';
import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import { buildPaginationMeta, type PaginationMeta } from '../../utils/pagination.js';
import type { z } from 'zod';
import type { createUserSchema, updateUserSchema, usersListQuerySchema } from './users.validation.js';

type ListQuery = z.infer<typeof usersListQuerySchema>;
type CreateInput = z.infer<typeof createUserSchema>;
type UpdateInput = z.infer<typeof updateUserSchema>;

function notDeleted() {
  return { deletedAt: null };
}

async function resolveRole(roleCode?: CreateInput['roleCode'] | UpdateInput['roleCode'], roleId?: string) {
  if (roleId) {
    const role = await prisma.role.findFirst({ where: { id: roleId, ...notDeleted() } });
    if (!role) throw ApiError.badRequest('Invalid roleId');
    return role;
  }

  if (!roleCode) throw ApiError.badRequest('roleCode is required');
  const role = await prisma.role.findFirst({ where: { code: roleCode, ...notDeleted() } });
  if (!role) throw ApiError.badRequest('Invalid roleCode');
  return role;
}

function sanitizeUser<T extends { passwordHash: string }>(user: T) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export async function listUsers(query: ListQuery): Promise<{ items: unknown[]; meta: PaginationMeta }> {
  const { page, limit, search, role, status } = query;
  const where = {
    ...notDeleted(),
    ...(role ? { roleCode: role } : {}),
    ...(status ? { status } : {}),
    ...(search?.trim()
      ? {
          OR: [
            { firstName: { contains: search.trim(), mode: 'insensitive' as const } },
            { lastName: { contains: search.trim(), mode: 'insensitive' as const } },
            { email: { contains: search.trim(), mode: 'insensitive' as const } },
            { phone: { contains: search.trim(), mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { role: true },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items: items.map(sanitizeUser),
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findFirst({
    where: { id, ...notDeleted() },
    include: { role: true },
  });

  if (!user) throw ApiError.notFound('User not found');
  return sanitizeUser(user);
}

export async function createUser(input: CreateInput) {
  const email = input.email.toLowerCase().trim();
  const [existingEmail, existingPhone, role] = await Promise.all([
    prisma.user.findFirst({ where: { email, ...notDeleted() } }),
    input.phone
      ? prisma.user.findFirst({ where: { phone: input.phone, ...notDeleted() } })
      : Promise.resolve(null),
    resolveRole(input.roleCode, input.roleId),
  ]);

  if (existingEmail) throw ApiError.conflict('Email already in use');
  if (existingPhone) throw ApiError.conflict('Phone already in use');

  const passwordHash = await bcrypt.hash(input.password, 10);

  const created = await prisma.user.create({
    data: {
      id: `u-${Date.now()}`,
      email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone ?? null,
      roleId: role.id,
      roleCode: role.code,
      locale: input.locale,
      status: input.status,
    },
    include: { role: true },
  });

  return sanitizeUser(created);
}

export async function updateUser(id: string, input: UpdateInput) {
  await getUserById(id);

  if (input.email) {
    const email = input.email.toLowerCase().trim();
    const existing = await prisma.user.findFirst({
      where: { email, id: { not: id }, ...notDeleted() },
    });
    if (existing) throw ApiError.conflict('Email already in use');
  }

  if (input.phone) {
    const existingPhone = await prisma.user.findFirst({
      where: { phone: input.phone, id: { not: id }, ...notDeleted() },
    });
    if (existingPhone) throw ApiError.conflict('Phone already in use');
  }

  const role =
    input.roleId || input.roleCode
      ? await resolveRole(input.roleCode, input.roleId)
      : null;

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(input.email !== undefined ? { email: input.email.toLowerCase().trim() } : {}),
      ...(input.password !== undefined ? { passwordHash: await bcrypt.hash(input.password, 10) } : {}),
      ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
      ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(role ? { roleId: role.id, roleCode: role.code } : {}),
      ...(input.locale !== undefined ? { locale: input.locale } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
    include: { role: true },
  });

  return sanitizeUser(updated);
}

export async function deleteUser(id: string) {
  await getUserById(id);
  await prisma.user.update({ where: { id }, data: { deletedAt: new Date() } });
  return { id, deleted: true };
}
