import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  buildPaginationMeta,
  buildSearchFilter,
  paginateSkip,
  type ListQuery,
} from '../../utils/pagination.js';
import type { createProgramSchema, updateProgramSchema } from './programs.validation.js';
import type { z } from 'zod';

type CreateInput = z.infer<typeof createProgramSchema>;
type UpdateInput = z.infer<typeof updateProgramSchema>;

const notDeleted = { deletedAt: null };

export async function listPrograms(query: ListQuery) {
  const { page, limit, search, status, branchId } = query;
  const where = {
    ...notDeleted,
    ...(status ? { status: status as never } : {}),
    ...(branchId ? { branches: { some: { branchId } } } : {}),
    ...buildSearchFilter(search, ['name', 'slug', 'programCode']),
  };

  const [items, total] = await Promise.all([
    prisma.program.findMany({
      where,
      ...paginateSkip(page, limit),
      orderBy: { name: 'asc' },
      include: { sport: true, branches: { include: { branch: true } } },
    }),
    prisma.program.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export async function getProgramById(id: string) {
  const program = await prisma.program.findFirst({
    where: { id, ...notDeleted },
    include: { sport: true, branches: { include: { branch: true } } },
  });
  if (!program) throw ApiError.notFound('Program not found');
  return program;
}

export async function createProgram(input: CreateInput) {
  const { branchIds, ...data } = input;
  const code = data.programCode ?? `PRO-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return prisma.program.create({
    data: {
      id: `prog-${Date.now()}`,
      programCode: code,
      ...data,
      priceMonthly: data.priceMonthly,
      branches: branchIds?.length
        ? { create: branchIds.map((branchId) => ({ branchId })) }
        : undefined,
    },
    include: { sport: true, branches: true },
  });
}

export async function updateProgram(id: string, input: UpdateInput) {
  await getProgramById(id);
  const { branchIds, ...data } = input;

  return prisma.$transaction(async (tx) => {
    if (branchIds) {
      await tx.programBranch.deleteMany({ where: { programId: id } });
      if (branchIds.length) {
        await tx.programBranch.createMany({
          data: branchIds.map((branchId) => ({ programId: id, branchId })),
        });
      }
    }
    return tx.program.update({
      where: { id },
      data: {
        ...data,
        ...(data.priceMonthly !== undefined
          ? { priceMonthly: data.priceMonthly }
          : {}),
      },
      include: { sport: true, branches: true },
    });
  });
}

export async function deleteProgram(id: string) {
  await getProgramById(id);
  await prisma.program.update({ where: { id }, data: { deletedAt: new Date() } });
  return { id, deleted: true };
}
