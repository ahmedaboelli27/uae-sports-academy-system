import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { UserRole } from '@prisma/client';

import { ROLES_KEY } from '../decorators/roles.decorator.js';

interface AuthenticatedRequest {
  user?: {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    roleCode?: string;
  };
  auth?: {
    userId?: string;
    role?: string;
    roleCode?: string;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @Inject(Reflector)
    private readonly reflector: Reflector,
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const userRole =
      request.user?.roleCode ??
      request.user?.role ??
      request.auth?.roleCode ??
      request.auth?.role;

    if (!userRole) {
      throw new ForbiddenException('User role is missing');
    }

    const normalizedUserRole = String(userRole).toUpperCase();

    const hasRequiredRole = requiredRoles.some(
      (role) => String(role).toUpperCase() === normalizedUserRole,
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}