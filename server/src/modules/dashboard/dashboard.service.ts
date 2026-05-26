import { prisma } from '../../db/prisma.js';

const notDeleted = { deletedAt: null };

export async function getAdminDashboard() {
  const [
    students,
    parents,
    coaches,
    programs,
    branches,
    activeSubscriptions,
    todaySessions,
    attendanceToday,
  ] = await Promise.all([
    prisma.student.count({ where: notDeleted }),
    prisma.parent.count({ where: notDeleted }),
    prisma.coach.count({ where: notDeleted }),
    prisma.program.count({ where: notDeleted }),
    prisma.branch.count({ where: notDeleted }),
    prisma.subscription.count({ where: { status: 'ACTIVE', ...notDeleted } }),
    prisma.scheduleSession.count({
      where: {
        ...notDeleted,
        startAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lt: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    }),
    prisma.attendanceRecord.count({
      where: {
        ...notDeleted,
        recordedAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);

  const revenue = await prisma.payment.aggregate({
    where: { status: 'PAID', ...notDeleted },
    _sum: { amount: true },
  });

  return {
    kpis: {
      students,
      parents,
      coaches,
      programs,
      branches,
      activeSubscriptions,
      todaySessions,
      attendanceToday,
      totalRevenue: Number(revenue._sum.amount ?? 0),
      currency: 'AED',
    },
  };
}
