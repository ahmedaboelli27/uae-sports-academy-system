import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  buildPaginationMeta,
  buildSearchFilter,
  paginateSkip,
  type ListQuery,
} from '../../utils/pagination.js';
import type { createCoachSchema, updateCoachSchema } from './coaches.validation.js';
import type { z } from 'zod';

type CreateInput = z.infer<typeof createCoachSchema>;
type UpdateInput = z.infer<typeof updateCoachSchema>;

const notDeleted = { deletedAt: null };

export async function listCoaches(query: ListQuery) {
  const { page, limit, search, status, branchId, programId } = query;
  const where = {
    ...notDeleted,
    ...(status ? { status: status as never } : {}),
    ...(branchId
      ? { branchAssignments: { some: { branchId } } }
      : {}),
    ...(programId
      ? { programAssignments: { some: { programId } } }
      : {}),
    ...buildSearchFilter(search, ['coachCode', 'licenseNumber']),
  };

  const [items, total] = await Promise.all([
    prisma.coach.findMany({
      where,
      ...paginateSkip(page, limit),
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        branchAssignments: { include: { branch: true } },
        programAssignments: { include: { program: true } },
      },
    }),
    prisma.coach.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export async function getCoachById(id: string) {
  const coach = await prisma.coach.findFirst({
    where: { id, ...notDeleted },
    include: {
      user: true,
      branchAssignments: { include: { branch: true } },
      programAssignments: { include: { program: true } },
    },
  });
  if (!coach) throw ApiError.notFound('Coach not found');
  return coach;
}

export async function createCoach(input: CreateInput) {
  const code = input.coachCode ?? `COA-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const id = `c-${Date.now()}`;

  return prisma.coach.create({
    data: {
      id,
      coachCode: code,
      userId: input.userId,
      status: input.status,
      bio: input.bio ?? null,
      specialties: input.specialties,
      licenseNumber: input.licenseNumber ?? null,
      branchAssignments: input.branchIds?.length
        ? { create: input.branchIds.map((branchId) => ({ branchId })) }
        : undefined,
      programAssignments: input.programIds?.length
        ? { create: input.programIds.map((programId) => ({ programId })) }
        : undefined,
    },
    include: { user: true, branchAssignments: true, programAssignments: true },
  });
}

export async function updateCoach(id: string, input: UpdateInput) {
  await getCoachById(id);
  const { branchIds, programIds, ...data } = input;

  return prisma.$transaction(async (tx) => {
    if (branchIds) {
      await tx.coachBranch.deleteMany({ where: { coachId: id } });
      if (branchIds.length) {
        await tx.coachBranch.createMany({
          data: branchIds.map((branchId) => ({ coachId: id, branchId })),
        });
      }
    }
    if (programIds) {
      await tx.coachProgram.deleteMany({ where: { coachId: id } });
      if (programIds.length) {
        await tx.coachProgram.createMany({
          data: programIds.map((programId) => ({ coachId: id, programId })),
        });
      }
    }

    return tx.coach.update({
      where: { id },
      data,
      include: { user: true, branchAssignments: true, programAssignments: true },
    });
  });
}

export async function deleteCoach(id: string) {
  await getCoachById(id);
  await prisma.coach.update({ where: { id }, data: { deletedAt: new Date() } });
  return { id, deleted: true };
}
