import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../db/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export interface AuthPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      roleCode: string;
      phone?: string | null;
      status?: string;
    }

    interface Request {
      auth?: {
        userId?: string;
        id?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        role?: string;
        roleCode?: string;
        phone?: string | null;
        status?: string;
      };
    }
  }
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Missing or invalid authorization header'));
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.auth = payload;

    const user = await prisma.user.findFirst({
      where: { id: payload.userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roleCode: true,
      },
    });

    if (!user) {
      return next(ApiError.unauthorized('User not found'));
    }

    req.user = user;
    return next();
  } catch {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
}

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next();
  }

  return authMiddleware(req, _res, next);
}
