import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  buildPaginationMeta,
  paginateSkip,
  type ListQuery,
} from '../../utils/pagination.js';
import type { createAttendanceSchema, updateAttendanceSchema } from './attendance.validation.js';
import type { z } from 'zod';

type CreateInput = z.infer<typeof createAttendanceSchema>;
type UpdateInput = z.infer<typeof updateAttendanceSchema>;

const notDeleted = { deletedAt: null };

export async function listAttendance(query: ListQuery) {
  const { page, limit, branchId, programId, dateFrom, dateTo } = query;
  const where = {
    ...notDeleted,
    ...(dateFrom || dateTo
      ? {
          recordedAt: {
            ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
            ...(dateTo ? { lte: new Date(dateTo) } : {}),
          },
        }
      : {}),
    session: {
      ...(branchId ? { branchId } : {}),
      ...(programId ? { programId } : {}),
    },
  };

  const [items, total] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where,
      ...paginateSkip(page, limit),
      orderBy: { recordedAt: 'desc' },
      include: {
        session: { include: { branch: true, program: true } },
        student: true,
      },
    }),
    prisma.attendanceRecord.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export async function getAttendanceById(id: string) {
  const record = await prisma.attendanceRecord.findFirst({
    where: { id, ...notDeleted },
    include: { session: true, student: true },
  });
  if (!record) throw ApiError.notFound('Attendance record not found');
  return record;
}

export async function createAttendance(input: CreateInput) {
  return prisma.attendanceRecord.create({
    data: {
      id: `att-${Date.now()}`,
      sessionId: input.sessionId,
      studentId: input.studentId,
      status: input.status,
      recordedAt: input.recordedAt ? new Date(input.recordedAt) : new Date(),
      recordedByUserId: input.recordedByUserId ?? null,
      notes: input.notes ?? null,
    },
    include: { session: true, student: true },
  });
}

export async function updateAttendance(id: string, input: UpdateInput) {
  await getAttendanceById(id);
  return prisma.attendanceRecord.update({
    where: { id },
    data: {
      ...input,
      ...(input.recordedAt ? { recordedAt: new Date(input.recordedAt) } : {}),
    },
    include: { session: true, student: true },
  });
}
