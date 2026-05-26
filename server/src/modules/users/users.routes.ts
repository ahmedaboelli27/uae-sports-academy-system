import { Router } from 'express';

/** Placeholder — user management CRUD can be added in a follow-up phase */
const router = Router();

router.get('/', (_req, res) => {
  res.status(501).json({
    success: false,
    message: 'Users module not implemented yet',
    code: 'NOT_IMPLEMENTED',
  });
});

export default router;
