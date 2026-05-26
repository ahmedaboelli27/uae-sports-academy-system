import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as controller from './finance.controller.js';

const router = Router();

router.get('/dashboard', asyncHandler(controller.dashboard));

router.get('/subscriptions', asyncHandler(controller.listSubscriptions));
router.get('/subscriptions/:id', asyncHandler(controller.getSubscription));
router.post('/subscriptions', asyncHandler(controller.createSubscription));
router.patch('/subscriptions/:id', asyncHandler(controller.updateSubscription));
router.delete('/subscriptions/:id', asyncHandler(controller.deleteSubscription));

router.get('/invoices', asyncHandler(controller.listInvoices));
router.get('/invoices/:id', asyncHandler(controller.getInvoice));
router.post('/invoices', asyncHandler(controller.createInvoice));
router.patch('/invoices/:id', asyncHandler(controller.updateInvoice));
router.delete('/invoices/:id', asyncHandler(controller.deleteInvoice));

router.get('/payments', asyncHandler(controller.listPayments));
router.get('/payments/:id', asyncHandler(controller.getPayment));
router.post('/payments', asyncHandler(controller.createPayment));
router.patch('/payments/:id', asyncHandler(controller.updatePayment));
router.delete('/payments/:id', asyncHandler(controller.deletePayment));

export default router;
