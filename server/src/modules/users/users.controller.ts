import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { paramId } from '../../utils/params.js';
import { createUserSchema, updateUserSchema, usersListQuerySchema } from './users.validation.js';
import * as usersService from './users.service.js';

export async function list(req: Request, res: Response) {
  const query = usersListQuerySchema.parse(req.query);
  const { items, meta } = await usersService.listUsers(query);
  return sendPaginated(res, items, meta, 'Users loaded');
}

export async function getById(req: Request, res: Response) {
  const item = await usersService.getUserById(paramId(req.params.id));
  return sendSuccess(res, item, 'User loaded');
}

export async function create(req: Request, res: Response) {
  const body = createUserSchema.parse(req.body);
  const item = await usersService.createUser(body);
  return sendSuccess(res, item, 'User created', 201);
}

export async function update(req: Request, res: Response) {
  const body = updateUserSchema.parse(req.body);
  const item = await usersService.updateUser(paramId(req.params.id), body);
  return sendSuccess(res, item, 'User updated');
}

export async function remove(req: Request, res: Response) {
  const result = await usersService.deleteUser(paramId(req.params.id));
  return sendSuccess(res, result, 'User deleted');
}
