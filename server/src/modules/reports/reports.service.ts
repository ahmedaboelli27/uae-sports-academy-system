import { prisma } from '../../db/prisma.js';

const notDeleted = { deletedAt: null };

export async function getReportsSummary() {
  const [studentsByProgram, revenueByBranch, attendanceStats] = await Promise.all([
    prisma.student.groupBy({
      by: ['programId'],
      where: { ...notDeleted, programId: { not: null } },
      _count: { id: true },
    }),
    prisma.subscription.groupBy({
      by: ['branchId'],
      where: notDeleted,
      _sum: { amount: true },
      _count: { id: true },
    }),
    prisma.attendanceRecord.groupBy({
      by: ['status'],
      where: notDeleted,
      _count: { id: true },
    }),
  ]);

  return {
    studentsByProgram,
    revenueByBranch,
    attendanceStats,
    generatedAt: new Date().toISOString(),
  };
}
