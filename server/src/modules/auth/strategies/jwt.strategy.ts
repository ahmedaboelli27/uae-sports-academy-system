import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from '../../../prisma/prisma.service.js';

interface JwtPayload {
  userId?: string;
  sub?: string;
  id?: string;
  email?: string;
  role?: string;
  roleCode?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(ConfigService)
    configService: ConfigService,

    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {
    const secret =
      configService.get<string>('JWT_SECRET') ??
      configService.get<string>('JWT_ACCESS_SECRET') ??
      process.env.JWT_SECRET ??
      process.env.JWT_ACCESS_SECRET ??
      'dev-secret-change-me';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload) {
    const userId = payload.userId ?? payload.sub ?? payload.id;

    if (!userId) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        roleCode: true,
        status: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      ...user,
      role: user.roleCode,
    };
  }
}