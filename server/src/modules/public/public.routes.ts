import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as controller from './public.controller.js';

const router = Router();

router.get('/academy-summary', asyncHandler(controller.academySummary));
router.get('/home', asyncHandler(controller.home));
router.get('/about', asyncHandler(controller.about));
router.get('/programs', asyncHandler(controller.programs));
router.get('/programs/:programId', asyncHandler(controller.programDetails));
router.get('/coaches', asyncHandler(controller.coaches));
router.get('/coaches/:coachId', asyncHandler(controller.coachDetails));
router.get('/locations', asyncHandler(controller.locations));
router.get('/pricing', asyncHandler(controller.pricing));
router.get('/offers', asyncHandler(controller.offers));
router.get('/gallery', asyncHandler(controller.gallery));
router.get('/events', asyncHandler(controller.events));
router.get('/events/:eventId', asyncHandler(controller.eventDetails));
router.get('/blog', asyncHandler(controller.blog));
router.get('/blog/:postId', asyncHandler(controller.blogPost));
router.get('/login-showcase', asyncHandler(controller.loginShowcase));

export default router;
