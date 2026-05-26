import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { paramId } from '../../utils/params.js';
import { parseListQuery } from '../../utils/pagination.js';
import { createParentSchema, updateParentSchema } from './parents.validation.js';
import * as service from './parents.service.js';

export async function list(req: Request, res: Response) {
  const result = await service.listParents(parseListQuery(req.query));
  return sendPaginated(res, result.items, result.meta);
}

export async function getById(req: Request, res: Response) {
  return sendSuccess(res, await service.getParentById(paramId(req.params.id)));
}

export async function create(req: Request, res: Response) {
  const body = createParentSchema.parse(req.body);
  return sendSuccess(res, await service.createParent(body), 'Parent created', 201);
}

export async function update(req: Request, res: Response) {
  const body = updateParentSchema.parse(req.body);
  return sendSuccess(res, await service.updateParent(paramId(req.params.id), body), 'Parent updated');
}

export async function remove(req: Request, res: Response) {
  return sendSuccess(res, await service.deleteParent(paramId(req.params.id)), 'Parent deleted');
}
