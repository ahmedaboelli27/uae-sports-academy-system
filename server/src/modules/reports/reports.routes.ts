import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as controller from './reports.controller.js';

const router = Router();
router.get('/summary', asyncHandler(controller.summary));
export default router;
