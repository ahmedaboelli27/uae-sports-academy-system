import { axiosClient } from '@/services/api/axios-client';
import type { ApiResponse, ListFilters, PaginatedResponse } from '@/types';

interface BackendSuccess<T> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginatedResponse<T>['meta'];
}

export async function getJson<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const { data } = await axiosClient.get<BackendSuccess<T>>(url, { params });
  return data.data;
}

export async function getPaginated<T>(
  url: string,
  filters?: ListFilters,
): Promise<PaginatedResponse<T>> {
  const { data } = await axiosClient.get<BackendSuccess<T[]>>(url, {
    params: {
      page: filters?.page,
      limit: filters?.pageSize,
      search: filters?.search,
      sortBy: filters?.sortBy,
      sortOrder: filters?.sortOrder,
    },
  });

  return {
    success: true,
    data: data.data,
    meta: data.meta ?? {
      page: filters?.page ?? 1,
      pageSize: filters?.pageSize ?? 20,
      totalItems: data.data.length,
      totalPages: 1,
    },
  };
}

export async function postJson<T, B>(url: string, body: B): Promise<T> {
  const { data } = await axiosClient.post<BackendSuccess<T>>(url, body);
  return data.data;
}

export async function patchJson<T, B>(url: string, body: B): Promise<T> {
  const { data } = await axiosClient.patch<BackendSuccess<T>>(url, body);
  return data.data;
}

export async function deleteJson<T>(url: string): Promise<T> {
  const { data } = await axiosClient.delete<BackendSuccess<T>>(url);
  return data.data;
}

export type { ApiResponse };
