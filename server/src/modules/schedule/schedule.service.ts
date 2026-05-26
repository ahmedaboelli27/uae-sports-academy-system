import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  buildPaginationMeta,
  paginateSkip,
  type ListQuery,
} from '../../utils/pagination.js';
import type { createSessionSchema, updateSessionSchema } from './schedule.validation.js';
import type { z } from 'zod';

type CreateInput = z.infer<typeof createSessionSchema>;
type UpdateInput = z.infer<typeof updateSessionSchema>;

const notDeleted = { deletedAt: null };

export async function listSessions(query: ListQuery) {
  const { page, limit, branchId, programId, dateFrom, dateTo } = query;
  const where = {
    ...notDeleted,
    ...(branchId ? { branchId } : {}),
    ...(programId ? { programId } : {}),
    ...(dateFrom || dateTo
      ? {
          startAt: {
            ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
            ...(dateTo ? { lte: new Date(dateTo) } : {}),
          },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.scheduleSession.findMany({
      where,
      ...paginateSkip(page, limit),
      orderBy: { startAt: 'asc' },
      include: { branch: true, program: true, coach: { include: { user: true } } },
    }),
    prisma.scheduleSession.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export async function getSessionById(id: string) {
  const session = await prisma.scheduleSession.findFirst({
    where: { id, ...notDeleted },
    include: { branch: true, program: true, coach: { include: { user: true } } },
  });
  if (!session) throw ApiError.notFound('Schedule session not found');
  return session;
}

export async function createSession(input: CreateInput) {
  return prisma.scheduleSession.create({
    data: {
      id: `ts-${Date.now()}`,
      ...input,
      startAt: new Date(input.startAt),
      endAt: new Date(input.endAt),
    },
    include: { branch: true, program: true, coach: true },
  });
}

export async function updateSession(id: string, input: UpdateInput) {
  await getSessionById(id);
  return prisma.scheduleSession.update({
    where: { id },
    data: {
      ...input,
      ...(input.startAt ? { startAt: new Date(input.startAt) } : {}),
      ...(input.endAt ? { endAt: new Date(input.endAt) } : {}),
    },
    include: { branch: true, program: true, coach: true },
  });
}

export async function deleteSession(id: string) {
  await getSessionById(id);
  await prisma.scheduleSession.update({ where: { id }, data: { deletedAt: new Date() } });
  return { id, deleted: true };
}
