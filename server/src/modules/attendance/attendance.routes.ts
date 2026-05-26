import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import * as controller from './attendance.controller.js';

const router = Router();
router.get('/', asyncHandler(controller.list));
router.get('/:id', asyncHandler(controller.getById));
router.post('/', asyncHandler(controller.create));
router.patch('/:id', asyncHandler(controller.update));
export default router;
