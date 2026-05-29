import { Module } from '@nestjs/common';
import { PublicNestController } from './public.nest.controller.js';

@Module({
  controllers: [PublicNestController],
})
export class PublicModule {}
