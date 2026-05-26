import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { paramId } from '../../utils/params.js';
import { parseListQuery } from '../../utils/pagination.js';
import {
  createInvoiceSchema,
  createPaymentSchema,
  createSubscriptionSchema,
  updateInvoiceSchema,
  updatePaymentSchema,
  updateSubscriptionSchema,
} from './finance.validation.js';
import * as service from './finance.service.js';

export async function dashboard(_req: Request, res: Response) {
  return sendSuccess(res, await service.getFinanceDashboard());
}

export async function listSubscriptions(req: Request, res: Response) {
  const result = await service.listSubscriptions(parseListQuery(req.query));
  return sendPaginated(res, result.items, result.meta);
}

export async function getSubscription(req: Request, res: Response) {
  return sendSuccess(res, await service.getSubscriptionById(paramId(req.params.id)));
}

export async function createSubscription(req: Request, res: Response) {
  return sendSuccess(res, await service.createSubscription(createSubscriptionSchema.parse(req.body)), 'Subscription created', 201);
}

export async function updateSubscription(req: Request, res: Response) {
  return sendSuccess(res, await service.updateSubscription(paramId(req.params.id), updateSubscriptionSchema.parse(req.body)), 'Subscription updated');
}

export async function deleteSubscription(req: Request, res: Response) {
  return sendSuccess(res, await service.deleteSubscription(paramId(req.params.id)), 'Subscription deleted');
}

export async function listInvoices(req: Request, res: Response) {
  const result = await service.listInvoices(parseListQuery(req.query));
  return sendPaginated(res, result.items, result.meta);
}

export async function getInvoice(req: Request, res: Response) {
  return sendSuccess(res, await service.getInvoiceById(paramId(req.params.id)));
}

export async function createInvoice(req: Request, res: Response) {
  return sendSuccess(res, await service.createInvoice(createInvoiceSchema.parse(req.body)), 'Invoice created', 201);
}

export async function updateInvoice(req: Request, res: Response) {
  return sendSuccess(res, await service.updateInvoice(paramId(req.params.id), updateInvoiceSchema.parse(req.body)), 'Invoice updated');
}

export async function deleteInvoice(req: Request, res: Response) {
  return sendSuccess(res, await service.deleteInvoice(paramId(req.params.id)), 'Invoice deleted');
}

export async function listPayments(req: Request, res: Response) {
  const result = await service.listPayments(parseListQuery(req.query));
  return sendPaginated(res, result.items, result.meta);
}

export async function getPayment(req: Request, res: Response) {
  return sendSuccess(res, await service.getPaymentById(paramId(req.params.id)));
}

export async function createPayment(req: Request, res: Response) {
  return sendSuccess(res, await service.createPayment(createPaymentSchema.parse(req.body)), 'Payment created', 201);
}

export async function updatePayment(req: Request, res: Response) {
  return sendSuccess(res, await service.updatePayment(paramId(req.params.id), updatePaymentSchema.parse(req.body)), 'Payment updated');
}

export async function deletePayment(req: Request, res: Response) {
  return sendSuccess(res, await service.deletePayment(paramId(req.params.id)), 'Payment deleted');
}
