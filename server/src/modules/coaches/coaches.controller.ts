import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { paramId } from '../../utils/params.js';
import { parseListQuery } from '../../utils/pagination.js';
import { createCoachSchema, updateCoachSchema } from './coaches.validation.js';
import * as service from './coaches.service.js';

export async function list(req: Request, res: Response) {
  const result = await service.listCoaches(parseListQuery(req.query));
  return sendPaginated(res, result.items, result.meta);
}

export async function getById(req: Request, res: Response) {
  return sendSuccess(res, await service.getCoachById(paramId(req.params.id)));
}

export async function create(req: Request, res: Response) {
  return sendSuccess(res, await service.createCoach(createCoachSchema.parse(req.body)), 'Coach created', 201);
}

export async function update(req: Request, res: Response) {
  return sendSuccess(res, await service.updateCoach(paramId(req.params.id), updateCoachSchema.parse(req.body)), 'Coach updated');
}

export async function remove(req: Request, res: Response) {
  return sendSuccess(res, await service.deleteCoach(paramId(req.params.id)), 'Coach deleted');
}
