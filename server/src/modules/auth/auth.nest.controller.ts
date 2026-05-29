import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import * as authController from './auth.controller.js';

@Controller('auth')
export class AuthNestController {
  @Post('login')
  login(@Req() req: Request, @Res() res: Response) {
    return authController.login(req, res);
  }

  @Post('register')
  register(@Req() req: Request, @Res() res: Response) {
    return authController.register(req, res);
  }

  @Post('register/parent')
  registerParent(@Req() req: Request, @Res() res: Response) {
    return authController.registerParent(req, res);
  }

  @Post('register/coach-request')
  registerCoachRequest(@Req() req: Request, @Res() res: Response) {
    return authController.registerCoachRequest(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: Request, @Res() res: Response) {
    return authController.me(req, res);
  }
}
