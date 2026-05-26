import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { paramId } from '../../utils/params.js';
import { parseListQuery } from '../../utils/pagination.js';
import { createProgramSchema, updateProgramSchema } from './programs.validation.js';
import * as service from './programs.service.js';

export async function list(req: Request, res: Response) {
  const result = await service.listPrograms(parseListQuery(req.query));
  return sendPaginated(res, result.items, result.meta);
}

export async function getById(req: Request, res: Response) {
  return sendSuccess(res, await service.getProgramById(paramId(req.params.id)));
}

export async function create(req: Request, res: Response) {
  return sendSuccess(res, await service.createProgram(createProgramSchema.parse(req.body)), 'Program created', 201);
}

export async function update(req: Request, res: Response) {
  return sendSuccess(res, await service.updateProgram(paramId(req.params.id), updateProgramSchema.parse(req.body)), 'Program updated');
}

export async function remove(req: Request, res: Response) {
  return sendSuccess(res, await service.deleteProgram(paramId(req.params.id)), 'Program deleted');
}
