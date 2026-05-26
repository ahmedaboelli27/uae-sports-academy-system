import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/api-response.js';
import * as service from './reports.service.js';

export async function summary(_req: Request, res: Response) {
  return sendSuccess(res, await service.getReportsSummary());
}
