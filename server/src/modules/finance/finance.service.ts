import { prisma } from '../../db/prisma.js';
import { ApiError } from '../../utils/ApiError.js';
import {
  buildPaginationMeta,
  buildSearchFilter,
  paginateSkip,
  type ListQuery,
} from '../../utils/pagination.js';
import type {
  createInvoiceSchema,
  createPaymentSchema,
  createSubscriptionSchema,
  updateInvoiceSchema,
  updatePaymentSchema,
  updateSubscriptionSchema,
} from './finance.validation.js';
import type { z } from 'zod';

type CreateSub = z.infer<typeof createSubscriptionSchema>;
type UpdateSub = z.infer<typeof updateSubscriptionSchema>;
type CreateInv = z.infer<typeof createInvoiceSchema>;
type UpdateInv = z.infer<typeof updateInvoiceSchema>;
type CreatePay = z.infer<typeof createPaymentSchema>;
type UpdatePay = z.infer<typeof updatePaymentSchema>;

const notDeleted = { deletedAt: null };

export async function getFinanceDashboard() {
  const [subscriptions, invoices, payments, students, parents] = await Promise.all([
    prisma.subscription.count({ where: notDeleted }),
    prisma.invoice.count({ where: notDeleted }),
    prisma.payment.count({ where: notDeleted }),
    prisma.student.count({ where: notDeleted }),
    prisma.parent.count({ where: notDeleted }),
  ]);

  const paidPayments = await prisma.payment.aggregate({
    where: { status: 'PAID', ...notDeleted },
    _sum: { amount: true },
  });

  const activeSubscriptions = await prisma.subscription.count({
    where: { status: 'ACTIVE', ...notDeleted },
  });

  return {
    totals: {
      subscriptions,
      invoices,
      payments,
      students,
      parents,
      activeSubscriptions,
      totalCollected: Number(paidPayments._sum.amount ?? 0),
      currency: 'AED',
    },
  };
}

export async function listSubscriptions(query: ListQuery) {
  const { page, limit, search, status, branchId, programId } = query;
  const where = {
    ...notDeleted,
    ...(status ? { status: status as never } : {}),
    ...(branchId ? { branchId } : {}),
    ...(programId ? { programId } : {}),
    ...buildSearchFilter(search, ['subscriptionCode']),
  };

  const [items, total] = await Promise.all([
    prisma.subscription.findMany({
      where,
      ...paginateSkip(page, limit),
      orderBy: { createdAt: 'desc' },
      include: { student: true, parent: { include: { user: true } }, branch: true, program: true },
    }),
    prisma.subscription.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export async function getSubscriptionById(id: string) {
  const item = await prisma.subscription.findFirst({
    where: { id, ...notDeleted },
    include: {
      student: true,
      parent: { include: { user: true } },
      branch: true,
      program: true,
      invoices: true,
      payments: true,
    },
  });
  if (!item) throw ApiError.notFound('Subscription not found');
  return item;
}

export async function createSubscription(input: CreateSub) {
  const code = input.subscriptionCode ?? `SUB-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return prisma.subscription.create({
    data: {
      id: `sub-${Date.now()}`,
      subscriptionCode: code,
      ...input,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      amount: input.amount,
    },
    include: { student: true, parent: true, branch: true, program: true },
  });
}

export async function updateSubscription(id: string, input: UpdateSub) {
  await getSubscriptionById(id);
  return prisma.subscription.update({
    where: { id },
    data: {
      ...input,
      ...(input.startDate ? { startDate: new Date(input.startDate) } : {}),
      ...(input.endDate ? { endDate: new Date(input.endDate) } : {}),
    },
    include: { student: true, parent: true, branch: true, program: true },
  });
}

export async function deleteSubscription(id: string) {
  await getSubscriptionById(id);
  await prisma.subscription.update({ where: { id }, data: { deletedAt: new Date() } });
  return { id, deleted: true };
}

export async function listInvoices(query: ListQuery) {
  const { page, limit, search, status } = query;
  const where = {
    ...notDeleted,
    ...(status ? { status: status as never } : {}),
    ...buildSearchFilter(search, ['invoiceNumber']),
  };

  const [items, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      ...paginateSkip(page, limit),
      orderBy: { issuedAt: 'desc' },
      include: { parent: true, student: true, subscription: true, lineItems: true },
    }),
    prisma.invoice.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export async function getInvoiceById(id: string) {
  const item = await prisma.invoice.findFirst({
    where: { id, ...notDeleted },
    include: { parent: true, student: true, subscription: true, lineItems: true, payments: true },
  });
  if (!item) throw ApiError.notFound('Invoice not found');
  return item;
}

export async function createInvoice(input: CreateInv) {
  const { lineItems, ...data } = input;
  const number = data.invoiceNumber ?? `INV-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  return prisma.invoice.create({
    data: {
      id: `inv-${Date.now()}`,
      invoiceNumber: number,
      parentId: data.parentId,
      studentId: data.studentId ?? null,
      subscriptionId: data.subscriptionId ?? null,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      dueDate: new Date(data.dueDate),
      issuedAt: new Date(data.issuedAt),
      lineItems: lineItems?.length
        ? {
            create: lineItems.map((li) => ({
              description: li.description,
              quantity: li.quantity,
              unitPrice: li.unitPrice,
              discount: li.discount,
              tax: li.tax,
              total: li.quantity * li.unitPrice - li.discount + li.tax,
            })),
          }
        : undefined,
    },
    include: { lineItems: true, parent: true, student: true },
  });
}

export async function updateInvoice(id: string, input: UpdateInv) {
  await getInvoiceById(id);
  const { lineItems: _lineItems, ...data } = input;
  return prisma.invoice.update({
    where: { id },
    data: {
      ...data,
      ...(data.dueDate ? { dueDate: new Date(data.dueDate) } : {}),
      ...(data.issuedAt ? { issuedAt: new Date(data.issuedAt) } : {}),
    },
    include: { lineItems: true },
  });
}

export async function deleteInvoice(id: string) {
  await getInvoiceById(id);
  await prisma.invoice.update({ where: { id }, data: { deletedAt: new Date() } });
  return { id, deleted: true };
}

export async function listPayments(query: ListQuery) {
  const { page, limit, search, status } = query;
  const where = {
    ...notDeleted,
    ...(status ? { status: status as never } : {}),
    ...buildSearchFilter(search, ['paymentCode', 'reference']),
  };

  const [items, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      ...paginateSkip(page, limit),
      orderBy: { createdAt: 'desc' },
      include: { parent: true, student: true, invoice: true, subscription: true },
    }),
    prisma.payment.count({ where }),
  ]);

  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export async function getPaymentById(id: string) {
  const item = await prisma.payment.findFirst({
    where: { id, ...notDeleted },
    include: { parent: true, student: true, invoice: true, subscription: true },
  });
  if (!item) throw ApiError.notFound('Payment not found');
  return item;
}

export async function createPayment(input: CreatePay) {
  const code = input.paymentCode ?? `PAY-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  return prisma.payment.create({
    data: {
      id: `pay-${Date.now()}`,
      paymentCode: code,
      parentId: input.parentId,
      studentId: input.studentId ?? null,
      invoiceId: input.invoiceId ?? null,
      subscriptionId: input.subscriptionId ?? null,
      amount: input.amount,
      currency: input.currency,
      status: input.status,
      method: input.method ?? null,
      transactionType: input.transactionType,
      paidAt: input.paidAt ? new Date(input.paidAt) : input.status === 'PAID' ? new Date() : null,
      reference: input.reference ?? null,
      notes: input.notes ?? null,
    },
    include: { parent: true, invoice: true, subscription: true },
  });
}

export async function updatePayment(id: string, input: UpdatePay) {
  await getPaymentById(id);
  return prisma.payment.update({
    where: { id },
    data: {
      ...input,
      ...(input.paidAt ? { paidAt: new Date(input.paidAt) } : {}),
    },
    include: { parent: true, invoice: true, subscription: true },
  });
}

export async function deletePayment(id: string) {
  await getPaymentById(id);
  await prisma.payment.update({ where: { id }, data: { deletedAt: new Date() } });
  return { id, deleted: true };
}
