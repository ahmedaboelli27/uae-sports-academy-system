import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/api-response.js';
import * as service from './dashboard.service.js';

export async function adminDashboard(_req: Request, res: Response) {
  return sendSuccess(res, await service.getAdminDashboard());
}
