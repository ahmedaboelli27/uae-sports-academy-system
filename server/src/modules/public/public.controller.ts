import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/api-response.js';
import * as publicService from './public.service.js';

export async function academySummary(_req: Request, res: Response) {
  const data = await publicService.getAcademySummary();
  return sendSuccess(res, data, 'Public academy summary loaded successfully');
}

export async function home(_req: Request, res: Response) {
  const data = await publicService.getPublicHome();
  return sendSuccess(res, data, 'Public home data loaded successfully');
}

export async function loginShowcase(_req: Request, res: Response) {
  const data = await publicService.getLoginShowcase();
  return sendSuccess(res, data, 'Public login showcase loaded successfully');
}
