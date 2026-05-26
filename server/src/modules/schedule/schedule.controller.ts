import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { paramId } from '../../utils/params.js';
import { parseListQuery } from '../../utils/pagination.js';
import { createSessionSchema, updateSessionSchema } from './schedule.validation.js';
import * as service from './schedule.service.js';

export async function list(req: Request, res: Response) {
  const result = await service.listSessions(parseListQuery(req.query));
  return sendPaginated(res, result.items, result.meta);
}

export async function getById(req: Request, res: Response) {
  return sendSuccess(res, await service.getSessionById(paramId(req.params.id)));
}

export async function create(req: Request, res: Response) {
  return sendSuccess(res, await service.createSession(createSessionSchema.parse(req.body)), 'Session created', 201);
}

export async function update(req: Request, res: Response) {
  return sendSuccess(res, await service.updateSession(paramId(req.params.id), updateSessionSchema.parse(req.body)), 'Session updated');
}

export async function remove(req: Request, res: Response) {
  return sendSuccess(res, await service.deleteSession(paramId(req.params.id)), 'Session deleted');
}
