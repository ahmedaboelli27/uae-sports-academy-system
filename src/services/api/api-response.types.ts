export type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  PaginationMeta,
  ListFilters,
} from '@/types/api.types';

export function apiSuccess<T>(data: T, message?: string): import('@/types/api.types').ApiResponse<T> {
  return { success: true, data, message };
}

export function apiError(code: string, message: string): import('@/types/api.types').ApiError {
  return { code, message };
}
