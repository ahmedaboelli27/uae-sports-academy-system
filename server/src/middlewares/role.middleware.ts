import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.roleCode as UserRole | undefined;

    if (!role || !roles.includes(role)) {
      return next(ApiError.forbidden('Insufficient permissions'));
    }

    return next();
  };
}

export const adminOnly = requireRoles('ADMIN', 'ACCOUNTANT');
