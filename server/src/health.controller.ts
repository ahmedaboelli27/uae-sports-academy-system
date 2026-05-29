import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    return {
      success: true,
      message: 'Success',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
    };
  }
}
