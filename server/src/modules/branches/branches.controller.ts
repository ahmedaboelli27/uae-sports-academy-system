import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { paramId } from '../../utils/params.js';
import { parseListQuery } from '../../utils/pagination.js';
import { createBranchSchema, updateBranchSchema } from './branches.validation.js';
import * as service from './branches.service.js';

export async function list(req: Request, res: Response) {
  const result = await service.listBranches(parseListQuery(req.query));
  return sendPaginated(res, result.items, result.meta);
}

export async function getById(req: Request, res: Response) {
  return sendSuccess(res, await service.getBranchById(paramId(req.params.id)));
}

export async function create(req: Request, res: Response) {
  return sendSuccess(res, await service.createBranch(createBranchSchema.parse(req.body)), 'Branch created', 201);
}

export async function update(req: Request, res: Response) {
  return sendSuccess(res, await service.updateBranch(paramId(req.params.id), updateBranchSchema.parse(req.body)), 'Branch updated');
}

export async function remove(req: Request, res: Response) {
  return sendSuccess(res, await service.deleteBranch(paramId(req.params.id)), 'Branch deleted');
}
