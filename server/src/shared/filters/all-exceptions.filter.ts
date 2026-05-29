import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { ApiError } from '../../utils/ApiError.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof ApiError) {
      response.status(exception.statusCode).json({
        success: false,
        message: exception.message,
        code: exception.code,
        details: exception.details,
      });
      return;
    }

    if (exception instanceof ZodError) {
      const details: Record<string, string[]> = {};
      for (const issue of exception.issues) {
        const key = issue.path.join('.') || 'body';
        details[key] = details[key] ?? [];
        details[key].push(issue.message);
      }

      response.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const message =
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
          ? String((exceptionResponse as { message: unknown }).message)
          : exception.message;

      response.status(status).json({
        success: false,
        message: status === 404 ? 'Route not found' : message,
        code: status === 404 ? 'NOT_FOUND' : 'HTTP_ERROR',
      });
      return;
    }

    console.error(exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
}
