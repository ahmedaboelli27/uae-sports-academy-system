import { ENDPOINTS } from '@/services/api/endpoints';
import { deleteJson, getJson, patchJson, postJson } from '@/services/api/http';
import type { ApiError } from '@/types/api.types';
import type {
  CreateInvoiceRequestDto,
  CreatePaymentRequestDto,
  CreateSubscriptionRequestDto,
  DeleteFinanceRecordResponseDto,
  ExportFinanceReportRequestDto,
  ExportFinanceReportResponseDto,
  FinanceDashboardDto,
  FinanceFiltersDto,
  FinanceInvoiceDetailsDto,
  FinanceInvoiceListItemDto,
  FinancePaymentDetailsDto,
  FinancePaymentListItemDto,
  FinanceSubscriptionDetailsDto,
  FinanceSubscriptionListItemDto,
  UpdateInvoiceRequestDto,
  UpdatePaymentRequestDto,
  UpdateSubscriptionRequestDto,
} from '../types/finance.dto';
import {
  buildFinanceDashboardDto,
  buildFinanceQueryParams,
  filterPaymentsByMethod,
  mapCreateInvoicePayload,
  mapCreatePaymentPayload,
  mapCreateSubscriptionPayload,
  mapInvoiceDetails,
  mapInvoiceListItem,
  mapPaymentDetails,
  mapPaymentListItem,
  mapSubscriptionDetails,
  mapSubscriptionListItem,
  mapUpdateInvoicePayload,
  mapUpdatePaymentPayload,
  mapUpdateSubscriptionPayload,
  type BackendInvoice,
  type BackendPayment,
  type BackendSubscription,
} from './finance-api.mappers';

function isNotFoundError(error: unknown): boolean {
  const apiError = error as ApiError;
  return apiError?.code === 'NOT_FOUND';
}

async function fetchSubscriptions(filters?: FinanceFiltersDto) {
  const raw = await getJson<BackendSubscription[]>(
    ENDPOINTS.admin.finance.subscriptions.list,
    buildFinanceQueryParams(filters, 'subscription'),
  );
  return raw.map((item) => mapSubscriptionListItem(item, item.payments));
}

async function fetchInvoices(filters?: FinanceFiltersDto) {
  const raw = await getJson<BackendInvoice[]>(
    ENDPOINTS.admin.finance.invoices.list,
    buildFinanceQueryParams(filters, 'invoice'),
  );
  return raw.map(mapInvoiceListItem);
}

async function fetchPayments(filters?: FinanceFiltersDto) {
  const raw = await getJson<BackendPayment[]>(
    ENDPOINTS.admin.finance.payments.list,
    buildFinanceQueryParams(filters, 'payment'),
  );
  const mapped = raw.map(mapPaymentListItem);
  return filterPaymentsByMethod(mapped, filters);
}

export async function getFinanceDashboard(
  filters?: FinanceFiltersDto,
): Promise<FinanceDashboardDto> {
  const [subscriptions, invoices, payments] = await Promise.all([
    fetchSubscriptions(filters),
    fetchInvoices(filters),
    fetchPayments(filters),
  ]);

  return buildFinanceDashboardDto(subscriptions, invoices, payments);
}

export async function getFinanceSubscriptions(
  filters?: FinanceFiltersDto,
): Promise<FinanceSubscriptionListItemDto[]> {
  return fetchSubscriptions(filters);
}

export async function getFinanceSubscriptionById(
  subscriptionId: string,
): Promise<FinanceSubscriptionDetailsDto | null> {
  try {
    const raw = await getJson<BackendSubscription>(
      ENDPOINTS.admin.finance.subscriptions.detail(subscriptionId),
    );
    return mapSubscriptionDetails(raw, raw.payments);
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function createFinanceSubscription(
  payload: CreateSubscriptionRequestDto,
): Promise<FinanceSubscriptionDetailsDto> {
  const raw = await postJson<BackendSubscription, ReturnType<typeof mapCreateSubscriptionPayload>>(
    ENDPOINTS.admin.finance.subscriptions.list,
    mapCreateSubscriptionPayload(payload),
  );
  return mapSubscriptionDetails(raw, raw.payments);
}

export async function updateFinanceSubscription(
  subscriptionId: string,
  payload: UpdateSubscriptionRequestDto,
): Promise<FinanceSubscriptionDetailsDto | null> {
  try {
    const raw = await patchJson<BackendSubscription, Record<string, unknown>>(
      ENDPOINTS.admin.finance.subscriptions.detail(subscriptionId),
      mapUpdateSubscriptionPayload(payload),
    );
    return mapSubscriptionDetails(raw, raw.payments);
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function deleteFinanceSubscription(
  subscriptionId: string,
): Promise<DeleteFinanceRecordResponseDto> {
  return deleteJson<DeleteFinanceRecordResponseDto>(
    ENDPOINTS.admin.finance.subscriptions.detail(subscriptionId),
  );
}

export async function getFinanceInvoices(
  filters?: FinanceFiltersDto,
): Promise<FinanceInvoiceListItemDto[]> {
  return fetchInvoices(filters);
}

export async function getFinanceInvoiceById(
  invoiceId: string,
): Promise<FinanceInvoiceDetailsDto | null> {
  try {
    const raw = await getJson<BackendInvoice>(
      ENDPOINTS.admin.finance.invoices.detail(invoiceId),
    );
    return mapInvoiceDetails(raw);
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function createFinanceInvoice(
  payload: CreateInvoiceRequestDto,
): Promise<FinanceInvoiceDetailsDto> {
  const raw = await postJson<BackendInvoice, ReturnType<typeof mapCreateInvoicePayload>>(
    ENDPOINTS.admin.finance.invoices.list,
    mapCreateInvoicePayload(payload),
  );
  return mapInvoiceDetails(raw);
}

export async function updateFinanceInvoice(
  invoiceId: string,
  payload: UpdateInvoiceRequestDto,
): Promise<FinanceInvoiceDetailsDto | null> {
  try {
    const raw = await patchJson<BackendInvoice, Record<string, unknown>>(
      ENDPOINTS.admin.finance.invoices.detail(invoiceId),
      mapUpdateInvoicePayload(payload),
    );
    return mapInvoiceDetails(raw);
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function deleteFinanceInvoice(
  invoiceId: string,
): Promise<DeleteFinanceRecordResponseDto> {
  return deleteJson<DeleteFinanceRecordResponseDto>(
    ENDPOINTS.admin.finance.invoices.detail(invoiceId),
  );
}

export async function getFinancePayments(
  filters?: FinanceFiltersDto,
): Promise<FinancePaymentListItemDto[]> {
  return fetchPayments(filters);
}

export async function getFinancePaymentById(
  paymentId: string,
): Promise<FinancePaymentDetailsDto | null> {
  try {
    const raw = await getJson<BackendPayment>(
      ENDPOINTS.admin.finance.payments.detail(paymentId),
    );
    return mapPaymentDetails(
      raw,
      raw.subscription ? mapSubscriptionListItem(raw.subscription, raw.subscription.payments) : null,
    );
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function createFinancePayment(
  payload: CreatePaymentRequestDto,
): Promise<FinancePaymentDetailsDto> {
  const raw = await postJson<BackendPayment, ReturnType<typeof mapCreatePaymentPayload>>(
    ENDPOINTS.admin.finance.payments.list,
    mapCreatePaymentPayload(payload),
  );
  return mapPaymentDetails(
    raw,
    raw.subscription ? mapSubscriptionListItem(raw.subscription) : null,
  );
}

export async function updateFinancePayment(
  paymentId: string,
  payload: UpdatePaymentRequestDto,
): Promise<FinancePaymentDetailsDto | null> {
  try {
    const raw = await patchJson<BackendPayment, Record<string, unknown>>(
      ENDPOINTS.admin.finance.payments.detail(paymentId),
      mapUpdatePaymentPayload(payload),
    );
    return mapPaymentDetails(
      raw,
      raw.subscription ? mapSubscriptionListItem(raw.subscription) : null,
    );
  } catch (error) {
    if (isNotFoundError(error)) return null;
    throw error;
  }
}

export async function deleteFinancePayment(
  paymentId: string,
): Promise<DeleteFinanceRecordResponseDto> {
  return deleteJson<DeleteFinanceRecordResponseDto>(
    ENDPOINTS.admin.finance.payments.detail(paymentId),
  );
}

/** Export remains mock-only until a backend report endpoint exists. */
export async function exportFinanceReport(
  _payload: ExportFinanceReportRequestDto,
): Promise<ExportFinanceReportResponseDto> {
  const timestamp = new Date().toISOString();
  return {
    fileName: `finance-report-${timestamp.slice(0, 10)}.csv`,
    fileUrl: '#',
    generatedAt: timestamp,
  };
}
