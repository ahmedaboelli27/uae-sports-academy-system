import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  buildPaginationMeta,
  buildSearchFilter,
  paginateSkip,
  type ListQuery,
} from '../../utils/pagination.js';
import type { createParentSchema, updateParentSchema } from './parents.validation.js';
import type { z } from 'zod';

type CreateInput = z.infer<typeof createParentSchema>;
type UpdateInput = z.infer<typeof updateParentSchema>;

const notDeleted = { deletedAt: null };

export async function listParents(query: ListQuery) {
  const { page, limit, search, status } = query;
  const where = {
    ...notDeleted,
    ...(status ? { status: status as never } : {}),
    ...buildSearchFilter(search, ['parentCode', 'city', 'emirate']),
  };

  const [items, total] = await Promise.all([
    prisma.parent.findMany({
      where,
      ...paginateSkip(page, limit),
      orderBy: { createdAt: 'desc' },
      include: { user: true, students: { where: notDeleted } },
    }),
    prisma.parent.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export async function getParentById(id: string) {
  const parent = await prisma.parent.findFirst({
    where: { id, ...notDeleted },
    include: { user: true, students: { where: notDeleted } },
  });
  if (!parent) throw ApiError.notFound('Parent not found');
  return parent;
}

export async function createParent(input: CreateInput) {
  const code = input.parentCode ?? `PAR-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return prisma.parent.create({
    data: {
      id: `p-${Date.now()}`,
      parentCode: code,
      userId: input.userId,
      status: input.status,
      emergencyContact: input.emergencyContact ?? null,
      address: input.address ?? null,
      city: input.city ?? null,
      emirate: input.emirate ?? null,
    },
    include: { user: true },
  });
}

export async function updateParent(id: string, input: UpdateInput) {
  await getParentById(id);
  return prisma.parent.update({
    where: { id },
    data: input,
    include: { user: true },
  });
}

export async function deleteParent(id: string) {
  await getParentById(id);
  await prisma.parent.update({ where: { id }, data: { deletedAt: new Date() } });
  return { id, deleted: true };
}
