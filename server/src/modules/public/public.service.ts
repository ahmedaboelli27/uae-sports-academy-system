import { prisma } from '../../db/prisma.js';

const GALLERY_FALLBACK = [
  { id: 'gallery-1', title: 'Team training', subtitle: 'Team spirit and discipline', image: '' },
  { id: 'gallery-2', title: 'Skill development', subtitle: 'Progressive sessions', image: '' },
  { id: 'gallery-3', title: 'Professional sessions', subtitle: 'Structured coaching plans', image: '' },
  { id: 'gallery-4', title: 'Safe environment', subtitle: 'Family-focused academy experience', image: '' },
];

const LOGIN_FEATURES_FALLBACK = [
  { id: 'f-kpi', title: 'KPI dashboards' },
  { id: 'f-ops', title: 'Academy operations' },
  { id: 'f-attendance', title: 'Attendance tracking' },
];

function notDeleted() {
  return { deletedAt: null };
}

async function getAttendanceRate() {
  const [total, presentLike] = await Promise.all([
    prisma.attendanceRecord.count({ where: notDeleted() }),
    prisma.attendanceRecord.count({
      where: {
        ...notDeleted(),
        status: { in: ['PRESENT', 'LATE', 'EXCUSED'] },
      },
    }),
  ]);

  if (total === 0) return 0;
  return Math.round((presentLike / total) * 100);
}

export async function getAcademySummary() {
  const [students, coaches, branches, programs, todaySessions, pendingInvoices, attendanceRate] =
    await Promise.all([
      prisma.student.count({ where: notDeleted() }),
      prisma.coach.count({ where: notDeleted() }),
      prisma.branch.count({ where: notDeleted() }),
      prisma.program.count({ where: notDeleted() }),
      prisma.scheduleSession.count({
        where: {
          ...notDeleted(),
          startAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.invoice.count({
        where: {
          ...notDeleted(),
          status: { in: ['SENT', 'ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] },
        },
      }),
      getAttendanceRate(),
    ]);

  return {
    totalActiveStudents: students,
    totalCoaches: coaches,
    totalBranches: branches,
    totalPrograms: programs,
    attendanceRate,
    parentSatisfaction: 94,
    todaySessions,
    pendingPayments: pendingInvoices,
  };
}

export async function getPublicHome() {
  const [summary, programs, branches] = await Promise.all([
    getAcademySummary(),
    prisma.program.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        ageGroupMin: true,
        ageGroupMax: true,
      },
    }),
    prisma.branch.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: { id: true, city: true, address: true },
    }),
  ]);

  return {
    kpis: [
      { key: 'students', label: 'Active players', value: String(summary.totalActiveStudents) },
      { key: 'coaches', label: 'Professional coaches', value: String(summary.totalCoaches) },
      { key: 'branches', label: 'Training branches', value: String(summary.totalBranches) },
      { key: 'satisfaction', label: 'Parent satisfaction', value: `${summary.parentSatisfaction}%` },
    ],
    programs: programs.map((item) => ({
      id: item.id,
      title: item.name,
      description: item.description ?? '',
      age:
        item.ageGroupMin !== null && item.ageGroupMax !== null
          ? `Ages ${item.ageGroupMin}-${item.ageGroupMax}`
          : 'All ages',
      level: 'Beginner to advanced',
    })),
    branches: branches.map((item) => ({
      id: item.id,
      city: item.city,
      location: item.address,
      schedule: 'Sunday - Thursday | 4 PM - 9 PM',
    })),
    gallery: GALLERY_FALLBACK,
    loginShowcase: {
      features: LOGIN_FEATURES_FALLBACK,
      metrics: [
        { id: 'players', label: 'Players', value: `${summary.totalActiveStudents}+` },
        { id: 'coaches', label: 'Coaches', value: `${summary.totalCoaches}+` },
        { id: 'branches', label: 'Branches', value: `${summary.totalBranches}` },
      ],
    },
  };
}

export async function getLoginShowcase() {
  const summary = await getAcademySummary();

  return {
    features: LOGIN_FEATURES_FALLBACK,
    metrics: [
      { id: 'players', label: 'Players', value: `${summary.totalActiveStudents}+` },
      { id: 'coaches', label: 'Coaches', value: `${summary.totalCoaches}+` },
      { id: 'branches', label: 'Branches', value: `${summary.totalBranches}` },
    ],
  };
}
