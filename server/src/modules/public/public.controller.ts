import type { Request, Response } from 'express';

import { sendSuccess } from '../../utils/api-response.js';
import * as publicService from './public.service.js';

function getSingleParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }

  return value ?? '';
}

export async function academySummary(_req: Request, res: Response) {
  const data = await publicService.getAcademySummary();

  return sendSuccess(
    res,
    data,
    'Public academy summary loaded successfully',
  );
}

export async function home(_req: Request, res: Response) {
  const data = await publicService.getPublicHome();

  return sendSuccess(res, data, 'Public home data loaded successfully');
}

export async function about(_req: Request, res: Response) {
  const data = await publicService.getPublicAbout();

  return sendSuccess(res, data, 'Public about data loaded successfully');
}

export async function programs(_req: Request, res: Response) {
  const data = await publicService.getPublicPrograms();

  return sendSuccess(res, data, 'Public programs data loaded successfully');
}

export async function programDetails(req: Request, res: Response) {
  const programId = getSingleParam(req.params.programId);

  const data = await publicService.getPublicProgramDetails(programId);

  return sendSuccess(
    res,
    data,
    'Public program details loaded successfully',
  );
}

export async function coaches(_req: Request, res: Response) {
  const data = await publicService.getPublicCoaches();

  return sendSuccess(res, data, 'Public coaches data loaded successfully');
}

export async function coachDetails(req: Request, res: Response) {
  const coachId = getSingleParam(req.params.coachId);

  const data = await publicService.getPublicCoachDetails(coachId);

  return sendSuccess(res, data, 'Public coach details loaded successfully');
}

export async function locations(_req: Request, res: Response) {
  const data = await publicService.getPublicLocations();

  return sendSuccess(res, data, 'Public locations data loaded successfully');
}

export async function pricing(_req: Request, res: Response) {
  const data = await publicService.getPublicPricing();

  return sendSuccess(res, data, 'Public pricing data loaded successfully');
}

export async function offers(_req: Request, res: Response) {
  const data = await publicService.getPublicOffers();

  return sendSuccess(res, data, 'Public offers data loaded successfully');
}

export async function gallery(_req: Request, res: Response) {
  const data = await publicService.getPublicGallery();

  return sendSuccess(res, data, 'Public gallery data loaded successfully');
}

export async function events(_req: Request, res: Response) {
  const data = await publicService.getPublicEvents();

  return sendSuccess(res, data, 'Public events data loaded successfully');
}

export async function eventDetails(req: Request, res: Response) {
  const eventId = getSingleParam(req.params.eventId);

  const data = await publicService.getPublicEventDetails(eventId);

  return sendSuccess(res, data, 'Public event details loaded successfully');
}

export async function blog(_req: Request, res: Response) {
  const data = await publicService.getPublicBlog();

  return sendSuccess(res, data, 'Public blog data loaded successfully');
}

export async function blogPost(req: Request, res: Response) {
  const postId = getSingleParam(req.params.postId);

  const data = await publicService.getPublicBlogPost(postId);

  return sendSuccess(res, data, 'Public blog post loaded successfully');
}

export async function loginShowcase(_req: Request, res: Response) {
  const data = await publicService.getLoginShowcase();

  return sendSuccess(res, data, 'Public login showcase loaded successfully');
}