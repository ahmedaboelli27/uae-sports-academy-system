import type { Response } from 'express';
import type { PaginationMeta } from './pagination.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  message = 'Success',
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta,
  });
}
