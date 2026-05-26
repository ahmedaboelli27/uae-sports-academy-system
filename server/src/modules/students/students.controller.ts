import type { Request, Response } from 'express';
import { sendPaginated, sendSuccess } from '../../utils/api-response.js';
import { paramId } from '../../utils/params.js';
import { parseListQuery } from '../../utils/pagination.js';
import { createStudentSchema, updateStudentSchema } from './students.validation.js';
import * as studentsService from './students.service.js';

export async function list(req: Request, res: Response) {
  const query = parseListQuery(req.query);
  const { items, meta } = await studentsService.listStudents(query);
  return sendPaginated(res, items, meta);
}

export async function getById(req: Request, res: Response) {
  const item = await studentsService.getStudentById(paramId(req.params.id));
  return sendSuccess(res, item);
}

export async function create(req: Request, res: Response) {
  const body = createStudentSchema.parse(req.body);
  const item = await studentsService.createStudent(body);
  return sendSuccess(res, item, 'Student created', 201);
}

export async function update(req: Request, res: Response) {
  const body = updateStudentSchema.parse(req.body);
  const item = await studentsService.updateStudent(paramId(req.params.id), body);
  return sendSuccess(res, item, 'Student updated');
}

export async function remove(req: Request, res: Response) {
  const result = await studentsService.deleteStudent(paramId(req.params.id));
  return sendSuccess(res, result, 'Student deleted');
}
