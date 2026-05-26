import type { Request, Response } from 'express';
import { sendSuccess } from '../../utils/api-response.js';
import {
  loginSchema,
  registerCoachRequestSchema,
  registerParentSchema,
  registerSchema,
} from './auth.validation.js';
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

export async function register(req: Request, res: Response) {
  const body = registerSchema.parse(req.body);
  const user = await authService.registerUser(body, 'general');
  return sendSuccess(res, user, 'Registration successful', 201);
}

export async function registerParent(req: Request, res: Response) {
  const body = registerParentSchema.parse(req.body);
  const user = await authService.registerUser(body, 'parent');
  return sendSuccess(res, user, 'Parent registration successful', 201);
}

export async function registerCoachRequest(req: Request, res: Response) {
  const body = registerCoachRequestSchema.parse(req.body);
  const user = await authService.registerUser(body, 'coach-request');
  return sendSuccess(res, user, 'Coach request submitted successfully', 201);
}
