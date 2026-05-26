import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/api-response.js';
import { loginSchema } from './auth.validation.js';
import * as authService from './auth.service.js';

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);
  const result = await authService.loginUser(body);
  return sendSuccess(res, result, 'Login successful');
}

export async function me(req: Request, res: Response) {
  const userId = req.user!.id;
  const user = await authService.getCurrentUser(userId);
  return sendSuccess(res, user, 'Current user');
}
