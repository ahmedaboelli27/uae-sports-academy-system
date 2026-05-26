/**
 * Database seed — IDs aligned with frontend `src/data/seed/*` for mock/API parity.
 */
import bcrypt from 'bcrypt';
import {
  PrismaClient,
  UserRole,
  RecordStatus,
  SportType,
  SubscriptionStatus,
  SubscriptionPlan,
  InvoiceStatus,
  PaymentStatus,
  PaymentMethod,
  TransactionType,
  SessionStatus,
  AttendanceStatus,
  Gender,
} from '@prisma/client';

const prisma = new PrismaClient();

const now = new Date();
const ts = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d;
};

async function main() {
  console.log('Seeding database...');

  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.invoiceLineItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.scheduleSession.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.coachProgram.deleteMany();
  await prisma.coachBranch.deleteMany();
  await prisma.programBranch.deleteMany();
  await prisma.student.deleteMany();
  await prisma.coach.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.program.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.sport.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  const roles = [
    { id: 'role-parent', code: UserRole.PARENT, name: 'parent', label: 'Parent', description: 'Parent portal', permissions: [], redirectPath: '/parent' },
    { id: 'role-coach', code: UserRole.COACH, name: 'coach', label: 'Coach', description: 'Coach portal', permissions: [], redirectPath: '/coach' },
    { id: 'role-accountant', code: UserRole.ACCOUNTANT, name: 'accountant', label: 'Accountant', description: 'Finance', permissions: [], redirectPath: '/admin/finance' },
    { id: 'role-admin', code: UserRole.ADMIN, name: 'admin', label: 'Admin', description: 'Full access', permissions: ['*'], redirectPath: '/admin' },
  ];

  for (const role of roles) {
    await prisma.role.create({
      data: { ...role, permissions: role.permissions },
    });
  }

  const users = [
    { id: 'u-parent-1', email: 'parent@academy.ae', firstName: 'Fatima', lastName: 'Al Mansoori', phone: '+971501234567', roleId: 'role-parent', roleCode: UserRole.PARENT },
    { id: 'u-coach-1', email: 'coach@academy.ae', firstName: 'Ahmed', lastName: 'Hassan', roleId: 'role-coach', roleCode: UserRole.COACH },
    { id: 'u-accountant-1', email: 'finance@academy.ae', firstName: 'Sara', lastName: 'Khan', roleId: 'role-accountant', roleCode: UserRole.ACCOUNTANT },
    { id: 'u-admin-1', email: 'admin@academy.ae', firstName: 'Omar', lastName: 'Al Zaabi', roleId: 'role-admin', roleCode: UserRole.ADMIN },
    { id: 'u-coach-2', email: 'coach2@academy.ae', firstName: 'Layla', lastName: 'Nasser', roleId: 'role-coach', roleCode: UserRole.COACH },
    { id: 'u-parent-2', email: 'parent2@academy.ae', firstName: 'Mohammed', lastName: 'Ali', phone: '+971501112233', roleId: 'role-parent', roleCode: UserRole.PARENT },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: {
        ...u,
        passwordHash: u.id === 'u-admin-1' || u.id === 'u-accountant-1' ? passwordHash : passwordHash,
        locale: 'en',
        status: RecordStatus.ACTIVE,
        createdAt: ts(30),
        updatedAt: ts(1),
      },
    });
  }

  await prisma.parent.createMany({
    data: [
      { id: 'p-1', parentCode: 'PAR-1001', userId: 'u-parent-1', status: RecordStatus.ACTIVE, emergencyContact: '+971509876543', address: 'Dubai Marina, Dubai, UAE', city: 'Dubai', emirate: 'Dubai', createdAt: ts(20), updatedAt: ts(1) },
      { id: 'p-2', parentCode: 'PAR-1002', userId: 'u-parent-2', status: RecordStatus.ACTIVE, emergencyContact: '+971501112233', address: 'Yas Island, Abu Dhabi, UAE', city: 'Abu Dhabi', emirate: 'Abu Dhabi', createdAt: ts(18), updatedAt: ts(1) },
    ],
  });

  await prisma.sport.createMany({
    data: [
      { id: 'sport-1', name: 'Football', nameAr: 'كرة القدم', slug: 'football', sportType: SportType.FOOTBALL, status: RecordStatus.ACTIVE, createdAt: ts(40), updatedAt: ts(1) },
      { id: 'sport-2', name: 'Basketball', nameAr: 'كرة السلة', slug: 'basketball', sportType: SportType.BASKETBALL, status: RecordStatus.ACTIVE, createdAt: ts(40), updatedAt: ts(1) },
      { id: 'sport-3', name: 'Swimming', nameAr: 'السباحة', slug: 'swimming', sportType: SportType.SWIMMING, status: RecordStatus.ACTIVE, createdAt: ts(40), updatedAt: ts(1) },
    ],
  });

  await prisma.branch.createMany({
    data: [
      { id: 'br-1', branchCode: 'DXB-MAR', name: 'Dubai Marina Centre', nameAr: 'مركز دبي مارينا', city: 'Dubai', emirate: 'Dubai', address: 'Marina Walk, Dubai Marina, Dubai', phone: '+97144332211', email: 'dubai@academy.ae', status: RecordStatus.ACTIVE, createdAt: ts(50), updatedAt: ts(1) },
      { id: 'br-2', branchCode: 'AUH-YAS', name: 'Abu Dhabi Yas Hub', nameAr: 'مركز ياس أبوظبي', city: 'Abu Dhabi', emirate: 'Abu Dhabi', address: 'Yas Island, Abu Dhabi', phone: '+97124445566', email: 'abudhabi@academy.ae', status: RecordStatus.ACTIVE, createdAt: ts(50), updatedAt: ts(1) },
    ],
  });

  await prisma.program.createMany({
    data: [
      { id: 'prog-1', programCode: 'PRO-FOOT-JR', sportId: 'sport-1', name: 'Junior Football Academy', nameAr: 'أكاديمية كرة القدم للناشئين', slug: 'junior-football', ageGroupMin: 6, ageGroupMax: 10, priceMonthly: 850, currency: 'AED', capacity: 24, description: 'Foundation skills', status: RecordStatus.ACTIVE, createdAt: ts(30), updatedAt: ts(1) },
      { id: 'prog-2', programCode: 'PRO-SWIM-FUN', sportId: 'sport-3', name: 'Swimming Fundamentals', nameAr: 'أساسيات السباحة', slug: 'swimming-fundamentals', ageGroupMin: 5, ageGroupMax: 12, priceMonthly: 750, currency: 'AED', capacity: 16, status: RecordStatus.ACTIVE, createdAt: ts(30), updatedAt: ts(1) },
      { id: 'prog-3', programCode: 'PRO-BB-ELITE', sportId: 'sport-2', name: 'Basketball Elite', slug: 'basketball-elite', ageGroupMin: 10, ageGroupMax: 16, priceMonthly: 900, currency: 'AED', capacity: 20, status: RecordStatus.ACTIVE, createdAt: ts(30), updatedAt: ts(1) },
    ],
  });

  await prisma.programBranch.createMany({
    data: [
      { programId: 'prog-1', branchId: 'br-1' },
      { programId: 'prog-2', branchId: 'br-1' },
      { programId: 'prog-3', branchId: 'br-2' },
    ],
  });

  await prisma.coach.createMany({
    data: [
      { id: 'c-1', coachCode: 'COA-1001', userId: 'u-coach-1', status: RecordStatus.ACTIVE, bio: 'UEFA licensed coach', specialties: ['Youth Development', 'Football'], licenseNumber: 'UAE-FB-1024', createdAt: ts(25), updatedAt: ts(1) },
      { id: 'c-2', coachCode: 'COA-1002', userId: 'u-coach-2', status: RecordStatus.ACTIVE, bio: 'National swimming coach', specialties: ['Swimming'], licenseNumber: 'UAE-SW-2048', createdAt: ts(25), updatedAt: ts(1) },
    ],
  });

  await prisma.coachBranch.createMany({
    data: [
      { coachId: 'c-1', branchId: 'br-1' },
      { coachId: 'c-2', branchId: 'br-2' },
    ],
  });

  await prisma.coachProgram.createMany({
    data: [
      { coachId: 'c-1', programId: 'prog-1' },
      { coachId: 'c-2', programId: 'prog-2' },
    ],
  });

  await prisma.student.createMany({
    data: [
      { id: 's-1', studentCode: 'STU-1001', parentId: 'p-1', branchId: 'br-1', programId: 'prog-1', firstName: 'Yousef', lastName: 'Al Mansoori', dateOfBirth: new Date('2015-03-12'), gender: Gender.MALE, status: RecordStatus.ACTIVE, createdAt: ts(15), updatedAt: ts(1) },
      { id: 's-2', studentCode: 'STU-1002', parentId: 'p-1', branchId: 'br-1', programId: 'prog-2', firstName: 'Mariam', lastName: 'Al Mansoori', dateOfBirth: new Date('2017-08-22'), gender: Gender.FEMALE, status: RecordStatus.ACTIVE, createdAt: ts(15), updatedAt: ts(1) },
      { id: 's-3', studentCode: 'STU-1003', parentId: 'p-2', branchId: 'br-2', programId: 'prog-1', firstName: 'Ali', lastName: 'Mohammed', dateOfBirth: new Date('2014-11-05'), gender: Gender.MALE, status: RecordStatus.TRIAL, createdAt: ts(14), updatedAt: ts(1) },
    ],
  });

  await prisma.enrollment.createMany({
    data: [
      { id: 'enr-1', studentId: 's-1', programId: 'prog-1', branchId: 'br-1', status: RecordStatus.ACTIVE, enrolledAt: new Date('2025-01-01'), createdAt: ts(14), updatedAt: ts(1) },
      { id: 'enr-2', studentId: 's-2', programId: 'prog-2', branchId: 'br-1', status: RecordStatus.ACTIVE, enrolledAt: new Date('2025-02-01'), createdAt: ts(14), updatedAt: ts(1) },
    ],
  });

  await prisma.scheduleSession.create({
    data: {
      id: 'ts-1',
      programId: 'prog-1',
      coachId: 'c-1',
      branchId: 'br-1',
      startAt: new Date('2025-05-20T16:00:00Z'),
      endAt: new Date('2025-05-20T17:30:00Z'),
      capacity: 24,
      status: SessionStatus.SCHEDULED,
      createdAt: ts(10),
      updatedAt: ts(1),
    },
  });

  await prisma.attendanceRecord.createMany({
    data: [
      { id: 'att-1', sessionId: 'ts-1', studentId: 's-1', status: AttendanceStatus.PRESENT, recordedAt: new Date('2025-05-20T16:05:00Z'), recordedByUserId: 'u-coach-1', createdAt: ts(5), updatedAt: ts(1) },
      { id: 'att-2', sessionId: 'ts-1', studentId: 's-2', status: AttendanceStatus.LATE, recordedAt: new Date('2025-05-20T16:12:00Z'), recordedByUserId: 'u-coach-1', createdAt: ts(5), updatedAt: ts(1) },
    ],
  });

  await prisma.subscription.createMany({
    data: [
      { id: 'sub-1', subscriptionCode: 'SUB-1001', studentId: 's-1', parentId: 'p-1', branchId: 'br-1', programId: 'prog-1', plan: SubscriptionPlan.ANNUAL, status: SubscriptionStatus.ACTIVE, startDate: new Date('2025-01-01'), endDate: new Date('2025-12-31'), amount: 850, currency: 'AED', createdAt: ts(12), updatedAt: ts(1) },
      { id: 'sub-2', subscriptionCode: 'SUB-1002', studentId: 's-2', parentId: 'p-1', branchId: 'br-1', programId: 'prog-2', plan: SubscriptionPlan.ANNUAL, status: SubscriptionStatus.ACTIVE, startDate: new Date('2025-02-01'), endDate: new Date('2026-01-31'), amount: 750, currency: 'AED', createdAt: ts(12), updatedAt: ts(1) },
      { id: 'sub-3', subscriptionCode: 'SUB-1003', studentId: 's-3', parentId: 'p-2', branchId: 'br-2', programId: 'prog-1', plan: SubscriptionPlan.ANNUAL, status: SubscriptionStatus.EXPIRED, startDate: new Date('2024-06-01'), endDate: new Date('2024-12-31'), amount: 850, currency: 'AED', createdAt: ts(12), updatedAt: ts(1) },
    ],
  });

  await prisma.invoice.createMany({
    data: [
      { id: 'inv-1', invoiceNumber: 'INV-2025-0001', parentId: 'p-1', studentId: 's-1', subscriptionId: 'sub-1', amount: 850, currency: 'AED', status: InvoiceStatus.PAID, dueDate: new Date('2025-01-15'), issuedAt: new Date('2025-01-01'), paidAt: new Date('2025-01-05'), createdAt: ts(10), updatedAt: ts(1) },
      { id: 'inv-2', invoiceNumber: 'INV-2025-0002', parentId: 'p-1', studentId: 's-2', subscriptionId: 'sub-2', amount: 750, currency: 'AED', status: InvoiceStatus.SENT, dueDate: new Date('2025-02-15'), issuedAt: new Date('2025-02-01'), createdAt: ts(10), updatedAt: ts(1) },
      { id: 'inv-3', invoiceNumber: 'INV-2025-0003', parentId: 'p-2', studentId: 's-3', amount: 850, currency: 'AED', status: InvoiceStatus.OVERDUE, dueDate: new Date('2025-01-10'), issuedAt: new Date('2024-12-20'), createdAt: ts(10), updatedAt: ts(1) },
    ],
  });

  await prisma.invoiceLineItem.createMany({
    data: [
      { invoiceId: 'inv-1', description: 'Football Academy - Annual', quantity: 1, unitPrice: 850, discount: 0, tax: 0, total: 850 },
      { invoiceId: 'inv-2', description: 'Swimming Program - Annual', quantity: 1, unitPrice: 750, discount: 0, tax: 0, total: 750 },
      { invoiceId: 'inv-3', description: 'Football Trial Package', quantity: 1, unitPrice: 850, discount: 0, tax: 0, total: 850 },
    ],
  });

  await prisma.payment.createMany({
    data: [
      { id: 'pay-1', paymentCode: 'PAY-1001', parentId: 'p-1', studentId: 's-1', subscriptionId: 'sub-1', invoiceId: 'inv-1', amount: 850, currency: 'AED', status: PaymentStatus.PAID, method: PaymentMethod.CARD, transactionType: TransactionType.SUBSCRIPTION_PAYMENT, paidAt: new Date('2025-01-05'), reference: 'TXN-1001', createdAt: ts(8), updatedAt: ts(1) },
      { id: 'pay-2', paymentCode: 'PAY-1002', parentId: 'p-1', studentId: 's-2', subscriptionId: 'sub-2', amount: 750, currency: 'AED', status: PaymentStatus.PENDING, method: PaymentMethod.BANK_TRANSFER, transactionType: TransactionType.SUBSCRIPTION_PAYMENT, reference: 'TXN-1002', createdAt: ts(8), updatedAt: ts(1) },
      { id: 'pay-3', paymentCode: 'PAY-1003', parentId: 'p-2', studentId: 's-3', amount: 850, currency: 'AED', status: PaymentStatus.PENDING, transactionType: TransactionType.INVOICE_PAYMENT, createdAt: ts(8), updatedAt: ts(1) },
    ],
  });

  await prisma.auditLog.create({
    data: {
      actorId: 'u-admin-1',
      action: 'SEED_DATABASE',
      entityType: 'system',
      metadata: { version: '0.1.0' },
    },
  });

  console.log('Seed completed.');
  console.log('Login: admin@academy.ae / Admin@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
