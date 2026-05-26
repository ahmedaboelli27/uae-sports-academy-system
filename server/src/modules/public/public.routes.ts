import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as controller from './public.controller.js';

const router = Router();

router.get('/academy-summary', asyncHandler(controller.academySummary));
router.get('/home', asyncHandler(controller.home));
router.get('/login-showcase', asyncHandler(controller.loginShowcase));

export default router;
