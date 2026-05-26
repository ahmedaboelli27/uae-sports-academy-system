import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import { adminOnly } from './middlewares/role.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { sendSuccess } from './utils/api-response.js';

import authRoutes from './modules/auth/auth.routes.js';
import studentsRoutes from './modules/students/students.routes.js';
import parentsRoutes from './modules/parents/parents.routes.js';
import coachesRoutes from './modules/coaches/coaches.routes.js';
import branchesRoutes from './modules/branches/branches.routes.js';
import programsRoutes from './modules/programs/programs.routes.js';
import scheduleRoutes from './modules/schedule/schedule.routes.js';
import attendanceRoutes from './modules/attendance/attendance.routes.js';
import financeRoutes from './modules/finance/finance.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import reportsRoutes from './modules/reports/reports.routes.js';
import usersRoutes from './modules/users/users.routes.js';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
      credentials: true,
    }),
  );
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    return sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);

  const adminRouter = express.Router();
  adminRouter.use(authMiddleware, adminOnly);

  adminRouter.use('/dashboard', dashboardRoutes);
  adminRouter.use('/students', studentsRoutes);
  adminRouter.use('/parents', parentsRoutes);
  adminRouter.use('/coaches', coachesRoutes);
  adminRouter.use('/branches', branchesRoutes);
  adminRouter.use('/programs', programsRoutes);
  adminRouter.use('/schedule', scheduleRoutes);
  adminRouter.use('/attendance', attendanceRoutes);
  adminRouter.use('/finance', financeRoutes);
  adminRouter.use('/reports', reportsRoutes);
  adminRouter.use('/users', usersRoutes);

  app.use('/api/admin', adminRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
