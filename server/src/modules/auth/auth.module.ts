import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { PrismaModule } from '../../prisma/prisma.module.js';
import { AuthNestController } from './auth.nest.controller.js';
import { RolesGuard } from './guards/roles.guard.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret =
          configService.get<string>('JWT_SECRET') ??
          configService.get<string>('JWT_ACCESS_SECRET') ??
          process.env.JWT_SECRET ??
          process.env.JWT_ACCESS_SECRET ??
          'dev-secret-change-me';

        const expiresInSeconds = Number(
          configService.get<string>('JWT_EXPIRES_IN_SECONDS') ??
          process.env.JWT_EXPIRES_IN_SECONDS ??
          60 * 60 * 24 * 7,
        );

        return {
          secret,
          signOptions: {
            expiresIn: expiresInSeconds,
          },
        };
      },
    }),
  ],
  controllers: [AuthNestController],
  providers: [JwtStrategy, RolesGuard],
  exports: [JwtModule, RolesGuard],
})
export class AuthModule { }