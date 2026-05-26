/**
 * Finance data facade — switches between rich mock and Express API by `VITE_USE_MOCK_API`.
 * Pages should import from this module only (not `finance.service.ts` directly).
 */
import { USE_MOCK_API } from '@/config/api-mode';
import * as financeApi from './finance-api.service';
import * as financeMock from './finance.service';

const impl = USE_MOCK_API ? financeMock : financeApi;

export const getFinanceDashboard = impl.getFinanceDashboard;
export const getFinanceSubscriptions = impl.getFinanceSubscriptions;
export const getFinanceSubscriptionById = impl.getFinanceSubscriptionById;
export const createFinanceSubscription = impl.createFinanceSubscription;
export const updateFinanceSubscription = impl.updateFinanceSubscription;
export const deleteFinanceSubscription = impl.deleteFinanceSubscription;

export const getFinanceInvoices = impl.getFinanceInvoices;
export const getFinanceInvoiceById = impl.getFinanceInvoiceById;
export const createFinanceInvoice = impl.createFinanceInvoice;
export const updateFinanceInvoice = impl.updateFinanceInvoice;
export const deleteFinanceInvoice = impl.deleteFinanceInvoice;

export const getFinancePayments = impl.getFinancePayments;
export const getFinancePaymentById = impl.getFinancePaymentById;
export const createFinancePayment = impl.createFinancePayment;
export const updateFinancePayment = impl.updateFinancePayment;
export const deleteFinancePayment = impl.deleteFinancePayment;

/** Mock-only rich export; API mode uses a lightweight stub from finance-api.service */
export const exportFinanceReport = impl.exportFinanceReport;
