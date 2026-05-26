import type { ListFilters, PaginatedResponse, PaginationMeta } from '@/types';

export function paginateItems<T>(
  items: T[],
  filters: ListFilters = {},
): PaginatedResponse<T> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 10));
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);
  const meta: PaginationMeta = { page, pageSize, totalItems, totalPages };
  return { success: true, data, meta };
}

export function filterBySearch<T>(
  items: T[],
  search: string | undefined,
  keys: (keyof T)[],
): T[] {
  if (!search?.trim()) return items;
  const q = search.toLowerCase();
  return items.filter((item) =>
    keys.some((key) => String(item[key] ?? '').toLowerCase().includes(q)),
  );
}
