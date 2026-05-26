import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { paramId } from '../../utils/params.js';
import { parseListQuery } from '../../utils/pagination.js';
import { createAttendanceSchema, updateAttendanceSchema } from './attendance.validation.js';
import * as service from './attendance.service.js';

export async function list(req: Request, res: Response) {
  const result = await service.listAttendance(parseListQuery(req.query));
  return sendPaginated(res, result.items, result.meta);
}

export async function getById(req: Request, res: Response) {
  return sendSuccess(res, await service.getAttendanceById(paramId(req.params.id)));
}

export async function create(req: Request, res: Response) {
  return sendSuccess(res, await service.createAttendance(createAttendanceSchema.parse(req.body)), 'Attendance recorded', 201);
}

export async function update(req: Request, res: Response) {
  return sendSuccess(res, await service.updateAttendance(paramId(req.params.id), updateAttendanceSchema.parse(req.body)), 'Attendance updated');
}
