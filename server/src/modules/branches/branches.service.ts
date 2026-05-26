import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  buildPaginationMeta,
  buildSearchFilter,
  paginateSkip,
  type ListQuery,
} from '../../utils/pagination.js';
import type { createBranchSchema, updateBranchSchema } from './branches.validation.js';
import type { z } from 'zod';

type CreateInput = z.infer<typeof createBranchSchema>;
type UpdateInput = z.infer<typeof updateBranchSchema>;

const notDeleted = { deletedAt: null };

export async function listBranches(query: ListQuery) {
  const { page, limit, search, status } = query;
  const where = {
    ...notDeleted,
    ...(status ? { status: status as never } : {}),
    ...buildSearchFilter(search, ['name', 'branchCode', 'city', 'emirate']),
  };

  const [items, total] = await Promise.all([
    prisma.branch.findMany({ where, ...paginateSkip(page, limit), orderBy: { name: 'asc' } }),
    prisma.branch.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export async function getBranchById(id: string) {
  const branch = await prisma.branch.findFirst({ where: { id, ...notDeleted } });
  if (!branch) throw ApiError.notFound('Branch not found');
  return branch;
}

export async function createBranch(input: CreateInput) {
  const code = input.branchCode ?? `BR-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return prisma.branch.create({
    data: { id: `br-${Date.now()}`, branchCode: code, ...input, nameAr: input.nameAr ?? null },
  });
}

export async function updateBranch(id: string, input: UpdateInput) {
  await getBranchById(id);
  return prisma.branch.update({ where: { id }, data: input });
}

export async function deleteBranch(id: string) {
  await getBranchById(id);
  await prisma.branch.update({ where: { id }, data: { deletedAt: new Date() } });
  return { id, deleted: true };
}
