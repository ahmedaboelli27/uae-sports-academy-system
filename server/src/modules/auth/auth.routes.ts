import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import * as authController from './auth.controller.js';

const router = Router();

router.post('/login', asyncHandler(authController.login));
router.post('/register', asyncHandler(authController.register));
router.post('/register/parent', asyncHandler(authController.registerParent));
router.post('/register/coach-request', asyncHandler(authController.registerCoachRequest));
router.get('/me', authMiddleware, asyncHandler(authController.me));

export default router;
