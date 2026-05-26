import { z } from 'zod';

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  status: z.string().optional(),
  branchId: z.string().optional(),
  programId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type ListQuery = z.infer<typeof listQuerySchema>;

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export function parseListQuery(query: unknown): ListQuery {
  return listQuerySchema.parse(query);
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  totalItems: number,
): PaginationMeta {
  return {
    page,
    limit,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / limit)),
  };
}

export function paginateSkip(page: number, limit: number) {
  return { skip: (page - 1) * limit, take: limit };
}

export function buildSearchFilter(
  search: string | undefined,
  fields: string[],
): Record<string, unknown> | undefined {
  if (!search?.trim()) return undefined;

  const term = search.trim();
  return {
    OR: fields.map((field) => ({
      [field]: { contains: term, mode: 'insensitive' as const },
    })),
  };
}
