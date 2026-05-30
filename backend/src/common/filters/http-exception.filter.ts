import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exRes = exception.getResponse();
      message = typeof exRes === 'string' ? exRes : (exRes as Record<string, unknown>).message as string ?? exception.message;
      if (Array.isArray(message)) message = (message as string[]).join('; ');
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
