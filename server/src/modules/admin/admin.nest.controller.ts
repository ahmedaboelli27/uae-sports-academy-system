import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import * as attendanceController from '../attendance/attendance.controller.js';
import * as branchesController from '../branches/branches.controller.js';
import * as coachesController from '../coaches/coaches.controller.js';
import * as dashboardController from '../dashboard/dashboard.controller.js';
import * as financeController from '../finance/finance.controller.js';
import * as parentsController from '../parents/parents.controller.js';
import * as programsController from '../programs/programs.controller.js';
import * as reportsController from '../reports/reports.controller.js';
import * as scheduleController from '../schedule/schedule.controller.js';
import * as studentsController from '../students/students.controller.js';
import * as usersController from '../users/users.controller.js';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'ACCOUNTANT')
export class AdminNestController {
  @Get('dashboard')
  dashboard(@Req() req: Request, @Res() res: Response) {
    return dashboardController.adminDashboard(req, res);
  }

  @Get('students')
  studentsList(@Req() req: Request, @Res() res: Response) {
    return studentsController.list(req, res);
  }

  @Get('students/:id')
  studentsDetail(@Req() req: Request, @Res() res: Response) {
    return studentsController.getById(req, res);
  }

  @Post('students')
  studentsCreate(@Req() req: Request, @Res() res: Response) {
    return studentsController.create(req, res);
  }

  @Patch('students/:id')
  studentsUpdate(@Req() req: Request, @Res() res: Response) {
    return studentsController.update(req, res);
  }

  @Delete('students/:id')
  studentsDelete(@Req() req: Request, @Res() res: Response) {
    return studentsController.remove(req, res);
  }

  @Get('parents')
  parentsList(@Req() req: Request, @Res() res: Response) {
    return parentsController.list(req, res);
  }

  @Get('parents/:id')
  parentsDetail(@Req() req: Request, @Res() res: Response) {
    return parentsController.getById(req, res);
  }

  @Post('parents')
  parentsCreate(@Req() req: Request, @Res() res: Response) {
    return parentsController.create(req, res);
  }

  @Patch('parents/:id')
  parentsUpdate(@Req() req: Request, @Res() res: Response) {
    return parentsController.update(req, res);
  }

  @Delete('parents/:id')
  parentsDelete(@Req() req: Request, @Res() res: Response) {
    return parentsController.remove(req, res);
  }

  @Get('coaches')
  coachesList(@Req() req: Request, @Res() res: Response) {
    return coachesController.list(req, res);
  }

  @Get('coaches/:id')
  coachesDetail(@Req() req: Request, @Res() res: Response) {
    return coachesController.getById(req, res);
  }

  @Post('coaches')
  coachesCreate(@Req() req: Request, @Res() res: Response) {
    return coachesController.create(req, res);
  }

  @Patch('coaches/:id')
  coachesUpdate(@Req() req: Request, @Res() res: Response) {
    return coachesController.update(req, res);
  }

  @Delete('coaches/:id')
  coachesDelete(@Req() req: Request, @Res() res: Response) {
    return coachesController.remove(req, res);
  }

  @Get('branches')
  branchesList(@Req() req: Request, @Res() res: Response) {
    return branchesController.list(req, res);
  }

  @Get('branches/:id')
  branchesDetail(@Req() req: Request, @Res() res: Response) {
    return branchesController.getById(req, res);
  }

  @Post('branches')
  branchesCreate(@Req() req: Request, @Res() res: Response) {
    return branchesController.create(req, res);
  }

  @Patch('branches/:id')
  branchesUpdate(@Req() req: Request, @Res() res: Response) {
    return branchesController.update(req, res);
  }

  @Delete('branches/:id')
  branchesDelete(@Req() req: Request, @Res() res: Response) {
    return branchesController.remove(req, res);
  }

  @Get('programs')
  programsList(@Req() req: Request, @Res() res: Response) {
    return programsController.list(req, res);
  }

  @Get('programs/:id')
  programsDetail(@Req() req: Request, @Res() res: Response) {
    return programsController.getById(req, res);
  }

  @Post('programs')
  programsCreate(@Req() req: Request, @Res() res: Response) {
    return programsController.create(req, res);
  }

  @Patch('programs/:id')
  programsUpdate(@Req() req: Request, @Res() res: Response) {
    return programsController.update(req, res);
  }

  @Delete('programs/:id')
  programsDelete(@Req() req: Request, @Res() res: Response) {
    return programsController.remove(req, res);
  }

  @Get('schedule')
  scheduleList(@Req() req: Request, @Res() res: Response) {
    return scheduleController.list(req, res);
  }

  @Get('schedule/:id')
  scheduleDetail(@Req() req: Request, @Res() res: Response) {
    return scheduleController.getById(req, res);
  }

  @Post('schedule')
  scheduleCreate(@Req() req: Request, @Res() res: Response) {
    return scheduleController.create(req, res);
  }

  @Patch('schedule/:id')
  scheduleUpdate(@Req() req: Request, @Res() res: Response) {
    return scheduleController.update(req, res);
  }

  @Delete('schedule/:id')
  scheduleDelete(@Req() req: Request, @Res() res: Response) {
    return scheduleController.remove(req, res);
  }

  @Get('attendance')
  attendanceList(@Req() req: Request, @Res() res: Response) {
    return attendanceController.list(req, res);
  }

  @Get('attendance/:id')
  attendanceDetail(@Req() req: Request, @Res() res: Response) {
    return attendanceController.getById(req, res);
  }

  @Post('attendance')
  attendanceCreate(@Req() req: Request, @Res() res: Response) {
    return attendanceController.create(req, res);
  }

  @Patch('attendance/:id')
  attendanceUpdate(@Req() req: Request, @Res() res: Response) {
    return attendanceController.update(req, res);
  }

  @Get('finance/dashboard')
  financeDashboard(@Req() req: Request, @Res() res: Response) {
    return financeController.dashboard(req, res);
  }

  @Get('finance/subscriptions')
  financeSubscriptions(@Req() req: Request, @Res() res: Response) {
    return financeController.listSubscriptions(req, res);
  }

  @Get('finance/subscriptions/:id')
  financeSubscriptionDetail(@Req() req: Request, @Res() res: Response) {
    return financeController.getSubscription(req, res);
  }

  @Post('finance/subscriptions')
  financeSubscriptionCreate(@Req() req: Request, @Res() res: Response) {
    return financeController.createSubscription(req, res);
  }

  @Patch('finance/subscriptions/:id')
  financeSubscriptionUpdate(@Req() req: Request, @Res() res: Response) {
    return financeController.updateSubscription(req, res);
  }

  @Delete('finance/subscriptions/:id')
  financeSubscriptionDelete(@Req() req: Request, @Res() res: Response) {
    return financeController.deleteSubscription(req, res);
  }

  @Get('finance/invoices')
  financeInvoices(@Req() req: Request, @Res() res: Response) {
    return financeController.listInvoices(req, res);
  }

  @Get('finance/invoices/:id')
  financeInvoiceDetail(@Req() req: Request, @Res() res: Response) {
    return financeController.getInvoice(req, res);
  }

  @Post('finance/invoices')
  financeInvoiceCreate(@Req() req: Request, @Res() res: Response) {
    return financeController.createInvoice(req, res);
  }

  @Patch('finance/invoices/:id')
  financeInvoiceUpdate(@Req() req: Request, @Res() res: Response) {
    return financeController.updateInvoice(req, res);
  }

  @Delete('finance/invoices/:id')
  financeInvoiceDelete(@Req() req: Request, @Res() res: Response) {
    return financeController.deleteInvoice(req, res);
  }

  @Get('finance/payments')
  financePayments(@Req() req: Request, @Res() res: Response) {
    return financeController.listPayments(req, res);
  }

  @Get('finance/payments/:id')
  financePaymentDetail(@Req() req: Request, @Res() res: Response) {
    return financeController.getPayment(req, res);
  }

  @Post('finance/payments')
  financePaymentCreate(@Req() req: Request, @Res() res: Response) {
    return financeController.createPayment(req, res);
  }

  @Patch('finance/payments/:id')
  financePaymentUpdate(@Req() req: Request, @Res() res: Response) {
    return financeController.updatePayment(req, res);
  }

  @Delete('finance/payments/:id')
  financePaymentDelete(@Req() req: Request, @Res() res: Response) {
    return financeController.deletePayment(req, res);
  }

  @Get('reports/summary')
  reportsSummary(@Req() req: Request, @Res() res: Response) {
    return reportsController.summary(req, res);
  }

  @Get('users')
  usersList(@Req() req: Request, @Res() res: Response) {
    return usersController.list(req, res);
  }

  @Get('users/:id')
  usersDetail(@Req() req: Request, @Res() res: Response) {
    return usersController.getById(req, res);
  }

  @Post('users')
  usersCreate(@Req() req: Request, @Res() res: Response) {
    return usersController.create(req, res);
  }

  @Patch('users/:id')
  usersUpdate(@Req() req: Request, @Res() res: Response) {
    return usersController.update(req, res);
  }

  @Delete('users/:id')
  usersDelete(@Req() req: Request, @Res() res: Response) {
    return usersController.remove(req, res);
  }
}
