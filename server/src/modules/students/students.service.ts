import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  buildPaginationMeta,
  buildSearchFilter,
  paginateSkip,
  type ListQuery,
} from '../../utils/pagination.js';
import type { createStudentSchema, updateStudentSchema } from './students.validation.js';
import type { z } from 'zod';

type CreateInput = z.infer<typeof createStudentSchema>;
type UpdateInput = z.infer<typeof updateStudentSchema>;

function notDeleted() {
  return { deletedAt: null };
}

export async function listStudents(query: ListQuery) {
  const { page, limit, search, status, branchId, programId } = query;
  const where = {
    ...notDeleted(),
    ...(status ? { status: status as never } : {}),
    ...(branchId ? { branchId } : {}),
    ...(programId ? { programId } : {}),
    ...buildSearchFilter(search, ['firstName', 'lastName', 'studentCode']),
  };

  const [items, total] = await Promise.all([
    prisma.student.findMany({
      where,
      ...paginateSkip(page, limit),
      orderBy: { createdAt: 'desc' },
      include: { parent: true, branch: true, program: true },
    }),
    prisma.student.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export async function getStudentById(id: string) {
  const student = await prisma.student.findFirst({
    where: { id, ...notDeleted() },
    include: { parent: true, branch: true, program: true },
  });

  if (!student) throw ApiError.notFound('Student not found');
  return student;
}

export async function createStudent(input: CreateInput) {
  const code =
    input.studentCode ??
    `STU-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return prisma.student.create({
    data: {
      id: `s-${Date.now()}`,
      studentCode: code,
      parentId: input.parentId,
      branchId: input.branchId ?? null,
      programId: input.programId ?? null,
      firstName: input.firstName,
      lastName: input.lastName,
      dateOfBirth: new Date(input.dateOfBirth),
      gender: input.gender ?? null,
      status: input.status,
      medicalNotes: input.medicalNotes ?? null,
    },
    include: { parent: true, branch: true, program: true },
  });
}

export async function updateStudent(id: string, input: UpdateInput) {
  await getStudentById(id);

  return prisma.student.update({
    where: { id },
    data: {
      ...(input.parentId !== undefined ? { parentId: input.parentId } : {}),
      ...(input.branchId !== undefined ? { branchId: input.branchId } : {}),
      ...(input.programId !== undefined ? { programId: input.programId } : {}),
      ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
      ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
      ...(input.dateOfBirth !== undefined
        ? { dateOfBirth: new Date(input.dateOfBirth) }
        : {}),
      ...(input.gender !== undefined ? { gender: input.gender } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.medicalNotes !== undefined ? { medicalNotes: input.medicalNotes } : {}),
    },
    include: { parent: true, branch: true, program: true },
  });
}

export async function deleteStudent(id: string) {
  await getStudentById(id);
  await prisma.student.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return { id, deleted: true };
}
