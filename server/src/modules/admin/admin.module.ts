import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminNestController } from './admin.nest.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [AdminNestController],
})
export class AdminModule {}
