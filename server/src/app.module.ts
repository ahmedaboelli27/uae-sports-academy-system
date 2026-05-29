import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthController } from './health.controller.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ContactModule } from './modules/contact/contact.module.js';
import { PublicModule } from './modules/public/public.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    PublicModule,
    AdminModule,
    SettingsModule,
    ContactModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }