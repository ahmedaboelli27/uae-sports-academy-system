import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as publicController from './public.controller.js';

@Controller('public')
export class PublicNestController {
  @Get('academy-summary')
  academySummary(@Req() req: Request, @Res() res: Response) {
    return publicController.academySummary(req, res);
  }

  @Get('home')
  home(@Req() req: Request, @Res() res: Response) {
    return publicController.home(req, res);
  }

  @Get('about')
  about(@Req() req: Request, @Res() res: Response) {
    return publicController.about(req, res);
  }

  @Get('programs')
  programs(@Req() req: Request, @Res() res: Response) {
    return publicController.programs(req, res);
  }

  @Get('programs/:programId')
  programDetails(@Req() req: Request, @Res() res: Response) {
    return publicController.programDetails(req, res);
  }

  @Get('coaches')
  coaches(@Req() req: Request, @Res() res: Response) {
    return publicController.coaches(req, res);
  }

  @Get('coaches/:coachId')
  coachDetails(@Req() req: Request, @Res() res: Response) {
    return publicController.coachDetails(req, res);
  }

  @Get('locations')
  locations(@Req() req: Request, @Res() res: Response) {
    return publicController.locations(req, res);
  }

  @Get('pricing')
  pricing(@Req() req: Request, @Res() res: Response) {
    return publicController.pricing(req, res);
  }

  @Get('offers')
  offers(@Req() req: Request, @Res() res: Response) {
    return publicController.offers(req, res);
  }

  @Get('gallery')
  gallery(@Req() req: Request, @Res() res: Response) {
    return publicController.gallery(req, res);
  }

  @Get('events')
  events(@Req() req: Request, @Res() res: Response) {
    return publicController.events(req, res);
  }

  @Get('events/:eventId')
  eventDetails(@Req() req: Request, @Res() res: Response) {
    return publicController.eventDetails(req, res);
  }

  @Get('blog')
  blog(@Req() req: Request, @Res() res: Response) {
    return publicController.blog(req, res);
  }

  @Get('blog/:postId')
  blogPost(@Req() req: Request, @Res() res: Response) {
    return publicController.blogPost(req, res);
  }

  @Get('login-showcase')
  loginShowcase(@Req() req: Request, @Res() res: Response) {
    return publicController.loginShowcase(req, res);
  }
}
