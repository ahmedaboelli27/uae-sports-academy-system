import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as controller from './dashboard.controller.js';

const router = Router();
router.get('/', asyncHandler(controller.adminDashboard));
export default router;
